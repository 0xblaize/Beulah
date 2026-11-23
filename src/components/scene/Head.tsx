"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import {
  createHeadMaterial,
  createParticleMaterial,
  type ScanUniforms,
} from "./shaders";

const MODEL_URL = "/models/head.glb";
const HEAD_HEIGHT = 2.3;

/** Seeded PRNG so the particle cloud is identical on every render. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type HeadProps = {
  uniforms: ScanUniforms;
  particleCount: number;
  onReady?: () => void;
};

export function Head({ uniforms, particleCount, onReady }: HeadProps) {
  const { scene } = useGLTF(MODEL_URL, false);

  const geometry = useMemo(() => {
    let src: THREE.Mesh | undefined;
    scene.traverse((o) => {
      if (!src && (o as THREE.Mesh).isMesh) src = o as THREE.Mesh;
    });
    if (!src) throw new Error("Head model has no mesh");

    const geo = src.geometry.clone();
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = HEAD_HEIGHT / size.y;
    geo.translate(-center.x, -center.y, -center.z);
    geo.scale(s, s, s);
    geo.computeVertexNormals();
    return geo;
  }, [scene]);

  const particles = useMemo(() => {
    const random = mulberry32(0xbe0a1);
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry));
    // Typed late in @types/three, but present in the shipped sampler.
    (sampler as MeshSurfaceSampler & { setRandomGenerator(fn: () => number): void }).setRandomGenerator(random);
    sampler.build();
    const pos = new Float32Array(particleCount * 3);
    const nor = new Float32Array(particleCount * 3);
    const rnd = new Float32Array(particleCount);
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    for (let i = 0; i < particleCount; i++) {
      sampler.sample(p, n);
      pos.set([p.x, p.y, p.z], i * 3);
      nor.set([n.x, n.y, n.z], i * 3);
      rnd[i] = random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aNormal", new THREE.BufferAttribute(nor, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
    return g;
  }, [geometry, particleCount]);

  const headMaterial = useMemo(() => createHeadMaterial(uniforms), [uniforms]);
  const particleMaterial = useMemo(() => createParticleMaterial(uniforms), [uniforms]);

  useEffect(() => () => {
    geometry.dispose();
    particles.dispose();
    headMaterial.dispose();
    particleMaterial.dispose();
  }, [geometry, particles, headMaterial, particleMaterial]);

  // Fire once, on the first mount after the model is in. R3F's reconciler has no
  // useEffectEvent, so the latest callback rides in a ref.
  const readyRef = useRef(onReady);
  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);
  useEffect(() => {
    readyRef.current?.();
  }, []);

  return (
    <>
      <mesh geometry={geometry} material={headMaterial} />
      <points geometry={particles} material={particleMaterial} />
    </>
  );
}

useGLTF.preload(MODEL_URL, false);
