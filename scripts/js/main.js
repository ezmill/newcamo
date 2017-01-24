var renderer, scene, camera;
var renderSize = new THREE.Vector2(0.0, 0.0);
var container = document.getElementById("container");
var PATH = './assets/';
var time = 0.0;
var mouse = new THREE.Vector2(0.0, 0.0);
var deltaMouse = new THREE.Vector2(0.0, 0.0);
var loader = new THREE.TextureLoader();
var cubeLoader = new THREE.CubeTextureLoader();
var uniforms;
var counter = 0;
var clock = new THREE.Clock();
var asphalt;
var videoTexture;
var colors = [
  // 0x604439,
  // 0x9e9a75,
  // 0x1c222e,
  // 0x41533b,
  // 0x554840,
/*  0xdfd5ba,
  0xbe8649,
  0xd0b588,
  0xf5dabc,
  0x907f3a,*/
  // 0x3b231c,
  // 0x875730,
  // 0xaea398,
  // 0x34431c,
  // 0x6d8455,
  // 0x472E2A,
  // 0x8D7C6A,
  // 0x672C28,
  // 0xAA4B47,
  // 0x762A2A,
/*  0x202C38,
  0x516580,
  0x465962,
  0x7488A1,
  0x2B3D55,*/
/*  0x2C130C,
  0xFAEAC8,
  0x173013,
  0xAFAF8D,
  0x42571F,*/
  0xFAD089,
  0xFF9C5B,
  0xF5634A,
  0xED303C,
  0x3B8183,

]
var images = [
  // PATH + "textures/IMG_4354",
  // PATH + "textures/IMG_4375",
  // PATH + "textures/IMG_4705",
  PATH + "textures/IMG_4728",
  // PATH + "textures/IMG_5091",
  PATH + "textures/IMG_5109",
  // PATH + "textures/IMG_5113",
  // PATH + "textures/IMG_5228",
  // PATH + "textures/IMG_5250",
  // PATH + "textures/IMG_5302",
  PATH + "textures/IMG_5533",
  // PATH + "textures/IMG_6036",
  // PATH + "textures/IMG_6077",
  // PATH + "textures/IMG_6108",
  // PATH + "textures/IMG_6160",
  // PATH + "textures/IMG_6205",
  PATH + "textures/IMG_6312",
  // PATH + "textures/IMG_6373",
  // PATH + "textures/IMG_6765",
  // PATH + "textures/IMG_6778",
  PATH + "textures/IMG_6796",
  // PATH + "textures/IMG_7390",
  // PATH + "textures/IMG_7443",
  // PATH + "textures/IMG_7499",
  // PATH + "textures/IMG_7627",
  // PATH + "textures/IMG_7731",
  // PATH + "textures/IMG_7781",
  // PATH + "textures/IMG_7800",
  PATH + "textures/IMG_7803",
  // PATH + "textures/IMG_7807",
  // PATH + "textures/IMG_7826",
  // PATH + "textures/IMG_7836",
]
var textures = [];
var bumpMaps = [];
var count = 0;
var capturer = new CCapture( { framerate: 60, format: 'webm', workersPath: 'js/' } );

loadTextures();

function loadTextures(){
  for(var i = 0; i < images.length; i++){
    var texture = loader.load(images[i] + ".jpg", loadCounter);
    texture.minFilter = texture.magFilter = THREE.NearestFilter;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    textures.push(texture);
    var bump = loader.load(images[i] + "_BUMP.png", loadCounter);
    bump.minFilter = bump.magFilter = THREE.NearestFilter;
    bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
    bumpMaps.push(bump);
  }
}
function loadCounter(){
  count++;
  if(count >= images.length*2){
    init();
  }
}

function init(){
	setRenderSize();

	renderer = new THREE.WebGLRenderer({
		preserveDrawingBuffer: true,
		antialias: true,
		alpha: true
	})
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(renderSize.x, renderSize.y);
  renderer.setClearColor(0x000000,1.0);
 	container.appendChild(renderer.domElement);
	scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -100000, 100000 );
	// camera = new THREE.PerspectiveCamera( 45, renderSize.x/ renderSize.y, 0.01, 100000 );
	camera.position.z = 1000;
  
  var noiseTex = loader.load(PATH + "textures/noise.png");
  noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping;
	controls = new THREE.OrbitControls(camera);
	uniforms = {
	    "resolution": renderSize,
	    "mouse": new THREE.Vector2(0.0,0.0),
	    "time": 0.0,
      "texture_noise": noiseTex
	}

  camo = new Camo(renderer, scene, camera);
  camo.init();

  debounceResize = debounce(onWindowResize, 250);
  window.addEventListener("resize", debounceResize);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener('keydown', function(){screenshot(renderer)}, false);

	animate();
}


function animate() {
    id = requestAnimationFrame(animate);
    draw();
}

function draw(){
	time+= 0.1;
	uniforms["time"] = time;
	uniforms["mouse"] = mouse;

  camo.draw();
  renderer.render(scene, camera);
  capturer.capture( renderer.domElement );

}

function setRenderSize(){
    // renderSize = new THREE.Vector2(window.innerHeight*(3024/4032), window.innerHeight);
    renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
}
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderSize.x) * 2 - 1;  
    mouse.y = -(event.clientY / renderSize.y) * 2 + 1;   
    deltaMouse.x = 10.0 * event.movementX / renderSize.x;
    deltaMouse.y = -10.0 * event.movementY / renderSize.y;
}
function onMouseDown(event) {

}
function onWindowResize(event) {
    setRenderSize();
    renderer.setSize(renderSize.x, renderSize.y);
    uniforms["resolution"] = new THREE.Vector2(renderSize.x, renderSize.y);
}
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
function screenshot(renderer) {
    if (event.keyCode == "32") {
        grabScreen(renderer);

        function grabScreen(renderer) {
            var blob = dataURItoBlob(renderer.domElement.toDataURL('image/png'));
            var file = window.URL.createObjectURL(blob);
            var img = new Image();
            img.src = file;
            img.onload = function(e) {
                window.open(this.src);

            }
        }
        function dataURItoBlob(dataURI) {
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {
                type: mimeString
            });
        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }
    if (event.keyCode == "82") {
        capturer.start();
    }
    if (event.keyCode == "84") {
        capturer.stop();
        capturer.save(function(blob) {
            window.open(blob);
        });
    }
}