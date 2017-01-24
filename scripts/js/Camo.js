function Camo(RENDERER, SCENE, CAMERA){
	//image +
	//invert + gaussian blur + noise mask
	//blend mode difference
	//levels adjust to image
	this.renderer = RENDERER;
	this.camera = new THREE.Camera();
	this.camera.position.z = 1;
    this.buffers = [];
	this.init = function(){
        for(var i = 0; i < textures.length; i++){
            var buffer = new Buffer(new BumpShader());
            buffer.material.uniforms["texture"].value = textures[i];
            buffer.material.uniforms["texture_bump"].value = bumpMaps[i];
            buffer.material.uniforms["color"].value = new THREE.Color(colors[i%colors.length]);
            // buffer.mesh.position.z = i*100;
            this.buffers.push(buffer);
        }
	}

	this.draw = function(){
        for(var i = 0; i < this.buffers.length; i++){
            this.buffers[i].render(this.renderer, camera, false);
        }
	}
}
function BumpShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "texture_bump": { type: "t", value: null },
            "texture_specular": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "color": { type: "v3", value: null },
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
        "   pos.z += dot(texture2D(texture_bump, vec2(vUv.x, vUv.y + time*0.001)).xyz, vec3(1.0))*50.0;",
        "   vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;",
        "}",

    ].join("\n");

    this.fragmentShader = [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "uniform sampler2D texture;",
        "uniform sampler2D texture_bump;",
        "uniform sampler2D texture_specular;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform vec3 color;",
        "uniform float time;",
        
        "vec2 W(vec2 p){",
        "    float interlineDistance = 1.0;",
        "    float amplificationFactor = 10.0;",
        "    float thickness = 10.0;",
        "    vec4 color = vec4(vec3(0.0), 0.0);",
        "    vec2 fc = p*resolution.xy;",
        "    fc /= interlineDistance;",
        "    vec2 p0 = fc*interlineDistance;//floor(fc*interlineDistance);",
        "    color += pow(.5+.5*cos( time*0.1 + 6.28*(fc-p0).x + amplificationFactor*(1.*texture2D(texture_bump,vec2(p0.x, p0.y)/resolution.xy).g-1.) ),thickness);",
        "    color += pow(.5+.5*cos( time*0.1 + 6.28*(fc-p0).y + amplificationFactor*(1.*texture2D(texture_bump,vec2(p0.x, p0.y)/resolution.xy).g-1.) ),thickness);",
        "    return color.rg;//mod(p, 2.0)-1.0; // Range: [vec2(-1), vec2(1)]",
        "   ",
        "}",

        "// Bump mapping function. Put whatever you want here. In this case, ",
        "// we're returning the length of the sinusoidal warp function.",
        "float bumpFunc(vec2 p){ ",

        "	return length(W(p));//mod(texture2D(texture_bump, p).r,length(W(p))*.7071)*2.0; // Range: [0, 1]",

        "}",
        "float bumpFunc2(vec2 p){ ",

        "	return texture2D(texture_bump, vec2(p.x, p.y)).r; // Range: [0, 1]",

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
        "    float spec = pow(max(dot( reflect(-ld, sn), -rd), 0.), 24.); ",

        "    vec3 texCol = texture2D(texture,vec2(uv.x, uv.y)).xyz;",
        "    // Rough sRGB to linear conversion with processaing... That's a whole other conversation. :)",
        "    //texCol = smoothstep(0.05, .75, pow(texCol*texCol, vec3(.75, .8, .85)));     ",
        "    ",
        "    // Textureless. Simple and elegant... so it clearly didn't come from me. Thanks Fabrice. :)",
        // "    vec3 texCol = /*texture2D(texture,vec2(uv.x, uv.y)).xyz**/color;//smoothFract( W(sp.xy).xyy )*.1 + .2;",
        "    ",
        "	",
        "    ",
        "    // FINAL COLOR",
        "    // Using the values above to produce the final color.   ",
        "    vec3 col = (texCol /** (diff*vec3(0.5)*2. + 0.5) * vec3(1.0)*/ + spec*vec3(1.0, 0.9, 0.9))*atten;",


        "    // Perform some statistically unlikely (but close enough) 2.0 gamma correction. :) ",
        "   gl_FragColor = vec4(col, dot(bumpFunc(vUv), 1.0));//vec4(sqrt(clamp(col, 0., 1.)), 1.);",
        // "   gl_FragColor = texture2D(texture_bump, vUv);//vec4(sqrt(clamp(col, 0., 1.)), 1.);",
        // "   gl_FragColor = vec4(mix(vec3(0.0),col,dot(bumpFunc(vUv), 1.0)), 1.0);//vec4(sqrt(clamp(col, 0., 1.)), 1.);",
        // "	gl_FragColor = mix(vec4(vec3(1.0), 0.0),vec4(col,1.0),dot(bumpFunc(vUv), 1.0));//vec4(sqrt(clamp(col, 0., 1.)), 1.);",
        "}",

    ].join("\n");
}
