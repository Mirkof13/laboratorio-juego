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
      curY = initialPos[1] + Math.sin(time * 2) * 0.14;
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
      const scale = 1 + Math.sin(time * 2.5) * 0.08;
      flameRef.current.scale.set(scale, scale, scale);
      flameRef.current.rotation.y += 0.02;
    }

    if (onPositionUpdate) {
      onPositionUpdate(id, [curX, curY, curZ], radius);
    }
  });

  return (
    <group ref={groupRef} position={initialPos}>
      <pointLight
        color={type === 'skullPatrol' ? '#d97a30' : '#8c2d2d'}
        intensity={1.8}
        distance={5}
        decay={2}
      />

      {type === 'scytheTrap' && (
        <group ref={rotorRef}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 3.8, 16]} />
            <meshStandardMaterial color="#23262d" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#4a5260" metalness={0.9} roughness={0.25} />
          </mesh>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx * Math.PI) / 2;
            return (
              <group key={idx} rotation={[0, 0, angle]}>
                <mesh position={[0.7, 0, 0]} castShadow>
                  <boxGeometry args={[1.4, 0.08, 0.04]} />
                  <meshStandardMaterial
                    color="#3a404c"
                    metalness={0.85}
                    roughness={0.3}
                  />
                </mesh>
                <mesh position={[1.35, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
                  <boxGeometry args={[0.65, 0.12, 0.03]} />
                  <meshStandardMaterial
                    color="#68222a"
                    metalness={0.85}
                    roughness={0.25}
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
            <meshStandardMaterial color="#7a7266" roughness={0.7} metalness={0.2} />
          </mesh>

          <mesh position={[0, 0.12, 0.3]} castShadow>
            <boxGeometry args={[0.62, 0.12, 0.25]} />
            <meshStandardMaterial color="#6a6358" roughness={0.7} />
          </mesh>

          <mesh position={[0, -0.18, 0.26]} castShadow>
            <boxGeometry args={[0.38, 0.22, 0.28]} />
            <meshStandardMaterial color="#5c554b" roughness={0.75} />
          </mesh>

          <mesh position={[0, -0.3, 0.28]}>
            <boxGeometry args={[0.3, 0.08, 0.08]} />
            <meshStandardMaterial color="#8c8578" roughness={0.5} />
          </mesh>

          <mesh position={[-0.17, 0.08, 0.44]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial color="#1a1815" />
          </mesh>
          <mesh position={[0.17, 0.08, 0.44]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial color="#1a1815" />
          </mesh>

          <mesh position={[-0.17, 0.08, 0.49]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#d97a30" />
          </mesh>
          <mesh position={[0.17, 0.08, 0.49]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#d97a30" />
          </mesh>

          <mesh position={[-0.38, 0.45, -0.05]} rotation={[0.2, 0, -0.55]} castShadow>
            <coneGeometry args={[0.09, 0.7, 16]} />
            <meshStandardMaterial color="#2b2520" roughness={0.6} metalness={0.4} />
          </mesh>
          <mesh position={[0.38, 0.45, -0.05]} rotation={[0.2, 0, 0.55]} castShadow>
            <coneGeometry args={[0.09, 0.7, 16]} />
            <meshStandardMaterial color="#2b2520" roughness={0.6} metalness={0.4} />
          </mesh>

          <mesh position={[-0.42, 0.15, 0.05]} rotation={[0.1, 0, -1.1]} castShadow>
            <coneGeometry args={[0.055, 0.35, 12]} />
            <meshStandardMaterial color="#2b2520" roughness={0.6} metalness={0.4} />
          </mesh>
          <mesh position={[0.42, 0.15, 0.05]} rotation={[0.1, 0, 1.1]} castShadow>
            <coneGeometry args={[0.055, 0.35, 12]} />
            <meshStandardMaterial color="#2b2520" roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      )}

      {type === 'pendulum' && (
        <group ref={rotorRef} position={[0, 3.8, 0]}>
          <mesh position={[0, -1.8, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 3.6, 16]} />
            <meshStandardMaterial color="#2a2e36" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, -3.8, 0]} castShadow>
            <sphereGeometry args={[0.62, 24, 24]} />
            <meshStandardMaterial color="#1f2228" metalness={0.85} roughness={0.3} />
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
                <coneGeometry args={[0.13, 0.7, 12]} />
                <meshStandardMaterial
                  color="#5e262c"
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {type === 'reaperBlade' && (
        <group ref={rotorRef}>
          <mesh>
            <torusGeometry args={[1.0, 0.065, 16, 32]} />
            <meshStandardMaterial
              color="#3a414e"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx * Math.PI) / 2;
            return (
              <mesh
                key={idx}
                position={[
                  Math.cos(angle) * 0.95,
                  0,
                  Math.sin(angle) * 0.95,
                ]}
                rotation={[0, -angle, 0]}
                castShadow
              >
                <coneGeometry args={[0.14, 0.62, 12]} />
                <meshStandardMaterial
                  color="#566072"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
