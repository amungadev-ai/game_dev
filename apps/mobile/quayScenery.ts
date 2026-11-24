import * as THREE from 'three';
// Decorative geometry only, outside the shared walkable bounds.
export function buildQuayScenery(scene:THREE.Scene){
 const group=new THREE.Group();scene.add(group);
 const cube=new THREE.BoxGeometry(1,1,1),crown=new THREE.IcosahedronGeometry(1,1),trunk=new THREE.CylinderGeometry(.13,.23,1,7);
 const materials=new Map<number,THREE.MeshStandardMaterial>();
 function mesh(g:THREE.BufferGeometry,color:number,x:number,y:number,z:number,w:number,h:number,d:number){
  let m=materials.get(color);if(!m){m=new THREE.MeshStandardMaterial({color,roughness:1});materials.set(color,m);}
  const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(w,h,d);group.add(o);return o;
 }
 const box=(color:number,x:number,y:number,z:number,w:number,h:number,d:number)=>mesh(cube,color,x,y,z,w,h,d);
 // Sea and distant island silhouettes.
 box(0x427f88,0,-.48,0,48,.2,48);
 for(const [x,z,w,h] of [[-15,-14,7,4],[13,-18,9,5],[-18,7,6,3]]){
  mesh(crown,0x75877b,x,-.2,z,w,h,w*.65);
 }
 // Raised quay edging and timber jetty outside the playable floor.
 for(const x of [-8.2,8.2])box(0xb69b72,x,.13,0,.4,.45,16.8);
 box(0xb69b72,0,.13,-8.2,16.8,.45,.4);
 box(0x94704d,0,-.04,10.1,3,.22,4.2);
 for(const x of [-1.3,1.3])for(const z of [8.6,10.3,12])box(0x634a35,x,.45,z,.2,1.2,.2);
 // Harbor houses beyond the collision boundary.
 for(const x of [-5,5]){
  box(0xd6bd92,x,1.6,-10.4,3.8,3.2,3.5);
  box(0xb4774e,x,3.25,-10.4,4.1,.25,3.8);
  box(0x70543d,x,.9,-8.63,.85,1.8,.06);
  for(const dx of [-1.1,1.1])box(0x536d70,x+dx,2.15,-8.61,.55,.65,.08);
 }
 // Olive-like trees with irregular layered crowns.
 for(const x of [-9.1,9.1])for(const z of [-6,-1,4]){
  mesh(trunk,0x796044,x,.85,z,1,1.7,1);
  for(let i=0;i<3;i++){const a=i*2.4+z;mesh(crown,i===1?0x718b55:0x4e754e,x+Math.cos(a)*.48,1.9+i*.15,z+Math.sin(a)*.48,.8,.65,.75);}
 }
 return group;
}
