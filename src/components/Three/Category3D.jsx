// src/components/Three/Category3D.jsx

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const normalizeModelUrl = (url) => {
  if (!url) return url;
  if (typeof url !== "string") return url;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
  return `/${url}`;
};

const NormalizedModel = ({ url }) => {
  const normalizedUrl = useMemo(() => normalizeModelUrl(url), [url]);
  const { scene } = useGLTF(normalizedUrl);
  const groupRef = useRef();

  const model = useMemo(() => {
    if (!scene) return null;

    const clone = scene.clone(true);

    // ✅ Clean Light Grey Material (Single Color)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#d1d5db"), // Light grey
          roughness: 0.4,
          metalness: 0.2,
        });

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // ✅ Proper Centering + Margin Control
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    // Slightly smaller scale for inner margin
    const maxAxis = Math.max(size.x, size.y, size.z);
    if (Number.isFinite(maxAxis) && maxAxis > 0) {
      const scale = 2.0 / maxAxis; // Smaller than before = margin inside box
      clone.scale.setScalar(scale);

      // Perfect centering
      clone.position.x = -center.x * scale;
      clone.position.y = -center.y * scale;
      clone.position.z = -center.z * scale;
    }

    return clone;
  }, [scene]);

  // ✅ Smooth rotation only (no vertical floating)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  if (!model) return null;

  return <primitive ref={groupRef} object={model} />;
};

const Category3D = ({ modelUrl }) => {
  const normalizedUrl = useMemo(() => normalizeModelUrl(modelUrl), [modelUrl]);

  return (
    <div className="h-[220px] w-full">
      <Canvas
        shadows
        camera={{ position: [0, 0, 6], fov: 25 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        {/* Balanced neutral lighting */}

        <ambientLight intensity={0.4} />

        <directionalLight
          position={[5, 6, 5]}
          intensity={1.2}
          castShadow
        />

        <Environment preset="studio" />

        <Suspense fallback={null}>
          <NormalizedModel url={normalizedUrl} />

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={8}
            blur={2.5}
            far={4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Category3D;
