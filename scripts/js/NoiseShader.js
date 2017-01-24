function NoiseShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture_noise": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "time": { type: "f", value: 0.0 },
            "diffusionRate": { type: "f", value: 0.0 },
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
        "uniform sampler2D texture_noise;",
        "uniform vec2 resolution;",
        "uniform vec2 mouse;",
        "uniform float time;",

        "float noise( in vec2 x )",
        "{",
        "    vec2 p = floor(x);",
        "    vec2 f = fract(x);",
        "    f = f*f*(3.0-2.0*f);",
        "    float a = texture2D(texture_noise,(p+vec2(0.5,0.5))/256.0).x;",
        "    float b = texture2D(texture_noise,(p+vec2(1.5,0.5))/256.0).x;",
        "    float c = texture2D(texture_noise,(p+vec2(0.5,1.5))/256.0).x;",
        "    float d = texture2D(texture_noise,(p+vec2(1.5,1.5))/256.0).x;",
        "    return mix(mix( a, b,f.x), mix( c, d,f.x),f.y);",
        "}",

        "const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );",

        "float fbm4( vec2 p )",
        "{",
        "    float f = 0.0;",

        "    f += 0.5000*(-1.0+2.0*noise( p )); p = mtx*p*2.02;",
        "    f += 0.2500*(-1.0+2.0*noise( p )); p = mtx*p*2.03;",
        "    f += 0.1250*(-1.0+2.0*noise( p )); p = mtx*p*2.01;",
        "    f += 0.0625*(-1.0+2.0*noise( p ));",

        "    return f/0.9375;",
        "}",

        "float fbm6( vec2 p )",
        "{",
        "    float f = 0.0;",

        "    f += 0.500000*noise( p ); p = mtx*p*2.02;",
        "    f += 0.250000*noise( p ); p = mtx*p*2.03;",
        "    f += 0.125000*noise( p ); p = mtx*p*2.01;",
        "    f += 0.062500*noise( p ); p = mtx*p*2.04;",
        "    f += 0.031250*noise( p ); p = mtx*p*2.01;",
        "    f += 0.015625*noise( p );",

        "    return f/0.96875;",
        "}",

        "float func( vec2 q, out vec2 o, out vec2 n )",
        "{",
        "    float ql = length( q );",
        "    q.x += 0.05*sin(0.11*time+ql*4.0);",
        "    q.y += 0.05*sin(0.13*time+ql*4.0);",
        "    q *= 0.7 + 0.2*cos(0.05*time);",

        "    q = (q+1.0)*0.5;",

        "    o.x = 0.5 + 0.5*fbm4( vec2(2.0*q*vec2(1.0,1.0)          )  );",
        "    o.y = 0.5 + 0.5*fbm4( vec2(2.0*q*vec2(1.0,1.0)+vec2(5.2))  );",

        "    float ol = length( o );",
        "    o.x += 0.02*sin(0.11*time*ol)/ol;",
        "    o.y += 0.02*sin(0.13*time*ol)/ol;",


        "    n.x = fbm6( vec2(4.0*o*vec2(1.0,1.0)+vec2(9.2))  );",
        "    n.y = fbm6( vec2(4.0*o*vec2(1.0,1.0)+vec2(5.7))  );",

        "    vec2 p = 4.0*q + 4.0*n;",

        "    float f = 0.5 + 0.5*fbm4( p );",

        "    f = mix( f, f*f*f*3.5, f*abs(n.x) );",

        "    float g = 0.5+0.5*sin(4.0*p.x)*sin(4.0*p.y);",
        "    f *= 1.0-0.5*pow( g, 8.0 );",

        "    return f;",
        "}",

        "float funcs( in vec2 q )",
        "{",
        "    vec2 t1, t2;",
        "    return func(q,t1,t2);",
        "}",


        "void main()",
        "{",
        "    vec2 p = gl_FragCoord.xy / resolution.xy;",
        "    vec2 q = (-resolution.xy + 2.0*gl_FragCoord.xy) /resolution.y;",
        "    ",
        "    vec2 o, n;",
        "    float f = func(q, o, n);",
        "    vec3 col = vec3(0.0);",


        "    col = mix( vec3(0.0), vec3(1.0), f );",
        " ",
        "    gl_FragColor = vec4( col, 1.0 );",
        "}",
      
    ].join("\n");
}