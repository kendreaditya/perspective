import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import CentralObject from './CentralObject';
import VisionCone from './VisionCone';
import Person from './Person';
import * as THREE from 'three';

// Scene setup
const Scene = () => {
  const sceneRef = useRef<THREE.Group>(null);
  // Center position that all characters look at
  const centerPosition: [number, number, number] = [0, 1, 0];
  // Positions for the people around the center
  const personPositions = [
    { position: [3, 0, 0], rotation: [0, -Math.PI / 2, 0], color: '#4ADE80' },  // Right (green)

    { position: [-3, 0, 0], rotation: [0, Math.PI / 2, 0], color: '#FB7185' },  // Left (red)

    { position: [0, 0, 3], rotation: [0, Math.PI, 0], color: '#60A5FA' },      // Back (blue)

    { position: [0, 0, -3], rotation: [0, 0, 0], color: '#F59E0B' },           // Front (orange)

  ];

  // Gentle rotation of the entire scene

  useFrame(({ clock }) => {

    if (sceneRef.current) {

      sceneRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;

    }

  });

  return (

    <group ref={sceneRef}>

      {/* Central object that everyone is looking at */}

      <CentralObject position={centerPosition} />

      {/* Place people around the central object */}

      {personPositions.map((props, index) => (

        <Person 

          key={index} 

          {...props} 

          lookAt={centerPosition}

        />

      ))}

      {/* Ground plane */}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]} receiveShadow>

        <planeGeometry args={[20, 20]} />

        <meshStandardMaterial color="#1E293B" />

      </mesh>

    </group>

  );

};

// Main component

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

      {/* Ambient and directional lighting */}

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