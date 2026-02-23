/**
 * StoreRoom.jsx
 * ─────────────────────────────────────────────────────────
 * The 3D showroom geometry: floor, walls, ceiling, neon
 * grid, and all pedestals arranged in two rows.
 *
 * Room dimensions  : 40 × 60 × 10  (W × D × H)
 * Pedestal layout  : 2 rows × 3 columns in main zone
 *                    (6 pedestals total, one per model)
 */

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
/* NOTE: useFrame removed — was imported but never called in this file */
import Pedestal from './Pedestal';
import StoreLighting from './StoreLighting';

/* ── Room constants ── */
const ROOM_W  = 40;   // width  (X)
const ROOM_D  = 60;   // depth  (Z)
const ROOM_H  = 10;   // height (Y)
const WALL_T  = 0.2;  // wall thickness

/* ── Product / pedestal data ── */
const SHOWROOM_PRODUCTS = [
  {
    id: 'virt-keyboard',
    name: 'Mechanical Keyboard',
    modelUrl: '/models/keyboard.glb',
    accent: '#00E0FF',
    price: 14999,
    originalPrice: 19999,
    rating: 4.8,
    reviews: 342,
    stock: 24,
    description: 'Ultra-responsive mechanical switches with per-key RGB and aircraft-grade aluminium frame.',
    features: ['Hot-swappable switches', 'Per-key RGB', 'USB-C braided cable', 'PBT keycaps'],
    image: '/images/keyboards/corsair-k100-rgb-2.avif',
    category: 'keyboards',
  },
  {
    id: 'virt-mouse',
    name: 'Pro Gaming Mouse',
    modelUrl: '/models/mouse.glb',
    accent: '#00FF88',
    price: 7999,
    originalPrice: 11999,
    rating: 4.7,
    reviews: 512,
    stock: 40,
    description: 'Lightweight 58 g shell with a 30K DPI sensor and PTFE glides for friction-free aim.',
    features: ['30K DPI sensor', '58 g ultralight', 'Optical switches', 'PTFE feet'],
    image: '/images/mice/mouse1.png',
    category: 'mice',
  },
  {
    id: 'virt-gpu',
    name: 'RTX Graphics Card',
    modelUrl: '/models/gpu.glb',
    accent: '#BD00FF',
    price: 89999,
    originalPrice: 109999,
    rating: 4.9,
    reviews: 198,
    stock: 8,
    description: 'Ray-tracing powerhouse with 16 GB GDDR6X and a triple-fan cooling solution.',
    features: ['16 GB GDDR6X', 'Ray-tracing cores', 'Triple-fan cooler', 'HDMI 2.1 + DP 1.4a'],
    image: '/images/graphics-cards/graphic-card-1.png',
    category: 'graphics-cards',
  },
  {
    id: 'virt-chair',
    name: 'Ergonomic Gaming Chair',
    modelUrl: '/models/chair.glb',
    accent: '#00E0FF',
    price: 34999,
    originalPrice: 44999,
    rating: 4.6,
    reviews: 274,
    stock: 15,
    description: '4D armrests, cold-foam seat, and adaptive lumbar support for marathon sessions.',
    features: ['4D armrests', 'Cold-cure foam', 'Magnetic headrest', '165° recline'],
    image: '/images/gaming-chairs/chair1.png',
    category: 'gaming-chairs',
  },
  {
    id: 'virt-monitor',
    name: 'QHD 240 Hz Monitor',
    modelUrl: '/models/monitor.glb',
    accent: '#00FF88',
    price: 52999,
    originalPrice: 64999,
    rating: 4.8,
    reviews: 406,
    stock: 12,
    description: '27″ QHD IPS panel running at 240 Hz with 1 ms response time and HDR 600.',
    features: ['2560 × 1440', '240 Hz IPS', '1 ms GTG', 'HDR 600'],
    image: '/images/monitors/monitor1.jpg',
    category: 'monitors',
  },
  {
    id: 'virt-headset',
    name: 'Surround Sound Headset',
    modelUrl: '/models/headset.glb',
    accent: '#BD00FF',
    price: 12999,
    originalPrice: 17999,
    rating: 4.5,
    reviews: 621,
    stock: 32,
    description: '7.1 virtual surround with 50 mm bio-cellulose drivers and noise-cancelling mic.',
    features: ['7.1 surround', '50 mm drivers', 'ANC microphone', '30 h battery'],
    image: '/images/headsets/headset1.jpg',
    category: 'headsets',
  },
];

/* ── pedestal positions (2 rows × 3 cols) ── */
const PEDESTAL_POSITIONS = [
  [-12, 0, -15],
  [0,   0, -15],
  [12,  0, -15],
  [-12, 0,   5],
  [0,   0,   5],
  [12,  0,   5],
];

/* ── Neon floor grid ── */
const NeonGrid = () => {
  const lines = useMemo(() => {
    const positions = [];
    const spacing = 4;
    const halfW = ROOM_W / 2;
    const halfD = ROOM_D / 2;

    for (let x = -halfW; x <= halfW; x += spacing) {
      positions.push(x, 0.01, -halfD, x, 0.01, halfD);
    }
    for (let z = -halfD; z <= halfD; z += spacing) {
      positions.push(-halfW, 0.01, z, halfW, 0.01, z);
    }

    return new Float32Array(positions);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={lines}
          count={lines.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#00E0FF" transparent opacity={0.12} />
    </lineSegments>
  );
};

/* ── Wall panel ── */
const Wall = ({ position, size, color = '#0B0F14' }) => (
  <mesh position={position} receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial
      color={color}
      roughness={0.85}
      metalness={0.2}
    />
  </mesh>
);

/* ── Main export ── */
const StoreRoom = ({ onSelectProduct, selectedProductId }) => {
  return (
    <group>
      {/* ── Lighting rig ── */}
      <StoreLighting />

      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial
          color="#080810"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* ── Neon grid overlay ── */}
      <NeonGrid />

      {/* ── Ceiling ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#060609" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ── Walls ── */}
      {/* back */}
      <Wall position={[0, ROOM_H / 2, -ROOM_D / 2]} size={[ROOM_W, ROOM_H, WALL_T]} />
      {/* front */}
      <Wall position={[0, ROOM_H / 2,  ROOM_D / 2]} size={[ROOM_W, ROOM_H, WALL_T]} />
      {/* left */}
      <Wall position={[-ROOM_W / 2, ROOM_H / 2, 0]} size={[WALL_T, ROOM_H, ROOM_D]} />
      {/* right */}
      <Wall position={[ ROOM_W / 2, ROOM_H / 2, 0]} size={[WALL_T, ROOM_H, ROOM_D]} />

      {/* ── Pedestals ── */}
      {SHOWROOM_PRODUCTS.map((product, i) => (
        <Pedestal
          key={product.id}
          position={PEDESTAL_POSITIONS[i]}
          modelUrl={product.modelUrl}
          product={product}
          accentColor={product.accent}
          onSelect={onSelectProduct}
          isSelected={selectedProductId === product.id}
        />
      ))}
    </group>
  );
};

/* Preload all models so Suspense resolves faster */
SHOWROOM_PRODUCTS.forEach((p) => useGLTF.preload(p.modelUrl));

export default StoreRoom;
export { SHOWROOM_PRODUCTS };
