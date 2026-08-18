import type { GameRulesConfig } from '../core';
import { SMOKE_DEMO_LEVEL } from './levels';

export const SMOKE_DEMO_RULES: GameRulesConfig = {
  boardWidth: SMOKE_DEMO_LEVEL.width,
  boardHeight: SMOKE_DEMO_LEVEL.height,
  blockSize: 40,
  startPosition: SMOKE_DEMO_LEVEL.startPosition,
  movementVectors: SMOKE_DEMO_LEVEL.movementVectors,
  scorePerMove: 10,
  defaultSeed: 'reusable-game-template',
};

export const SMOKE_DEMO_VIEW = {
  backgroundColor: '#111827',
  blockColor: 0x67e8f9,
  blockBorderColor: 0xecfeff,
  blockBorderWidth: 3,
  moveAnimationDurationMs: 140,
} as const;
