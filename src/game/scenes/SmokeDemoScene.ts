import Phaser from 'phaser';

import { SMOKE_DEMO_RULES, SMOKE_DEMO_VIEW } from '../../config/gameConfig';
import { createInitialGameState, reduceGameState, type GameState } from '../../core';

export interface SmokeDemoSceneOptions {
  readonly onStateChange: (state: GameState) => void;
}

export class SmokeDemoScene extends Phaser.Scene {
  private readonly onStateChange: (state: GameState) => void;

  private state = createInitialGameState(SMOKE_DEMO_RULES);

  private block: Phaser.GameObjects.Rectangle | undefined;

  public constructor(options: SmokeDemoSceneOptions) {
    super({ key: 'SmokeDemoScene' });
    this.onStateChange = options.onStateChange;
  }

  public create(): void {
    const { blockSize } = SMOKE_DEMO_RULES;

    this.block = this.add
      .rectangle(
        this.state.position.x + blockSize / 2,
        this.state.position.y + blockSize / 2,
        blockSize,
        blockSize,
        SMOKE_DEMO_VIEW.blockColor,
      )
      .setStrokeStyle(SMOKE_DEMO_VIEW.blockBorderWidth, SMOKE_DEMO_VIEW.blockBorderColor);

    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.handleMove, this);
    this.onStateChange(this.state);
  }

  public restartDemo(): void {
    this.state = reduceGameState(this.state, { type: 'restart' }, SMOKE_DEMO_RULES);
    this.renderState(false);
  }

  private handleMove(): void {
    this.state = reduceGameState(this.state, { type: 'move' }, SMOKE_DEMO_RULES);
    this.renderState(true);
  }

  private renderState(animate: boolean): void {
    const block = this.block;

    if (block !== undefined) {
      const { blockSize } = SMOKE_DEMO_RULES;
      const x = this.state.position.x + blockSize / 2;
      const y = this.state.position.y + blockSize / 2;

      this.tweens.killTweensOf(block);

      if (animate) {
        this.tweens.add({
          targets: block,
          x,
          y,
          duration: SMOKE_DEMO_VIEW.moveAnimationDurationMs,
          ease: 'Sine.Out',
        });
      } else {
        block.setPosition(x, y);
      }
    }

    this.onStateChange(this.state);
  }
}
