import * as THREE from 'three';
import { Train } from './train.js';
import { TrackGraph } from './trackGraph.js';
export class Game{
 constructor(root){this.root=root;this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x91a9b7);this.scene.fog=new THREE.Fog(0x91a9b7,100,650);this.camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,1200);this.camera.position.set(8,7,13);this.renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setSize(innerWidth,innerHeight);this.renderer.shadowMap.enabled=false;this.renderer.outputColorSpace=THREE.SRGBColorSpace;root.appendChild(this.renderer.domElement);this.clock=new THREE.Clock();this.paused=false;this.running=false;this.power=0;this.brake=3;this.speed=0;this.headlights=false;this.doorsOpen=false;this.cameraIndex=0;this.cameraName='SIDE FOLLOW';this.track=new TrackGraph();this.train=new Train(this.scene);this.menuTrain=null;this.buildWorld();addEventListener('resize',()=>this.resize());this.animate();}
 async init(){await new Promise(r=>setTimeout(r,350));this.setMenuScene('menu');}
 buildWorld(){const hemi=new THREE.HemisphereLight(0xdcecff,0x4d544b,2.0);this.scene.add(hemi);const sun=new THREE.DirectionalLight(0xffe2b4,2.2);sun.position.set(-40,70,30);this.scene.add(sun);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(1600,1600),new THREE.MeshStandardMaterial({color:0x536b4a,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.22;this.scene.add(ground);
 // parallel track beds and sleepers
 for(let lane=-1;lane<=1;lane++){const z=lane*5;const bed=new THREE.Mesh(new THREE.BoxGeometry(1000,.18,3.4),new THREE.MeshStandardMaterial({color:0x514e49}));bed.position.set(0,-.08,z);this.scene.add(bed);
 for(let x=-500;x<500;x+=2.4){const sleeper=new THREE.Mesh(new THREE.BoxGeometry(.28,.16,2.8),new THREE.MeshStandardMaterial({color:0x4b3c31}));sleeper.position.set(x,.02,z);this.scene.add(sleeper);}
 for(const side of [-.72,.72]){const rail=new THREE.Mesh(new THREE.BoxGeometry(1000,.13,.12),new THREE.MeshStandardMaterial({color:0x9ba7ad,metalness:.7,roughness:.35}));rail.position.set(0,.13,z+side);this.scene.add(rail);}
 }
 // catenary poles, crossarms and wires
 for(let x=-490;x<500;x+=24){for(const z of [-2.5,2.5]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,8,6),new THREE.MeshStandardMaterial({color:0x5b666b,metalness:.5}));pole.position.set(x,3.8,z);this.scene.add(pole);const arm=new THREE.Mesh(new THREE.BoxGeometry(5,.12,.12),new THREE.MeshStandardMaterial({color:0x6b777b}));arm.position.set(x,7.2,z*.2);this.scene.add(arm);}const wire=new THREE.Mesh(new THREE.BoxGeometry(24,.035,.035),new THREE.MeshStandardMaterial({color:0x333e43,metalness:.6}));wire.position.set(x+12,6.9,0);this.scene.add(wire);}
 // compact buildings and trees
 for(let i=0;i<105;i++){const x=(Math.random()-.5)*900,z=(Math.random()<.5?-1:1)*(14+Math.random()*80);if(Math.abs(x)<45&&Math.abs(z)<25)continue;const h=4+Math.random()*17,w=4+Math.random()*9;const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.56+Math.random()*.1,.14,.25+Math.random()*.25),roughness:.95}));b.position.set(x,h/2-0.2,z);this.scene.add(b);}
 for(let i=0;i<140;i++){const x=(Math.random()-.5)*850,z=(Math.random()<.5?-1:1)*(12+Math.random()*100);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.22,2,5),new THREE.MeshStandardMaterial({color:0x5b4532}));trunk.position.set(x,.8,z);this.scene.add(trunk);const crown=new THREE.Mesh(new THREE.ConeGeometry(1.8,4,6),new THREE.MeshStandardMaterial({color:0x315e43}));crown.position.set(x,3.5,z);this.scene.add(crown);}
 // station platform
 const platform=new THREE.Mesh(new THREE.BoxGeometry(90,.55,5),new THREE.MeshStandardMaterial({color:0x777f82}));platform.position.set(0,.02,8.8);this.scene.add(platform);const edge=new THREE.Mesh(new THREE.BoxGeometry(90,.07,.22),new THREE.MeshStandardMaterial({color:0xe8c35d}));edge.position.set(0,.33,6.25);this.scene.add(edge);
 for(let x=-38;x<=38;x+=12){const post=new THREE.Mesh(new THREE.BoxGeometry(.2,4,.2),new THREE.MeshStandardMaterial({color:0x6b7478}));post.position.set(x,2.2,10);this.scene.add(post);const roof=new THREE.Mesh(new THREE.BoxGeometry(12,.18,5),new THREE.MeshStandardMaterial({color:0x414b52}));roof.position.set(x,4.2,10);this.scene.add(roof);}
 const sign=new THREE.Mesh(new THREE.BoxGeometry(6,1.2,.15),new THREE.MeshStandardMaterial({color:0x102b35}));sign.position.set(-18,2,10);this.scene.add(sign);
 // signals
 for(const x of [-45,48]){const mast=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,5,6),new THREE.MeshStandardMaterial({color:0x353b3f}));mast.position.set(x,2.5,-3);this.scene.add(mast);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),new THREE.MeshStandardMaterial({color:x<0?0x35d681:0xe2a33d,emissive:x<0?0x16894d:0x87521b,emissiveIntensity:1}));lamp.position.set(x,4.5,-3);this.scene.add(lamp);}
 }
 showPreview(name){this.running=false;this.train.build(name,'blue',12);this.track.distance=this.track.length*0.52;this.train.setTrackDistance(this.track.distance);this.cameraName='PREVIEW';}
 setLivery(color){this.train.setLivery(color);}
 start(name,route,livery){this.train.build(name,livery,12);this.track.setRoute(route);this.track.distance=this.track.length*0.52;this.train.setTrackDistance(this.track.distance);this.speed=0;this.power=0;this.brake=3;this.running=true;this.paused=false;this.doorsOpen=false;this.cameraIndex=0;this.cameraName='SIDE FOLLOW';this.applyHeadlights();}
 stop(){this.running=false;this.speed=0;this.power=0;this.brake=3;}
 setPower(v){this.power=Math.max(0,Math.min(5,v));if(this.doorsOpen&&this.speed<.1)this.power=0;if(this.speed<.1&&this.brake>0&&this.power>0)this.brake=0;}
 setBrake(v){this.brake=Math.max(0,Math.min(5,v));if(this.brake>0)this.power=0;}
 toggleDoors(){if(this.speed>0.4)return false;this.doorsOpen=!this.doorsOpen;this.train.setDoors(this.doorsOpen);if(this.doorsOpen)this.brake=Math.max(3,this.brake);return true;}
 applyHeadlights(){this.train.setHeadlights(this.headlights);}
 nextCamera(){this.cameraIndex=(this.cameraIndex+1)%6;this.cameraName=['SIDE FOLLOW','DRIVER POV','FRONT EXTERIOR','REAR EXTERIOR','ROOF CAMERA','DRONE CAMERA'][this.cameraIndex];}
 setMenuScene(){this.running=false;this.camera.position.set(12,7,18);this.camera.lookAt(0,1,0);}
 resize(){this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);}
 animate(){requestAnimationFrame(()=>this.animate());const dt=Math.min(this.clock.getDelta(),.05);if(this.running&&!this.paused){const accel=this.power*0.42-this.brake*0.85-this.speed*.012;this.speed=Math.max(0,Math.min(25,this.speed+accel*dt));this.track.distance+=this.speed*dt;this.train.update(this.track,this.speed,dt,this.brake); }else if(!this.running){this.train.update(this.track,0,dt,0);}
 const target=this.train.getCameraTarget(this.cameraIndex);this.camera.position.lerp(target.position,Math.min(1,dt*2.5));this.camera.lookAt(target.lookAt);this.renderer.render(this.scene,this.camera);}
}
