
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

var fov = 75;
var aspect = window.innerWidth / window.innerHeight;
var near = 0.1;
var far  = 1000;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 1, 5);

var scene = new THREE.Scene();

document.body.appendChild(renderer.domElement);


var light = new THREE.DirectionalLight(0xffffff);
light.position.set(10, 10, 5);
scene.add(light);

var ambient = new THREE.AmbientLight(0x333333);
scene.add(ambient);

var textureLoader = new THREE.TextureLoader();
textureLoader.load('img/texture.jpg', function (texture) {
    // plane
    var planeGeo = new THREE.PlaneGeometry(5, 5);
    var planeMat = new THREE.MeshLambertMaterial({
        map: texture
    });
    var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = THREE.Math.degToRad(-90);
    scene.add(plane);
});

var bed = new THREE.Object3D();
var bedLoader = new THREE.JSONLoader();
bedLoader.load('models/bed.json', function (geometry, materials) {
    var material = new THREE.MeshFaceMaterial(materials);
    bed = new THREE.Mesh(geometry, material);
    var s = 0.5;
    bed.scale.set(s, s, s);
    scene.add(bed);
});

var tableLoader = new THREE.JSONLoader();
tableLoader.load('models/table.json', function (geometry, materials) {
    var material = new THREE.MeshFaceMaterial(materials);
    var table = new THREE.Mesh(geometry, material);
    var s = 0.25;
    table.scale.set(s, s, s);
    table.position.x = 1.2;
    scene.add(table);
});
















function animate() {
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}
animate();


