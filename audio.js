export class AudioSystem{
 constructor(){this.ctx=null;this.osc=null;this.gain=null;this.master=.15;}
 unlock(){if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.gain=this.ctx.createGain();this.gain.gain.value=this.master;this.gain.connect(this.ctx.destination);}if(this.ctx.state==='suspended')this.ctx.resume();}
 horn(on){if(!this.ctx)return;if(on&&!this.osc){this.osc=this.ctx.createOscillator();const g=this.ctx.createGain();this.osc.type='sawtooth';this.osc.frequency.value=220;g.gain.value=.09;this.osc.connect(g);g.connect(this.gain);this.osc.start();this.hornGain=g;}else if(!on&&this.osc){try{this.osc.stop()}catch{}this.osc.disconnect();this.osc=null;}}
 pause(){if(this.ctx&&this.ctx.state==='running')this.ctx.suspend()}resume(){if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume()}
}
