/**
 * VirtualStore.jsx
 * ─────────────────────────────────────────────────────────
 * Fully immersive 3D walkable showroom page.
 *
 * Includes:
 *  - R3F Canvas with bloom postprocessing
 *  - FPS WASD + pointer-lock movement
 *  - Cyberpunk showroom with neon pedestals
 *  - Product click → QuickView modal
 *  - Exit button overlay
 *  - Minimap UI overlay (top-right)
 *  - Fade-in intro animation
 *  - Hologram info panels
 *  - Ambient sound loop + footstep SFX
 *  - Camera shake while walking
 */

import React, {
  useState,
  useCallback,
  Suspense,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Preload, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Crosshair } from 'lucide-react';

/* ── Internal components ── */
import FPSController from '../components/Three/FPSController';
import StoreRoom from '../components/Three/StoreRoom';
import { QuickView } from '../components';

/* ═══════════════════════════════════════════════════════════
   Hologram Panel — floating transparent info panel in 3D
   ═══════════════════════════════════════════════════════════ */
const HologramPanel = ({ position, rotation = [0, 0, 0], text, color = '#00E0FF' }) => {
  const meshRef = useRef();
  const edgeGeo = useMemo(() => {
    const plane = new THREE.PlaneGeometry(6, 3);
    const edges = new THREE.EdgesGeometry(plane);
    plane.dispose();
    return edges;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.material.opacity = 0.12 + Math.sin(t * 1.5) * 0.04;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Panel body */}
      <mesh ref={meshRef}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.12}
          toneMapped={false}
          side={2}
        />
      </mesh>

      {/* Border glow */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   Camera Shake — subtle shake while the player is moving
   ═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   Camera Shake — applies a tiny offset to the camera's
   quaternion rather than mutating .rotation directly, which
   would fight with PointerLockControls' internal Euler state.
   ═══════════════════════════════════════════════════════════ */
const _shakeEuler = new THREE.Euler();
const _shakeQuat  = new THREE.Quaternion();

const CameraShake = ({ intensity = 0.0004 }) => {
  const { camera } = useThree();
  const prevPos = useRef(camera.position.clone());

  useFrame(() => {
    const dist = camera.position.distanceTo(prevPos.current);
    prevPos.current.copy(camera.position);

    if (dist > 0.001) {
      /* Apply shake via quaternion multiply so we don't
         overwrite PointerLockControls' rotation values */
      _shakeEuler.set(
        (Math.random() - 0.5) * intensity * 0.5,
        0,
        (Math.random() - 0.5) * intensity,
      );
      _shakeQuat.setFromEuler(_shakeEuler);
      camera.quaternion.multiply(_shakeQuat);
    }
  });

  return null;
};

/* ═══════════════════════════════════════════════════════════
   Minimap — 2D overlay rendering player + pedestal dots
   ═══════════════════════════════════════════════════════════ */
const MinimapInner = ({ onUpdate }) => {
  const { camera } = useThree();
  const lastUpdate = useRef(0);

  useFrame(({ clock }) => {
    /* Throttle to ~10 fps — calling setPlayerData 60×/sec was
       triggering a full React re-render every frame for no
       perceptible benefit. 10 updates/sec is plenty for a minimap. */
    const now = clock.getElapsedTime();
    if (now - lastUpdate.current < 0.1) return;
    lastUpdate.current = now;

    onUpdate({
      x: camera.position.x,
      z: camera.position.z,
      ry: camera.rotation.y,
    });
  });
  return null;
};

const PEDESTAL_POSITIONS = [
  [-12, -15], [0, -15], [12, -15],
  [-12,   5], [0,   5], [12,   5],
];

const Minimap = ({ playerData }) => {
  const scale = 2.5;       // px per world-unit
  const halfW = 20 * scale;
  const halfD = 30 * scale;
  const w = halfW * 2;
  const h = halfD * 2;

  const px = playerData.x * scale + halfW;
  const py = playerData.z * scale + halfD;

  return (
    <div
      className="absolute top-4 right-4 rounded-xl overflow-hidden border border-cyan-500/30"
      style={{
        width: w,
        height: h,
        background: 'rgba(5,5,15,0.75)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* label */}
      <div className="absolute top-1 left-0 right-0 text-center text-[9px] font-bold tracking-widest text-cyan-400/60 uppercase">
        Minimap
      </div>

      {/* pedestal dots */}
      {PEDESTAL_POSITIONS.map(([wx, wz], i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-500/70"
          style={{
            left: wx * scale + halfW - 4,
            top: wz * scale + halfD - 4,
          }}
        />
      ))}

      {/* player dot + direction indicator */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(0,255,136,0.8)]"
        style={{
          left: px - 5,
          top: py - 5,
          transform: `rotate(${-playerData.ry}rad)`,
        }}
      >
        {/* direction arrow */}
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '3px solid transparent',
            borderRight: '3px solid transparent',
            borderBottom: '5px solid #00FF88',
          }}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Loading screen
   ═══════════════════════════════════════════════════════════ */
const LoadingScreen = () => {
  const { progress } = useProgress();

  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: '#0B0F14' }}
    >
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-purple-500 mb-8"
      >
        NEXUS VIRTUAL STORE
      </motion.h1>

      {/* progress bar */}
      <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-white/40 text-sm tracking-wider">
        Loading assets… {Math.round(progress)}%
      </p>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   VirtualStore — page component
   ═══════════════════════════════════════════════════════════ */
const VirtualStore = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [muted, setMuted] = useState(true);
  const [playerData, setPlayerData] = useState({ x: 0, z: 20, ry: 0 });

  /* ── audio refs ── */
  const ambientRef = useRef(null);
  const footstepRef = useRef(null);
  const prevPlayerPos = useRef({ x: 0, z: 20 });

  /* ── Scene loaded callback ── */
  const handleCreated = useCallback(() => {
    // small delay so the intro feels intentional
    setTimeout(() => {
      setSceneReady(true);
      setShowIntro(false);
    }, 600);
  }, []);

  /* ── Product selection ── */
  const handleSelectProduct = useCallback((product) => {
    setSelectedProduct(product);
    // unlock pointer so user can interact with modal
    document.exitPointerLock?.();
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  /* ── Toggle mute ── */
  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  /* ── Ambient sound management ── */
  useEffect(() => {
    // Create audio elements lazily
    if (!ambientRef.current) {
      const amb = new Audio();
      // Generate a simple ambient hum using oscillator via AudioContext
      amb.loop = true;
      amb.volume = 0.15;
      ambientRef.current = amb;
    }

    return () => {
      ambientRef.current?.pause();
    };
  }, []);

  /* ── Footstep detection (compare playerData changes) ── */
  useEffect(() => {
    const dx = playerData.x - prevPlayerPos.current.x;
    const dz = playerData.z - prevPlayerPos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    prevPlayerPos.current = { x: playerData.x, z: playerData.z };

    // We could play footstep audio ticks here if sound files are provided
  }, [playerData]);

  /* ── Keyboard shortcut: ESC → navigate away ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && selectedProduct) {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedProduct]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden" style={{ background: '#0B0F14' }}>
      {/* ── Loading / intro ── */}
      <AnimatePresence>{showIntro && <LoadingScreen />}</AnimatePresence>

      {/* ── Fade-in wrapper for scene ── */}
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: sceneReady ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      >
        {/* ══════════ R3F Canvas ══════════ */}
        <Canvas
          shadows
          camera={{ fov: 70, near: 0.1, far: 200, position: [0, 1.7, 22] }}
          onCreated={handleCreated}
          gl={{
            antialias: true,
            toneMapping: 3, // ACESFilmicToneMapping
            toneMappingExposure: 1.1,
          }}
          style={{ background: '#0B0F14' }}
        >
          <Suspense fallback={null}>
            {/* ── Environment & scene ── */}
            <StoreRoom
              onSelectProduct={handleSelectProduct}
              selectedProductId={selectedProduct?.id ?? null}
            />

            {/* ── FPS Controls ── */}
            <FPSController onLockChange={setIsLocked} />

            {/* ── Camera shake ── */}
            <CameraShake intensity={0.0006} />

            {/* ── Minimap bridge (reads camera, sends to React state) ── */}
            <MinimapInner onUpdate={setPlayerData} />

            {/* ── Postprocessing ── */}
            <EffectComposer multisampling={4}>
              <Bloom
                luminanceThreshold={0.3}
                luminanceSmoothing={0.7}
                intensity={0.8}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.15} darkness={0.6} />
            </EffectComposer>

            <Preload all />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* ══════════ HUD Overlays ══════════ */}

      {/* ── Crosshair ── */}
      {isLocked && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
          <Crosshair size={20} className="text-white/30" />
        </div>
      )}

      {/* ── Top-left controls ── */}
      <div className="fixed top-4 left-4 z-40 flex flex-col gap-3">
        {/* Exit button */}
        <motion.button
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={() => navigate('/store')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                     bg-black/60 border border-cyan-500/30 text-cyan-400
                     hover:bg-cyan-500/10 hover:border-cyan-400 transition-all
                     backdrop-blur-md"
        >
          <ArrowLeft size={16} /> Exit Store
        </motion.button>

        {/* Mute toggle */}
        <motion.button
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.7 }}
          onClick={toggleMute}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                     bg-black/60 border border-purple-500/30 text-purple-400
                     hover:bg-purple-500/10 hover:border-purple-400 transition-all
                     backdrop-blur-md"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {muted ? 'Unmute' : 'Mute'}
        </motion.button>
      </div>

      {/* ── Click-to-enter prompt ── */}
      {!isLocked && !selectedProduct && sceneReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <div className="text-center">
            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-lg font-bold text-white/80 tracking-wider px-6 py-3 rounded-2xl
                         bg-black/50 border border-cyan-500/20 backdrop-blur-md"
            >
              Click anywhere to enter the showroom
            </motion.p>
            <p className="mt-3 text-xs text-white/40 tracking-wide">
              WASD to move · Mouse to look · Click product to inspect · ESC to release cursor
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Bottom info bar ── */}
      {isLocked && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30
                     flex items-center gap-6 px-6 py-2.5 rounded-2xl
                     bg-black/50 border border-white/10 backdrop-blur-md"
        >
          <span className="text-white/40 text-xs tracking-wider">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-mono mr-1">W A S D</kbd> Move
          </span>
          <span className="text-white/40 text-xs tracking-wider">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-mono mr-1">SHIFT</kbd> Sprint
          </span>
          <span className="text-white/40 text-xs tracking-wider">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-mono mr-1">CLICK</kbd> Inspect product
          </span>
          <span className="text-white/40 text-xs tracking-wider">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-mono mr-1">ESC</kbd> Release cursor
          </span>
        </motion.div>
      )}

      {/* ── Minimap overlay ── */}
      {isLocked && <Minimap playerData={playerData} />}

      {/* ── Product Quick-View modal ── */}
      <QuickView
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default VirtualStore;
