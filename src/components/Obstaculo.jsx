import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Obstaculo({
  id = 1,
  type = 'scytheTrap',
  initialPos = [0, 1.2, 0],
  axis = 'x',
  range = 3.5,
  speed = 2.2,
  offset = 0,
  radius = 1.35,
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

    if (axis === 'x') {
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
      const scale = 1 + Math.sin(time * 3) * 0.15;
      flameRef.current.scale.set(scale, scale, scale);
    }

    if (onPositionUpdate) {
      onPositionUpdate(id, { x: curX, y: curY, z: curZ }, radius);
    }
  });

  return (
    <group ref={groupRef} position={initialPos}>
      <pointLight
        color={type === 'skullPatrol' ? '#ff3366' : '#9900ff'}
        intensity={2.2}
        distance={5}
        decay={2}
      />

      {type === 'scytheTrap' && (
        <group ref={rotorRef}>
          <mesh castShadow>
            <sphereGeometry args={[0.42, 24, 24]} />
            <meshStandardMaterial color="#1a1520" metalness={0.9} roughness={0.2} />
          </mesh>

          <mesh ref={flameRef}>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshBasicMaterial color="#ff0055" />
          </mesh>

          {[0, 1, 2, 3].map((i) => {
            const angle = (i * Math.PI) / 2;
            return (
              <group key={i} rotation={[0, 0, angle]}>
                <mesh position={[0.7, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} rotation={[0, 0, Math.PI / 2]} />
                  <meshStandardMaterial color="#404048" metalness={0.8} roughness={0.3} />
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
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.55, 24, 24]} />
            <meshStandardMaterial color="#e2d9cc" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.32, 0.18]} castShadow>
            <cylinderGeometry args={[0.26, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#c8bfb0" roughness={0.6} />
          </mesh>
          <mesh position={[-0.38, 0.42, -0.05]} rotation={[0.3, 0, -0.55]} castShadow>
            <coneGeometry args={[0.1, 0.65, 16]} />
            <meshStandardMaterial color="#1a151e" roughness={0.4} />
          </mesh>
          <mesh position={[0.38, 0.42, -0.05]} rotation={[0.3, 0, 0.55]} castShadow>
            <coneGeometry args={[0.1, 0.65, 16]} />
            <meshStandardMaterial color="#1a151e" roughness={0.4} />
          </mesh>
          <mesh position={[-0.18, 0.06, 0.48]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshBasicMaterial color="#bc13fe" />
          </mesh>
          <mesh position={[0.18, 0.06, 0.48]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshBasicMaterial color="#bc13fe" />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.85, 0.05, 16, 32]} />
            <meshStandardMaterial
              color="#bc13fe"
              emissive="#8a05c7"
              emissiveIntensity={2}
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
              emissiveIntensity={2}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 2.4, 16]} />
            <meshStandardMaterial
              color="#00f6ff"
              emissive="#00c8e0"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
