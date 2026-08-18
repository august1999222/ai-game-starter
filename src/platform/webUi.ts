import type { GameState } from '../core';

export interface WebUi {
  readonly showState: (state: GameState) => void;
  readonly bindRestart: (handler: () => void) => () => void;
  readonly identifyCanvas: (canvas: HTMLCanvasElement) => void;
}

function requireElement<T extends HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);

  if (element === null) {
    throw new Error(`Required page element was not found: ${selector}`);
  }

  return element;
}

/** Keeps DOM access at the web platform boundary. */
export function createWebUi(root: ParentNode = document): WebUi {
  const score = requireElement<HTMLOutputElement>(root, '[data-testid="score"]');
  const restartButton = requireElement<HTMLButtonElement>(
    root,
    '[data-testid="restart-button"]',
  );

  return {
    showState(state) {
      score.value = String(state.score);
      score.dataset.moveCount = String(state.moveCount);
      score.dataset.blockPosition = `${state.position.x},${state.position.y}`;
    },

    bindRestart(handler) {
      restartButton.addEventListener('click', handler);

      return () => restartButton.removeEventListener('click', handler);
    },

    identifyCanvas(canvas) {
      canvas.dataset.testid = 'game-canvas';
      canvas.setAttribute('aria-label', '可交互游戏画布');
    },
  };
}
