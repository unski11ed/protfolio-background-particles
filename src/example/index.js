import RippledParticles from './../lib';
var colors = [
    'rgba(171,71,188,0.4)',
    'rgba(41,182,246,0.4)',
    'rgba(118,255,3,0.4)'
];
var currentColorIndex = 0;
var gravity = {
    x: 0.75,
    y: 0.75,
    width: 100,
    height: 100,
};
var rippleConfig = {
    rippleAnimationDuration: 800,
};
var canvasElement = document.querySelector('#canvas');
var gravityShadowElement = document.querySelector('.gravity-shadow');
var rippledParticles = new RippledParticles(canvasElement, {
    gravitySourceRect: gravity,
    rippleConfig: rippleConfig,
    initialColor: colors[currentColorIndex],
});
rippledParticles.events.on('reset', function () {
    rippledParticles.createParticles(200);
});
rippledParticles.createParticles(200);
gravityShadowElement.style.width = gravity.width + "px";
gravityShadowElement.style.height = gravity.height + "px";
gravityShadowElement.style.left = gravity.x * 100 + "%";
gravityShadowElement.style.top = gravity.y * 100 + "%";
gravityShadowElement.style.setProperty('--gravity-color', colors[currentColorIndex]);
gravityShadowElement.style.transition =
    "background " + 1000 + "ms cubic-bezier(0.215, 0.610, 0.355, 1.000)" +
        (",box-shadow " + 1000 + "ms cubic-bezier(0.215, 0.610, 0.355, 1.000)");
setInterval(function () {
    var canvasRect = canvasElement.getBoundingClientRect();
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    var targetColor = colors[currentColorIndex];
    rippledParticles.trigger({
        x: gravity.x * canvasRect.width,
        y: gravity.y * canvasRect.height
    }, targetColor);
    gravityShadowElement.style.setProperty('--gravity-color', targetColor);
}, 5000);
