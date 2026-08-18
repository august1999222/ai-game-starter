import { describe, expect, it } from 'vitest';

import { createRandomState, nextRandomFloat, nextRandomInt } from '../../src/core/random';

function takeFloats(seed: number | string, count: number): number[] {
  let state = createRandomState(seed);
  const values: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const result = nextRandomFloat(state);
    values.push(result.value);
    state = result.state;
  }

  return values;
}

describe('deterministic random generator', () => {
  it('returns the same sequence for the same numeric seed', () => {
    expect(takeFloats(42, 6)).toEqual(takeFloats(42, 6));
  });

  it('keeps the documented sequence stable and separates different seeds', () => {
    expect(takeFloats(42, 6)).toEqual([
      0.6011037519201636, 0.44829055899754167, 0.8524657934904099, 0.6697340414393693,
      0.17481389874592423, 0.5265925421845168,
    ]);
    expect(takeFloats(42, 6)).not.toEqual(takeFloats(43, 6));
  });

  it('returns the same sequence for the same text seed', () => {
    expect(takeFloats('repeatable-session', 6)).toEqual(
      takeFloats('repeatable-session', 6),
    );
  });

  it('keeps integer values inside the requested range', () => {
    let state = createRandomState(2026);

    for (let index = 0; index < 100; index += 1) {
      const result = nextRandomInt(state, 4);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThan(4);
      state = result.state;
    }
  });

  it('rejects invalid seeds and integer ranges', () => {
    expect(() => createRandomState(Number.NaN)).toThrow(RangeError);
    expect(() => nextRandomInt(createRandomState(1), 0)).toThrow(RangeError);
  });
});
