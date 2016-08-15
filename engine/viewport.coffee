{mat2, mat3, mat4, vec2, vec3, vec4, quat} = require 'gl-matrix'

class Viewport

    constructor: (@render_manager, @camera, @rect=[0,0,1,1], @custom_size=[0, 0], @dest_buffer=@render_manager.main_fb)->
        @rect_pix = @rect
        @post_processing_enabled = false
        @post_processing_filters = [@render_manager.dummy_filter]
        @eye_shift = vec3.create()
        @custom_fov = null
        @debug_camera = null
        @set_clear true, true
        @render_manager.viewports.push @
        @recalc_aspect()
        if @render_manager.common_filter_fb
            @render_manager.recalculate_fb_size()

    recalc_aspect: ->
        r = @rect
        w = @dest_buffer.size_x
        h = @dest_buffer.size_y
        @camera.aspect_ratio = (r[2]*@render_manager.width)/(r[3]*@render_manager.height)
        @camera.recalculate_projection()
        cs = @custom_size
        if cs[0] == 0 and cs[1] == 0
            @rect_pix = [r[0]*w, r[1]*h, r[2]*w, r[3]*h]
        else
            @rect_pix = [r[0]*w, r[1]*h, cs[0], cs[1]]
        @dest_rect_pix = [r[0]*w, r[1]*h, r[2]*w, r[3]*h]

    set_clear: (color, depth)->
        c = if color then 16384 else 0 # GL_COLOR_BUFFER_BIT
        c |= if depth then 256 else 0 # GL_DEPTH_BUFFER_BIT
        @clear_bits = c
    
    clone: ->
        return new Viewport(@render_manager, @camera, @rect, @custom_size, @dest_buffer)

module.exports = {Viewport}
