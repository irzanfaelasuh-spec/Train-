import * as THREE from 'three';
export class TrackGraph{
 constructor(){this.distance=0;this.setRoute('urban');}
 setRoute(route){this.route=route;let pts=[];if(route==='coast'){pts=[new THREE.Vector3(-450,0,-8),new THREE.Vector3(-250,0,-8),new THREE.Vector3(-100,0,0),new THREE.Vector3(100,0,12),new THREE.Vector3(250,0,4),new THREE.Vector3(450,0,-4)];}else if(route==='rural'){pts=[new THREE.Vector3(-450,0,6),new THREE.Vector3(-250,0,6),new THREE.Vector3(-120,0,-5),new THREE.Vector3(40,0,-12),new THREE.Vector3(220,0,-2),new THREE.Vector3(450,0,7)];}else{pts=[new THREE.Vector3(-450,0,0),new THREE.Vector3(-260,0,0),new THREE.Vector3(-80,0,0),new THREE.Vector3(100,0,0),new THREE.Vector3(280,0,0),new THREE.Vector3(450,0,0)];}this.curve=new THREE.CatmullRomCurve3(pts);this.length=this.curve.getLength();this.distance=0;}
}
