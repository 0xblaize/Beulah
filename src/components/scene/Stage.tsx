"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Scene } from "./Scene";
import styles from "./Stage.module.css";

const ABERRATION = new THREE.Vector2(0.0007, 0.0007);

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

export default function Stage() {
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <div className={styles.stage} aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 2]}
        camera={{ fov: 28, position: [0, 0.05, 7.4], near: 0.1, far: 100 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        fallback={<div className={styles.noGl} />}
      >
        <Scene reducedMotion={reducedMotion} onReady={() => setReady(true)} />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.82} luminanceSmoothing={0.2} radius={0.7} />
          <ChromaticAberration offset={ABERRATION} radialModulation modulationOffset={0.2} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Noise premultiply={false} blendFunction={BlendFunction.OVERLAY} opacity={0.35} />
          <Vignette offset={0.28} darkness={0.85} />
        </EffectComposer>
      </Canvas>
      </div>
      <div className={`${styles.veil} ${ready ? styles.veilOff : ""}`} aria-hidden="true" />
    </>
  );
}
