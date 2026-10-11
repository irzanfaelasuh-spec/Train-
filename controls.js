export class Controls{constructor(game,onTick){this.game=game;this.onTick=onTick;this.last=performance.now();const tick=()=>{this.onTick?.();requestAnimationFrame(tick)};tick();}}
