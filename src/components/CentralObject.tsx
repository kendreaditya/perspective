import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CentralObjectProps {
  position?: [number, number, number];
}

const CentralObject: React.FC<CentralObjectProps> = ({ position = [0, 0, 0] }) => {
  const vaseRef = useRef<THREE.Mesh>(null);
  
  // Gentle floating animation
  useFrame(({ clock }) => {
    if (vaseRef.current) {
      vaseRef.current.position.y = position[1]-1.5 + Math.sin(clock.getElapsedTime()) * 0.1;
      vaseRef.current.rotation.y += 0.003;
    }
  });
  
  return (
    <group position={position}>
      {/* Base of the vase */}
      <mesh castShadow position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.5} roughness={0.2} />
      </mesh>
      
      {/* Main body of the vase - custom shape */}
      <mesh ref={vaseRef} castShadow position={[0, 0.5, 0]}>
        <latheGeometry 
          args={[
            [
              new THREE.Vector2(0, 0),
              new THREE.Vector2(0.15, 0.1),
              new THREE.Vector2(0.3, 0.3),
              new THREE.Vector2(0.35, 0.5),
              new THREE.Vector2(0.3, 0.7),
              new THREE.Vector2(0.35, 0.9),
              new THREE.Vector2(0.25, 1.1),
              new THREE.Vector2(0, 1.2),
            ],
            32
          ]} 
        />
        <meshPhysicalMaterial 
          color="#CBD5E1" 
          metalness={0.1} 
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Light highlight to make the object stand out */}
      <pointLight position={[0, 1, 0]} intensity={0.5} distance={3} color="#FFFFFF" />
    </group>
  );
};

export default CentralObject;