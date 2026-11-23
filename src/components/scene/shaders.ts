import * as THREE from "three";

export type ScanUniforms = {
  uScan: { value: number };
  uTime: { value: number };
  uEdge: { value: THREE.Color };
  uPx: { value: number };
};

export function createScanUniforms(): ScanUniforms {
  return {
    uScan: { value: -3 },
    uTime: { value: 0 },
    uEdge: { value: new THREE.Color(0xffd2a8) },
    uPx: { value: 1 },
  };
}

/**
 * Obsidian bust that is cut away above the scanline, with a glowing seam
 * along the cut and a faintly lit hollow inside.
 */
export function createHeadMaterial(u: ScanUniforms) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x0c0c0f,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.6,
    side: THREE.DoubleSide,
  });
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWP;")
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vWP;\nuniform float uScan;\nuniform float uTime;\nuniform vec3 uEdge;",
      )
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        float wob = sin(vWP.x * 11.0 + uTime * 1.7) * 0.018 + sin(vWP.z * 17.0 - uTime * 2.3) * 0.012;
        float dd = vWP.y - (uScan + wob);
        if (dd > 0.0) discard;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float seam = smoothstep(0.05, 0.0, -dd);
        totalEmissiveRadiance += uEdge * (seam * seam * 6.0);
        if (!gl_FrontFacing) totalEmissiveRadiance += uEdge * 0.05 * (1.0 + seam * 8.0);`,
      );
  };
  return mat;
}

/** The particle twin: alive only above the scanline, drifting further the higher it sits. */
export function createParticleMaterial(u: ScanUniforms) {
  return new THREE.ShaderMaterial({
    uniforms: u,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uScan, uTime, uPx;
      attribute vec3 aNormal;
      attribute float aRnd;
      varying float vA;
      varying float vD;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        float d = w.y - uScan;
        float lift = max(d, 0.0);
        vec3 wn = normalize(mat3(modelMatrix) * aNormal);
        float t = uTime * (0.35 + aRnd * 0.5);
        vec3 drift = vec3(sin(t + aRnd * 40.0), cos(t * 0.8 + aRnd * 17.0), sin(t * 1.2 + aRnd * 9.0));
        w.xyz += wn * pow(lift, 1.6) * (0.25 + aRnd * 0.9);
        w.xyz += drift * lift * lift * 0.18;
        w.y += lift * lift * aRnd * 0.35;
        vec4 mv = viewMatrix * w;
        gl_Position = projectionMatrix * mv;
        float near = smoothstep(0.0, 0.025, d);
        vA = near * (1.0 - smoothstep(0.7, 2.1, d)) * (0.35 + aRnd * 0.65);
        vD = d;
        gl_PointSize = uPx * (1.0 + aRnd * 1.8 + smoothstep(0.08, 0.0, d) * 2.5) * (6.5 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      varying float vA;
      varying float vD;
      void main() {
        vec2 q = gl_PointCoord - 0.5;
        float r = dot(q, q);
        if (r > 0.25) discard;
        vec3 warm = vec3(1.0, 0.82, 0.66);
        vec3 cold = vec3(0.66, 0.74, 1.0);
        vec3 col = mix(warm * 1.6, cold, smoothstep(0.0, 0.9, vD));
        gl_FragColor = vec4(col, vA * (1.0 - r * 4.0));
      }`,
  });
}

/** Short laser that fades out at both ends, drawn at the scan height. */
export function createLaserMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        float x = 1.0 - abs(vUv.x - 0.5) * 2.0;
        float y = 1.0 - abs(vUv.y - 0.5) * 2.0;
        gl_FragColor = vec4(vec3(1.0, 0.88, 0.77), pow(x, 2.2) * y * 0.7);
      }`,
  });
}
