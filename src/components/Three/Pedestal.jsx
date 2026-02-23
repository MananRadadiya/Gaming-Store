/**
 * Pedestal.jsx
 * ─────────────────────────────────────────────────────────
 * A single product pedestal inside the virtual showroom.
 *
 * Features:
 *  - Glowing hexagonal base with emissive ring
 *  - Lazy-loaded GLB model that auto-rotates
 *  - Floating product title (Html from drei)
 *  - Hover → scale up + stronger glow
 *  - Click  → calls onSelect(product) for modal
 *  - Spotlight beam when selected
 */

import { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── pre-allocated constants (avoid per-frame GC) ── */
const GLOW_COLOR = new THREE.Color('#00FF88');
const _tmpColor = new THREE.Color();

/* ── Glowing base ring ── */
const GlowRing = ({ radius = 1.2, color = '#00E0FF', active = false }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.material.emissiveIntensity = active
      ? 2.5 + Math.sin(t * 4) * 0.5
      : 1.0 + Math.sin(t * 2) * 0.3;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[radius - 0.08, radius, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        transparent
        opacity={0.9}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/* ── Rotating 3D model ── */
const ProductModel = ({ url, hovered, selected }) => {
  const { scene } = useGLTF(url);
  const ref = useRef();

  /* Compute bounding-box once → scale to fit pedestal */
  const cloned = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.6 / maxDim; // fit inside ~1.6 units
    s.scale.setScalar(scale);
    // centre the model
    box.setFromObject(s);
    const center = new THREE.Vector3();
    box.getCenter(center);
    s.position.sub(center);
    s.position.y -= box.min.y * 0.5; // sit on pedestal

    /* enable emissive reaction on child meshes */
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
        }
      }
    });
    return s;
  }, [scene]);

  /* rotate + emissive glow on hover / select */
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.5;

    /* emissive glow logic — uses pre-allocated color constants */
    ref.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const targetIntensity = selected ? 0.8 : hovered ? 0.4 : 0;
        child.material.emissiveIntensity = THREE.MathUtils.lerp(
          child.material.emissiveIntensity ?? 0,
          targetIntensity,
          delta * 5,
        );
        if ((hovered || selected) && !child.material.emissive.equals(GLOW_COLOR)) {
          child.material.emissive.copy(GLOW_COLOR);
        }
      }
    });
  });

  return <primitive ref={ref} object={cloned} />;
};

/* ── Hexagonal pedestal geometry (reusable) ── */
const HexColumn = ({ height = 1, radius = 1, color = '#151520' }) => (
  <mesh position={[0, height / 2, 0]} receiveShadow castShadow>
    <cylinderGeometry args={[radius, radius * 1.05, height, 6]} />
    <meshStandardMaterial
      color={color}
      roughness={0.3}
      metalness={0.8}
    />
  </mesh>
);

/* ── Main Pedestal export ── */
const Pedestal = ({
  position = [0, 0, 0],
  modelUrl,
  product,
  accentColor = '#00E0FF',
  onSelect,
  isSelected = false,
}) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  /* cursor style */
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  /* smooth scale on hover */
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = hovered ? 1.08 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      delta * 6,
    );
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelect?.(product); }}
    >
      {/* Hexagonal base */}
      <HexColumn height={1} radius={1} />

      {/* Glowing ring around the top */}
      <GlowRing radius={1.15} color={accentColor} active={hovered || isSelected} />

      {/* 3D Product model floating above the pedestal */}
      <group position={[0, 1.8, 0]}>
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
            <ProductModel url={modelUrl} hovered={hovered} selected={isSelected} />
          </Float>
        </Suspense>
      </group>

      {/* Floating product title */}
      <Html
        center
        distanceFactor={12}
        position={[0, 3.6, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div className="text-center whitespace-nowrap">
          <p
            className="text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-md"
            style={{
              color: accentColor,
              textShadow: `0 0 12px ${accentColor}`,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {product?.name ?? 'Product'}
          </p>
        </div>
      </Html>

      {/* Spotlight beam when selected */}
      {isSelected && (
        <spotLight
          position={[0, 8, 0]}
          target-position={[0, 0, 0]}
          angle={0.3}
          penumbra={0.6}
          intensity={60}
          color="#00FF88"
          distance={15}
        />
      )}
    </group>
  );
};

export default Pedestal;
