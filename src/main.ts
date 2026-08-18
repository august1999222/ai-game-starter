import Phaser from 'phaser';

import { SMOKE_DEMO_RULES, SMOKE_DEMO_VIEW } from './config/gameConfig';
import { SmokeDemoScene } from './game/scenes/SmokeDemoScene';
import { createWebUi } from './platform';
import './styles.css';

const ui = createWebUi();
const demoScene = new SmokeDemoScene({ onStateChange: ui.showState });

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-canvas-root',
  width: SMOKE_DEMO_RULES.boardWidth,
  height: SMOKE_DEMO_RULES.boardHeight,
  backgroundColor: SMOKE_DEMO_VIEW.backgroundColor,
  scene: demoScene,
  callbacks: {
    postBoot(bootedGame) {
      ui.identifyCanvas(bootedGame.canvas);
    },
  },
  input: {
    activePointers: 2,
  },
  render: {
    antialias: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});

ui.bindRestart(() => demoScene.restartDemo());
