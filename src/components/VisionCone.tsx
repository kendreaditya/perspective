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
  opacity = 0.3,
  maxRadius = 1.2,
}) => {
  const { coneGeometry, ringGeometry } = useMemo(() => {
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);

    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    if (length < 0.001) {
      return {
        coneGeometry: new THREE.BufferGeometry(),
        ringGeometry: new THREE.BufferGeometry(),
      };
    }
    direction.normalize();

    const radius = Math.min(length * 0.3, maxRadius);

    const coneGeom = new THREE.ConeGeometry(radius, length, 32, 1, true);
    // Default cone: tip at +Y/2, base at -Y/2. Translate so tip sits at the origin
    // (later placed at the eye). Tip→base axis is now local -Y.
    coneGeom.translate(0, -length / 2, 0);

    const coneQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, -1, 0),
      direction
    );
    coneGeom.applyQuaternion(coneQuat);
    coneGeom.translate(start.x, start.y, start.z);

    // Bright opaque ring sitting at the cone's wide end — i.e. at the gaze
    // target. This disambiguates the cone's direction even when viewed
    // straight down its axis (otherwise it foreshortens into a blob).
    const ringGeom = new THREE.RingGeometry(radius * 0.85, radius, 32);
    // RingGeometry's plane normal is +Z by default; rotate so it faces along the gaze.
    const ringQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );
    ringGeom.applyQuaternion(ringQuat);
    ringGeom.translate(end.x, end.y, end.z);

    return { coneGeometry: coneGeom, ringGeometry: ringGeom };
  }, [startPosition, endPosition, maxRadius]);

  useEffect(
    () => () => {
      coneGeometry.dispose();
      ringGeometry.dispose();
    },
    [coneGeometry, ringGeometry]
  );

  return (
    <>
      <mesh geometry={coneGeometry}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={ringGeometry} renderOrder={1}>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

export default VisionCone;
