export const MAP_CONFIG = {
  startPos: [0, 1.0, 34.0],
  goalPos: [0, 1.0, -47.0],
  relicPos: [-14.5, 3.6, -0.5],
  gateZ: -35.5,
};

export function checkWalkable(x, z, hasRelic = false) {
  if (x >= -3.4 && x <= 3.4 && z >= 19.5 && z <= 37.0) {
    return { valid: true, y: 1.0 };
  }

  if (x >= -3.4 && x <= 18.2 && z >= 14.5 && z <= 20.5) {
    return { valid: true, y: 1.0 };
  }

  if (x >= 12.0 && x <= 18.2 && z >= -3.5 && z <= 15.5) {
    return { valid: true, y: 1.0 };
  }

  if (x >= -7.8 && x <= 18.2 && z >= -3.5 && z <= 2.5) {
    return { valid: true, y: 1.0 };
  }

  if (x >= -17.5 && x <= -7.5 && z >= -3.8 && z <= 2.8) {
    const progress = Math.min(1.0, Math.max(0.0, (-x - 7.5) / 7.5));
    const elevatedY = 1.0 + progress * 2.6;
    return { valid: true, y: elevatedY };
  }

  if (x >= -7.2 && x <= -0.4 && z >= -35.5 && z <= -3.0) {
    return { valid: true, y: 1.0 };
  }

  if (hasRelic) {
    if (x >= -7.5 && x <= 7.5 && z >= -53.0 && z <= -35.0) {
      return { valid: true, y: 1.0 };
    }
  }

  return { valid: false, y: 1.0 };
}
