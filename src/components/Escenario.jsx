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
  const portcullisRef = useRef();
  const throneGlowRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (relicMeshRef.current && !hasRelic) {
      relicMeshRef.current.rotation.y += delta * 1.2;
      relicMeshRef.current.position.y = MAP_CONFIG.relicPos[1] + Math.sin(time * 2.2) * 0.14;
    }

    if (ringRef.current && !hasRelic) {
      ringRef.current.rotation.z += delta * 0.8;
    }

    if (portcullisRef.current) {
      const targetY = hasRelic ? 3.4 : 0.85;
      portcullisRef.current.position.y = THREE.MathUtils.lerp(
        portcullisRef.current.position.y,
        targetY,
        0.06
      );
    }

    if (throneGlowRef.current) {
      throneGlowRef.current.rotation.z += delta * 0.4;
    }
  });

  const sceneryRocks = [
    { pos: [-18, -0.6, 26], scale: [3.4, 2.2, 3.2] },
    { pos: [16, -0.5, 28], scale: [3.8, 2.6, 3.5] },
    { pos: [24, -0.4, 10], scale: [4.2, 3.0, 4.0] },
    { pos: [-16, -0.5, 14], scale: [3.6, 2.5, 3.4] },
    { pos: [-24, 0.2, -6], scale: [4.8, 3.4, 4.2] },
    { pos: [15, -0.5, -16], scale: [3.9, 2.8, 3.6] },
    { pos: [-18, -0.4, -28], scale: [4.2, 3.0, 3.8] },
    { pos: [16, -0.3, -40], scale: [4.5, 3.2, 4.2] },
    { pos: [-16, 0.2, -48], scale: [4.6, 3.5, 4.4] },
  ];

  const pineTrees = [
    { pos: [-12, 0.2, 28], scale: 1.1 },
    { pos: [10, 0.2, 32], scale: 1.2 },
    { pos: [22, 0.2, 16], scale: 1.3 },
    { pos: [20, 0.2, -2], scale: 1.2 },
    { pos: [-20, 0.2, 4], scale: 1.4 },
    { pos: [-10, 0.2, -18], scale: 1.0 },
    { pos: [12, 0.2, -24], scale: 1.2 },
    { pos: [-12, 0.2, -40], scale: 1.3 },
    { pos: [12, 0.2, -50], scale: 1.5 },
  ];

  return (
    <group>
      <ambientLight intensity={0.82} color="#cdd7e5" />
      <directionalLight
        position={[35, 45, 25]}
        intensity={1.25}
        color="#f4ede2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={10}
        shadow-camera-far={120}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={52}
        shadow-camera-bottom={-52}
      />
      <directionalLight
        position={[-25, 32, -25]}
        intensity={0.55}
        color="#8ea2b8"
      />
      <fog attach="fog" args={['#202732', 38, 115]} />

      <mesh position={[0, -1.2, -8]} receiveShadow>
        <boxGeometry args={[110, 1.2, 130]} />
        <meshStandardMaterial color="#232a35" roughness={0.95} metalness={0.1} />
      </mesh>

      {sceneryRocks.map((rock, idx) => (
        <mesh
          key={idx}
          position={rock.pos}
          scale={rock.scale}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1.0, 1]} />
          <meshStandardMaterial color="#363e4a" roughness={0.9} metalness={0.15} />
        </mesh>
      ))}

      {pineTrees.map((tree, idx) => (
        <group key={idx} position={tree.pos} scale={[tree.scale, tree.scale, tree.scale]}>
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.24, 1.6, 12]} />
            <meshStandardMaterial color="#2b2017" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.1, 1.8, 12]} />
            <meshStandardMaterial color="#1f3024" roughness={0.85} />
          </mesh>
          <mesh position={[0, 3.0, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.85, 1.5, 12]} />
            <meshStandardMaterial color="#25382b" roughness={0.85} />
          </mesh>
        </group>
      ))}

      <group position={MAP_CONFIG.startPos}>
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <boxGeometry args={[7.5, 0.8, 7.5]} />
          <meshStandardMaterial color="#3a4350" roughness={0.85} />
        </mesh>

        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 3.0, 32]} />
          <meshStandardMaterial color="#4e5b6e" roughness={0.8} />
        </mesh>

        {[-3.2, 3.2].map((x, idx) => (
          <group key={idx} position={[x, 0.9, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.32, 0.38, 1.8, 16]} />
              <meshStandardMaterial color="#424c5a" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.42, 0.28, 0.3, 16]} />
              <meshStandardMaterial color="#252c36" roughness={0.7} metalness={0.6} />
            </mesh>
            <mesh position={[0, 1.15, 0]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshBasicMaterial color="#e07a2c" />
            </mesh>
            <pointLight position={[0, 1.15, 0]} color="#e07a2c" intensity={1.8} distance={6} />
          </group>
        ))}

        <Text
          position={[0, 2.4, -1.0]}
          fontSize={0.65}
          color="#d8c8b0"
          anchorX="center"
          outlineWidth={0.06}
          outlineColor="#1a202c"
        >
          PUNTO A: SANTUARIO DE PARTIDA
        </Text>
      </group>

      <group>
        <mesh position={[0, -0.4, 29]} receiveShadow>
          <boxGeometry args={[7.0, 0.8, 18.0]} />
          <meshStandardMaterial color="#363f4c" roughness={0.85} />
        </mesh>
        <mesh position={[-3.6, 0.55, 29]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.1, 18.0]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>
        <mesh position={[3.6, 0.55, 30]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.1, 16.0]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>

        <group position={[-3.6, 1.25, 29]}>
          <mesh>
            <boxGeometry args={[0.15, 0.25, 0.15]} />
            <meshStandardMaterial color="#23272e" roughness={0.6} metalness={0.8} />
          </mesh>
          <pointLight color="#d97a30" intensity={1.4} distance={5} />
        </group>
      </group>

      <group>
        <mesh position={[7.5, -0.4, 17.5]} receiveShadow>
          <boxGeometry args={[22.0, 0.8, 7.0]} />
          <meshStandardMaterial color="#38414f" roughness={0.85} />
        </mesh>
        <mesh position={[10.5, 0.55, 21.2]} castShadow receiveShadow>
          <boxGeometry args={[16.0, 1.1, 0.6]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>
        <mesh position={[4.0, 0.55, 13.8]} castShadow receiveShadow>
          <boxGeometry args={[14.5, 1.1, 0.6]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>
        <mesh position={[18.6, 0.55, 17.5]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.1, 7.0]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>

        <group position={[18.2, 1.25, 17.5]}>
          <mesh>
            <boxGeometry args={[0.15, 0.25, 0.15]} />
            <meshStandardMaterial color="#23272e" roughness={0.6} metalness={0.8} />
          </mesh>
          <pointLight color="#d97a30" intensity={1.4} distance={5} />
        </group>
      </group>

      <group>
        <mesh position={[15.2, -0.4, 6.0]} receiveShadow>
          <boxGeometry args={[7.0, 0.8, 17.0]} />
          <meshStandardMaterial color="#363f4c" roughness={0.85} />
        </mesh>
        <mesh position={[18.6, 0.55, 6.0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.1, 17.0]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>
        <mesh position={[11.8, 0.55, 8.5]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.1, 11.5]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>

        <group position={[18.2, 1.25, 6.0]}>
          <mesh>
            <boxGeometry args={[0.15, 0.25, 0.15]} />
            <meshStandardMaterial color="#23272e" roughness={0.6} metalness={0.8} />
          </mesh>
          <pointLight color="#d97a30" intensity={1.4} distance={5} />
        </group>
      </group>

      <group>
        <mesh position={[5.0, -0.4, -0.5]} receiveShadow>
          <boxGeometry args={[27.0, 0.8, 7.0]} />
          <meshStandardMaterial color="#394250" roughness={0.85} />
        </mesh>
        <mesh position={[8.5, 0.55, -4.0]} castShadow receiveShadow>
          <boxGeometry args={[20.0, 1.1, 0.6]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>
        <mesh position={[6.0, 0.55, 2.8]} castShadow receiveShadow>
          <boxGeometry args={[12.0, 1.1, 0.6]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>
      </group>

      <group>
        <mesh position={[-11.2, 0.8, -0.5]} rotation={[0, 0, -0.32]} receiveShadow>
          <boxGeometry args={[8.0, 0.8, 6.8]} />
          <meshStandardMaterial color="#3c4656" roughness={0.8} />
        </mesh>

        <mesh position={[-15.0, 2.3, -0.5]} receiveShadow>
          <cylinderGeometry args={[3.6, 4.0, 1.6, 24]} />
          <meshStandardMaterial color="#343d4a" roughness={0.8} />
        </mesh>

        <mesh position={[-14.5, 3.15, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.7, 1.6]} />
          <meshStandardMaterial color="#222832" roughness={0.7} metalness={0.4} />
        </mesh>

        <Text
          position={[-11.2, 2.9, 2.8]}
          fontSize={0.55}
          color="#d0b898"
          anchorX="center"
          outlineWidth={0.05}
          outlineColor="#1a202c"
        >
          CUESTA DEL ALMA
        </Text>

        {!hasRelic ? (
          <group position={[-14.5, 0, -0.5]}>
            <mesh ref={relicMeshRef} position={[0, MAP_CONFIG.relicPos[1], 0]} castShadow>
              <octahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial
                color="#e5a93b"
                emissive="#b87a1d"
                emissiveIntensity={1.4}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>

            <mesh ref={ringRef} position={[0, MAP_CONFIG.relicPos[1], 0]}>
              <torusGeometry args={[1.3, 0.05, 16, 32]} />
              <meshStandardMaterial color="#cda052" roughness={0.4} metalness={0.8} />
            </mesh>

            <pointLight
              position={[0, MAP_CONFIG.relicPos[1], 0]}
              color="#e5a93b"
              intensity={2.2}
              distance={6}
              decay={2}
            />

            <Text
              position={[0, MAP_CONFIG.relicPos[1] + 1.5, 0]}
              fontSize={0.55}
              color="#f3ebd9"
              anchorX="center"
              outlineWidth={0.05}
              outlineColor="#2a2015"
            >
              {isNearRelic ? 'PRESIONA [E] PARA TOMAR' : 'CUBO DE ALMA'}
            </Text>
          </group>
        ) : (
          <group position={[-14.5, 3.4, -0.5]}>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.2, 0.28, 0.8, 16]} />
              <meshStandardMaterial color="#4a5666" roughness={0.7} />
            </mesh>
            <pointLight color="#cda052" intensity={1.2} distance={4} />
          </group>
        )}
      </group>

      <group>
        <mesh position={[-3.8, -0.4, -19.5]} receiveShadow>
          <boxGeometry args={[7.2, 0.8, 34.0]} />
          <meshStandardMaterial color="#363f4c" roughness={0.85} />
        </mesh>
        <mesh position={[-7.4, 0.55, -19.5]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 1.1, 34.0]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>
        <mesh position={[-0.2, 0.55, -20.5]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 1.1, 32.0]} />
          <meshStandardMaterial color="#444e5d" roughness={0.8} />
        </mesh>

        <group position={[-7.0, 1.25, -19.5]}>
          <mesh>
            <boxGeometry args={[0.15, 0.25, 0.15]} />
            <meshStandardMaterial color="#23272e" roughness={0.6} metalness={0.8} />
          </mesh>
          <pointLight color="#d97a30" intensity={1.4} distance={5} />
        </group>
      </group>

      <group position={[-3.8, 0, MAP_CONFIG.gateZ]}>
        <mesh position={[-3.1, 0.85, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.42, 1.7, 16]} />
          <meshStandardMaterial color="#3a4350" roughness={0.8} />
        </mesh>
        <mesh position={[3.1, 0.85, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.42, 1.7, 16]} />
          <meshStandardMaterial color="#3a4350" roughness={0.8} />
        </mesh>

        <group ref={portcullisRef} position={[0, 0.85, 0]}>
          <mesh castShadow>
            <boxGeometry args={[5.5, 1.7, 0.22]} />
            <meshStandardMaterial
              color="#2a221b"
              roughness={0.85}
              metalness={0.2}
            />
          </mesh>
          {[-2.0, -1.0, 0, 1.0, 2.0].map((x, idx) => (
            <mesh key={idx} position={[x, 0, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 1.75, 12]} />
              <meshStandardMaterial color="#3f4754" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
        </group>

        <Text
          position={[0, 2.2, 0]}
          fontSize={0.5}
          color={hasRelic ? '#8ec07c' : '#d08060'}
          anchorX="center"
          outlineWidth={0.05}
          outlineColor="#1a202c"
        >
          {hasRelic ? 'PORTON DESBLOQUEADO' : 'PORTON BLOQUEADO - BUSCA EL CUBO'}
        </Text>
      </group>

      <group position={[0, 0, -47]}>
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <boxGeometry args={[15.0, 0.8, 16.0]} />
          <meshStandardMaterial color="#323b47" roughness={0.8} metalness={0.2} />
        </mesh>

        <mesh position={[-7.4, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.1, 16.0]} />
          <meshStandardMaterial color="#424c5a" roughness={0.85} />
        </mesh>
        <mesh position={[7.4, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.1, 16.0]} />
          <meshStandardMaterial color="#424c5a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.55, -8.0]} castShadow receiveShadow>
          <boxGeometry args={[15.4, 1.1, 0.6]} />
          <meshStandardMaterial color="#424c5a" roughness={0.85} />
        </mesh>

        {[-6.5, 6.5].map((x, idx) => (
          <group key={idx} position={[x, 1.1, -7.0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.45, 0.58, 2.2, 16]} />
              <meshStandardMaterial color="#3c4554" roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.25, 0]}>
              <sphereGeometry args={[0.18, 12, 12]} />
              <meshBasicMaterial color="#e5a93b" />
            </mesh>
            <pointLight position={[0, 1.25, 0]} color="#e5a93b" intensity={1.8} distance={6} />
          </group>
        ))}

        <mesh position={[0, 0.55, -5.5]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.1, 1.8]} />
          <meshStandardMaterial color="#382e3c" roughness={0.7} />
        </mesh>

        <group position={[0, 2.0, -4.0]}>
          <mesh ref={throneGlowRef}>
            <torusGeometry args={[1.9, 0.18, 24, 48]} />
            <meshStandardMaterial
              color="#c59b42"
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
          <pointLight color="#d9a338" intensity={2.8} distance={9} decay={2} />
        </group>


        
        <Text
          position={[0, 4.4, -4.0]}
          fontSize={0.75}
          color="#e2c074"
          anchorX="center"
          outlineWidth={0.06}
          outlineColor="#2a2012"
        >
          PUNTO B: CASTILLO DEL TRONO
        </Text>
      </group>
    </group>
  );
}
