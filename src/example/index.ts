import RippledParticles from './../lib';

const colors = [
    'hotpink',
    'yellow',
    'lightgreen'
];
let currentColorIndex = 0;

const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
const rippledParticles = new RippledParticles(canvasElement, {
    initialColor: colors[currentColorIndex]
});

rippledParticles.createParticles(200);

canvasElement.addEventListener('click', (e) => {
    currentColorIndex = (currentColorIndex + 1) % colors.length;

    rippledParticles.trigger(
        { x: e.offsetX, y: e.offsetY },
        colors[currentColorIndex]
    );
});