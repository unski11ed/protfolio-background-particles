"use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}var EventEmitter=_interopDefault(require("eventemitter3")),FpsThrottler=_interopDefault(require("fps-throttler")),lodash=require("lodash"),eases=require("eases"),eases__default=_interopDefault(eases),extendStatics=function(t,e){return(extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)};function __extends(t,e){function i(){this.constructor=t}extendStatics(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}var __assign=function(){return(__assign=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var r in e=arguments[i])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};function __awaiter(t,e,i,n){return new(i||(i=Promise))(function(r,a){function o(t){try{c(n.next(t))}catch(t){a(t)}}function s(t){try{c(n.throw(t))}catch(t){a(t)}}function c(t){t.done?r(t.value):new i(function(e){e(t.value)}).then(o,s)}c((n=n.apply(t,e||[])).next())})}function __generator(t,e){var i,n,r,a,o={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(a){return function(s){return function(a){if(i)throw new TypeError("Generator is already executing.");for(;o;)try{if(i=1,n&&(r=2&a[0]?n.return:a[0]?n.throw||((r=n.return)&&r.call(n),0):n.next)&&!(r=r.call(n,a[1])).done)return r;switch(n=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return o.label++,{value:a[1],done:!1};case 5:o.label++,n=a[1],a=[0];continue;case 7:a=o.ops.pop(),o.trys.pop();continue;default:if(!(r=(r=o.trys).length>0&&r[r.length-1])&&(6===a[0]||2===a[0])){o=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){o.label=a[1];break}if(6===a[0]&&o.label<r[1]){o.label=r[1],r=a;break}if(r&&o.label<r[2]){o.label=r[2],o.ops.push(a);break}r[2]&&o.ops.pop(),o.trys.pop();continue}a=e.call(t,o)}catch(t){a=[6,t],n=0}finally{i=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,s])}}}var ElementType,Screen=function(){function t(t,e){var i=this;this.canvasElement=t,this.screenSize=e,this.events=new EventEmitter,this.handleCanvasResize=function(){var t=i.canvasElement.getBoundingClientRect();i.canvasElement.width=t.width,i.canvasElement.height=t.height,i.events.emit("screenResized")},this.canvasContext=t.getContext("2d"),"undefined"!=typeof window&&window.addEventListener("resize",this.handleCanvasResize),this.handleCanvasResize()}return t.prototype.prepareScene=function(){this.canvasContext.fillStyle="#000",this.canvasContext.fillRect(0,0,this.screenSize.width,this.screenSize.height)},t.prototype.destroy=function(){"undefined"!=typeof window&&window.removeEventListener("resize",this.handleCanvasResize)},t}(),ScreenSize=function(){function t(t){this.canvasElement=t}return Object.defineProperty(t.prototype,"width",{get:function(){return this.canvasElement.width},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"height",{get:function(){return this.canvasElement.height},enumerable:!0,configurable:!0}),t}();!function(t){t.Particle="element--particle",t.Ripple="element--ripple"}(ElementType||(ElementType={}));var Particle=function(t,e,i){void 0===i&&(i=.1),this.x=t,this.y=e,this.speed=i,this.type=ElementType.Particle,this.size=1,this.opacity=.5,this.vX=0,this.vY=0},Particles=function(){function t(t,e){this.screenSize=t,this.particleBuilders=e,this.particles=[]}return t.prototype.create=function(t){void 0===t&&(t=1);for(var e=0;e<t;e++){for(var i=new Particle(Math.random()*this.screenSize.width,Math.random()*this.screenSize.height),n=0,r=this.particleBuilders;n<r.length;n++){r[n].build(i)}this.particles.push(i)}},t.prototype.destroy=function(t){var e=this.particles.indexOf(t);this.particles.splice(e,1)},t}(),RendererBase=function(t){this.canvasElement=t,this.canvasContext=t.getContext("2d")};function drawCircle(t,e){t.beginPath(),t.fillStyle=e.color,t.arc(e.x,e.y,e.radius<0?0:e.radius,0,2*Math.PI),t.fill()}function distance(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function rippleLength(t,e){var i=e.x>t.width/2?e.x:t.width-e.x,n=e.y>t.height/2?e.y:t.height-e.y;return Math.sqrt(Math.pow(i,2)+Math.pow(n,2))}function createDebouncer(t){void 0===t&&(t=100);return function(e){clearTimeout(0),setTimeout(e,t)}}var merge=function(t,e){for(var i=0,n=Object.keys(e);i<n.length;i++){var r=n[i];e[r]instanceof Object&&Object.assign(e[r],merge(t[r],e[r]))}return Object.assign(t||{},e),t},PARTICLE_COLOR="#fff",ParticleRenderer=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return __extends(e,t),e.prototype.render=function(t){for(var e=0,i=t;e<i.length;e++){var n=i[e],r=this.canvasContext.globalAlpha;this.canvasContext.globalAlpha=n.opacity,drawCircle(this.canvasContext,{color:PARTICLE_COLOR,x:n.x,y:n.y,radius:n.size/2}),this.canvasContext.globalAlpha=r}},e}(RendererBase),GravityRectParticleBuilder=function(){function t(t){this.gravitySource=t}return t.prototype.build=function(t){var e=this.gravitySource.generatePointWithinRegion(),i=Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2));t.vX=(t.x-e.x)/i,t.vY=(t.y-e.y)/i},t}(),FadeInParticleBuilder=function(){function t(t,e){void 0===e&&(e={}),this.propertyAnimation=t,this.options={spawnAnimationEasing:"cubicOut",spawnAnimationDuration:300,minSize:1,maxSize:4,minOpacity:.01,maxOpacity:.7,minSpeed:.001,maxSpeed:.1},Object.assign(this.options,e)}return t.prototype.build=function(t){var e=lodash.random(this.options.minOpacity,this.options.maxOpacity,!0),i=lodash.random(this.options.minSize,this.options.maxSize);t.speed=lodash.random(this.options.minSpeed,this.options.maxSpeed,!0),this.propertyAnimation.animate(t,{opacity:[0,e],size:[0,i]},{functionName:this.options.spawnAnimationEasing,duration:this.options.spawnAnimationDuration})},t}(),GravitySource=function(){function t(t){this.gravityRegion=t}return Object.defineProperty(t.prototype,"region",{get:function(){return this.gravityRegion},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"center",{get:function(){return{x:this.region.x+this.region.width/2,y:this.region.y+this.region.height/2}},enumerable:!0,configurable:!0}),t.prototype.setRegion=function(t){this.gravityRegion=t},t.prototype.generatePointWithinRegion=function(){return{x:this.gravityRegion.x+Math.random()*this.gravityRegion.width,y:this.gravityRegion.y+Math.random()*this.gravityRegion.height}},t}(),createMovementParticleModifier=function(t){return function(t,e){t.x-=t.vX*t.speed,t.y-=t.vY*t.speed}},createInBoundParticleRecreator=function(t){return function(e,i){var n=t.bounds,r=t.particles;(e.x>n.width||e.x<0||e.y>n.height||e.y<0)&&(r.destroy(e),r.create(1))}},createParticleToGravityModifier=function(t){return function(e,i){var n=__assign({minOpacity:.1,maxOpacity:.9,easing:"cubicIn"},t.particleConfig),r=t.gravitySource,a=t.screenSize,o=distance(e,r.center),s=rippleLength(a,r.center),c=(s-o)/s,p=n.minOpacity+eases__default[n.easing](c)*(n.maxOpacity-n.minOpacity);e.opacity=p}},ParticleUpdater=function(){function t(t,e){this.modifiers=t,this.particles=e}return t.prototype.update=function(t){for(var e=0,i=this.particles.particles;e<i.length;e++)for(var n=i[e],r=0,a=this.modifiers;r<a.length;r++){(0,a[r])(n,t)}},t}(),DefaultAnimationOptions={duration:200,functionName:"linear"},PropertyAnimation=function(){function t(){this.animationStates=[]}return t.prototype.animate=function(t,e,i){var n=this;void 0===i&&(i={});var r=__assign({},DefaultAnimationOptions,i);if("function"!=typeof eases[r.functionName])throw Error("Provided easing function name "+r.functionName+" is not recognized.");return new Promise(function(i){var a={element:t,startTime:Date.now(),params:e,options:r,finishResolver:i};n.animationStates.push(a)})},t.prototype.finishAnimation=function(t){var e=this.animationStates.find(function(e){return e.element===t});if(e){for(var i=0,n=Object.keys(e.params);i<n.length;i++){var r=n[i];t[r]=e.params[r][1]}var a=this.animationStates.indexOf(e);this.animationStates.splice(a,1),e.finishResolver(e.element)}},t.prototype.update=function(t){for(var e=0,i=this.animationStates;e<i.length;e++){var n=i[e],r=n.element,a=n.startTime,o=n.params,s=n.options;n.finishResolver;if(t>=a+s.duration)this.finishAnimation(r);else for(var c=0,p=Object.keys(o);c<p.length;c++){var h=p[c],l=o[h],u=l[0],f=l[1],d=(t-a)/s.duration,g=u+eases[s.functionName](d)*(f-u);r[h]=g}}},t}(),RippleGenerator=function(){function t(t,e,i,n){this.particles=e,this.screenSize=i,this.propertyAnimation=n,this.startTime=0,this.rippleOrigin={x:0,y:0},this.animatedParticles=[],this.params={rippleAnimationDuration:1e3,rippleAnimationEasing:"cubicOut",particleAnimationDuration:75,particleAnimationEasing:"cubicOut",targetParticleOpacity:.8,targetParticleSize:4},Object.assign(this.params,t)}return t.prototype.trigger=function(t){this.startTime=Date.now(),this.rippleOrigin=t,this.animatedParticles.length=0;for(var e=0,i=this.particles.particles;e<i.length;e++){var n=i[e];this.propertyAnimation.finishAnimation(n)}},t.prototype.update=function(t){var e=this,i=this.params,n=i.rippleAnimationDuration,r=i.rippleAnimationEasing,a=i.particleAnimationDuration,o=i.particleAnimationEasing,s=i.targetParticleOpacity,c=i.targetParticleSize;if(this.startTime+n>t){var p=(t-this.startTime)/n,h=eases__default[r](p)*rippleLength(this.screenSize,this.rippleOrigin);this.particles.particles.forEach(function(t){return __awaiter(e,void 0,void 0,function(){var e,i,n;return __generator(this,function(r){switch(r.label){case 0:return this.animatedParticles.indexOf(t)<0&&distance(t,this.rippleOrigin)<=h?(e=t.opacity,i=t.size,n={duration:a,easing:o},this.animatedParticles.push(t),[4,this.propertyAnimation.animate(t,{opacity:[t.opacity,s],size:[t.size,c]},n)]):[3,2];case 1:r.sent(),this.propertyAnimation.animate(t,{opacity:[t.opacity,e],size:[t.size,i]},n),r.label=2;case 2:return[2]}})})})}},t}(),RippleTexture=function(){function t(t,e,i){this.params=t,this.screenSize=e,this.gravitySource=i,this.type=ElementType.Ripple,this.x=0,this.y=0,this.canvasElement=null,this.canvasContext=null,this.startTime=0,this.originPoint={x:0,y:0},this.nextColor="#fff",this.animationInProgress=!1,"undefined"!=typeof document&&(this.canvasElement=document.createElement("canvas"),this.updateSize(),this.canvasContext=this.canvasElement.getContext("2d"),this.currentColor=t.initialColor,this.fillTexture({color:this.currentColor}))}return Object.defineProperty(t.prototype,"texture",{get:function(){return this.canvasElement},enumerable:!0,configurable:!0}),t.prototype.updateSize=function(){this.canvasElement.width=this.screenSize.width,this.canvasElement.height=this.screenSize.height},t.prototype.trigger=function(t,e){this.startTime=Date.now(),this.animationInProgress=!0,this.currentColor=this.nextColor,this.nextColor=t,this.originPoint=e},t.prototype.update=function(t){var e=this.params,i=e.duration,n=e.easingFunc;if(this.animationInProgress)if(this.startTime+i>t){var r=(t-this.startTime)/i,a=eases__default[n](r)*rippleLength(this.screenSize,this.originPoint);this.generateTexture(a)}else this.fillTexture({color:this.nextColor}),this.animationInProgress=!1},t.prototype.fillTexture=function(t){this.canvasContext.fillStyle=t.color,this.canvasContext.fillRect(0,0,this.screenSize.width,this.screenSize.height)},t.prototype.generateTexture=function(t){var e=this.params.waveLength;this.fillTexture({color:this.currentColor});var i=e/2,n=this.canvasContext.createRadialGradient(this.originPoint.x,this.originPoint.y,t-i<0?0:t-i,this.originPoint.x,this.originPoint.y,t+e);n.addColorStop(0,this.nextColor),n.addColorStop(.2,"#fff"),n.addColorStop(.8,"#fff"),n.addColorStop(1,this.currentColor),drawCircle(this.canvasContext,__assign({},this.originPoint,{radius:t+i,color:n}))},t}(),RippleRenderer=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return __extends(e,t),e.prototype.render=function(t){var e=this.canvasContext.globalCompositeOperation;this.canvasContext.globalCompositeOperation="multiply",this.canvasContext.drawImage(t.texture,t.x,t.y),this.canvasContext.globalCompositeOperation=e},e}(RendererBase),defaultConfig={gravitySourceRect:{x:.75,y:.75,width:100,height:100},particleConfig:{minSize:1,maxSize:4,minOpacity:.1,maxOpacity:.9,minSpeed:.001,maxSpeed:.1,gravityOpacityFunc:"cubicOut"},rippleConfig:{rippleAnimationDuration:1e3,rippleAnimationEasing:"cubicOut",waveLength:300},initialColor:"hotpink",fpsLimit:30},default_1=function(){function t(t,e){var i=this;this.events=new EventEmitter;var n=this.options=merge(defaultConfig,e),r=this.screenSize=new ScreenSize(t),a=this.screen=new Screen(t,r);this.particleRenderer=new ParticleRenderer(t),this.rippleRenderer=new RippleRenderer(t);var o=this.propertyAnimation=new PropertyAnimation,s=this.gravitySource=new GravitySource(__assign({},n.gravitySourceRect,{x:n.gravitySourceRect.x*r.width,y:n.gravitySourceRect.x*r.height})),c=new GravityRectParticleBuilder(s),p=new FadeInParticleBuilder(o,n.particleConfig),h=this.particles=new Particles(r,[c,p]),l=createMovementParticleModifier(),u=createInBoundParticleRecreator({bounds:r,particles:h}),f=createParticleToGravityModifier({screenSize:r,gravitySource:s,particleConfig:e.particleConfig});this.particleUpdater=new ParticleUpdater([l,u,f],h),this.rippleGenerator=new RippleGenerator(n.rippleConfig,h,r,o),this.rippleTexture=new RippleTexture({duration:n.rippleConfig.rippleAnimationDuration,easingFunc:n.rippleConfig.rippleAnimationEasing,waveLength:n.rippleConfig.waveLength,initialColor:n.initialColor},r,s),this.fpsThrottler=new FpsThrottler(this.loop.bind(this),e.fpsLimit);var d=createDebouncer(300);a.events.on("screenResized",function(){d(i.reset.bind(i))}),this.fpsThrottler.start()}return t.prototype.createParticles=function(t){this.particles.create(t)},t.prototype.trigger=function(t,e){this.rippleGenerator.trigger(t),this.rippleTexture.trigger(e,t)},t.prototype.destroy=function(){this.fpsThrottler.stop(),this.screen.destroy()},t.prototype.reset=function(){this.rippleTexture.updateSize(),this.gravitySource.setRegion(__assign({},this.options.gravitySourceRect,{x:this.options.gravitySourceRect.x*this.screenSize.width,y:this.options.gravitySourceRect.x*this.screenSize.height}));for(var t=0,e=this.particles.particles;t<e.length;t++){var i=e[t];this.particles.destroy(i)}this.events.emit("reset")},t.prototype.loop=function(){var t=Date.now();this.screen.prepareScene(),this.particleUpdater.update(t),this.rippleTexture.update(t),this.rippleGenerator.update(t),this.propertyAnimation.update(t),this.particleRenderer.render(this.particles.particles),this.rippleRenderer.render(this.rippleTexture)},t}();module.exports=default_1;