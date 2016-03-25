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

    // キューブの生成
    var cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    var cubeMat = new THREE.MeshLambertMaterial({
        color: 0xdddddd
    });
    var cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.y = 1;
    scene.add(cube);

    // ライトの生成
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 2);
    scene.add(light);

    var planeGeo = new THREE.PlaneGeometry(5, 5);
    var planeMat = new THREE.MeshLambertMaterial({
        color: 0x883333
    });
    var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x -= Math.PI / 2;
    scene.add(plane);

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
