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
    window.scene = scene;

    // カメラを生成
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.x = 0;
    camera.position.y = 1.0;
    camera.position.z = 5.0;

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    //////////////////////////////////////////////////
    // 各種オブジェクトのセットアップ

    // ベッド
    var bedLoader = new THREE.JSONLoader();
    bedLoader.load('models/bed.json', function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        debugger;
        material.transparent = false;
        var bed = new THREE.Mesh(geometry, material);
        var s = 0.5;
        bed.scale.set(s, s, s);
        bed.castShadow = true;
        bed.receiveShadow = true;
        scene.add(bed);
    });

    // ライトの生成
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, -10);
    light.castShadow = true;
    light.shadow.mapSize.width  = 4096;
    light.shadow.mapSize.height = 4096;
    scene.add(light);

    var ambient = new THREE.AmbientLight(0xeeeeee);
    scene.add(ambient);


    var loader = new THREE.TextureLoader();
    loader.load('models/Sapele Mahogany.jpg', function (texture) {
        texture.repeat.set(4, 4);

        var planeGeo = new THREE.PlaneGeometry(5, 5);
        var planeMat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true
        });
        var plane = new THREE.Mesh(planeGeo, planeMat);
        plane.receiveShadow = true;
        plane.rotation.y = Math.PI / 2;
        plane.position.x = -2;
        scene.add(plane);
    });

    var tg = new THREE.SphereGeometry(1, 32, 32);
    var tm = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        map: loader.load('img/mapping-check.png'),
        side: THREE.DoubleSide
    });
    var tme = new THREE.Mesh(tg, tm);
    tme.position.y = 1;
    scene.add(tme);

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
