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

    // VR用コントローラを生成
    var controls = new THREE.VRControls(camera);

    // VR用エフェクトを生成
    var effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    // VRマネージャの生成
    var manager = new WebVRManager(renderer, effect);

    //////////////////////////////////////////////////
    // 各種オブジェクトのセットアップ

    // ベッド
    var bedLoader = new THREE.JSONLoader();
    bedLoader.load('models/bed.json', function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var bed = new THREE.Mesh(geometry, material);
        var s = 0.5;
        bed.scale.set(s, s, s);
        bed.castShadow = true;
        bed.receiveShadow = true;
        scene.add(bed);
    });

    var tableLoader = new THREE.JSONLoader();
    tableLoader.load('models/table.json', function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var table = new THREE.Mesh(geometry, material);
        var s = 0.25;
        table.scale.set(s, s, s);
        table.position.x = 1.2;
        table.castShadow = true;
        scene.add(table);
    });

    // ライトの生成
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 10);
    light.castShadow = true;
    light.shadow.mapSize.width  = 4096;
    light.shadow.mapSize.height = 4096;
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x333333);
    scene.add(ambient);


    var floorTextureLoader = new THREE.TextureLoader();
    floorTextureLoader.load('models/Sapele Mahogany.jpg', function (texture) {
        texture.repeat.set(4, 4);

        var planeGeo = new THREE.PlaneGeometry(5, 5);
        var planeMat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            map: texture
        });
        var plane = new THREE.Mesh(planeGeo, planeMat);
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);
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

        // VRコントローラのupdate
        controls.update();

        // VRマネージャを通してシーンをレンダリング
        manager.render(scene, camera, timestamp);

        // アニメーションループ
        requestAnimationFrame(animate);
    }

    // アニメーションの開始
    animate(performance ? performance.now() : Date.now());

}());
