import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import CentralObject from './CentralObject';
import Person from './Person';
import * as THREE from 'three';

// Define simple colors
const simpleColors = ["#4ADE80", "#FB7185", "#60A5FA", "#F59E0B"]; // Red, Blue, Green, Orange

// Scene setup
const Scene = () => {
  const sceneRef = useRef<THREE.Group>(null);
  // Center position - used for the object and one person's target
  const centerPosition = useMemo<[number, number, number]>(() => [0, 1, 0], []);

  // Generate random positions, rotations, and look-at targets for people
  const peopleData = useMemo(() => {
    const people = [];
    const numPeople = 4; // Number of people
    const radius = 3; // Distance from center for placement
    const lookAtRadius = 2; // Max distance from origin for random look-at target

    for (let i = 0; i < numPeople; i++) {
      // Placement position
      const angle = Math.random() * Math.PI * 2; // Random angle for placement
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const position: [number, number, number] = [x, 0, z];
      
      // Random look-at target for the vision cone (initially)
      const targetAngle = Math.random() * Math.PI * 2;
      const targetRadius = Math.random() * lookAtRadius;
      const targetX = Math.sin(targetAngle) * targetRadius;
      const targetZ = Math.cos(targetAngle) * targetRadius;
      let lookAtTarget: [number, number, number] = [targetX, centerPosition[1], targetZ]; 
      
      // Assign color from the simple list
      const color = simpleColors[i % simpleColors.length];

      people.push({ position, lookAtTarget, color });
    }

    // Randomly select one person to look at the center
    if (people.length > 0) {
      const lookAtCenterIndex = Math.floor(Math.random() * people.length);
      people[lookAtCenterIndex].lookAtTarget = centerPosition;
    }

    // Compute rotation based on lookAtTarget
    return people.map(p => {
      const [px, , pz] = p.position;
      const [tx, , tz] = p.lookAtTarget;
      const rotY = Math.atan2(tx - px, tz - pz);
      return { ...p, rotation: [0, rotY, 0] as [number, number, number] };
    });
  }, [centerPosition]); // Dependency remains


  // Gentle rotation of the entire scene
  useFrame(({ clock }) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* Central object */}
      <CentralObject position={centerPosition} />

      {/* Place people around */}
      {peopleData.map((props, index) => (
        <Person 
          key={index} 
          position={props.position}
          rotation={props.rotation}
          color={props.color}
          lookAt={props.lookAtTarget} // Use the random target for vision cone
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