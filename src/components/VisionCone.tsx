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
    // Create vectors for start (eye) and end (target) positions
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);
    
    // Direction vector points FROM eye (start) TO target (end)
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    // Avoid creating zero-length cones if start and end are the same
    if (length < 0.001) return new THREE.BufferGeometry(); 
    direction.normalize();
    
    // Create cone geometry with appropriate dimensions
    // The cone points along +Y by default (tip at +Y/2, base at -Y/2)
    const radius = length * 0.3; // Adjust radius based on length
    const geometry = new THREE.ConeGeometry(
      radius,        // radius at base
      length,        // height
      32,            // radial segments
      1,             // height segments
      true           // open ended
    );
    // By default, the cone tip is at (0, length/2, 0) and base center at (0, -length/2, 0)
    // We want the tip to be at the start position.
    // First, translate the geometry so the tip is at the origin.
    geometry.translate(0, -length / 2, 0);

    // Rotate the cone so it points along the direction vector instead of +Y
    const quaternion = new THREE.Quaternion();
    // Map +Y (cone's default axis) to our direction
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),  // Cone's default direction (+Y)
      direction                    // Target direction
    );
    geometry.applyQuaternion(quaternion);
    
    // Position the cone so its tip (which is now at the origin locally) is at the eye position
    geometry.translate(start.x, start.y, start.z);
    
    return geometry;
  }, [startPosition, endPosition]);

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