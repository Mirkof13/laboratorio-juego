import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Jugador from './components/Jugador';
import Obstaculo from './components/Obstaculo';
import Escenario from './components/Escenario';
import Marcador from './components/Marcador';
import TouchControls from './components/TouchControls';
import { sound } from './utils/audio';
import { MAP_CONFIG } from './utils/mapData';
import './App.css';

export default function App() {
  const [deaths, setDeaths] = useState(0);
  const [hasRelic, setHasRelic] = useState(false);
  const [isNearRelic, setIsNearRelic] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const [showTouchControls, setShowTouchControls] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
    return isMobileUA || (hasTouch && window.innerWidth < 1024);
  });

  const [touchDirection, setTouchDirection] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const obstaclesMapRef = useRef(new Map());
  const [obstaclesList, setObstaclesList] = useState([]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      sound.initContext();
      sound.startBGM();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handleObstaclePositionUpdate = useCallback((id, position, radius) => {
    obstaclesMapRef.current.set(id, { id, position, radius });
    setObstaclesList(Array.from(obstaclesMapRef.current.values()));
  }, []);

  const handlePlayerDeath = useCallback(() => {
    setDeaths((prev) => prev + 1);
  }, []);

  const handleCollectRelic = useCallback(() => {
    setHasRelic(true);
  }, []);

  const handleReachGoal = useCallback(() => {
    setIsWon(true);
  }, []);

  const handleRestart = useCallback(() => {
    setDeaths(0);
    setHasRelic(false);
    setIsNearRelic(false);
    setIsWon(false);
    setResetKey((prev) => prev + 1);
  }, []);

  const handleTouchDirectionChange = useCallback((dir, isPressed) => {
    setTouchDirection((prev) => ({ ...prev, [dir]: isPressed }));
  }, []);

  const handleTouchAction = useCallback(() => {
    if (isNearRelic && !hasRelic) {
      sound.playPickup();
      sound.playGate();
      setHasRelic(true);
    }
  }, [isNearRelic, hasRelic]);

  return (
    <div className="game-container">
      <Marcador
        deaths={deaths}
        hasRelic={hasRelic}
        isNearRelic={isNearRelic}
        isWon={isWon}
        onRestart={handleRestart}
        showTouchControls={showTouchControls}
        onToggleTouchControls={() => setShowTouchControls((prev) => !prev)}
      />

      {showTouchControls && (
        <TouchControls
          onDirectionChange={handleTouchDirectionChange}
          onAction={handleTouchAction}
          isNearRelic={isNearRelic}
          hasRelic={hasRelic}
        />
      )}

      <Canvas
        camera={{ position: [0, 14, 46], fov: 48 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#080b16']} />
        <Stars
          radius={85}
          depth={50}
          count={1200}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        <Escenario
          hasRelic={hasRelic}
          isNearRelic={isNearRelic}
        />

        <Obstaculo
          id={1}
          type="scytheTrap"
          initialPos={[0, 1.2, 28]}
          axis="x"
          range={2.1}
          speed={2.6}
          offset={0}
          radius={1.3}
          onPositionUpdate={handleObstaclePositionUpdate}
        />

        <Obstaculo
          id={2}
          type="pendulum"
          initialPos={[15.2, 1.2, 6]}
          axis="z"
          range={4.2}
          speed={1.8}
          offset={1.2}
          radius={1.4}
          onPositionUpdate={handleObstaclePositionUpdate}
        />

        <Obstaculo
          id={3}
          type="skullPatrol"
          initialPos={[-9.5, 1.6, -0.5]}
          axis="x"
          range={1.9}
          speed={2.2}
          offset={2.0}
          radius={1.35}
          onPositionUpdate={handleObstaclePositionUpdate}
        />

        <Obstaculo
          id={4}
          type="scytheTrap"
          initialPos={[-3.8, 1.2, -16]}
          axis="x"
          range={2.1}
          speed={2.9}
          offset={3.0}
          radius={1.35}
          onPositionUpdate={handleObstaclePositionUpdate}
        />

        <Obstaculo
          id={5}
          type="reaperBlade"
          initialPos={[-3.8, 1.3, -28]}
          axis="x"
          range={2.2}
          speed={2.7}
          offset={4.2}
          radius={1.35}
          onPositionUpdate={handleObstaclePositionUpdate}
        />

        <Jugador
          startPos={MAP_CONFIG.startPos}
          obstacles={obstaclesList}
          relicPos={MAP_CONFIG.relicPos}
          goalPos={MAP_CONFIG.goalPos}
          hasRelic={hasRelic}
          isWon={isWon}
          resetKey={resetKey}
          onDeath={handlePlayerDeath}
          onNearRelicChange={setIsNearRelic}
          onCollectRelic={handleCollectRelic}
          onReachGoal={handleReachGoal}
          touchDirection={touchDirection}
        />
      </Canvas>
    </div>
  );
}
