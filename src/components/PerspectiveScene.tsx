import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import CentralObject from './CentralObject';
import Person from './Person';
import * as THREE from 'three';

// Four perspectives on the same reality.
//   objectGazer    — looks at the centerpiece. The empiricist: the thing IS the thing.
//   skyGazer       — looks past the world. The transcendentalist: meaning is beyond the object.
//   gazerObserver  — looks at the object-gazer. The sociologist: studies how others construct reality.
//   viewerGazer    — looks at the camera (you). The recursive twist: your "neutral" view is a perspective too.

type Role = 'objectGazer' | 'skyGazer' | 'gazerObserver' | 'viewerGazer';

interface PersonSpec {
  role: Role;
  position: [number, number, number];
  color: string;
  lookAt: [number, number, number];
}

const Scene = () => {
  const sceneRef = useRef<THREE.Group>(null);
  const centerPosition = useMemo<[number, number, number]>(() => [0, 1, 0], []);

  const objectGazerPos: [number, number, number] = [3, 0, 0.5];
  const skyGazerPos: [number, number, number] = [-3, 0, 0.5];
  const gazerObserverPos: [number, number, number] = [-2.2, 0, 2.6];
  const viewerGazerPos: [number, number, number] = [1.5, 0, -3];

  const staticPeople = useMemo<PersonSpec[]>(() => [
    {
      role: 'objectGazer',
      position: objectGazerPos,
      color: '#4ADE80', // green
      lookAt: centerPosition,
    },
    {
      role: 'skyGazer',
      position: skyGazerPos,
      // Up into space, slightly toward "above the centerpiece" to suggest the gaze
      // passes beyond the world rather than randomly skyward.
      lookAt: [skyGazerPos[0] * 0.3, 10, skyGazerPos[2] * 0.3],
      color: '#60A5FA', // blue
    },
    {
      role: 'gazerObserver',
      position: gazerObserverPos,
      // Look at the object-gazer's head, not at the centerpiece.
      lookAt: [objectGazerPos[0], 1.1, objectGazerPos[2]],
      color: '#F59E0B', // orange
    },
  ], [centerPosition]);

  // The viewer-gazer's target tracks the camera in scene-local space.
  // Initialised to the camera's default starting position so the first frame
  // already has them facing the viewer.
  const [viewerLookAt, setViewerLookAt] = useState<[number, number, number]>([0, 5, 10]);

  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const eyeApprox = useMemo(
    () => new THREE.Vector3(viewerGazerPos[0], 1.1, viewerGazerPos[2]),
    []
  );

  useFrame(({ camera, clock }) => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Gentle scene sway — a slow oscillation reminding the viewer the frame itself moves.
    scene.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;

    // Camera position in scene-local coordinates.
    tmpVec.copy(camera.position);
    scene.worldToLocal(tmpVec);

    // Clip the cone length so it ends in front of the viewer rather than at/through them.
    const dir = tmpVec.clone().sub(eyeApprox);
    const distance = dir.length();
    if (distance < 0.001) return;
    dir.normalize();
    const targetLen = Math.min(distance * 0.6, 6.5);
    const target = eyeApprox.clone().addScaledVector(dir, targetLen);

    setViewerLookAt((prev) => {
      if (
        Math.abs(prev[0] - target.x) < 0.001 &&
        Math.abs(prev[1] - target.y) < 0.001 &&
        Math.abs(prev[2] - target.z) < 0.001
      ) {
        return prev;
      }
      return [target.x, target.y, target.z];
    });
  });

  const viewerRotation = useMemo<[number, number, number]>(() => {
    const [px, , pz] = viewerGazerPos;
    const [tx, , tz] = viewerLookAt;
    return [0, Math.atan2(tx - px, tz - pz), 0];
  }, [viewerLookAt]);

  return (
    <group ref={sceneRef}>
      <CentralObject position={centerPosition} />

      {staticPeople.map((p) => {
        const [px, , pz] = p.position;
        const [tx, , tz] = p.lookAt;
        const rotation: [number, number, number] = [0, Math.atan2(tx - px, tz - pz), 0];
        return (
          <Person
            key={p.role}
            position={p.position}
            rotation={rotation}
            color={p.color}
            lookAt={p.lookAt}
          />
        );
      })}

      <Person
        position={viewerGazerPos}
        rotation={viewerRotation}
        color="#FB7185"
        lookAt={viewerLookAt}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
    </group>
  );
};

const PerspectiveScene: React.FC = () => {
  return (
    <Canvas shadows className="w-full h-full">
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      <OrbitControls
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.6}
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
      />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Scene />
    </Canvas>
  );
};

export default PerspectiveScene;
