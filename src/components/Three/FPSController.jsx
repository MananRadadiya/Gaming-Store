/**
 * FPSController.jsx
 * ─────────────────────────────────────────────────────────
 * First-person WASD movement controller with pointer-lock
 * camera rotation. Includes collision boundaries so the
 * player stays inside the showroom, smooth acceleration /
 * deceleration, and a subtle camera bob while walking.
 *
 * FIX LOG:
 *  - Uses e.code (KeyW/KeyA/KeyS/KeyD) instead of e.key
 *    so movement works on ALL keyboard layouts (AZERTY etc.)
 *  - Uses camera.getWorldDirection() for direction calc
 *    instead of reading Euler angles — avoids gimbal-lock
 *    and rotation-order mismatches with PointerLockControls
 *  - Pre-allocates all THREE objects outside the component
 *    to avoid per-frame garbage-collection pressure
 *  - Resets key state on pointer-unlock to prevent stuck keys
 *  - Adds makeDefault to PointerLockControls for drei v10+
 */

import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

/* ── room boundaries (half-extents) ── */
const BOUNDS = { x: 18, z: 28 };
const MOVE_SPEED = 6;          // units / second
const SPRINT_MULT = 1.6;
const DAMPING = 8;              // velocity damping factor
const BOB_FREQ = 10;            // head-bob frequency
const BOB_AMP = 0.04;           // head-bob amplitude
const CAM_HEIGHT = 1.7;         // eye-level height

/* ── pre-allocated math objects (zero GC pressure) ── */
const _forward = new THREE.Vector3();
const _right   = new THREE.Vector3();
const _moveDir = new THREE.Vector3();
const _up      = new THREE.Vector3(0, 1, 0);

const FPSController = ({ onLockChange }) => {
  const { camera } = useThree();
  const controlsRef = useRef(null);

  /* ── key state (mutable ref, never triggers re-render) ── */
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
  const velocity = useRef(new THREE.Vector3());
  const bobPhase = useRef(0);
  const isLocked = useRef(false);

  /* ── keyboard handlers ──
   *  Uses e.code (physical key position) instead of e.key
   *  so movement works regardless of keyboard layout.
   */
  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':       keys.current.w = true; break;
        case 'KeyA':       keys.current.a = true; break;
        case 'KeyS':       keys.current.s = true; break;
        case 'KeyD':       keys.current.d = true; break;
        case 'ShiftLeft':
        case 'ShiftRight': keys.current.shift = true; break;
        default: break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':       keys.current.w = false; break;
        case 'KeyA':       keys.current.a = false; break;
        case 'KeyS':       keys.current.s = false; break;
        case 'KeyD':       keys.current.d = false; break;
        case 'ShiftLeft':
        case 'ShiftRight': keys.current.shift = false; break;
        default: break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  /* ── pointer-lock callbacks ── */
  const handleLock = useCallback(() => {
    isLocked.current = true;
    onLockChange?.(true);
  }, [onLockChange]);

  const handleUnlock = useCallback(() => {
    isLocked.current = false;
    /* Reset ALL keys on unlock — the browser may swallow keyup
       events while pointer-lock transitions, leaving keys stuck */
    keys.current = { w: false, a: false, s: false, d: false, shift: false };
    velocity.current.set(0, 0, 0);
    onLockChange?.(false);
  }, [onLockChange]);

  /* ── per-frame movement loop ── */
  useFrame((_, delta) => {
    if (!isLocked.current) return;

    const { w, a, s, d, shift } = keys.current;
    const speed = MOVE_SPEED * (shift ? SPRINT_MULT : 1);

    /* ── direction from camera.getWorldDirection ──
     *  This is rotation-order agnostic and works perfectly
     *  with PointerLockControls' internal camera management.
     *  Project onto the XZ plane so looking up/down doesn't
     *  affect movement speed.
     */
    camera.getWorldDirection(_forward);
    _forward.y = 0;
    _forward.normalize();

    /* right = forward × world-up */
    _right.crossVectors(_forward, _up).normalize();

    /* build desired movement vector */
    _moveDir.set(0, 0, 0);
    if (w) _moveDir.add(_forward);
    if (s) _moveDir.sub(_forward);
    if (d) _moveDir.add(_right);
    if (a) _moveDir.sub(_right);

    if (_moveDir.lengthSq() > 0) _moveDir.normalize();

    /* smooth acceleration / deceleration */
    const factor = 1 - Math.exp(-DAMPING * delta);
    velocity.current.x += (_moveDir.x * speed - velocity.current.x) * factor;
    velocity.current.z += (_moveDir.z * speed - velocity.current.z) * factor;

    /* update position */
    camera.position.x += velocity.current.x * delta;
    camera.position.z += velocity.current.z * delta;

    /* clamp to room boundaries */
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -BOUNDS.x, BOUNDS.x);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -BOUNDS.z, BOUNDS.z);

    /* head-bob */
    const isMoving = Math.abs(velocity.current.x) > 0.3 || Math.abs(velocity.current.z) > 0.3;
    if (isMoving) {
      bobPhase.current += delta * BOB_FREQ;
      camera.position.y = CAM_HEIGHT + Math.sin(bobPhase.current) * BOB_AMP;
    } else {
      bobPhase.current = 0;
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, CAM_HEIGHT, delta * 5);
    }
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      makeDefault
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  );
};

export default FPSController;
