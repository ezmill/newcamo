function Asphalt(RENDERER, SCENE, CAMERA){
	this.renderer = RENDERER;
	this.scene = SCENE;
	this.camera = CAMERA;
	this.mesh, this.material, this.geometry;
    // this.cubeCamera = new THREE.CubeCamera( 1, 100000, 2048 );
    // this.cubeCamera.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
    // this.scene.add(this.cubeCamera);
	this.init = function(){
        var shader = new WindowShader();
        this.material = new THREE.ShaderMaterial({
            uniforms: shader.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: 2
        })
        this.material.extensions.derivatives = true;

        var urls = [
        	PATH + "textures/downtown/px.png",
        	PATH + "textures/downtown/nx.png",
        	PATH + "textures/downtown/py.png",
        	PATH + "textures/downtown/ny.png",
        	PATH + "textures/downtown/pz.png",
        	PATH + "textures/downtown/nz.png"
        ]
        this.material.uniforms["envMap"].value = cubeLoader.load(urls)//this.cubeCamera.renderTarget.texture;
        var tex = loader.load(PATH + "textures/inspiration/IMG_7499.jpg");
        this.material.uniforms["texture"].value = tex;
        this.material.uniforms["noise"].value = noise.renderTarget.texture;//tex;
        this.material.uniforms["normalMap"].value = tex;;
        this.material.uniforms["time"].value = time;
        this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y, 100, 100);
        // this.geometry = new THREE.SphereGeometry(100, 100, 100);

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.mesh);
        // this.mesh.position.copy(this.position);
        // this.mesh.rotation.x = Math.PI/1.5;
        // this.mesh.rotation.y = this.rotation.y;
        // this.mesh.rotation.z = this.rotation.z;
	}

	this.draw = function(){
        this.material.uniforms["time"].value = time;       
        // this.cubeCamera.position.copy( this.mesh.position );
        // this.cubeCamera.updateCubeMap( this.renderer, this.scene );
	}
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
            "vec3 normalTex = texture2D( normalMap, vUv ).xyz*2.0 - 1.0;",
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
