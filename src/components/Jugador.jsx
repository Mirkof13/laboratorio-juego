import React, { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { checkWalkable } from '../utils/mapData';
import { sound } from '../utils/audio';

export default function Jugador({
  startPos = [0, 1, 34],
  obstacles = [],
  relicPos = [-14.5, 3.6, -0.5],
  goalPos = [0, 1, -47],
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
  const shadowDiscRef = useRef();
  const relicCrownRef = useRef();
  const cloakRef = useRef();

  const pos = useRef(new THREE.Vector3(...startPos));
  const keys = useRef({});
  const deathCooldown = useRef(0);
  const stepTimer = useRef(0);
  const victoryTriggered = useRef(false);

  useEffect(() => {
    pos.current.set(...startPos);
    deathCooldown.current = 0;
    victoryTriggered.current = false;
    if (groupRef.current) {
      groupRef.current.position.set(...startPos);
      groupRef.current.rotation.set(0, 0, 0);
    }
  }, [resetKey, startPos]);

  const attemptPickupRelic = useCallback(() => {
    if (hasRelic) return;
    const playerV = new THREE.Vector3(pos.current.x, pos.current.y, pos.current.z);
    const relicV = new THREE.Vector3(...relicPos);
    const dist = playerV.distanceTo(relicV);

    if (dist < 4.2) {
      sound.playPickup();
      sound.playGate();
      if (onCollectRelic) onCollectRelic();
    }
  }, [hasRelic, relicPos, onCollectRelic]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const code = e.code;
      keys.current[code] = true;

      if (code === 'KeyE') {
        attemptPickupRelic();
      }
    };

    const handleKeyUp = (e) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [attemptPickupRelic]);

  const respawnAtA = () => {
    pos.current.set(...startPos);
    if (groupRef.current) {
      groupRef.current.position.set(...startPos);
      groupRef.current.rotation.set(0, 0, 0);
    }
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (deathCooldown.current > 0) {
      deathCooldown.current -= delta;
    }

    if (isWon) {
      const victoryCameraTarget = new THREE.Vector3(
        goalPos[0],
        goalPos[1] + 9.5,
        goalPos[2] + 12.0
      );
      state.camera.position.lerp(victoryCameraTarget, 0.04);
      state.camera.lookAt(goalPos[0], goalPos[1] + 1.8, goalPos[2]);
      return;
    }

    let moveX = 0;
    let moveZ = 0;

    const isUp =
      keys.current['KeyW'] ||
      keys.current['ArrowUp'] ||
      touchDirection.up;
    const isDown =
      keys.current['KeyS'] ||
      keys.current['ArrowDown'] ||
      touchDirection.down;
    const isLeft =
      keys.current['KeyA'] ||
      keys.current['ArrowLeft'] ||
      touchDirection.left;
    const isRight =
      keys.current['KeyD'] ||
      keys.current['ArrowRight'] ||
      touchDirection.right;

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
        scytheLeftRef.current.rotation.z = Math.sin(walkTime) * 0.28;
        scytheRightRef.current.rotation.z = -Math.sin(walkTime) * 0.28;
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
      if (scytheLeftRef.current && scytheRightRef.current) {
        scytheLeftRef.current.rotation.z = THREE.MathUtils.lerp(
          scytheLeftRef.current.rotation.z,
          0.12,
          0.1
        );
        scytheRightRef.current.rotation.z = THREE.MathUtils.lerp(
          scytheRightRef.current.rotation.z,
          -0.12,
          0.1
        );
      }
    }

    if (relicCrownRef.current && hasRelic) {
      relicCrownRef.current.rotation.y += delta * 1.5;
    }

    groupRef.current.position.x = pos.current.x;
    groupRef.current.position.z = pos.current.z;

    const relicVec = new THREE.Vector3(...relicPos);
    const distToRelic = pos.current.distanceTo(relicVec);
    const near = distToRelic < 4.2;
    if (onNearRelicChange) onNearRelicChange(near);

    if (deathCooldown.current <= 0 && obstacles.length > 0) {
      const playerPos = new THREE.Vector3(pos.current.x, pos.current.y + 0.6, pos.current.z);

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (!obs || !obs.position) continue;

        const obsPos = new THREE.Vector3(...obs.position);
        const dist = playerPos.distanceTo(obsPos);
        const hitRadius = (obs.radius || 1.3) + 0.45;

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
      pos.current.y + 12.0,
      pos.current.z + 10.5
    );
    state.camera.position.lerp(cameraTargetPos, 0.08);
    state.camera.lookAt(pos.current.x, pos.current.y + 0.5, pos.current.z - 2.0);
  });

  return (
    <group ref={groupRef} position={startPos}>
      <mesh ref={shadowDiscRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[0.75, 32]} />
        <meshBasicMaterial
          color="#121720"
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh position={[0, 0.15, -0.02]} castShadow>
        <capsuleGeometry args={[0.32, 0.75, 16, 24]} />
        <meshStandardMaterial color="#252b36" roughness={0.7} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0.45, 0.05]} castShadow>
        <cylinderGeometry args={[0.36, 0.38, 0.65, 24]} />
        <meshStandardMaterial color="#3e4756" roughness={0.5} metalness={0.5} />
      </mesh>

      <group ref={cloakRef} position={[0, 0.85, -0.22]}>
        <mesh position={[0, -0.65, 0]} rotation={[0.08, 0, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.65, 1.3, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#1a1e27" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh position={[0, 1.05, 0.02]} castShadow>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#212630" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.98, 0.22]} castShadow>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color="#dcd5c9" roughness={0.5} metalness={0.1} />
      </mesh>

      <mesh position={[-0.22, 1.25, 0.12]} rotation={[0.15, 0, -0.4]} castShadow>
        <coneGeometry args={[0.065, 0.5, 16]} />
        <meshStandardMaterial color="#2b2620" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.22, 1.25, 0.12]} rotation={[0.15, 0, 0.4]} castShadow>
        <coneGeometry args={[0.065, 0.5, 16]} />
        <meshStandardMaterial color="#2b2620" roughness={0.5} metalness={0.3} />
      </mesh>

      <mesh position={[-0.09, 0.98, 0.36]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#1a1c22" />
      </mesh>
      <mesh position={[0.09, 0.98, 0.36]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#1a1c22" />
      </mesh>

      <mesh position={[-0.46, 0.78, 0]} rotation={[0, 0, 0.2]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#424c5b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.46, 0.78, 0]} rotation={[0, 0, -0.2]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#424c5b" metalness={0.8} roughness={0.3} />
      </mesh>

      <group ref={scytheLeftRef} position={[-0.56, 0.35, 0.18]} rotation={[0.2, 0.12, 0.15]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.038, 1.85, 16]} />
          <meshStandardMaterial color="#26221c" metalness={0.4} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.92, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.02, 0.15, 16]} />
          <meshStandardMaterial color="#504538" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.045, 0.22, 16]} />
          <meshStandardMaterial color="#504538" metalness={0.85} roughness={0.3} />
        </mesh>

        <mesh position={[0.16, 0.8, 0]} rotation={[0, 0, -0.4]} castShadow>
          <boxGeometry args={[0.35, 0.09, 0.04]} />
          <meshStandardMaterial color="#323842" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0.38, 0.74, 0]} rotation={[0, 0, -1.05]} castShadow>
          <boxGeometry args={[0.48, 0.08, 0.03]} />
          <meshStandardMaterial color="#5e6878" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.52, 0.44, 0]} rotation={[0, 0, -2.2]} castShadow>
          <coneGeometry args={[0.065, 0.42, 16]} />
          <meshStandardMaterial color="#707c90" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      <group ref={scytheRightRef} position={[0.56, 0.35, 0.18]} rotation={[0.2, -0.12, -0.15]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.038, 1.85, 16]} />
          <meshStandardMaterial color="#26221c" metalness={0.4} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.92, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.02, 0.15, 16]} />
          <meshStandardMaterial color="#504538" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.045, 0.22, 16]} />
          <meshStandardMaterial color="#504538" metalness={0.85} roughness={0.3} />
        </mesh>

        <mesh position={[-0.16, 0.8, 0]} rotation={[0, 0, 0.4]} castShadow>
          <boxGeometry args={[0.35, 0.09, 0.04]} />
          <meshStandardMaterial color="#323842" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[-0.38, 0.74, 0]} rotation={[0, 0, 1.05]} castShadow>
          <boxGeometry args={[0.48, 0.08, 0.03]} />
          <meshStandardMaterial color="#5e6878" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.52, 0.44, 0]} rotation={[0, 0, 2.2]} castShadow>
          <coneGeometry args={[0.065, 0.42, 16]} />
          <meshStandardMaterial color="#707c90" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {hasRelic && (
        <group ref={relicCrownRef} position={[0, 2.15, 0]}>
          <mesh>
            <octahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial
              color="#e5a93b"
              emissive="#946317"
              emissiveIntensity={1.2}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          <pointLight color="#e5a93b" intensity={1.5} distance={4} />
        </group>
      )}
    </group>
  );
}
