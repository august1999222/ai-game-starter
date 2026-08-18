import { describe, expect, it } from 'vitest';

import {
  createInitialGameState,
  reduceGameState,
  type GameRulesConfig,
} from '../../src/core/gameState';

const rules: GameRulesConfig = {
  boardWidth: 100,
  boardHeight: 100,
  blockSize: 20,
  startPosition: { x: 40, y: 40 },
  movementVectors: [
    { x: 20, y: 0 },
    { x: -20, y: 0 },
    { x: 0, y: 20 },
    { x: 0, y: -20 },
  ],
  scorePerMove: 5,
  defaultSeed: 1234,
};

function playMoves(seed: number, moveCount: number) {
  let state = createInitialGameState(rules, seed);

  for (let index = 0; index < moveCount; index += 1) {
    state = reduceGameState(state, { type: 'move' }, rules);
  }

  return state;
}

describe('game state', () => {
  it('creates the configured initial state', () => {
    expect(createInitialGameState(rules)).toMatchObject({
      position: { x: 40, y: 40 },
      score: 0,
      moveCount: 0,
    });
  });

  it('moves within the board and awards the configured score', () => {
    const initial = createInitialGameState(rules);
    const moved = reduceGameState(initial, { type: 'move' }, rules);

    expect(moved.position).not.toEqual(initial.position);
    expect(moved.score).toBe(5);
    expect(moved.moveCount).toBe(1);
    expect(moved.position.x).toBeGreaterThanOrEqual(0);
    expect(moved.position.y).toBeGreaterThanOrEqual(0);
    expect(moved.position.x + rules.blockSize).toBeLessThanOrEqual(rules.boardWidth);
    expect(moved.position.y + rules.blockSize).toBeLessThanOrEqual(rules.boardHeight);
  });

  it('restarts score, position and random sequence with the session seed', () => {
    const initial = createInitialGameState(rules, 99);
    const moved = reduceGameState(initial, { type: 'move' }, rules);
    const restarted = reduceGameState(moved, { type: 'restart' }, rules);

    expect(restarted).toEqual(initial);
    expect(reduceGameState(restarted, { type: 'move' }, rules)).toEqual(moved);
  });

  it('produces identical state for the same seed and input sequence', () => {
    expect(playMoves(8675309, 20)).toEqual(playMoves(8675309, 20));
  });

  it('does not mutate the preceding state', () => {
    const initial = createInitialGameState(rules);
    const snapshot = structuredClone(initial);

    reduceGameState(initial, { type: 'move' }, rules);

    expect(initial).toEqual(snapshot);
  });
});
