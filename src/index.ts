import { Screen } from "./screen";
import { ScreenSize } from "./screenSize";
import { Particles } from "./particles";
import { ParticleRenderer } from "./particleRenderer";
import { TextureLoader } from "./textureLoader";

import "./styles.css";
import "reset-css";
import { createGravityRectParticleBuilder } from "./gravityRectParticleBuilder";
import { createFadeInParticleBuilder } from "./fadeInParticleBuilder";
import { GravitySource } from "./gravitySource";
import { createMovementParticleModifier } from "./movementParticleModifier";
import { createInBoundParticleRecreator } from "./inBoundParticleRecreator";
import { ParticleUpdater } from "./particleUpdater";
import { ElementAnimation } from "./elementAnimation";
import { RippleGenerator } from './rippleGenerator';

const canvasElement: HTMLCanvasElement = document.querySelector("#canvas");

async function bootstrap() {
  const screenSize = new ScreenSize(canvasElement);
  const screen = new Screen(canvasElement, screenSize);
  const gravitySource = new GravitySource({
    x: 0.75 * screenSize.width,
    y: 0.75 * screenSize.height,
    width: 100,
    height: 100
  });
  const textureLoader = new TextureLoader();
  const particleRenderer = new ParticleRenderer(canvasElement);

  textureLoader.registerTextures({
    particle: {
      url: require("./../assets/img/particle.png")
    }
  });

  const textures = await textureLoader.loadTextures();
  const elementAnimation = new ElementAnimation();
  const particles = new Particles(screenSize, textures["particle"].image, [
    createGravityRectParticleBuilder({
      gravitySource
    }),
    createFadeInParticleBuilder({
      elementAnimation
    })
  ]);
  const rippleGenerator = new RippleGenerator(
    {
      duration: 600,
      easingFunc: 'quadIn',
      waveLength: 20,
    },
    particles,
    gravitySource,
    screenSize,
    elementAnimation,
  );
  const particleUpdater = new ParticleUpdater(
    [
      createMovementParticleModifier({ gravitySource }),
      createInBoundParticleRecreator({ screenSize, particles }),
      elementAnimation.createModifier()
    ],
    particles
  );

  particles.create(200);

  setTimeout(() => {
    rippleGenerator.trigger();
  }, 7000);

  (function loop() {
    // Setup Scene
    screen.prepareScene();

    // Update entities
    particleUpdater.update();
    rippleGenerator.update();

    // Render
    particleRenderer.render(particles.particles);

    // Continue Loop...
    requestAnimationFrame(loop);
  })();
}

bootstrap();
