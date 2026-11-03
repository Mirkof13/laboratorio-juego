import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';

export default function Marcador({
  deaths = 0,
  hasRelic = false,
  isNearRelic = false,
  isWon = false,
  onRestart,
  showTouchControls = false,
  onToggleTouchControls,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.startBGM();
    }
  };

  const handleRestartClick = () => {
    setSeconds(0);
    if (onRestart) onRestart();
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="marcador-overlay">
      <header className="hud-topbar">
        <div className="hud-card death-card">
          <div className="hud-card-tag">MUERTES</div>
          <div className="hud-card-value death-val">{deaths}</div>
        </div>

        <div className={`hud-card relic-card ${hasRelic ? 'relic-ok' : 'relic-pending'}`}>
          <div className="hud-card-tag">PORTON DEL CASTILLO</div>
          <div className="hud-card-value">
            {hasRelic ? 'DESBLOQUEADO' : 'BLOQUEADO [REQUIERE CUBO]'}
          </div>
        </div>

        <div className="hud-card timer-card">
          <div className="hud-card-tag">TIEMPO</div>
          <div className="hud-card-value">{formatTime(seconds)}</div>
        </div>

        <div className="hud-buttons-row">
          <button
            className="hud-sys-btn"
            onClick={handleToggleSound}
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}
          </button>
          <button
            className={`hud-sys-btn ${showTouchControls ? 'active' : ''}`}
            onClick={onToggleTouchControls}
            title="Alternar controles tactiles"
          >
            {showTouchControls ? 'PAD: ON' : 'PAD: OFF'}
          </button>
        </div>
      </header>

      <aside className="hud-objectives-box">
        <div className="objectives-header">OBJETIVOS DE MISION</div>
        <ul className="objectives-list">
          <li className="objective-item ok">
            <span className="badge-status">[OK]</span> Punto A: Santuario de origen
          </li>
          <li className={`objective-item ${hasRelic ? 'ok' : 'current'}`}>
            <span className="badge-status">{hasRelic ? '[OK]' : '[ACTUAL]'}</span>
            Subir la cuesta y recuperar el Cubo de Alma
          </li>
          <li className={`objective-item ${hasRelic && !isWon ? 'current' : ''}`}>
            <span className="badge-status">{isWon ? '[OK]' : hasRelic ? '[ACTUAL]' : '[BLOQ]'}</span>
            Cruzar el porton hacia el Castillo (Punto B)
          </li>
        </ul>
      </aside>

      {isNearRelic && !hasRelic && (
        <div className="interactive-prompt">
          <div className="prompt-header">PUZZLE DE LA CUESTA</div>
          <div className="prompt-action">PRESIONA [E] PARA TOMAR EL CUBO DE ALMA</div>
          <div className="prompt-sub">Desbloqueara el porton principal hacia el Castillo</div>
        </div>
      )}

      {isWon && (
        <div className="victory-screen">
          <div className="victory-content">
            <div className="victory-subtitle">OBJETIVO CUMPLIDO</div>
            <h1 className="victory-title">VICTORIA</h1>
            <p className="victory-text">
              Has superado el laberinto, resuelto el puzzle y alcanzado el Castillo del Trono.
            </p>

            <div className="victory-stats">
              <div className="v-stat">
                <span className="v-label">MUERTES</span>
                <span className="v-value">{deaths}</span>
              </div>
              <div className="v-divider" />
              <div className="v-stat">
                <span className="v-label">TIEMPO</span>
                <span className="v-value">{formatTime(seconds)}</span>
              </div>
              <div className="v-divider" />
              <div className="v-stat">
                <span className="v-label">META</span>
                <span className="v-value">PUNTO B</span>
              </div>
            </div>

            <button className="victory-btn" onClick={handleRestartClick}>
              REINICIAR PARTIDA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
