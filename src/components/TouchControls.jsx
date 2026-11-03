import React from 'react';

export default function TouchControls({ onDirectionChange, onAction, isNearRelic, hasRelic }) {
  const handleTouchStart = (dir) => {
    if (onDirectionChange) onDirectionChange(dir, true);
  };

  const handleTouchEnd = (dir) => {
    if (onDirectionChange) onDirectionChange(dir, false);
  };

  return (
    <div className="touch-controls-container" aria-label="Controles tactiles">
      <div className="dpad-wrapper">
        <button
          className="dpad-btn dpad-up"
          onMouseDown={() => handleTouchStart('up')}
          onMouseUp={() => handleTouchEnd('up')}
          onTouchStart={(e) => { e.preventDefault(); handleTouchStart('up'); }}
          onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('up'); }}
          aria-label="Avanzar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-8 8h6v8h4v-8h6z" />
          </svg>
        </button>

        <div className="dpad-middle-row">
          <button
            className="dpad-btn dpad-left"
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
            onTouchStart={(e) => { e.preventDefault(); handleTouchStart('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('left'); }}
            aria-label="Izquierda"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 12l8-8v6h8v4h-8v6z" />
            </svg>
          </button>
          <div className="dpad-center-mark" />
          <button
            className="dpad-btn dpad-right"
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
            onTouchStart={(e) => { e.preventDefault(); handleTouchStart('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('right'); }}
            aria-label="Derecha"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 12l-8-8v6H4v4h8v6z" />
            </svg>
          </button>
        </div>

        <button
          className="dpad-btn dpad-down"
          onMouseDown={() => handleTouchStart('down')}
          onMouseUp={() => handleTouchEnd('down')}
          onTouchStart={(e) => { e.preventDefault(); handleTouchStart('down'); }}
          onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('down'); }}
          aria-label="Retroceder"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 20l8-8h-6V4h-4v8H4z" />
          </svg>
        </button>
      </div>

      <div className="action-buttons-wrapper">
        <button
          className={`action-btn ${isNearRelic && !hasRelic ? 'pulse-action' : ''}`}
          onClick={onAction}
          onTouchStart={(e) => { e.preventDefault(); onAction(); }}
          aria-label="Interactuar o Tomar Reliquia"
        >
          <span className="action-text-top">ACCION</span>
          <span className="action-text-sub">
            {isNearRelic && !hasRelic ? 'TOMAR [E]' : '[E]'}
          </span>
        </button>
      </div>
    </div>
  );
}
