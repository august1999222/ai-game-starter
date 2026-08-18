import { describe, expect, it } from 'vitest';

import { SMOKE_DEMO_RULES } from '../../src/config/gameConfig';
import { createInitialGameState, reduceGameState } from '../../src/core';

describe('smoke demo session', () => {
  it('can play several moves and start the exact same session again', () => {
    const initial = createInitialGameState(SMOKE_DEMO_RULES);
    let firstRun = initial;

    for (let index = 0; index < 8; index += 1) {
      firstRun = reduceGameState(firstRun, { type: 'move' }, SMOKE_DEMO_RULES);
    }

    let replay = reduceGameState(firstRun, { type: 'restart' }, SMOKE_DEMO_RULES);

    for (let index = 0; index < 8; index += 1) {
      replay = reduceGameState(replay, { type: 'move' }, SMOKE_DEMO_RULES);
    }

    expect(replay).toEqual(firstRun);
    expect(firstRun.score).toBe(8 * SMOKE_DEMO_RULES.scorePerMove);
  });
});
