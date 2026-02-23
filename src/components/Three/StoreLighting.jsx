/**
 * StoreLighting.jsx
 * ─────────────────────────────────────────────────────────
 * Premium cyberpunk lighting rig for the virtual showroom.
 * Combines ambient / directional / spot lights, contact
 * shadows, fog, and animated neon wall strips.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/* ── Animated neon strip (used on walls) ── */
const NeonStrip = ({ position, rotation, width = 40, color = '#00E0FF' }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.material.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.4;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={[width, 0.06, 0.06]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        toneMapped={false}
      />
    </mesh>
  );
};

/* ── Spot accent light on the ceiling ── */
const CeilingSpot = ({ position, target = [0, 0, 0], color = '#00E0FF' }) => {
  const light = useRef();
  /* Destructure array deps so useMemo doesn't re-run on
     every render (array literals create new references) */
  const [tx, ty, tz] = target;
  const targetObj = useMemo(() => {
    const t = new THREE.Object3D();
    t.position.set(tx, ty, tz);
    return t;
  }, [tx, ty, tz]);

  return (
    <>
      <primitive object={targetObj} />
      <spotLight
        ref={light}
        position={position}
        target={targetObj}
        color={color}
        intensity={30}
        angle={0.4}
        penumbra={0.8}
        distance={30}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
    </>
  );
};

const StoreLighting = () => {
  return (
    <>
      {/* ── Global ambient ── */}
      <ambientLight intensity={0.12} color="#1a1a2e" />

      {/* ── Key light (slightly warm) ── */}
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.4}
        color="#e8e0ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* ── Fill light ── */}
      <directionalLight position={[-8, 10, -5]} intensity={0.15} color="#00E0FF" />

      {/* ── Ceiling accent spots (illuminate pedestals) ── */}
      <CeilingSpot position={[-12, 10, -15]} target={[-12, 0, -15]} color="#BD00FF" />
      <CeilingSpot position={[0, 10, -15]}   target={[0, 0, -15]}   color="#00E0FF" />
      <CeilingSpot position={[12, 10, -15]}  target={[12, 0, -15]}  color="#BD00FF" />
      <CeilingSpot position={[-12, 10, 5]}   target={[-12, 0, 5]}   color="#00E0FF" />
      <CeilingSpot position={[0, 10, 5]}     target={[0, 0, 5]}     color="#BD00FF" />
      <CeilingSpot position={[12, 10, 5]}    target={[12, 0, 5]}    color="#00E0FF" />

      {/* ── Neon wall strips ── */}
      {/* back wall */}
      <NeonStrip position={[0, 3.5, -29.9]} color="#00E0FF" />
      <NeonStrip position={[0, 6,   -29.9]} color="#BD00FF" />
      {/* front wall */}
      <NeonStrip position={[0, 3.5, 29.9]}  color="#BD00FF" />
      <NeonStrip position={[0, 6,   29.9]}  color="#00E0FF" />
      {/* left wall */}
      <NeonStrip position={[-19.9, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} width={60} color="#00FF88" />
      <NeonStrip position={[-19.9, 6,   0]} rotation={[0, Math.PI / 2, 0]} width={60} color="#BD00FF" />
      {/* right wall */}
      <NeonStrip position={[19.9, 3.5, 0]}  rotation={[0, Math.PI / 2, 0]} width={60} color="#00FF88" />
      <NeonStrip position={[19.9, 6,   0]}  rotation={[0, Math.PI / 2, 0]} width={60} color="#BD00FF" />

      {/* ── Contact shadows on the floor ── */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={60}
        blur={2}
        far={20}
        resolution={512}
      />

      {/* ── Fog ── */}
      <fog attach="fog" args={['#0B0F14', 15, 55]} />
    </>
  );
};

export default StoreLighting;
