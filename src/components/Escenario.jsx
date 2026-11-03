import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { MAP_CONFIG } from '../utils/mapData';

export default function Escenario({
  hasRelic = false,
  isNearRelic = false,
}) {
  const relicMeshRef = useRef();
  const ringRef = useRef();
  const gateRef = useRef();
  const portalRef = useRef();

  const islandsRef = useRef([]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (relicMeshRef.current && !hasRelic) {
      relicMeshRef.current.rotation.x += delta * 1.3;
      relicMeshRef.current.rotation.y += delta * 1.5;
      relicMeshRef.current.position.y = MAP_CONFIG.relicPos[1] + Math.sin(time * 3) * 0.22;
    }

    if (ringRef.current && !hasRelic) {
      ringRef.current.rotation.z += delta * 1.0;
      ringRef.current.rotation.x = Math.sin(time * 2) * 0.35;
    }

    if (gateRef.current) {
      const targetGateY = hasRelic ? 5.5 : 1.4;
      gateRef.current.position.y = THREE.MathUtils.lerp(
        gateRef.current.position.y,
        targetGateY,
        0.06
      );
    }

    if (portalRef.current) {
      portalRef.current.rotation.z += delta * 1.8;
    }

    islandsRef.current.forEach((island, i) => {
      if (!island) return;
      const speed = 0.6 + (i % 3) * 0.2;
      const phase = i * 1.3;
      island.position.y = island.userData.baseY + Math.sin(time * speed + phase) * 0.8;
      island.rotation.y += delta * 0.12;
      island.rotation.z = Math.sin(time * 0.5 + phase) * 0.08;
    });
  });

  const islandData = [
    { pos: [-14, -2.5, 26], scale: 2.6 },
    { pos: [14, -1.8, 28], scale: 2.2 },
    { pos: [22, -2.0, 8], scale: 3.0 },
    { pos: [-12, -1.5, 12], scale: 2.4 },
    { pos: [-22, 0.5, -4], scale: 3.2 },
    { pos: [12, -2.0, -18], scale: 2.8 },
    { pos: [-16, -1.0, -32], scale: 3.1 },
    { pos: [14, -0.5, -42], scale: 3.4 },
  ];

  return (
    <group>
      <ambientLight intensity={0.7} color="#9cb5d9" />
      <directionalLight
        position={[30, 45, 25]}
        intensity={1.2}
        color="#d8e8ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={10}
        shadow-camera-far={120}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <fog attach="fog" args={['#080b16', 50, 140]} />

      {islandData.map((data, idx) => (
        <group
          key={idx}
          ref={(el) => {
            if (el) {
              el.userData.baseY = data.pos[1];
              islandsRef.current[idx] = el;
            }
          }}
          position={data.pos}
          scale={[data.scale, data.scale * 0.8, data.scale]}
        >
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[1.0, 1]} />
            <meshStandardMaterial color="#1f2533" roughness={0.9} metalness={0.2} />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00bfff"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      ))}

      <group position={MAP_CONFIG.startPos}>
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <boxGeometry args={[7.5, 0.8, 7.5]} />
          <meshStandardMaterial color="#2d3748" roughness={0.8} />
        </mesh>

        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 3.2, 32]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
        </mesh>

        {[-3.2, 3.2].map((x, idx) => (
          <group key={idx} position={[x, 1.2, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.35, 0.4, 2.4, 16]} />
              <meshStandardMaterial color="#3d495c" roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.3, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
            <pointLight position={[0, 1.3, 0]} color="#00ffff" intensity={2.5} distance={8} />
          </group>
        ))}

        <Text
          position={[0, 2.8, -1.0]}
          fontSize={0.7}
          color="#00ffff"
          anchorX="center"
          outlineWidth={0.06}
          outlineColor="#001a26"
        >
          PUNTO A: SANTUARIO DE PARTIDA
        </Text>
      </group>

      <group>
        <mesh position={[0, -0.4, 29]} receiveShadow>
          <boxGeometry args={[7.0, 0.8, 18.0]} />
          <meshStandardMaterial color="#242c38" roughness={0.85} />
        </mesh>
        <mesh position={[-3.6, 0.7, 29]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.4, 18.0]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>
        <mesh position={[3.6, 0.7, 30]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.4, 16.0]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>

        <group position={[-3.6, 1.5, 29]}>
          <mesh>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          <pointLight color="#00e5ff" intensity={2.0} distance={7} />
        </group>
      </group>

      <group>
        <mesh position={[7.5, -0.4, 17.5]} receiveShadow>
          <boxGeometry args={[22.0, 0.8, 7.0]} />
          <meshStandardMaterial color="#262f3d" roughness={0.85} />
        </mesh>
        <mesh position={[10.5, 0.7, 21.2]} castShadow receiveShadow>
          <boxGeometry args={[16.0, 1.4, 0.6]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>
        <mesh position={[4.0, 0.7, 13.8]} castShadow receiveShadow>
          <boxGeometry args={[14.5, 1.4, 0.6]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>
        <mesh position={[18.6, 0.7, 17.5]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.4, 7.0]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>

        <group position={[18.2, 1.5, 17.5]}>
          <mesh>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshBasicMaterial color="#bc13fe" />
          </mesh>
          <pointLight color="#bc13fe" intensity={2.2} distance={8} />
        </group>
      </group>

      <group>
        <mesh position={[15.2, -0.4, 6.0]} receiveShadow>
          <boxGeometry args={[7.0, 0.8, 17.0]} />
          <meshStandardMaterial color="#242c38" roughness={0.85} />
        </mesh>
        <mesh position={[18.6, 0.7, 6.0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.4, 17.0]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>
        <mesh position={[11.8, 0.7, 8.5]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.4, 11.5]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>

        <group position={[18.2, 1.5, 6.0]}>
          <mesh>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          <pointLight color="#00e5ff" intensity={2.0} distance={7} />
        </group>
      </group>

      <group>
        <mesh position={[5.0, -0.4, -0.5]} receiveShadow>
          <boxGeometry args={[27.0, 0.8, 7.0]} />
          <meshStandardMaterial color="#283242" roughness={0.85} />
        </mesh>
        <mesh position={[8.5, 0.7, -4.0]} castShadow receiveShadow>
          <boxGeometry args={[20.0, 1.4, 0.6]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>
        <mesh position={[6.0, 0.7, 2.8]} castShadow receiveShadow>
          <boxGeometry args={[12.0, 1.4, 0.6]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>
      </group>

      <group>
        <mesh position={[-11.2, 0.8, -0.5]} rotation={[0, 0, -0.32]} receiveShadow>
          <boxGeometry args={[8.0, 0.8, 6.8]} />
          <meshStandardMaterial color="#313d50" roughness={0.8} />
        </mesh>

        <mesh position={[-15.0, 2.3, -0.5]} receiveShadow>
          <cylinderGeometry args={[3.6, 4.0, 1.6, 24]} />
          <meshStandardMaterial color="#263040" roughness={0.7} />
        </mesh>

        <mesh position={[-14.5, 3.2, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.8, 1.5]} />
          <meshStandardMaterial color="#111620" metalness={0.9} roughness={0.2} />
        </mesh>

        <Text
          position={[-11.2, 3.2, 2.8]}
          fontSize={0.6}
          color="#00f6ff"
          anchorX="center"
          outlineWidth={0.05}
          outlineColor="#001a26"
        >
          CUESTA DEL ALMA
        </Text>

        {!hasRelic ? (
          <group position={[-14.5, 0, -0.5]}>
            <mesh ref={relicMeshRef} position={[0, MAP_CONFIG.relicPos[1], 0]} castShadow>
              <octahedronGeometry args={[0.85, 0]} />
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00bfff"
                emissiveIntensity={2.8}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>

            <mesh ref={ringRef} position={[0, MAP_CONFIG.relicPos[1], 0]}>
              <torusGeometry args={[1.6, 0.08, 16, 32]} />
              <meshBasicMaterial color="#00ffff" wireframe />
            </mesh>

            <pointLight
              position={[0, MAP_CONFIG.relicPos[1], 0]}
              color="#00ffff"
              intensity={4}
              distance={10}
              decay={2}
            />

            <Text
              position={[0, MAP_CONFIG.relicPos[1] + 1.8, 0]}
              fontSize={0.6}
              color="#ffffff"
              anchorX="center"
              outlineWidth={0.05}
              outlineColor="#005570"
            >
              {isNearRelic ? 'PRESIONA [E] PARA TOMAR' : 'CUBO DE ALMA'}
            </Text>
          </group>
        ) : (
          <group position={[-14.5, 3.7, -0.5]}>
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color="#00ff88" />
            </mesh>
            <pointLight color="#00ff88" intensity={2.0} distance={5} />
          </group>
        )}
      </group>

      <group>
        <mesh position={[-3.8, -0.4, -19.5]} receiveShadow>
          <boxGeometry args={[7.2, 0.8, 34.0]} />
          <meshStandardMaterial color="#242c38" roughness={0.85} />
        </mesh>
        <mesh position={[-7.6, 0.7, -19.5]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.4, 34.0]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>
        <mesh position={[0.0, 0.7, -20.5]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.4, 32.0]} />
          <meshStandardMaterial color="#3d4758" roughness={0.8} />
        </mesh>

        <group position={[-7.2, 1.5, -19.5]}>
          <mesh>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          <pointLight color="#00e5ff" intensity={2.2} distance={8} />
        </group>
      </group>

      <group position={[-3.8, 0, MAP_CONFIG.gateZ]}>
        <mesh position={[-3.4, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 4.4, 1.4]} />
          <meshStandardMaterial color="#2b3340" roughness={0.8} />
        </mesh>
        <mesh position={[3.4, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 4.4, 1.4]} />
          <meshStandardMaterial color="#2b3340" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.0, 0.8, 1.6]} />
          <meshStandardMaterial color="#323b4a" roughness={0.7} />
        </mesh>

        <group ref={gateRef} position={[0, 1.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[5.6, 2.8, 0.3]} />
            <meshStandardMaterial
              color="#171b24"
              metalness={0.9}
              roughness={0.2}
              wireframe={!hasRelic}
            />
          </mesh>
        </group>

        <mesh position={[0, 1.4, 0]}>
          <planeGeometry args={[5.6, 2.8]} />
          <meshBasicMaterial
            color={hasRelic ? '#00ff88' : '#ff0033'}
            transparent
            opacity={hasRelic ? 0.15 : 0.65}
            side={THREE.DoubleSide}
          />
        </mesh>

        <Text
          position={[0, 5.3, 0]}
          fontSize={0.6}
          color={hasRelic ? '#00ff88' : '#ff3344'}
          anchorX="center"
          outlineWidth={0.05}
          outlineColor="#000"
        >
          {hasRelic ? 'PORTON DESBLOQUEADO' : 'PORTON BLOQUEADO - BUSCA EL CUBO'}
        </Text>
      </group>

      <group position={[0, 0, -47]}>
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <boxGeometry args={[15.0, 0.8, 16.0]} />
          <meshStandardMaterial color="#222a36" roughness={0.8} metalness={0.25} />
        </mesh>

        <mesh position={[-7.5, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1.8, 16.0]} />
          <meshStandardMaterial color="#323c4d" roughness={0.85} />
        </mesh>
        <mesh position={[7.5, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1.8, 16.0]} />
          <meshStandardMaterial color="#323c4d" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.2, -8.0]} castShadow receiveShadow>
          <boxGeometry args={[15.8, 2.4, 0.8]} />
          <meshStandardMaterial color="#323c4d" roughness={0.85} />
        </mesh>

        {[-6.8, 6.8].map((x, idx) => (
          <group key={idx} position={[x, 2.5, -7.2]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.8, 1.0, 5.0, 16]} />
              <meshStandardMaterial color="#2d3748" roughness={0.8} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 1.5, -6.0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 3.0, 1.6]} />
          <meshStandardMaterial color="#3a2542" roughness={0.6} />
        </mesh>

        <group position={[0, 2.2, -4.0]}>
          <mesh ref={portalRef}>
            <torusGeometry args={[2.2, 0.28, 24, 48]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#ffaa00"
              emissiveIntensity={2.8}
            />
          </mesh>
          <pointLight color="#ffaa00" intensity={4.5} distance={12} decay={2} />
        </group>

        <Text
          position={[0, 5.4, -4.0]}
          fontSize={0.85}
          color="#ffd700"
          anchorX="center"
          outlineWidth={0.07}
          outlineColor="#332200"
        >
          PUNTO B: CASTILLO DEL TRONO
        </Text>
      </group>
    </group>
  );
}
