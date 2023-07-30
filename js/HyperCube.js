class Vector4D {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

class HyperCube {
    constructor() {
        this.vertices4D = [
            new Vector4D(-1, -1, -1, 1),
            new Vector4D(1, -1, -1, 1),
            new Vector4D(1, 1, -1, 1),
            new Vector4D(-1, 1, -1, 1),

            new Vector4D(-1, -1, 1, 1),
            new Vector4D(1, -1, 1, 1),
            new Vector4D(1, 1, 1, 1),
            new Vector4D(-1, 1, 1, 1),

            new Vector4D(-1, -1, -1, -1),
            new Vector4D(1, -1, -1, -1),
            new Vector4D(1, 1, -1, -1),
            new Vector4D(-1, 1, -1, -1),

            new Vector4D(-1, -1, 1, -1),
            new Vector4D(1, -1, 1, -1),
            new Vector4D(1, 1, 1, -1),
            new Vector4D(-1, 1, 1, -1),
        ];
        // 颜色
        this.hue = 90;
        this.saturation = 100;
        this.brightness = 100;
        // 大小
        this.scale = 150;
        // 三维角度（描述姿态）
        this.angleX = PI / 3;
        this.angleY = 0;
        this.angleZ = PI / 3;
        // 旋转速度
        this.velocity = 1;
        // 四维旋转角度
        this.rotation_angle = 0;
    }
    draw() {
        push();
        colorMode(HSB, 360, 100, 100);
        stroke(this.hue, this.saturation, this.brightness);
        strokeWeight(10);
        noFill();

        rotateX(this.angleX);
        rotateY(this.angleY);
        rotateZ(this.angleZ);
        
        this.rotation_angle += 0.01 * this.velocity;
        // 四维旋转矩阵
        // let rotationXY = [
        //     [cos(this.rotation_angle), -sin(this.rotation_angle), 0, 0],
        //     [sin(this.rotation_angle), cos(this.rotation_angle), 0, 0],
        //     [0, 0, 1, 0],
        //     [0, 0, 0, 1]
        // ];
        // let rotationXW = [
        //     [cos(this.rotation_angle), 0, 0, -sin(this.rotation_angle)],
        //     [0, 1, 0, 0],
        //     [0, 0, 1, 0],
        //     [sin(this.rotation_angle), 0, 0, cos(this.rotation_angle)],
        // ];
        let rotationZW = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, cos(this.rotation_angle), -sin(this.rotation_angle)],
            [0, 0, sin(this.rotation_angle), cos(this.rotation_angle)]
        ];

        let rotationMat = rotationZW;
        // 将四维空间中的点投影到三维空间
        let vertices3D = new Array(this.vertices4D.length);
        for (let i = 0; i < this.vertices4D.length; i++) {
            let v = this.vertices4D[i]
            v = matToVec4d(matmulVec4d(rotationMat, v));
            let distance = 2;
            let w = 1 / (distance - v.w);
            let projectionMat = [
                [w, 0, 0, 0],
                [0, w, 0, 0],
                [0, 0, w, 0]
            ];
            let projected_v = matToVec3d(matmulVec4d(projectionMat, v));
            vertices3D[i] = projected_v;
        }

        for (let i = 0; i < vertices3D.length; i++) {
            vertices3D[i].x *= this.scale;
            vertices3D[i].y *= this.scale;
            vertices3D[i].z *= this.scale;
            // point(vertices3D[i].x, vertices3D[i].y, vertices3D[i].z);
        }

        strokeWeight(2);
        beginShape(LINES);

        for (let i = 0; i < 4; i++) {
            connect(0, i, (i + 1) % 4, vertices3D);
            connect(0, i + 4, ((i + 1) % 4) + 4, vertices3D);
            connect(0, i, i + 4, vertices3D);
        }
        for (let i = 0; i < 4; i++) {
            connect(8, i, (i + 1) % 4, vertices3D);
            connect(8, i + 4, ((i + 1) % 4) + 4, vertices3D);
            connect(8, i, i + 4, vertices3D);
        }
        for (let i = 0; i < 8; i++) {
            connect(0, i, i + 8, vertices3D);
        }

        endShape();

        pop();
    }
}

function vec4dToMat(a) {
    let result = [[0], [0], [0], [0]];
    result[0][0] = a.x;
    result[1][0] = a.y;
    result[2][0] = a.z;
    result[3][0] = a.w;
    return result;
}

function matToVec3d(A) {
    return new p5.Vector(A[0][0], A[1][0], A[2][0]);
}

function matToVec4d(A) {
    return new Vector4D(A[0][0], A[1][0], A[2][0], A[3][0]);
}

function matmulVec4d(mat, a) {
    let A = vec4dToMat(a);
    return matmul(mat, A);
}

function matmul(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;

    if (colsA !== rowsB) {
        throw new Error("Cols of A must equal to rows of B.");
    }

    const C = new Array(rowsA);
    for (let i = 0; i < rowsA; i++) {
        C[i] = new Array(colsB).fill(0);
    }

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return C;
}

function connect(offset, i, j, vertices) {
    a = vertices[i + offset];
    b = vertices[j + offset];
    vertex(a.x, a.y, a.z);
    vertex(b.x, b.y, b.z);
}
