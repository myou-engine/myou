{mat2, mat3, mat4, vec2, vec3, vec4, quat} = require 'gl-matrix'
{GameObject} = require './gameobject.coffee'
{Framebuffer} = require './framebuffer.coffee'
{Material} = require './material.coffee'

class Lamp extends GameObject
    type : 'LAMP'

    constructor: (@context)->
        super(@context)
        @lamp_type = 'POINT'
        @shadow_fb = null
        @shadow_texture = null
        # set in loader, its presence signals calling init_shadow()
        # when shadows are enabled
        @shadow_options = null
        # this option allows to stop rendering the shadow when stuff didn't change
        @render_shadow = true
        @_color4 = vec4.fromValues 1,1,1,1
        @color = @_color4.subarray 0,3
        @energy = 1
        @spot_size = 1.3
        @spot_blend = 0.15
        @_view_pos = vec3.create()
        @_dir = vec3.create()
        @_depth_matrix = mat4.create()
        @_cam2depth = mat4.create()
        @_projection_matrix = mat4.create()
        @size_x = 0
        @size_y = 0


    #Avoid physical lamps and cameras
    instance_physics: ->

    recalculate_render_data: (world2cam, neg) ->
        vec3.transformMat4 @_view_pos, @world_matrix.subarray(12,15), world2cam

        # mat4.multiply m4, world2cam, @world_matrix
        # @_dir[0] = -m4[8]
        # @_dir[1] = -m4[9]
        # @_dir[2] = -m4[10]
        ##We're doing the previous lines, but just for the terms we need
        a = world2cam
        b = @world_matrix
        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11]
        x = b0*a[0] + b1*a[4] + b2*a[8] + b3*a[12]
        y = b0*a[1] + b1*a[5] + b2*a[9] + b3*a[13]
        z = b0*a[2] + b1*a[6] + b2*a[10] + b3*a[14]
        @_dir[0] = -x
        @_dir[1] = -y
        @_dir[2] = -z
        return

    init_shadow: ->
        {texture_size, frustum_size, clip_start, clip_end} = @shadow_options
        # This one has no depth because we're using common_shadow_fb,
        # then applying box blur and storing here
        @shadow_fb = new Framebuffer @context, {size: [texture_size, texture_size], use_depth: false}
        @shadow_texture = @shadow_fb.texture

        # If using half float buffers, add a little bit of extra bias
        {extensions} = @context.render_manager
        extra_bias = ''
        if @shadow_fb.tex_type == 0x8D61 # HALF_FLOAT_OES
            # TODO: make configurable? or calculate depending on scene size?
            extra_bias = '-0.0007'

        varyings = [{type: 'PROJ_POSITION', varname: 'proj_position'}]
        fs = """#extension GL_OES_standard_derivatives : enable
        precision highp float;
        varying vec4 proj_position;
        void main(){
            float depth = proj_position.z/proj_position.w;
            depth = depth * 0.5 + 0.5;
            float dx = dFdx(depth);
            float dy = dFdy(depth);
            gl_FragColor = vec4(depth #{extra_bias}, pow(depth, 2.0) + 0.25*(dx*dx + dy*dy), 0.0, 1.0);
        }"""

        mat = new Material @context, @name+'_shadow', {fragment: fs, varyings, material_type: 'PLAIN_SHADER'}
        mat.is_shadow_material = true
        @_shadow_material = mat

        mat4.ortho(
            @_projection_matrix,
            -frustum_size,
            frustum_size,
            -frustum_size,
            frustum_size,
            clip_start,
            clip_end
            )
        mat4.multiply(
            @_depth_matrix,
            [0.5, 0.0, 0.0, 0.0,
            0.0, 0.5, 0.0, 0.0,
            0.0, 0.0, 0.5, 0.0,
            0.5, 0.5, 0.5, 1.0],
            @_projection_matrix
            )
        return

    destroy_shadow: ->
        @shadow_fb?.destroy()
        @shadow_fb = null
        @material?.destroy()
        @material = null
        @shadow_texture.gl_tex = @context.render_manager.white_texture

module.exports = {Lamp}
