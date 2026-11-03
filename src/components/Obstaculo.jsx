import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Obstaculo({
  id,
  type = 'blade',
  initialPos = [0, 1, 0],
  axis = 'x',
  range = 2,
  speed = 2,
  offset = 0,
  radius = 1.3,
  onPositionUpdate,
}) {
  const groupRef = useRef();
  const rotorRef = useRef();
  const flameRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime() * speed + offset;
    const oscillation = Math.sin(time) * range;

    let curX = initialPos[0];
    let curY = initialPos[1];
    let curZ = initialPos[2];

    if (axis === 'circle') {
      curX = initialPos[0] + Math.cos(time) * range;
      curZ = initialPos[2] + Math.sin(time) * range;
      curY = initialPos[1] + Math.sin(time * 2) * 0.18;
    } else if (axis === 'x') {
      curX = initialPos[0] + oscillation;
    } else if (axis === 'y') {
      curY = initialPos[1] + Math.abs(Math.sin(time)) * range;
    } else if (axis === 'z') {
      curZ = initialPos[2] + oscillation;
    }

    groupRef.current.position.set(curX, curY, curZ);

    if (rotorRef.current) {
      if (type === 'pendulum') {
        rotorRef.current.rotation.z = Math.sin(time) * 1.1;
      } else {
        rotorRef.current.rotation.y += 0.08;
        rotorRef.current.rotation.z += 0.04;
      }
    }

    if (flameRef.current) {
      const scale = 1 + Math.sin(time * 3) * 0.12;
      flameRef.current.scale.set(scale, scale, scale);
      flameRef.current.rotation.y += 0.03;
    }

    if (onPositionUpdate) {
      onPositionUpdate(id, [curX, curY, curZ], radius);
    }
  });

  return (
    <group ref={groupRef} position={initialPos}>
      <pointLight
        color={type === 'skullPatrol' ? '#ff0055' : '#9900ff'}
        intensity={2.6}
        distance={6}
        decay={2}
      />

      {type === 'scytheTrap' && (
        <group ref={rotorRef}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 3.8, 16]} />
            <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#cbd5e0" metalness={0.95} roughness={0.15} />
          </mesh>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx * Math.PI) / 2;
            return (
              <group key={idx} rotation={[0, 0, angle]}>
                <mesh position={[0.7, 0, 0]} castShadow>
                  <boxGeometry args={[1.4, 0.08, 0.04]} />
                  <meshStandardMaterial
                    color="#2d3748"
                    metalness={0.85}
                    roughness={0.25}
                  />
                </mesh>
                <mesh position={[1.35, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
                  <boxGeometry args={[0.65, 0.12, 0.03]} />
                  <meshStandardMaterial
                    color="#ff1a40"
                    emissive="#ff1a40"
                    emissiveIntensity={2.5}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {type === 'skullPatrol' && (
        <group ref={flameRef}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color="#ded6c8" roughness={0.4} metalness={0.2} />
          </mesh>

          <mesh position={[0, 0.12, 0.3]} castShadow>
            <boxGeometry args={[0.62, 0.12, 0.25]} />
            <meshStandardMaterial color="#cdc5b6" roughness={0.45} />
          </mesh>

          <mesh position={[0, -0.18, 0.26]} castShadow>
            <boxGeometry args={[0.38, 0.22, 0.28]} />
            <meshStandardMaterial color="#c0b8a8" roughness={0.5} />
          </mesh>

          <mesh position={[0, -0.3, 0.28]}>
            <boxGeometry args={[0.3, 0.08, 0.08]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>

          <mesh position={[-0.17, 0.08, 0.44]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial color="#110515" />
          </mesh>
          <mesh position={[0.17, 0.08, 0.44]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial color="#110515" />
          </mesh>

          <mesh position={[-0.17, 0.08, 0.49]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color="#ff0055" />
          </mesh>
          <mesh position={[0.17, 0.08, 0.49]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color="#ff0055" />
          </mesh>

          <mesh position={[-0.38, 0.45, -0.05]} rotation={[0.2, 0, -0.55]} castShadow>
            <coneGeometry args={[0.09, 0.7, 16]} />
            <meshStandardMaterial color="#1f1824" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0.38, 0.45, -0.05]} rotation={[0.2, 0, 0.55]} castShadow>
            <coneGeometry args={[0.09, 0.7, 16]} />
            <meshStandardMaterial color="#1f1824" roughness={0.3} metalness={0.5} />
          </mesh>

          <mesh position={[-0.42, 0.15, 0.05]} rotation={[0.1, 0, -1.1]} castShadow>
            <coneGeometry args={[0.055, 0.35, 12]} />
            <meshStandardMaterial color="#1f1824" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0.42, 0.15, 0.05]} rotation={[0.1, 0, 1.1]} castShadow>
            <coneGeometry args={[0.055, 0.35, 12]} />
            <meshStandardMaterial color="#1f1824" roughness={0.3} metalness={0.5} />
          </mesh>

          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.92, 0.045, 16, 32]} />
            <meshStandardMaterial
              color="#ff0066"
              emissive="#ff0055"
              emissiveIntensity={3.2}
              wireframe
            />
          </mesh>
          <mesh rotation={[-Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.82, 0.035, 16, 32]} />
            <meshStandardMaterial
              color="#9900ff"
              emissive="#9900ff"
              emissiveIntensity={2.5}
              wireframe
            />
          </mesh>
        </group>
      )}

      {type === 'pendulum' && (
        <group ref={rotorRef} position={[0, 3.8, 0]}>
          <mesh position={[0, -1.8, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 3.6, 16]} />
            <meshStandardMaterial color="#2d2d35" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, -3.8, 0]} castShadow>
            <sphereGeometry args={[0.65, 24, 24]} />
            <meshStandardMaterial color="#18181f" metalness={0.8} roughness={0.3} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const rotY = (idx * Math.PI) / 3;
            return (
              <mesh
                key={idx}
                position={[0, -3.8, 0]}
                rotation={[0, rotY, Math.PI / 2]}
                castShadow
              >
                <coneGeometry args={[0.14, 0.75, 12]} />
                <meshStandardMaterial
                  color="#e02444"
                  emissive="#c41230"
                  emissiveIntensity={1.5}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {type === 'reaperBlade' && (
        <group ref={rotorRef}>
          <mesh>
            <torusGeometry args={[1.1, 0.07, 16, 32]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00bfff"
              emissiveIntensity={2.2}
            />
          </mesh>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx * Math.PI) / 2;
            return (
              <mesh
                key={idx}
                position={[
                  Math.cos(angle) * 1.0,
                  0,
                  Math.sin(angle) * 1.0,
                ]}
                rotation={[0, -angle, 0]}
                castShadow
              >
                <coneGeometry args={[0.15, 0.65, 12]} />
                <meshStandardMaterial
                  color="#00f6ff"
                  emissive="#00f6ff"
                  emissiveIntensity={2.5}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
