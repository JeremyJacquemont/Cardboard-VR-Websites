//Setup Three
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.domElement.style.position = 'absolute';
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.style.top      = 0;

renderer.domElement.addEventListener('click', fullscreen, false);

//Add element in page
document.body.appendChild(renderer.domElement);

// create a renderer for CSS
var rendererCSS	= new THREE.CSS3DStereoRenderer();
rendererCSS.setSize( window.innerWidth, window.innerHeight );
rendererCSS.domElement.style.position = 'absolute';
rendererCSS.domElement.style.top	  = 0;
document.body.appendChild( rendererCSS.domElement );

//Create Scene
var scene = new THREE.Scene();

//Create Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
camera.position.y += 0.5;

//Set Controls for VR Headset
var controls = new THREE.VRControls(camera);

//Apply stereo Effect
/*var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);*/
var effect = new THREE.StereoEffect(renderer);

//Create VR Manager
//var manager = new WebVRManager(renderer);

//Create Skybox
var boxWidth = 10;
var texture = THREE.ImageUtils.loadTexture(
  'img/checker.png'
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

var planeMaterial   = new THREE.MeshBasicMaterial({color: 0x00FFFFFF, opacity: 0.1, side: THREE.DoubleSide });
var planeWidth = 1;
var planeHeight = 1;
var planeGeometry = new THREE.PlaneGeometry( planeWidth, planeHeight );
var planeMesh= new THREE.Mesh( planeGeometry, planeMaterial );
planeMesh.position.y += planeHeight/2;
planeMesh.position.z = -1;
// add it to the standard (WebGL) scene
scene.add(planeMesh);

// create a new scene to hold CSS
var cssScene = new THREE.Scene();
// create the iframe to contain webpage
var element	= document.createElement('iframe');
// webpage to be loaded into iframe
element.src	= "https://www.youtube.com/embed/1zN7J64IeBo";
// width of iframe in pixels
var elementWidth = 1024;
// force iframe to have same relative dimensions as planeGeometry
var aspectRatio = planeHeight / planeWidth;
var elementHeight = elementWidth * aspectRatio;
element.style.width  = elementWidth + "px";
element.style.height = elementHeight + "px";

// create a CSS3DObject to display element
var cssObject = new THREE.CSS3DObject( element );

// synchronize cssObject position/rotation with planeMesh position/rotation 
cssObject.position.x = planeMesh.position.x;
cssObject.position.y = planeMesh.position.y;
cssObject.position.z = planeMesh.position.z;

cssObject.rotation.x = planeMesh.rotation.x;
cssObject.rotation.y = planeMesh.rotation.y;
cssObject.rotation.z = planeMesh.rotation.z;

// resize cssObject to same size as planeMesh (plus a border)
var percentBorder = 0.05;
cssObject.scale.x /= (1 + percentBorder) * (elementWidth / planeWidth);
cssObject.scale.y /= (1 + percentBorder) * (elementWidth / planeWidth);
cssScene.add(cssObject);

//Create Animate function
function animate() {
    //Update Controls
    controls.update();
    
    //Render the scene with Manager
    rendererCSS.render(cssScene, camera);
    renderer.render(scene, camera);
    
    requestAnimationFrame(animate);
}

//Start Animation
animate();

function fullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (document.body.msRequestFullscreen) {
    document.body.msRequestFullscreen();
  } else if (document.body.mozRequestFullScreen) {
    document.body.mozRequestFullScreen();
  } else if (document.body.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen();
  }
}

//SetUp resize event
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    effect.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize, false);