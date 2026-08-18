import type { MovementVector, Position } from '../core';

export interface DemoLevelConfig {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly startPosition: Position;
  readonly movementVectors: readonly MovementVector[];
}

/** Replace or remove this data together with the disposable smoke demo. */
export const SMOKE_DEMO_LEVEL: DemoLevelConfig = {
  id: 'template-smoke-demo',
  width: 640,
  height: 360,
  startPosition: { x: 280, y: 140 },
  movementVectors: [
    { x: 80, y: 0 },
    { x: -80, y: 0 },
    { x: 0, y: 80 },
    { x: 0, y: -80 },
  ],
};
