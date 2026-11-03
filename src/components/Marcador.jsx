import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
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

  useEffect(() => {
    if (isWon) {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00f0ff', '#ffd700', '#ff0055', '#7b2cbf'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00f0ff', '#ffd700', '#ff0055', '#7b2cbf'],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
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
        <div className="victory-modal-backdrop">
          <div className="victory-dialog">
            <div className="victory-status-badge">REINO DE LOS MUERTOS CONQUISTADO</div>
            <h1 className="victory-main-title">MISION COMPLETADA</h1>
            <p className="victory-main-desc">
              Has navegado el laberinto, resuelto el puzzle de la cuesta y alcanzado el Trono en el Punto B.
            </p>

            <div className="victory-summary-grid">
              <div className="summary-item">
                <span className="sum-label">Muertes Registradas</span>
                <span className="sum-val">{deaths}</span>
              </div>
              <div className="summary-item">
                <span className="sum-label">Tiempo Total</span>
                <span className="sum-val">{formatTime(seconds)}</span>
              </div>
              <div className="summary-item">
                <span className="sum-label">Destino Alcanzado</span>
                <span className="sum-val">Castillo (Punto B)</span>
              </div>
            </div>

            <button className="restart-action-btn" onClick={handleRestartClick}>
              REINICIAR PARTIDA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
