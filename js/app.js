'use strict';

(function() {
    
    //Setup Three
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    
    //Add element in page
    document.body.appendChild(renderer.domElement);
    
    //Create Scene
    var scene = new THREE.Scene();
    
    //Create Camera
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
    
    //Set Controls for VR Headset
    var controls = new THREE.VRControls(camera);
    
    //Apply stereo Effect
    var effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    
    //Create VR Manager
    var manager = new WebVRManager(renderer, effect, {hideButton: false});
    
    // Create 3D objects.
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(geometry, material);
    cube.position.z = -1;
    
    //Add cube
    scene.add(cube);
    
    //Create Skybox
    var boxWidth = 10;
    var texture = THREE.ImageUtils.loadTexture(
      'img/box.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxWidth, boxWidth);
    var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x333333,
      side: THREE.BackSide
    });
    var skybox = new THREE.Mesh(geometry, material);
    scene.add(skybox);
    
    //Create Animate function
    function animate() {
        //Rotate cube
        cube.rotation.y += 0.1;
        
        //Update Controls
        controls.update();
        
        //Render the scene with Manager
        manager.render(scene, camera);
        
        requestAnimationFrame(animate);
    }
    
    //Start Animation
    animate();
    
    
    //SetUp resize event
    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        effect.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize, false);
})();