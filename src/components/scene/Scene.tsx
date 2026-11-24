"use client";

// R3F animates by mutating three.js objects (uniforms, scene, camera) outside React's render,
// which the React Compiler immutability rule cannot tell apart from render-time mutation.
/* eslint-disable react-hooks/immutability */

import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Head } from "./Head";
import { createLaserMaterial, createScanUniforms } from "./shaders";

/** Stacked layout: phones and portrait tablets. Keep in sync with page.module.css. */
function isStacked(width: number, height: number) {
  return width <= 900 || width / height < 1.1;
}

type SceneProps = {
  reducedMotion: boolean;
  onReady: () => void;
};

export function Scene({ reducedMotion, onReady }: SceneProps) {
  const rig = useRef<THREE.Group>(null);
  const laser = useRef<THREE.Mesh>(null);
  const startedAt = useRef<number | null>(null);
  const mouse = useRef(new THREE.Vector2());
  const look = useRef(new THREE.Vector2());

  const { gl, scene, size, viewport } = useThree();
  const uniforms = useMemo(() => createScanUniforms(), []);
  const laserMaterial = useMemo(() => createLaserMaterial(), []);
  const small = isStacked(size.width, size.height);

  // Soft studio reflections for the clearcoat, generated locally (no HDR download).
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Head right of the copy on wide screens, above it on phones.
  const framing = small
    ? { x: 0, y: 1.0, scale: 0.62 }
    : { x: Math.min(1.9, (0.825 * size.width) / size.height), y: 0, scale: 1 };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const since = startedAt.current === null ? 0 : (performance.now() - startedAt.current) / 1000;
    uniforms.uTime.value = t;
    uniforms.uPx.value = viewport.dpr;

    // Intro: the scan climbs from below the chin and assembles the face,
    // then breathes between nose and brow.
    const { x, y, scale } = framing;
    const top = y + 1.15 * scale;
    const rest = y + 0.34 * scale;
    let scan: number;
    if (reducedMotion) {
      scan = rest;
    } else if (startedAt.current === null) {
      scan = top - 2.3 * scale - 0.2;
    } else {
      const intro = Math.min(since / 4.2, 1);
      const ease = 1 - Math.pow(1 - intro, 3);
      const from = top - 2.3 * scale - 0.2;
      const breathe = Math.sin(Math.max(since - 4.2, 0) * 0.32) * 0.22 * scale;
      scan = from + (rest - from) * ease + breathe * ease;
    }
    uniforms.uScan.value = scan;
    laser.current?.position.set(x, scan, 0);

    look.current.lerp(mouse.current, 0.04);
    if (rig.current) {
      rig.current.rotation.y = -0.35 + look.current.x * 0.55 + (reducedMotion ? 0 : Math.sin(t * 0.15) * 0.08);
      rig.current.rotation.x = look.current.y * 0.16;
    }
    const cam = state.camera;
    cam.position.x = look.current.x * -0.15;
    cam.position.z = 7.4 + (reducedMotion ? 0 : Math.sin(t * 0.1) * 0.25);
    cam.lookAt(x * 0.55, y * 0.7, 0);
  });

  return (
    <>
      <color attach="background" args={["#050506"]} />
      <fogExp2 attach="fog" args={["#050506", 0.09]} />

      {/* Faint tungsten key, hard ice rim, warm counter-rim. */}
      <spotLight color="#ffc79a" intensity={26} distance={20} angle={0.5} penumbra={0.8} decay={1.6} position={[-3.5, 1.2, 4.5]} />
      <directionalLight color="#a9bdff" intensity={5.5} position={[3.5, 2.5, -4]} />
      <directionalLight color="#ffb27a" intensity={2.2} position={[-4, 0.5, -3]} />
      <ambientLight color="#1a1c24" intensity={0.6} />

      <group ref={rig} position={[framing.x, framing.y, 0]} scale={framing.scale}>
        <Suspense fallback={null}>
          <Head
            uniforms={uniforms}
            particleCount={small ? 16000 : 38000}
            onReady={() => {
              startedAt.current = performance.now();
              onReady();
            }}
          />
        </Suspense>
      </group>

      <mesh ref={laser} material={laserMaterial}>
        <planeGeometry args={[5.5, 0.012]} />
      </mesh>
    </>
  );
}
