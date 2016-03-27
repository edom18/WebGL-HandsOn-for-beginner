(function (ns) {
    'use strict';


    /**
     *  VRレンダリング
     */
    function VRRenderer(renderer) {
        this.renderer = renderer;

        this.cameraL = new THREE.PerspectiveCamera();
        this.cameraR = new THREE.PerspectiveCamera();
    }
    VRRenderer.prototype.setVRDisplay = function (vrDisplay) {
        this.vrDisplay = vrDisplay;
    }
    VRRenderer.prototype.fovToProjection = function (fov, rightHanded, zNear, zFar) {
        var DEG2RAD = Math.PI / 180.0;

        var fovPort = {
            upTan: Math.tan( fov.upDegrees * DEG2RAD ),
            downTan: Math.tan( fov.downDegrees * DEG2RAD ),
            leftTan: Math.tan( fov.leftDegrees * DEG2RAD ),
            rightTan: Math.tan( fov.rightDegrees * DEG2RAD )
        };

        return fovPortToProjection( fovPort, rightHanded, zNear, zFar );
    };
    VRRenderer.prototype.fovToNDCScaleOffset = function (fov) {
        var pxscale = 2.0 / ( fov.leftTan + fov.rightTan );
        var pxoffset = ( fov.leftTan - fov.rightTan ) * pxscale * 0.5;
        var pyscale = 2.0 / ( fov.upTan + fov.downTan );
        var pyoffset = ( fov.upTan - fov.downTan ) * pyscale * 0.5;
        return { scale: [ pxscale, pyscale ], offset: [ pxoffset, pyoffset ] };
    };
    VRRenderer.prototype.fovPortToProjection = function (fov, rightHanded, zNear, zFar) {

        rightHanded = rightHanded === undefined ? true : rightHanded;
        zNear = zNear === undefined ? 0.01 : zNear;
        zFar = zFar === undefined ? 10000.0 : zFar;

        var handednessScale = rightHanded ? - 1.0 : 1.0;

        // start with an identity matrix
        var mobj = new THREE.Matrix4();
        var m = mobj.elements;

        // and with scale/offset info for normalized device coords
        var scaleAndOffset = this.fovToNDCScaleOffset(fov);

        // X result, map clip edges to [-w,+w]
        m[ 0 * 4 + 0 ] = scaleAndOffset.scale[ 0 ];
        m[ 0 * 4 + 1 ] = 0.0;
        m[ 0 * 4 + 2 ] = scaleAndOffset.offset[ 0 ] * handednessScale;
        m[ 0 * 4 + 3 ] = 0.0;

        // Y result, map clip edges to [-w,+w]
        // Y offset is negated because this proj matrix transforms from world coords with Y=up,
        // but the NDC scaling has Y=down (thanks D3D?)
        m[ 1 * 4 + 0 ] = 0.0;
        m[ 1 * 4 + 1 ] = scaleAndOffset.scale[ 1 ];
        m[ 1 * 4 + 2 ] = - scaleAndOffset.offset[ 1 ] * handednessScale;
        m[ 1 * 4 + 3 ] = 0.0;

        // Z result (up to the app)
        m[ 2 * 4 + 0 ] = 0.0;
        m[ 2 * 4 + 1 ] = 0.0;
        m[ 2 * 4 + 2 ] = zFar / ( zNear - zFar ) * - handednessScale;
        m[ 2 * 4 + 3 ] = ( zFar * zNear ) / ( zNear - zFar );

        // W result (= Z in)
        m[ 3 * 4 + 0 ] = 0.0;
        m[ 3 * 4 + 1 ] = 0.0;
        m[ 3 * 4 + 2 ] = handednessScale;
        m[ 3 * 4 + 3 ] = 0.0;

        mobj.transpose();

        return mobj;
    };
    VRRenderer.prototype.render = function (scene, camera) {

        var renderer  = this.renderer;
        var vrDisplay = this.vrDisplay;

        var cameraL = this.cameraL;
        var cameraR = this.cameraR;

        // vrDisplayがない場合はそのままレンダリング
        if (!vrDisplay) {
            renderer.render(scene, camera);
            return;
        }

        // vrDisplayがフルスクリーンでない場合もそのままレンダリング
        if (vrDisplay && !vrDisplay.isPresenting) {
            renderer.render(scene, camera);
            return;
        }

        var sceneL = scene;
        var sceneR = scene;

        var size = renderer.getSize();
        size.width /= 2;

        renderer.enableScissorTest( true );
        renderer.clear();

        if (camera.parent === null) {
            camera.updateMatrixWorld();
        }

        cameraL.projectionMatrix = this.fovToProjection( eyeFOVL, true, camera.near, camera.far );
        cameraR.projectionMatrix = this.fovToProjection( eyeFOVR, true, camera.near, camera.far );

        camera.matrixWorld.decompose( cameraL.position, cameraL.quaternion, cameraL.scale );
        camera.matrixWorld.decompose( cameraR.position, cameraR.quaternion, cameraR.scale );

        cameraL.translateX( eyeTranslationL.x * this.scale );
        cameraR.translateX( eyeTranslationR.x * this.scale );

        // render left eye
        renderer.setViewport( 0, 0, size.width, size.height );
        renderer.setScissor( 0, 0, size.width, size.height );
        renderer.render( sceneL, cameraL );

        // render right eye
        renderer.setViewport( size.width, 0, size.width, size.height );
        renderer.setScissor( size.width, 0, size.width, size.height );
        renderer.render( sceneR, cameraR );

        renderer.enableScissorTest( false );
    }

    // Exports
    ns.VRRenderer = VRRenderer;
}(window));
