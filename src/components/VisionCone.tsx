import React, { useMemo } from 'react';
import * as THREE from 'three';

interface VisionConeProps {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  color: string;
  opacity?: number;
}

const VisionCone: React.FC<VisionConeProps> = ({ 
  startPosition, 
  endPosition, 
  color, 
  opacity = 0.5 
}) => {
  // Create the cone geometry based on start and end positions
  const coneGeometry = useMemo(() => {
    // Create a vector from start to end position
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);
    
    // Direction vector points FROM eye TO center
    const direction = new THREE.Vector3().subVectors(start, end);
    const length = direction.length();
    direction.normalize();
    
    // Create cone geometry with appropriate dimensions
    // The cone points along +Y by default, so we need to rotate it
    const geometry = new THREE.ConeGeometry(
      length * 0.4,  // radius at base
      length,        // height
      32,            // radial segments
      1,             // height segments
      true           // open ended
    );
    
    // Rotate the cone so it points along the direction vector instead of +Y
    // First, create a rotation matrix that aligns +Y with our direction
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),  // Cone's default direction (+Y)
      direction                    // Target direction
    );
    
    // Apply the rotation to our geometry
    geometry.applyQuaternion(quaternion);
    
    // Position the cone so its tip is at the eye position
    // We need to offset by half the cone height in the direction vector
    geometry.translate(
      endPosition[0] + direction.x * length / 2,
      endPosition[1] + direction.y * length / 2,
      endPosition[2] + direction.z * length / 2
    );
    
    return geometry;
  }, [endPosition, startPosition]);

  return (
    <mesh geometry={coneGeometry}>
      <meshStandardMaterial 
        color={color} 
        transparent={true} 
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default VisionCone;