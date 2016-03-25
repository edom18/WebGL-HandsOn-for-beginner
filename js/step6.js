(function () {

    'use strict';

    // レンダラを生成
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    document.body.appendChild(renderer.domElement);

    // シーンを生成
    var scene = new THREE.Scene();

    // カメラを生成
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.x = 0;
    camera.position.y = 1.0;
    camera.position.z = 5.0;

    //////////////////////////////////////////////////

    // ライトの生成
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 2);
    scene.add(light);

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('img/texture.jpg', function (texture) {
        var planeGeo = new THREE.PlaneGeometry(5, 5);
        var planeMat = new THREE.MeshLambertMaterial({
            color: 0x883333,
            map: texture
        });
        var plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x -= Math.PI / 2;
        scene.add(plane);
    });

    var bed = new THREE.Object3D();

    // ベッドの配置
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

    var planeGeo = new THREE.PlaneGeometry(5, 2.5);
    var planeMat = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.z = -2.5;
    plane.position.y = 1.25;
    scene.add(plane);

    var leftWall = plane.clone();
    leftWall.position.z = 0;
    leftWall.position.x = -2.5;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    var rightWall = plane.clone();
    rightWall.position.z = 0;
    rightWall.position.x = 2.5;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    //////////////////////////////////////////////////

    // アニメーションループ
    function animate(timestamp) {
        renderer.render(scene, camera);

        // アニメーションループ
        requestAnimationFrame(animate);
    }

    // アニメーションの開始
    animate(performance ? performance.now() : Date.now());

}());
