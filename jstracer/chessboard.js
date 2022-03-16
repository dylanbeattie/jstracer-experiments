let chessboard = {
    shape: "plane",
    normal: [0, 1, 0],
    distance: 0,
    texture: {
        pigment: {
            pattern: "tiles",
            color1: "#000",
            color2: "#fff"
        },
        finish: {
            reflection: 0.2
        }
    }
}
let scene = {
    camera: { position: [-2, 3, -10], look_at: [0, 0, 0] },
    lights: [
        //{ position: [-10,10,0 ], color: [1,0,0] },
        { position: [10, 15, -10], color: "#fff" },
        { position: [-10, 10, -10], color: "#fff" },
    ],
    shapes: [
        {
            shape: "sphere",
            position: [0, 1, 0],
            radius: 1,
            texture: {
                pigment: { pattern: "solid", color: "#f00" },
                finish: { ambient: 0, diffuse: 1, reflection: 0.2, specular: 0.5 }
            }
        },
        {
            shape: "sphere",
            position: [0, 2.5, 0],
            radius: 0.5,
            texture: {
                finish: { reflection: 0.2 }
            }
        },
        chessboard,
        {
            shape: "box",
            corners: [[2, 0, 2], [3, 2, 3]],
            texture: {
                pigment: { pattern: "solid", color: "#0f0" },
                finish: { ambient: 0, diffuse: 0.7 }
            }
        }
    ]
}