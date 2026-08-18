import {
  createRandomState,
  nextRandomInt,
  type RandomSeed,
  type RandomState,
} from './random';

export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface MovementVector {
  readonly x: number;
  readonly y: number;
}

export interface GameRulesConfig {
  readonly boardWidth: number;
  readonly boardHeight: number;
  readonly blockSize: number;
  readonly startPosition: Position;
  readonly movementVectors: readonly MovementVector[];
  readonly scorePerMove: number;
  readonly defaultSeed: RandomSeed;
}

export interface GameState {
  readonly position: Position;
  readonly score: number;
  readonly moveCount: number;
  readonly seed: RandomState;
  readonly randomState: RandomState;
}

export type GameAction = { readonly type: 'move' } | { readonly type: 'restart' };

function isInsideBoard(position: Position, rules: GameRulesConfig): boolean {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x + rules.blockSize <= rules.boardWidth &&
    position.y + rules.blockSize <= rules.boardHeight
  );
}

function assertValidRules(rules: GameRulesConfig): void {
  if (
    rules.boardWidth <= 0 ||
    rules.boardHeight <= 0 ||
    rules.blockSize <= 0 ||
    rules.blockSize > rules.boardWidth ||
    rules.blockSize > rules.boardHeight
  ) {
    throw new RangeError('Board and block dimensions must be positive and compatible.');
  }

  if (!Number.isFinite(rules.scorePerMove)) {
    throw new RangeError('scorePerMove must be finite.');
  }

  if (rules.movementVectors.length === 0) {
    throw new RangeError('At least one movement vector is required.');
  }

  if (!isInsideBoard(rules.startPosition, rules)) {
    throw new RangeError('The starting position must fit inside the board.');
  }
}

/** Creates the complete, serializable state for a new session. */
export function createInitialGameState(
  rules: GameRulesConfig,
  seed: RandomSeed = rules.defaultSeed,
): GameState {
  assertValidRules(rules);
  const normalizedSeed = createRandomState(seed);

  return {
    position: { ...rules.startPosition },
    score: 0,
    moveCount: 0,
    seed: normalizedSeed,
    randomState: normalizedSeed,
  };
}

function move(state: GameState, rules: GameRulesConfig): GameState {
  const validDestinations = rules.movementVectors
    .map((vector) => ({
      x: state.position.x + vector.x,
      y: state.position.y + vector.y,
    }))
    .filter((position) => isInsideBoard(position, rules));

  if (validDestinations.length === 0) {
    return state;
  }

  const randomResult = nextRandomInt(state.randomState, validDestinations.length);
  const nextPosition = validDestinations[randomResult.value];

  if (nextPosition === undefined) {
    return state;
  }

  return {
    ...state,
    position: nextPosition,
    score: state.score + rules.scorePerMove,
    moveCount: state.moveCount + 1,
    randomState: randomResult.state,
  };
}

/**
 * Pure state transition. Given identical rules, state and action, it always
 * returns an identical result.
 */
export function reduceGameState(
  state: GameState,
  action: GameAction,
  rules: GameRulesConfig,
): GameState {
  if (action.type === 'restart') {
    return createInitialGameState(rules, state.seed);
  }

  return move(state, rules);
}
