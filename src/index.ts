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
  const particleUpdater = new ParticleUpdater(
    [
      createMovementParticleModifier(),
      createInBoundParticleRecreator({ screenSize, particles }),
      elementAnimation.createModifier()
    ],
    particles
  );

  particles.create(200);

  (function loop() {
    // Setup Scene
    screen.prepareScene();

    // Update entities
    particleUpdater.update();

    // Render
    particleRenderer.render(particles.particles);

    // Continue Loop...
    requestAnimationFrame(loop);
  })();
}

bootstrap();

/*
// Consts
const BACKGROUND_COLOR = "#000";
const PARTICLES_COUNT = 10;

const MIN_SPEED = 0.1;
const MAX_SPEED = 0.5;

// Variables / Getters
const canvasElement: HTMLCanvasElement = document.querySelector("#canvas");
const ctx = canvasElement.getContext("2d");
const getScreenWidth = () => canvasElement.width;
const getScreenHeight = () => canvasElement.height;
const galaxyCenterX = getScreenWidth() * 0.7;
const galaxyCenterY = getScreenHeight() * 0.7;
const particles: Particle[] | null = null;

// Types
interface Particle {
  x: number;
  y: number;
  direction: {
    x: number;
    y: number;
  };
  speed: number;
}

// Funcs
function clearScreen() {
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, getScreenWidth(), getScreenHeight());
  ctx.drawImage();
}

function generateParticles(count: number) {
  for (let i = 0; i < count; i++) {
    const x = getScreenWidth() * Math.random();
    const y = getScreenHeight() * Math.random();
    const speed = MAX_SPEED * Math.random() + MIN_SPEED;
    const direction = {
      x: galaxyCenterX - x,
      y: galaxyCenterY - y
    };

    particles.push({
      x,
      y,
      direction,
      speed
    });
  }
}

function updateParticle(particle: Particle) {
  // if any particle died - generate anouther one
  //
}

// Event Handlers
const resizeCanvasHandler = () => {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
};

// Register Event Listeners
window.addEventListener("resize", resizeCanvasHandler);

// Loop
function update(ts: number) {
  ctx.fillStyle = "#fff";
  ctx.fillText(ts.toString(), 0, 50);
}

// Bootstrap
resizeCanvasHandler();
generateParticles(PARTICLES_COUNT);

const loop = () => {
  clearScreen();

  update(Date.now());

  window.requestAnimationFrame(loop);
};
loop();
*/
