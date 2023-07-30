let hyperCube;

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.style('display', 'block');
    canvas.parent('canvas-container'); // 指定画布的父元素为容器
    hyperCube = new HyperCube();
}

function draw() {
    orbitControl(); // 添加鼠标控制旋转和缩放
    background(0, 0, 0, 0);

    let velocity = select('#velocitySlider').value();
    let hue = select('#hueSlider').value();
    let saturation = select('#saturationSlider').value();
    let brightness = select('#brightnessSlider').value();

    hyperCube.velocity = velocity;
    hyperCube.hue = hue;
    hyperCube.saturation = saturation;
    hyperCube.brightness = brightness;

    hyperCube.draw();
}