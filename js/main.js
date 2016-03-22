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
    camera.position.y = 0.1;
    camera.position.z = 0;
    // camera.lookAt(new THREE.Vector3(0, 0, 0));


    //////////////////////////////////////////////////
    // 各種オブジェクトのセットアップ

    // Skysphereの生成
    var skysphereLoader = new THREE.TextureLoader();
    function onSkysphereTextureLoaded(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);

        var geometry = new THREE.SphereGeometry(5000, 128, 128);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            color: 0xffffff,
            side: THREE.BackSide
        });

        var skysphere = new THREE.Mesh(geometry, material);
        skysphere.position.z = 0;
        scene.add(skysphere);
    }
    skysphereLoader.load('img/bg_skyplane.png', onSkysphereTextureLoaded);

    // ライトの生成
    var light = new THREE.DirectionalLight(0xffffff);
    light.castShadow = true;
    light.position.set(1, 1, 1);
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);

    var s = 0.1;
    var geometry = new THREE.BoxGeometry(s, s, s);
    var material = new THREE.MeshLambertMaterial({
        color: 0x99ccff
    });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.z = -1;
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);


    var planeGeo = new THREE.PlaneGeometry(1, 1);
    var planeMat = new THREE.MeshLambertMaterial({
        color: 0xdddddd
    });
    var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.receiveShadow = true;
    plane.position.z = -1;
    plane.position.y = -0.1;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);


    //////////////////////////////////////////////////

    // アニメーションループ
    function animate(timestamp) {
        renderer.render(scene, camera);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.02;

        // アニメーションループ
        requestAnimationFrame(animate);
    }

    // アニメーションの開始
    animate(performance ? performance.now() : Date.now());

}());
