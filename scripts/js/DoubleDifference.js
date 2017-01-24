function DoubleDifference(RENDERER, SCENE, CAMERA){
	//image +
	//invert + gaussian blur + noise mask
	//blend mode difference
	//levels adjust to image
	this.renderer = RENDERER;
	this.camera = new THREE.Camera();
	this.camera.position.z = 1;
	this.init = function(){
		// this.stars = new Buffer(new StarShader());
		this.image = new Buffer(new BumpShader());
        this.image.material.uniforms["texture"].value = loader.load(PATH + "textures/IMG_6360.jpg");
		this.image.material.uniforms["texture"].value.wrapS = this.image.material.uniforms["texture"].value.wrapT = THREE.RepeatWrapping;
        this.image.material.uniforms["texture_bump"].value = loader.load(PATH + "textures/bump5.jpg");
		this.image.material.uniforms["texture_bump"].value.wrapS = this.image.material.uniforms["texture_bump"].value.wrapT = THREE.RepeatWrapping;
/*		this.metal = new Buffer(new WindowShader());
        var urls = [
            PATH + "textures/downtown/px.png",
            PATH + "textures/downtown/nx.png",
            PATH + "textures/downtown/py.png",
            PATH + "textures/downtown/ny.png",
            PATH + "textures/downtown/pz.png",
            PATH + "textures/downtown/nz.png"
        ]
        this.metal.material.uniforms["envMap"].value = cubeLoader.load(urls)//this.cubeCamera.renderTarget.texture;
        var tex = loader.load(PATH + "textures/inspiration/IMG_7499.jpg");
        this.metal.material.uniforms["texture"].value = loader.load(PATH + "textures/random256_tiled512.jpg");
        this.metal.material.uniforms["texture"].value.wrapS = this.metal.material.uniforms["texture"].value.wrapT = THREE.RepeatWrapping;
        this.metal.material.uniforms["noise"].value = loader.load(PATH + "textures/random256_tiled512.jpg");
        this.metal.material.uniforms["noise"].value.wrapS = this.metal.material.uniforms["noise"].value.wrapT = THREE.RepeatWrapping;
        this.metal.material.uniforms["normalMap"].value = loader.load(PATH + "textures/random256_tiled512.jpg");
        this.metal.material.uniforms["normalMap"].value.wrapS = this.metal.material.uniforms["normalMap"].value.wrapT = THREE.RepeatWrapping;
        this.metal.material.uniforms["time"].value = time;
		this.metal.mesh.position.z = -10;*/
        // this.water = new Buffer(new WaterShader());
        // this.water.material.uniforms["texture"].value = this.image.renderTarget.texture;
        // this.water.material.uniforms["texture_bump"].value = loader.load(PATH + "textures/bump7.jpg");
		this.image2 = new Buffer(new BumpShader());
        this.image2.material.uniforms["texture"].value = loader.load(PATH + "textures/IMG_7803.jpg");
		this.image2.material.uniforms["texture"].value.wrapS = this.image2.material.uniforms["texture"].value.wrapT = THREE.RepeatWrapping;
        this.image2.material.uniforms["texture_bump"].value = loader.load(PATH + "textures/bump3.jpg");
		this.image2.material.uniforms["texture_bump"].value .wrapS =this.image2.material.uniforms["texture_bump"].value.wrapT = THREE.RepeatWrapping;
        this.image2.mesh.position.z = -100;
		this.image3 = new Buffer(new BumpShader());
        this.image3.material.uniforms["texture"].value = loader.load(PATH + "textures/IMG_7868.jpg");
		this.image3.material.uniforms["texture"].value.wrapS = this.image3.material.uniforms["texture"].value.wrapT = THREE.RepeatWrapping;
        this.image3.material.uniforms["texture_bump"].value = loader.load(PATH + "textures/bump8.jpg");
		this.image3.material.uniforms["texture_bump"].value .wrapS =this.image3.material.uniforms["texture_bump"].value.wrapT = THREE.RepeatWrapping;
        this.image3.mesh.position.z = -200;
/*		this.invert = new Buffer(new InvertShader());
		this.invert.material.uniforms["texture"].value = this.image.renderTarget.texture;
		this.blur = new Buffer(new BlurShader());
		this.blur.material.uniforms["texture"].value = this.invert.renderTarget.texture;

		// this.noise = new Buffer(new NoiseShader());
		// this.noise.material.uniforms["texture"].value = this.blur.renderTarget.texture;
		this.blend = new Buffer(new BlendShader());
		this.blend.material.uniforms["texture_src"].value = this.image.renderTarget.texture;
		this.blend.material.uniforms["texture_target"].value = this.invert.renderTarget.texture;
		this.invert2 = new Buffer(new InvertShader());
		this.invert2.material.uniforms["texture"].value = this.blend.renderTarget.texture;
		this.blur2 = new Buffer(new BlurShader());
		this.blur2.material.uniforms["texture"].value = this.invert2.renderTarget.texture;
		this.blend2 = new Buffer(new BlendShader());
		this.blend2.material.uniforms["texture_src"].value = this.blend.renderTarget.texture;
		this.blend2.material.uniforms["texture_target"].value = this.invert2.renderTarget.texture;*/
		// this.blur = new Buffer(new BlurShader());
		// this.noise = new Buffer(new NoiseShader());
		// this.combine = new Buffer(new BlendShader());

		//output - invert -
	}

	this.draw = function(){
		this.image.render(this.renderer, camera, true);
		// this.metal.render(this.renderer, camera, true);
		this.image2.render(this.renderer, this.camera, true);
		this.image3.render(this.renderer, this.camera, true);

		// this.stars.render(this.renderer, this.camera, true);
/*		this.image.render(this.renderer, this.camera, true);
		this.invert.render(this.renderer, this.camera, true);
		this.blur.render(this.renderer, this.camera, true);
		// this.noise.render(this.renderer, this.camera, true);
		this.blend.render(this.renderer, this.camera, true);
		this.invert2.render(this.renderer, this.camera, true);
		this.blur2.render(this.renderer, this.camera, true);
		this.blend2.render(this.renderer, this.camera, true);*/
	}
}
function BumpShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "texture2": { type: "t", value: null },
            "texture_bump": { type: "t", value: null },
            "texture_specular": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform sampler2D texture_bump;",
        "uniform float time;",
        "void main(){",
        "   vUv = uv;",
        "	vec3 pos = position;",
        "	pos.z += dot(texture2D(texture_bump, vec2(vUv.x, vUv.y + time*0.001)).xyz, vec3(1.0))*20.0;",
        "   vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;",
/*        "   vUv = position.xy;",
        "   vec2 clipSpace = 2.0*vUv - 1.0;  //from 0->1 to -1, 1 (clip space)",
        "   gl_Position = vec4(clipSpace, 0.0, 1.0 );",*/
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform sampler2D texture2;",
        "uniform sampler2D texture_bump;",
        "uniform sampler2D texture_specular;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",
        
        "vec2 W(vec2 p){",
        "    float interlineDistance = 1.0;",
        "    float amplificationFactor = 2.0;",
        "    float thickness = 10.0;",
        "    vec4 color = vec4(vec3(0.0), 0.0);",
        "    vec2 fc = p*resolution.xy;",
        "    fc /= interlineDistance;",
        "    vec2 p0 = fc*interlineDistance;//floor(fc*interlineDistance);",
        "    color += pow(.5+.5*cos( 6.28*(fc-p0).x + amplificationFactor*(1.*texture2D(texture_bump,vec2(p0.x, p0.y + time*10.0)/resolution.xy).g-1.) ),thickness);",
        "    color += pow(.5+.5*cos( 6.28*(fc-p0).y + amplificationFactor*(1.*texture2D(texture_bump,vec2(p0.x, p0.y + time*10.0)/resolution.xy).g-1.) ),thickness);",
       /* "    p = (p+3.)*4.;",

        "    float t = time/2.;",

        "    // Layered, sinusoidal feedback, with time component.",
        "    for (int i=0; i<3; i++){",
        "        p += cos( p.yx*3. + vec2(t,1.57))/3.;",
        "        p += sin( p.yx + t + vec2(1.57,0))/2.;",
        "        p *= 1.3;",
        "    }",

        "    // A bit of jitter to counter the high frequency sections.",
        // "    p +=  fract(sin(p+vec2(13, 7))*5e5)*.03-.015;",
*/
        "    return color.rg;//mod(p, 2.0)-1.0; // Range: [vec2(-1), vec2(1)]",
        "   ",
        "}",

        "// Bump mapping function. Put whatever you want here. In this case, ",
        "// we're returning the length of the sinusoidal warp function.",
        "float bumpFunc(vec2 p){ ",

        "	return length(W(p));//mod(texture2D(texture_bump, p).r,length(W(p))*.7071)*2.0; // Range: [0, 1]",

        "}",
        "float bumpFunc2(vec2 p){ ",

        "	return texture2D(texture_bump, vec2(p.x, p.y + time*0.01)).r; // Range: [0, 1]",

        "}",

        "vec3 smoothFract(vec3 x){ x = fract(x); return min(x, x*(1.-x)*12.); }",

        "void main(){",

        "    // Screen coordinates.",
        "	vec2 uv = vec2(vUv.x, vUv.y);//(fragCoord - resolution.xy*.5)/resolution.y;",
        "    ",
        "    vec3 sp = vec3(uv, 0); // Surface posion. Hit point, if you prefer. Essentially, a screen at the origin.",
        "    vec3 rd = normalize(vec3(uv, 1.0)); // Unit direction vector. From the origin to the screen plane.",
        "    vec3 lp = /*vec3((mouse.x)*0.5 + 0.5, (mouse.y*0.5 + 0.5), -1.0);//*/vec3(sin(time*0.1)*0.5 + 0.5, cos(time*0.1)*0.5 + 0.5, -1.); // Light position - Back from the screen.",
        "	vec3 sn = vec3(0., 0., -1); // Plane normal. Z pointing toward the viewer.",

        "    vec2 eps = vec2(4./resolution);",
        "    ",
        "    float f = bumpFunc2(sp.xy); // Sample value multiplied by the amplitude.",
        "    float fx = bumpFunc2(sp.xy-eps.xy); // Same for the nearby sample in the X-direction.",
        "    float fy = bumpFunc2(sp.xy-eps.yx); // Same for the nearby sample in the Y-direction.",
        "   ",
        " 	// Controls how much the bump is accentuated.",
        "	const float bumpFactor = 0.05;",
        "    ",
        "    // Using the above to determine the dx and dy function gradients.",
        "    fx = (fx-f)/eps.x; // Change in X",
        "    fy = (fy-f)/eps.x; // Change in Y.",
        "    //vec3 grad = vec3(fx, fy, 0);",
        "    //grad -= sn*dot(sn, grad);",
        "    //sn = normalize( sn + grad*bumpFactor );  ",
        "    sn = normalize( sn + vec3(fx, fy, 0)*bumpFactor );           ",
        "   ",
        "    ",
        "    // LIGHTING",
        "    //",
        "	// Determine the light direction vector, calculate its distance, then normalize it.",
        "	vec3 ld = lp - sp;",
        "	float lDist = max(length(ld), 0.001);",
        "	ld /= lDist;",

        "    // Light attenuation.    ",
        "    float atten = 1./(1.0 + lDist*lDist*0.015);",
        "	//float atten = min(1./(lDist*lDist*1.), 1.);",
        "    ",
        "    // find it gives extra depth.",
        "    atten *= f*.9 + .1; // Or... f*f*.7 + .3; //  pow(f, .75); // etc.",

        "	",

        "	// Diffuse value.",
        "	float diff = max(dot(sn, ld), 0.);  ",
        "    // Enhancing the diffuse value a bit. Made up.",
        "    diff = pow(diff, 4.)*0.66 + pow(diff, 8.)*0.34; ",
        "    // Specular highlighting.",
        "    float spec = pow(max(dot( reflect(-ld, sn), -rd), 0.), 12.); ",

        "    vec3 texCol = texture2D(texture,vec2(uv.x, uv.y + time*0.01)).xyz;",
        "    // Rough sRGB to linear conversion with processaing... That's a whole other conversation. :)",
        "    //texCol = smoothstep(0.05, .75, pow(texCol*texCol, vec3(.75, .8, .85)));     ",
        "    ",
        "    // Textureless. Simple and elegant... so it clearly didn't come from me. Thanks Fabrice. :)",
        // "    vec3 texCol = vec3(1.0, 0.35, 0.0)*vec3(2.0);//smoothFract( W(sp.xy).xyy )*.1 + .2;",
        "    ",
        "	",
        "    ",
        "    // FINAL COLOR",
        "    // Using the values above to produce the final color.   ",
        "    vec3 col = (texCol /** (diff*vec3(0.5)*2. + 0.5) * vec3(1.0)*/ +spec)*atten;",


        "    // Perform some statistically unlikely (but close enough) 2.0 gamma correction. :) ",
        "   gl_FragColor = vec4(col,dot(bumpFunc(vUv), 1.0));//vec4(sqrt(clamp(col, 0., 1.)), 1.);",
        // "   gl_FragColor = vec4(mix(vec3(0.0),col,dot(bumpFunc(vUv), 1.0)), 1.0);//vec4(sqrt(clamp(col, 0., 1.)), 1.);",
        // "	gl_FragColor = mix(vec4(vec3(1.0), 0.0),vec4(col,1.0),dot(bumpFunc(vUv), 1.0));//vec4(sqrt(clamp(col, 0., 1.)), 1.);",
        "}",

    ].join("\n");
}

function WindowShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "envMap": { type: "t", value: null },
            "normalMap": { type: "t", value: null },
            "normalScale": { type: "v2", value: new THREE.Vector2(1.0,1.0) },
            "texture": { type: "t", value: null },
            "noise": { type: "t", value: null },
            "time": { type: "f", value: 0.0 },
            "refractionRatio": { type: "f", value: 0.5 },
            "flipEnvMap": { type: "f", value: 1 },
            "useRefract": { type: "i", value: 0 } 
        }
    ]);

    this.vertexShader = [
        // "#define USE_ENVMAP",
        // "#define DOUBLE_SIDED",
        // "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )",
        "attribute vec4 tangent;",

        "varying vec3 vReflect;",
        "varying vec2 vUv;",
        "varying vec3 vWorldPosition;",
        "varying vec3 vViewPosition;",
        "varying vec3 vTangent;",
        "varying vec3 vBinormal;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform sampler2D noise;",
        "uniform float time;",
        "uniform float refractionRatio;",
        "uniform bool useRefract;",

        "vec3 mod289(vec3 x) {",
        "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",

        "vec4 mod289(vec4 x) {",
        "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",

        "vec4 permute(vec4 x) {",
        "     return mod289(((x*34.0)+1.0)*x);",
        "}",

        "vec4 taylorInvSqrt(vec4 r)",
        "{",
        "  return 1.79284291400159 - 0.85373472095314 * r;",
        "}",

        "float snoise(vec3 v)",
        "  { ",
        "  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;",
        "  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);",

        "// First corner",
        "  vec3 i  = floor(v + dot(v, C.yyy) );",
        "  vec3 x0 =   v - i + dot(i, C.xxx) ;",

        "// Other corners",
        "  vec3 g = step(x0.yzx, x0.xyz);",
        "  vec3 l = 1.0 - g;",
        "  vec3 i1 = min( g.xyz, l.zxy );",
        "  vec3 i2 = max( g.xyz, l.zxy );",

        "  //   x0 = x0 - 0.0 + 0.0 * C.xxx;",
        "  //   x1 = x0 - i1  + 1.0 * C.xxx;",
        "  //   x2 = x0 - i2  + 2.0 * C.xxx;",
        "  //   x3 = x0 - 1.0 + 3.0 * C.xxx;",
        "  vec3 x1 = x0 - i1 + C.xxx;",
        "  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y",
        "  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y",

        "// Permutations",
        "  i = mod289(i); ",
        "  vec4 p = permute( permute( permute( ",
        "             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))",
        "           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) ",
        "           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));",

        "// Gradients: 7x7 points over a square, mapped onto an octahedron.",
        "// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)",
        "  float n_ = 0.142857142857; // 1.0/7.0",
        "  vec3  ns = n_ * D.wyz - D.xzx;",

        "  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)",

        "  vec4 x_ = floor(j * ns.z);",
        "  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)",

        "  vec4 x = x_ *ns.x + ns.yyyy;",
        "  vec4 y = y_ *ns.x + ns.yyyy;",
        "  vec4 h = 1.0 - abs(x) - abs(y);",

        "  vec4 b0 = vec4( x.xy, y.xy );",
        "  vec4 b1 = vec4( x.zw, y.zw );",

        "  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;",
        "  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;",
        "  vec4 s0 = floor(b0)*2.0 + 1.0;",
        "  vec4 s1 = floor(b1)*2.0 + 1.0;",
        "  vec4 sh = -step(h, vec4(0.0));",

        "  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;",
        "  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;",

        "  vec3 p0 = vec3(a0.xy,h.x);",
        "  vec3 p1 = vec3(a0.zw,h.y);",
        "  vec3 p2 = vec3(a1.xy,h.z);",
        "  vec3 p3 = vec3(a1.zw,h.w);",

        "//Normalise gradients",
        "  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));",
        "  p0 *= norm.x;",
        "  p1 *= norm.y;",
        "  p2 *= norm.z;",
        "  p3 *= norm.w;",

        "// Mix final noise value",
        "  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);",
        "  m = m * m;",
        "  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), ",
        "                                dot(p2,x2), dot(p3,x3) ) );",
        "  }",
        "vec3 fn(vec3 pos){",
        // "   pos.z += sin(pos.y*0.2 + time*3.0)*3.0;",
        // "   float x = pos.x*2.0 - 1.0;",
        // "   float y = pos.y*2.0 - 1.0;",
        // "   float r = sqrt(x*x + y*y);",
        // "   float a = atan(x, y);",
        // "   float rn = pow(r,0.1);",
        // "   pos.z += dot(texture2D(texture, vUv).rgb, vec3(1.0)/3.0)*100.0;//snoise(vec3(x + time, y + time, abs(sin(a))*abs(cos(a))*rn));",
        // "   pos.z += snoise(vec3(x/5.0 + time, y/5.0 + time, abs(sin(a))*abs(cos(a))*rn/200.0));",
        // "   pos.z += snoise(pos);",
        "   return pos + texture2D(noise, uv).xyz;",
        "}",
        // "#endif"
        "void main(){",
            // "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )",

                // "#ifdef USE_SKINNING",

                //     "vec4 worldPosition = modelMatrix * skinned;",

                // "#endif",

                // "#if defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )",

                    // "vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );",

                // "#endif",
                "vUv = uv;",

                // "#if ! defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )",
                "vec3 pos = fn(position);",
                // "float small = 0.001;",
                // "vec3 bitangent = fn( vec3(position.x + small, position.yz) ) - pos;",
                // "vec3 tangent = fn(vec3(position.x, position.y + small, position.z)) - pos;",

                "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
                "gl_Position = projectionMatrix * mvPosition;",

                "vec4 worldPosition = modelMatrix * vec4( pos, 1.0 );",

                "vNormal = normalize( normalMatrix * normal );",
                "vTangent = normalize( normalMatrix * tangent.xyz );",
                "vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );",

                "vWorldPosition = worldPosition.xyz;",
                "vViewPosition = -mvPosition.xyz;",
                // "#endif",

            // "#endif"

            // "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )",
                // "vec3 objectNormal = normalize( cross( tangent, bitangent ));",
                "vec3 objectNormal = normal;",
                // "vec3 objectNormal = normalize(cross(dFdx(mvPosition.xyz), dFdy(mvPosition.xyz)));",
                "vec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;",
                "worldNormal = normalize( worldNormal );",

                "vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );",

                "if ( useRefract ) {",

                    "vReflect = refract( cameraToVertex, worldNormal, refractionRatio );",

                "} else {",

                "vReflect = reflect( cameraToVertex, worldNormal );",

                "}",

            // "#endif"
        "}",

    ].join("\n");

    this.fragmentShader = [
// 
        // "#define USE_ENVMAP",
        // "#define DOUBLE_SIDED",
        // "#ifdef USE_ENVMAP",

        "uniform float reflectivity;",
        "uniform samplerCube envMap;",
        "uniform float flipEnvMap;",
        // "uniform int combine;",

            // "#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )",

        "uniform bool useRefract;",
        "uniform float refractionRatio;",
        "uniform float time;",

            // "#else",

        "varying vec3 vReflect;",
        "varying vec2 vUv;",
        "varying vec3 vWorldPosition;",
        "varying vec3 vViewPosition;",
        "varying vec3 vTangent;",
        "varying vec3 vBinormal;",
        "varying vec3 vNormal;",

            // "#endif",
        "uniform sampler2D texture;",
        "uniform sampler2D normalMap;",
        "uniform sampler2D noise;",
        "uniform vec2 normalScale;",

        // Per-Pixel Tangent Space Normal Mapping
        // http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html

        "vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {",

            "vec3 q0 = dFdx( eye_pos.xyz );",
            "vec3 q1 = dFdy( eye_pos.xyz );",
            "vec2 st0 = dFdx( vUv.st );",
            "vec2 st1 = dFdy( vUv.st );",

            "vec3 S = normalize(  q0 * st1.t - q1 * st0.t );",
            "vec3 T = normalize( -q0 * st1.s + q1 * st0.s );",
            "vec3 N = normalize( surf_norm );",

            "vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;",
            "mapN.xy = normalScale * mapN.xy;",
            "mat3 tsn = mat3( S, T, N );",
            "return normalize( tsn * mapN );",

        "}",
        // "#endif"
        "void main(){",
            // "#ifdef USE_ENVMAP",

            "vec3 reflectVec;",
                
                // "#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )",
            "vec3 normalTex = texture2D( normalMap, vUv*3.0 ).xyz*2.0 - 1.0;",
            // "normalTex.xy *= uNormalScale;",
            "normalTex = normalize( normalTex );",
            "mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );",
            "vec3 finalNormal = /*tsb **/ normalTex;",
            "vec3 normal = normalize( finalNormal );",
            "vec3 viewPosition = normalize( vViewPosition );",
            "mat3 rot = mat3(vec3(1.0, 1.0, 1.0), vec3(1.0,1.0, 1.0), vec3(1.0, 1.0, 1.0));",
            "vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );",

            // "if ( useRefract ) {",

                // "reflectVec = mix(refract( cameraToVertex, normal, refractionRatio ), reflect( cameraToVertex, normal ), /*1.0*/dot(texture2D(noise, vUv).rgb, vec3(1.0)/3.0));",

            // "} else { ",

            "reflectVec = reflect( cameraToVertex, normal );",

            // "}",

                // "#else",

            // "reflectVec = vReflect;",

                // "#endif",

                // "#ifdef DOUBLE_SIDED",

            "float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );",
            "vec4 cubeColor = textureCube( envMap, /*flipNormal * */vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );",

                // "#else",

                    // "vec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );",

                // "#endif",

                // "#ifdef GAMMA_INPUT",

                    // "cubeColor.xyz *= cubeColor.xyz;",

                // "#endif",

                // "if ( combine == 1 ) {",

                //     "gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );",

                // "} else if ( combine == 2 ) {",

                //     "gl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;",

                // "} else {",

        // "gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );",
            "gl_FragColor.xyz = cubeColor.xyz;",
            "gl_FragColor.a = 1.0;",

                // "}",

            // "#endif"
        "}",

    ].join("\n");
}

function WaterShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "texture_bump": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
        "   vUv = uv;",
        "   vec3 pos = position;",
        "   pos.z = 20.0;",
        "   vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform sampler2D texture_bump;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",
        "vec2 W(vec2 p){",
        "    float interlineDistance = 1.0;",
        "    float amplificationFactor = 1.0;",
        "    float thickness = 10.0;",
        "    vec4 color = vec4(vec3(0.0), 0.0);",
        "    vec2 fc = p*resolution.xy;",
        "    fc /= interlineDistance;",
        "    vec2 p0 = fc*interlineDistance;//floor(fc*interlineDistance);",
        "    color += pow(.5+.5*cos( 6.28*(fc-p0).x + amplificationFactor*(1.*texture2D(texture_bump,vec2(p0.x, p0.y)/resolution.xy).g-1.) ),thickness);",
        "    color += pow(.5+.5*cos( 6.28*(fc-p0).y + amplificationFactor*(1.*texture2D(texture_bump,vec2(p0.x, p0.y)/resolution.xy).g-1.) ),thickness*0.25);",
       /* "    p = (p+3.)*4.;",

        "    float t = time/2.;",

        "    // Layered, sinusoidal feedback, with time component.",
        "    for (int i=0; i<3; i++){",
        "        p += cos( p.yx*3. + vec2(t,1.57))/3.;",
        "        p += sin( p.yx + t + vec2(1.57,0))/2.;",
        "        p *= 1.3;",
        "    }",

        "    // A bit of jitter to counter the high frequency sections.",
        // "    p +=  fract(sin(p+vec2(13, 7))*5e5)*.03-.015;",
*/
        "    return color.rg;//mod(p, 2.0)-1.0; // Range: [vec2(-1), vec2(1)]",
        "   ",
        "}",

        "// Bump mapping function. Put whatever you want here. In this case, ",
        "// we're returning the length of the sinusoidal warp function.",
        "float bumpFunc(vec2 p){ ",

        "   return length(W(p));//mod(texture2D(texture_bump, p).r,length(W(p))*.7071)*2.0; // Range: [0, 1]",

        "}",
        "void main()",
        "{",
        "    gl_FragColor = vec4( vec3(0.0, 0.0, (1.0 - dot(bumpFunc(vUv), 1.0))*3.0),  dot(bumpFunc(vUv), 1.0));",
        "}",
      
    ].join("\n");
}
function StarShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
/*        "   vUv = uv;",
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;;",*/
        "   vUv = position.xy;",
        "   vec2 clipSpace = 2.0*vUv - 1.0;  //from 0->1 to -1, 1 (clip space)",
        "   gl_Position = vec4(clipSpace, 0.0, 1.0 );",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",
        "#define M_2PI 6.28318530718",
        "vec2 polar(vec2 dPoint)",
        "{",
        "    return vec2(sqrt(dPoint.x * dPoint.x + dPoint.y * dPoint.y), atan(dPoint.y, dPoint.x));",
        "}",

        "float rand(vec2 co)",
        "{",
        "    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);",
        "}",

        "vec2 decart(vec2 pPoint)",
        "{",
        "    return vec2(pPoint.x * cos(pPoint.y), pPoint.x * sin(pPoint.y));",
        "}",

        "void main()",
        "{",
        "    vec2 screen = resolution.xy;",
        "    vec2 center = screen / 2.0;",
        "    vec2 frag = gl_FragCoord.xy - center;",
        "    vec2 fragPolar = polar(frag);",
        "    float lenCenter = length(center);",
        "    ",
        "	const float bandPass = 720.0;",
        "    const float angleDisp = M_2PI / (bandPass + 1.0);",
        "    ",
        "    const float particlesCount = 400.0;",
        "    const float particleLifetime = 7.0;",
        "    const float particleMaxSize = 70.5;",
        "    float particleMaxSizeNorm = particleMaxSize / lenCenter;",
        "    ",
        "    float globTime = time / particleLifetime;",
        "    float timeDelta = bandPass;",
        "    ",
        "    const float polarRadiusClip = 0.05;",
        "    const float polarRadiusMax = 0.75;",
        "    float polarRadiusDelta = polarRadiusMax - polarRadiusClip; ",
        "    ",
        "    float presence = 0.0;",
        "    vec2 pPoint;",
        "    ",
        "    for (float i = 0.0; i < particlesCount; i += 1.0)",
        "    {",
        "        float phase = i / particlesCount;",
        "        ",
        "        float localTime = globTime + timeDelta * (2.0 * phase - 1.0) + phase;",
        "        float particleTime = fract(localTime);",
        "        float spaceTransform = pow(particleTime, 8.0);",
        "        ",
        "        pPoint.x = lenCenter * ((polarRadiusClip + polarRadiusDelta * phase) + spaceTransform);",
        "        ",
        "        // +30 FPS :)",
        "        if (abs(pPoint.x - fragPolar.x) > particleMaxSize) continue;",
        "        ",
        "        pPoint.y = floor(particleTime + bandPass * rand(vec2(floor(localTime), 1))) * angleDisp;",
        "        ",
        "        vec2 dPoint = decart(pPoint);        ",
        "        float particleSize = particleMaxSize * spaceTransform;",
        "        float localPresence = particleSize * (1.0 - clamp(length(dPoint - frag), 0.0, 1.0));",
        "        presence += localPresence;",
        "    }",
        "    presence = clamp(presence, 0.0, 1.0);",
        "    gl_FragColor = vec4(presence, presence, presence, 1.0);",
        "}",
      
    ].join("\n");
}
function PassShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
/*        "   vUv = uv;",
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;;",*/
        "   vUv = position.xy;",
        "   vec2 clipSpace = 2.0*vUv - 1.0;  //from 0->1 to -1, 1 (clip space)",
        "   gl_Position = vec4(clipSpace, 0.0, 1.0 );",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",

        "void main()",
        "{",
        "    gl_FragColor = vec4( texture2D(texture, vec2(1.0 - vUv.x, vUv.y)).rrr*1.5, 1.0 );",
        "}",
      
    ].join("\n");
}
function InvertShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
/*        "   vUv = uv;",
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;;",*/
        "   vUv = position.xy;",
        "   vec2 clipSpace = 2.0*vUv - 1.0;  //from 0->1 to -1, 1 (clip space)",
        "   gl_Position = vec4(clipSpace, 0.0, 1.0 );",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",

        "void main()",
        "{",
        "    gl_FragColor = vec4( 1.0 - texture2D(texture, vUv).r, 1.0 - texture2D(texture, vUv).g, 1.0 - texture2D(texture, vUv).b, 1.0 );",
        "}",
      
    ].join("\n");
}

function BlurShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
/*        "   vUv = uv;",
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;;",*/
        "   vUv = position.xy;",
        "   vec2 clipSpace = 2.0*vUv - 1.0;  //from 0->1 to -1, 1 (clip space)",
        "   gl_Position = vec4(clipSpace, 0.0, 1.0 );",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",

      "float normpdf(in float x, in float sigma)",
      "{",
      "	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;",
      "}",


      "void main(){",
      "	vec3 c = texture2D(texture, vUv).rgb;",
  		"const int mSize = 7;",
  		"const int kSize = (mSize-1)/2;",
  		"float kernel[mSize];",
  		"vec3 final_colour = vec3(0.0);",
  		
  		"//create the 1-D kernel",
  		"float sigma = 7.0;",
  		"float Z = 0.0;",
  		"for (int j = 0; j <= kSize; ++j)",
  		"{",
  		"	kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);",
  		"}",
  		
  		"//get the normalization factor (as the gaussian has been clamped)",
  		"for (int j = 0; j < mSize; ++j)",
  		"{",
  		"	Z += kernel[j];",
  		"}",
  		
  		"//read out the texels",
  		"for (int i=-kSize; i <= kSize; ++i)",
  		"{",
  		"	for (int j=-kSize; j <= kSize; ++j)",
  		"	{",
  		"		final_colour += kernel[kSize+j]*kernel[kSize+i]*texture2D(texture, (gl_FragCoord.xy+vec2(float(i),float(j))) / resolution.xy).rgb;",
  	
  		"	}",
  		"}",
  		
  		
  		"gl_FragColor = vec4(final_colour/(Z*Z), 1.0);",
      "}",
    ].join("\n");
}

function BlurShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
/*        "   vUv = uv;",
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;;",*/
        "   vUv = position.xy;",
        "   vec2 clipSpace = 2.0*vUv - 1.0;  //from 0->1 to -1, 1 (clip space)",
        "   gl_Position = vec4(clipSpace, 0.0, 1.0 );",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",

      "float normpdf(in float x, in float sigma)",
      "{",
      "	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;",
      "}",


      "void main(){",
      "	vec3 c = texture2D(texture, vUv).rgb;",
  		"const int mSize = 11;",
  		"const int kSize = (mSize-1)/2;",
  		"float kernel[mSize];",
  		"vec3 final_colour = vec3(0.0);",
  		
  		"//create the 1-D kernel",
  		"float sigma = 7.0;",
  		"float Z = 0.0;",
  		"for (int j = 0; j <= kSize; ++j)",
  		"{",
  		"	kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);",
  		"}",
  		
  		"//get the normalization factor (as the gaussian has been clamped)",
  		"for (int j = 0; j < mSize; ++j)",
  		"{",
  		"	Z += kernel[j];",
  		"}",
  		
  		"//read out the texels",
  		"for (int i=-kSize; i <= kSize; ++i)",
  		"{",
  		"	for (int j=-kSize; j <= kSize; ++j)",
  		"	{",
  		"		final_colour += kernel[kSize+j]*kernel[kSize+i]*texture2D(texture, (gl_FragCoord.xy+vec2(float(i),float(j))) / resolution.xy).rgb;",
  	
  		"	}",
  		"}",
  		
  		
  		"gl_FragColor = vec4(final_colour/(Z*Z), 1.0);",
      "}",
    ].join("\n");
}

function NoiseShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "texture_noise": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
/*        "   vUv = uv;",
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;;",*/
        "   vUv = position.xy;",
        "   vec2 clipSpace = 2.0*vUv - 1.0;  //from 0->1 to -1, 1 (clip space)",
        "   gl_Position = vec4(clipSpace, 0.0, 1.0 );",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform sampler2D texture_noise;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",

      "void main(){",
      	"	vec4 tex = texture2D(texture, vUv);",
      	"	vec4 noise = texture2D(texture_noise, vUv*10.0);",
      	"	gl_FragColor = tex * noise;",
      "}",
    ].join("\n");
}
function BlendShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture_src": { type: "t", value: null },
            "texture_target": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [
   
        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
/*        "   vUv = uv;",
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;;",*/
        "   vUv = position.xy;",
        "   vec2 clipSpace = 2.0*vUv - 1.0;  //from 0->1 to -1, 1 (clip space)",
        "   gl_Position = vec4(clipSpace, 0.0, 1.0 );",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture_src;",
        "uniform sampler2D texture_target;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",
        "vec3 difference (vec3 target, vec3 blend){",
        "    return abs (target - blend);",
        "    ",
        "}",
      "void main(){",
      	"	vec4 src = texture2D(texture_src, vUv);",
      	"	vec4 trg = texture2D(texture_target, vUv);",
      	"	gl_FragColor = vec4(difference(trg.rgb, src.rgb), 1.0);",
      "}",
    ].join("\n");
}
