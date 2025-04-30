import React from 'react';
import * as THREE from 'three'; // Import THREE
import VisionCone from './VisionCone';

// Define the Person component
interface PersonProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  lookAt: [number, number, number];
}

const Person: React.FC<PersonProps> = ({ position, rotation, color, lookAt }) => {
  // Eye offsets in local space
  const leftEyeOffset = [-0.15, 1.1, 0.3];
  const rightEyeOffset = [0.15, 1.1, 0.3];
  
  // Convert eye offsets to world space
  const getWorldEyePosition = (offset: number[]): [number, number, number] => {
    const rotY = rotation[1];
    
    // Apply rotation around Y axis to the offset
    const rotatedX = offset[0] * Math.cos(rotY) + offset[2] * Math.sin(rotY);
    const rotatedY = offset[1];
    const rotatedZ = offset[2] * Math.cos(rotY) - offset[0] * Math.sin(rotY);
    
    // Add the person's position to get world coordinates
    return [
      position[0] + rotatedX,
      position[1] + rotatedY,
      position[2] + rotatedZ
    ];
  };
  
  const leftEyePos = getWorldEyePosition(leftEyeOffset);
  const rightEyePos = getWorldEyePosition(rightEyeOffset);
  
  return (
    <>
      {/* Character model */}
      <group position={position} rotation={rotation}>
        {/* Body */}
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 1, 8, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        
        {/* Eyes - local positions */}
        <mesh position={leftEyeOffset} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="white" />
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </mesh>
        
        <mesh position={rightEyeOffset} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="white" />
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </mesh>
      </group>
      
      {/* Vision cones - positioned directly in world space */}
      <VisionCone 
        startPosition={leftEyePos}
        endPosition={lookAt}
        color={color}
        opacity={0.3}
      />
      <VisionCone 
        startPosition={rightEyePos}
        endPosition={lookAt}
        color={color}
        opacity={0.3}
      />
    </>
  );
};
export default Person;