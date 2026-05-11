import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface VisionConeProps {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  color: string;
  opacity?: number;
  maxRadius?: number;
}

const VisionCone: React.FC<VisionConeProps> = ({
  startPosition,
  endPosition,
  color,
  opacity = 0.5,
  maxRadius = 1.2,
}) => {
  const coneGeometry = useMemo(() => {
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);

    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    if (length < 0.001) return new THREE.BufferGeometry();
    direction.normalize();

    // Cone half-angle ~17° (tan ≈ 0.3), capped so long cones don't fill the screen.
    const radius = Math.min(length * 0.3, maxRadius);
    const geometry = new THREE.ConeGeometry(radius, length, 32, 1, true);

    // Default cone has tip at +Y/2, base at -Y/2. Translate so tip sits at the origin
    // (which we'll later place at the eye). After this, tip→base axis is local -Y.
    geometry.translate(0, -length / 2, 0);

    // Align the tip→base axis with the eye→target direction.
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, -1, 0),
      direction
    );
    geometry.applyQuaternion(quaternion);

    geometry.translate(start.x, start.y, start.z);

    return geometry;
  }, [startPosition, endPosition, maxRadius]);

  useEffect(() => () => coneGeometry.dispose(), [coneGeometry]);

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
