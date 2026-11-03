import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sound } from '../utils/audio';
import { checkWalkable } from '../utils/mapData';

export default function Jugador({
  startPos = [0, 1.0, 34.0],
  obstacles = [],
  relicPos = [-14.5, 3.6, -0.5],
  goalPos = [0, 1.0, -47.0],
  hasRelic = false,
  isWon = false,
  resetKey = 0,
  onDeath,
  onNearRelicChange,
  onCollectRelic,
  onReachGoal,
  touchDirection = { up: false, down: false, left: false, right: false },
}) {
  const groupRef = useRef();
  const scytheLeftRef = useRef();
  const scytheRightRef = useRef();
  const soulAuraRef = useRef();
  const cloakRef = useRef();

  const pos = useRef(new THREE.Vector3(...startPos));
  const [keys, setKeys] = useState({});
  const stepTimer = useRef(0);
  const deathCooldown = useRef(0);
  const victoryTriggered = useRef(false);

  useEffect(() => {
    pos.current.set(...startPos);
    deathCooldown.current = 0;
    victoryTriggered.current = false;
    if (groupRef.current) {
      groupRef.current.position.copy(pos.current);
      groupRef.current.rotation.y = Math.PI;
    }
  }, [resetKey, startPos]);

  const checkRelicPickup = useCallback(() => {
    if (hasRelic) return;
    const playerV = pos.current;
    const relicV = new THREE.Vector3(...relicPos);
    const dist = playerV.distanceTo(relicV);

    if (dist < 3.2) {
      sound.playPickup();
      sound.playGate();
      if (onCollectRelic) onCollectRelic();
    }
  }, [hasRelic, relicPos, onCollectRelic]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = e.code;
      setKeys((prev) => ({ ...prev, [code]: true }));

      if (code === 'KeyE' || code === 'Space') {
        checkRelicPickup();
      }
    };

    const handleKeyUp = (e) => {
      const code = e.code;
      setKeys((prev) => ({ ...prev, [code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [checkRelicPickup]);

  const respawnAtA = () => {
    pos.current.set(...startPos);
    if (groupRef.current) {
      groupRef.current.position.copy(pos.current);
      groupRef.current.rotation.y = Math.PI;
    }
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isWon) {
      const victoryCam = new THREE.Vector3(
        pos.current.x,
        pos.current.y + 6.0,
        pos.current.z + 8.0
      );
      state.camera.position.lerp(victoryCam, 0.05);
      state.camera.lookAt(pos.current.x, pos.current.y + 1.2, pos.current.z - 2.0);
      return;
    }

    if (deathCooldown.current > 0) {
      deathCooldown.current -= delta;
    }

    let moveX = 0;
    let moveZ = 0;

    const isUp = keys['KeyW'] || keys['ArrowUp'] || touchDirection.up;
    const isDown = keys['KeyS'] || keys['ArrowDown'] || touchDirection.down;
    const isLeft = keys['KeyA'] || keys['ArrowLeft'] || touchDirection.left;
    const isRight = keys['KeyD'] || keys['ArrowRight'] || touchDirection.right;

    if (isUp) moveZ -= 1;
    if (isDown) moveZ += 1;
    if (isLeft) moveX -= 1;
    if (isRight) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving) {
      const moveDir = new THREE.Vector3(moveX, 0, moveZ).normalize();
      const speed = 11.0;

      const deltaX = moveDir.x * speed * delta;
      const deltaZ = moveDir.z * speed * delta;

      const targetX = pos.current.x + deltaX;
      const checkX = checkWalkable(targetX, pos.current.z, hasRelic);
      if (checkX.valid) {
        pos.current.x = targetX;
        pos.current.y = checkX.y;
      }

      const targetZ = pos.current.z + deltaZ;
      const checkZ = checkWalkable(pos.current.x, targetZ, hasRelic);
      if (checkZ.valid) {
        pos.current.z = targetZ;
        pos.current.y = checkZ.y;
      }

      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetAngle,
        0.25
      );

      const walkTime = state.clock.getElapsedTime() * 12;
      groupRef.current.position.y = pos.current.y + Math.abs(Math.sin(walkTime)) * 0.16;

      if (scytheLeftRef.current && scytheRightRef.current) {
        scytheLeftRef.current.rotation.z = Math.sin(walkTime) * 0.25;
        scytheRightRef.current.rotation.z = -Math.sin(walkTime) * 0.25;
      }

      if (cloakRef.current) {
        cloakRef.current.rotation.x = 0.25 + Math.sin(walkTime) * 0.15;
      }

      stepTimer.current += delta;
      if (stepTimer.current > 0.3) {
        sound.playStep();
        stepTimer.current = 0;
      }
    } else {
      const idleTime = state.clock.getElapsedTime() * 2.5;
      groupRef.current.position.y = pos.current.y + Math.sin(idleTime) * 0.05;
      if (cloakRef.current) {
        cloakRef.current.rotation.x = THREE.MathUtils.lerp(cloakRef.current.rotation.x, 0.08, 0.1);
      }
    }

    if (soulAuraRef.current) {
      soulAuraRef.current.rotation.z += delta * 1.5;
    }

    groupRef.current.position.x = pos.current.x;
    groupRef.current.position.z = pos.current.z;

    const relicVec = new THREE.Vector3(...relicPos);
    const distToRelic = pos.current.distanceTo(relicVec);
    const near = distToRelic < 3.2;
    if (onNearRelicChange) onNearRelicChange(near);

    if (deathCooldown.current <= 0 && obstacles.length > 0) {
      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (!obs || !obs.position) continue;

        const obsPos = new THREE.Vector3(
          obs.position.x,
          obs.position.y,
          obs.position.z
        );

        const dist = pos.current.distanceTo(obsPos);
        const hitRadius = obs.radius || 1.35;

        if (dist < hitRadius) {
          deathCooldown.current = 0.8;
          sound.playDeath();
          onDeath();
          respawnAtA();
          return;
        }
      }
    }

    const goalVec = new THREE.Vector3(...goalPos);
    const distToGoal = pos.current.distanceTo(goalVec);

    if (distToGoal < 3.8 && hasRelic && !victoryTriggered.current) {
      victoryTriggered.current = true;
      sound.playVictory();
      onReachGoal();
    }

    const cameraTargetPos = new THREE.Vector3(
      pos.current.x,
      pos.current.y + 11.5,
      pos.current.z + 11.5
    );
    state.camera.position.lerp(cameraTargetPos, 0.08);
    state.camera.lookAt(pos.current.x, pos.current.y + 0.5, pos.current.z - 2.5);
  });

  return (
    <group ref={groupRef} position={startPos}>
      <pointLight color="#00ffff" intensity={3.2} distance={9} decay={2} />

      <mesh ref={soulAuraRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <ringGeometry args={[0.55, 1.3, 32]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0.15, -0.02]} castShadow>
        <capsuleGeometry args={[0.32, 0.75, 16, 24]} />
        <meshStandardMaterial color="#1a202c" roughness={0.5} metalness={0.3} />
      </mesh>

      <mesh position={[0, 0.45, 0.05]} castShadow>
        <cylinderGeometry args={[0.36, 0.38, 0.65, 24]} />
        <meshStandardMaterial color="#4a5568" roughness={0.3} metalness={0.8} />
      </mesh>

      <group ref={cloakRef} position={[0, 0.85, -0.22]}>
        <mesh position={[0, -0.65, 0]} rotation={[0.08, 0, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.65, 1.3, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#111622" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh position={[0, 1.05, 0.02]} castShadow>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#171923" roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.98, 0.22]} castShadow>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color="#f7fafc" roughness={0.25} metalness={0.15} />
      </mesh>

      <mesh position={[-0.22, 1.25, 0.12]} rotation={[0.15, 0, -0.4]} castShadow>
        <coneGeometry args={[0.065, 0.5, 16]} />
        <meshStandardMaterial color="#2d3748" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0.22, 1.25, 0.12]} rotation={[0.15, 0, 0.4]} castShadow>
        <coneGeometry args={[0.065, 0.5, 16]} />
        <meshStandardMaterial color="#2d3748" roughness={0.35} metalness={0.4} />
      </mesh>

      <mesh position={[-0.09, 0.98, 0.36]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color="#00f6ff" />
      </mesh>
      <mesh position={[0.09, 0.98, 0.36]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color="#00f6ff" />
      </mesh>

      <mesh position={[-0.46, 0.78, 0]} rotation={[0, 0, 0.2]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#cbd5e0" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.46, 0.78, 0]} rotation={[0, 0, -0.2]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#cbd5e0" metalness={0.9} roughness={0.2} />
      </mesh>

      <group ref={scytheLeftRef} position={[-0.58, 0.45, 0.1]} rotation={[0.3, 0.2, 0.2]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.7, 16]} />
          <meshStandardMaterial color="#2d3748" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.32, 0.7, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <boxGeometry args={[0.75, 0.1, 0.03]} />
          <meshStandardMaterial
            color="#00f6ff"
            emissive="#00f6ff"
            emissiveIntensity={3.5}
            roughness={0.1}
          />
        </mesh>
      </group>

      <group ref={scytheRightRef} position={[0.58, 0.45, 0.1]} rotation={[0.3, -0.2, -0.2]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.7, 16]} />
          <meshStandardMaterial color="#2d3748" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.32, 0.7, 0]} rotation={[0, 0, Math.PI / 3]}>
          <boxGeometry args={[0.75, 0.1, 0.03]} />
          <meshStandardMaterial
            color="#00f6ff"
            emissive="#00f6ff"
            emissiveIntensity={3.5}
            roughness={0.1}
          />
        </mesh>
      </group>

      {hasRelic && (
        <group position={[0, 2.1, 0]}>
          <mesh rotation={[0.4, 0.4, 0]}>
            <octahedronGeometry args={[0.22]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00f6ff"
              emissiveIntensity={3.5}
              wireframe
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
