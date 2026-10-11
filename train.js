import * as THREE from 'three';
export class Train{
 constructor(scene){this.scene=scene;this.group=new THREE.Group();scene.add(this.group);this.cars=[];this.doorsOpen=false;this.lights=[];this.name='Metro EMU';this.livery='blue';this.build(this.name,this.livery,12);}
 build(name,livery,count=12){this.name=name;this.group.clear();this.cars=[];this.lights=[];this.livery=livery;const palette={blue:0x2f77a8,green:0x2e8b64,orange:0xe58b37,red:0xc84643,navy:0x263c66};const stripe=palette[livery]||palette.blue;
 const silver=new THREE.MeshStandardMaterial({color:0xb8c2c7,metalness:.58,roughness:.34}), dark=new THREE.MeshStandardMaterial({color:0x19232a,roughness:.5}), band=new THREE.MeshStandardMaterial({color:stripe,roughness:.45}), glass=new THREE.MeshStandardMaterial({color:0x142b3a,metalness:.25,roughness:.18}), white=new THREE.MeshStandardMaterial({color:0xf2f0e8});
 for(let i=0;i<count;i++){const car=new THREE.Group();car.userData.distance=-i*10.4;const body=new THREE.Mesh(new THREE.BoxGeometry(9.7,2.8,2.75),silver);body.position.y=2.25;car.add(body);
 const roof=new THREE.Mesh(new THREE.BoxGeometry(9.45,.18,2.65),dark);roof.position.y=3.72;car.add(roof);
 const stripeMesh=new THREE.Mesh(new THREE.BoxGeometry(9.74,.35,2.78),band);stripeMesh.position.y=1.95;car.add(stripeMesh);
 // windows on both sides and front/back
 for(let x=-4.05;x<=4.06;x+=1.05){for(const z of [-1.39,1.39]){const win=new THREE.Mesh(new THREE.BoxGeometry(.72,.78,.045),glass);win.position.set(x,2.75,z);car.add(win);}}
 for(const x of [-4.87,4.87]){const front=new THREE.Mesh(new THREE.BoxGeometry(.06,.95,1.35),glass);front.position.set(x,2.7,0);car.add(front);}
 // paired sliding doors, animated along X
 car.userData.doorPanels=[];for(const z of [-1.405,1.405]){for(const x of [-.35,.35]){const door=new THREE.Mesh(new THREE.BoxGeometry(.42,1.65,.055),silver);door.position.set(x,2.05,z);car.add(door);car.userData.doorPanels.push({mesh:door,baseX:x,side:Math.sign(z)});}}
 // bogies and wheels
 car.userData.wheels=[];for(const bx of [-3.2,3.2]){const bogie=new THREE.Mesh(new THREE.BoxGeometry(1.65,.35,1.8),dark);bogie.position.set(bx,.75,0);car.add(bogie);for(const wx of [-.48,.48])for(const z of [-.96,.96]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.18,12),dark);wheel.rotation.x=Math.PI/2;wheel.position.set(bx+wx,.52,z);car.add(wheel);car.userData.wheels.push(wheel);}}
 // underframe equipment
 const under=new THREE.Mesh(new THREE.BoxGeometry(6.4,.45,1.5),dark);under.position.y=1.05;car.add(under);
 // head/tail lamps
 if(i===0){for(const z of [-.85,.85]){const lamp=new THREE.PointLight(0xffe5ad,0,28);lamp.position.set(4.9,2.4,z);car.add(lamp);this.lights.push(lamp);const lens=new THREE.Mesh(new THREE.SphereGeometry(.12,8,8),white);lens.position.set(4.92,2.4,z);car.add(lens);}}
 car.position.z=0;this.group.add(car);this.cars.push(car);}
 this.setDoors(false);this.setHeadlights(false);}
 setLivery(color){this.livery=color;const palette={blue:0x2f77a8,green:0x2e8b64,orange:0xe58b37,red:0xc84643,navy:0x263c66};const mat=new THREE.MeshStandardMaterial({color:palette[color]||palette.blue});for(const car of this.cars)car.children.forEach(o=>{if(o.geometry?.parameters?.height===.35)o.material=mat;});}
 setTrackDistance(d){this.trackDistance=d;}
 setDoors(open){this.doorsOpen=open;for(const car of this.cars)for(const p of car.userData.doorPanels||[])p.mesh.position.x=p.baseX+(open?p.side*.34:0);}
 setHeadlights(on){for(const l of this.lights)l.intensity=on?5:0;}
 update(track,speed,dt,brake){const curve=track.curve;for(let i=0;i<this.cars.length;i++){const car=this.cars[i],d=track.distance-i*10.4;const p=curve.getPointAt(((d%track.length)+track.length)%track.length/track.length);const tangent=curve.getTangentAt(((d%track.length)+track.length)%track.length/track.length);car.position.set(p.x,p.y+Math.sin(d*.15)*Math.min(speed*.002,.025),p.z);car.rotation.y=Math.atan2(tangent.x,tangent.z);for(const w of car.userData.wheels)w.rotation.z-=speed*dt*1.6;}}
 getCameraTarget(index){const lead=this.cars[0]||this.group;const forward=new THREE.Vector3(Math.sin(lead.rotation.y),0,Math.cos(lead.rotation.y));const p=lead.position.clone();let pos,look=p.clone().add(new THREE.Vector3(0,2,0));if(index===1){pos=p.clone().add(new THREE.Vector3(0,3.05,0)).add(forward.clone().multiplyScalar(-1.5));look=p.clone().add(forward.clone().multiplyScalar(25)).add(new THREE.Vector3(0,2,0));}else if(index===2){pos=p.clone().add(forward.clone().multiplyScalar(15)).add(new THREE.Vector3(0,4,0));look=p.clone();}else if(index===3){pos=p.clone().add(forward.clone().multiplyScalar(-18)).add(new THREE.Vector3(0,5,0));look=p.clone();}else if(index===4){pos=p.clone().add(new THREE.Vector3(0,18,0));look=p.clone();}else if(index===5){pos=p.clone().add(new THREE.Vector3(18,12,18));look=p.clone();}else{pos=p.clone().add(forward.clone().multiplyScalar(-16)).add(new THREE.Vector3(7,5,0));look=p.clone().add(forward.clone().multiplyScalar(12));}return {position:pos,lookAt:look};}
}
