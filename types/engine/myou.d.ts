import { GameObject } from "./gameobject";
import { Behaviour, Behavior } from "./behaviour";
import { RenderManager } from "./render";
import { Scene } from "./scene";
import { Lamp } from "./lamp";
import { MainLoop } from "./main_loop";
import { Action, Animation, LoopedAnimation, FiniteAnimation, PingPongAnimation} from "./animation"
import { Armature } from "./armature";
import { Viewport } from "./viewport";
import { Screen, CanvasScreen } from "./screen";
import { Camera } from "./camera";
import { Framebuffer, ByteFramebuffer, ShortFramebuffer, FloatFramebuffer } from "./framebuffer";
import { Material } from "./material";
import { Texture } from "./texture";
import { Cubemap } from "./cubemap";
import { Mesh, MeshData } from "./mesh";
import { MeshFactory } from "./meshfactory";
import { Curve } from "./curve";
import { InputManager, Button, Axis, Axes2 } from "./input";
import { GLRay } from "./glray";
import { DebugDraw } from "./debug_render";

// TSLint will probably complain that these are not permitted, but these are prefectly fine!
export namespace Myou {
    export { Marker, Action, Animation, LoopedAnimation, FiniteAnimation, PingPongAnimation } from "./animation"
    export { Viewport, ViewportCloneOptions } from "./viewport"
    export { TextureBase, Texture } from "./texture"
    export { Scene, SceneData, SceneFeature } from "./scene"
    export { Behaviour, Behavior, BehaviourOptions } from "./behaviour"
    export { GameObject, ObjectType, CloneOptions as GameObjectCloneOptions } from "./gameobject"
    export { Mesh, MeshData, MeshDataLayout } from "./mesh"
    export { MeshFactory } from "./meshfactory"
    export { Armature, Bone, BoneConstraints, Pose } from "./armature"
    export { Curve } from "./curve"
    export { Camera } from "./camera"
    export { Lamp } from "./lamp"
    export { Framebuffer, ByteFramebuffer, ShortFramebuffer, FloatFramebuffer, BufferComponentType, FbTexture, MainFramebuffer, FramebufferOptions } from "./framebuffer"
    export { Cubemap } from "./cubemap"
    export { GLRay } from "./glray"
    export { Material, Uniform, InputValue as UniformInputValue, MaterialData } from "./material"
    export { DebugDraw, DebugCamera, DebugShape } from "./debug_render"
    export { Button, Axis, Axes2, InputManager, InputSource, GamepadInputSource, KeyboardInputSource } from "./input"
    export { BaseFilter, CopyFilter, FlipFilter, BoxBlurFilter, Block2x2BlurFilter, MipmapBiasFilter, DirectionalBlurFilter, ExprFilter, FunctionFilter } from "./filter"
    export { World, Body, Constraint as PhysicsConstraint, CollisionShape, CollisionType } from "./physics"
    export { Probe, ProbeData, ProbeType } from "./probe"
    export { RenderManager } from "./render"
    export { Screen, CanvasScreen } from "./screen"
    export { BaseEffect, FilterEffect, CopyEffect, BloomEffect } from "./effect"
    export { MainLoop } from "./main_loop"
    export { RotationOrder } from "./util"
}

/**
* This is the main engine class.
* You need to instance it to start using the engine.
* The engine instance is frequently referred internally as `context`.
*
* It instances and contains several singletons like `render_manager` and
* `main_loop`. The namespace `Myou` contains the *types* for these singletons.
*/
export class Myou {
    constructor(root: HTMLCanvasElement, options: MyouParameters);
    
    /** @property Object with all game objects in memory. The key is the name. */
    objects: Record<string, GameObject>;

    /** @property Main loop singleton */
    main_loop: MainLoop;
    /** @property Render manager singleton */
    render_manager: RenderManager;
    /** @property Minimum length of the average poligon for LoD calculation, in pixels. */
    mesh_lod_min_length_px: number;
    /** @property List of viewports of the canvas screen. Convenience reference to `myou.canvas_screen.viewports` (use `myou.canvas_screen` to operate on these).*/
    viewports: Viewport[];

    Action: typeof Action;
    Animation: typeof Animation;
    LoopedAnimation: typeof LoopedAnimation;
    FiniteAnimation: typeof FiniteAnimation;
    PingPongAnimation: typeof PingPongAnimation;
    Viewport: typeof Viewport;
    Texture: typeof Texture;

    GameObject: typeof GameObject;
    Mesh: typeof Mesh;
    Armature: typeof Armature;
    Curve: typeof Curve;
    Camera: typeof Camera;
    Lamp: typeof Lamp;
    Framebuffer: typeof Framebuffer;
    ByteFramebuffer: typeof ByteFramebuffer;
    ShortFramebuffer: typeof ShortFramebuffer;
    FloatFramebuffer: typeof FloatFramebuffer;
    Cubemap: typeof Cubemap;
    GLRay: typeof GLRay;
    Material: typeof Material;
    Scene: typeof Scene;
    DebugDraw: typeof DebugDraw;
    Button: typeof Button;
    Axis: typeof Axis;
    Axes2: typeof Axes2;

    screens: Screen[];
    behaviours: Behaviour[];
    behaviors: Behavior[];
    canvas_screen: CanvasScreen;
    scenes: Record<string, Scene>;
    loaded_scenes: Scene[];
    actions: Record<string, Action>;
    video_textures: Record<string, Texture>;
    //debug_loader: DebugLoader; Unused?
    canvas: HTMLCanvasElement;
    all_materials: Record<string, Material>;
    mesh_datas: Record<string, MeshData>;
    embed_meshes: Record<string, Mesh>;
    active_animations: Record<string, Animation>;
    all_cubemaps: Cubemap[];
    all_framebuffers: Framebuffer[];
    enabled_behaviours: Behaviour[];
    root: HTMLCanvasElement;
    options: MyouParameters;
    hash: number;
    initial_scene_loaded: boolean;
    is_webgl2: boolean;
    webpack_flags: unknown // Webpack flags?? Self defined?

    use_VR_position: boolean;
    root_rect: {top: number, left: number};

    update_root_rect: () => {top: number, left: number};

    mesh_factory: MeshFactory;
    input_manager: InputManager;
    has_created_debug_view: boolean;

    update_layout() : {top: number, left: number};

    load_scene(name: string, options?:{
        data_dir?: string,
        original_scene_name?: string
    }): Promise<Scene>;

    screenshot_as_blob: RenderManager["screenshot_as_blob"];

    change_gl_flags(gl_flags: WebGLContextAttributes): void;
    enable_debug_camera(viewport_number?: number): void;
    disable_debug_camera(viewport_number?: number): void;
}

export function create_canvas(root: HTMLCanvasElement, id: string, className?: string): HTMLCanvasElement;
export function create_full_window_canvas(): HTMLCanvasElement;

declare interface MyouParameters {
    data_dir?: string,
    debug?: boolean,
    no_s3tc?: boolean,
    gl_options?: WebGLContextAttributes
}