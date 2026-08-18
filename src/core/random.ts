/** A seed accepted by the deterministic random number generator. */
export type RandomSeed = number | string;

/**
 * The complete state of the generator. Keep and pass this value to the next
 * call instead of using ambient randomness.
 */
export type RandomState = number;

export interface RandomResult<T> {
  readonly value: T;
  readonly state: RandomState;
}

const UINT32_RANGE = 4_294_967_296;
const MULBERRY32_INCREMENT = 0x6d2b79f5;
const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

/** Converts numeric or text seeds into a stable unsigned 32-bit state. */
export function createRandomState(seed: RandomSeed): RandomState {
  if (typeof seed === 'number') {
    if (!Number.isFinite(seed)) {
      throw new RangeError('Random seeds must be finite numbers.');
    }

    return Math.trunc(seed) >>> 0;
  }

  let hash = FNV_OFFSET_BASIS;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME);
  }

  return hash >>> 0;
}

/**
 * Returns the next float in [0, 1) and the next generator state.
 *
 * This is a pure Mulberry32 step: it never reads or mutates global state.
 */
export function nextRandomFloat(state: RandomState): RandomResult<number> {
  const nextState = (state + MULBERRY32_INCREMENT) >>> 0;
  let mixed = nextState;

  mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
  mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);

  const value = ((mixed ^ (mixed >>> 14)) >>> 0) / UINT32_RANGE;

  return { value, state: nextState };
}

/** Returns a deterministic integer in [0, maxExclusive). */
export function nextRandomInt(
  state: RandomState,
  maxExclusive: number,
): RandomResult<number> {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError('maxExclusive must be a positive safe integer.');
  }

  const result = nextRandomFloat(state);

  return {
    value: Math.floor(result.value * maxExclusive),
    state: result.state,
  };
}
