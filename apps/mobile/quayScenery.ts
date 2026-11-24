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
 const sea=box(0x427f88,0,-.48,0,48,.2,48);
 // One batched line geometry for subtle moving surface highlights.
 const wavePositions=new Float32Array(48*6);
 const waveGeometry=new THREE.BufferGeometry();
 const waveAttribute=new THREE.BufferAttribute(wavePositions,3).setUsage(THREE.DynamicDrawUsage);
 waveGeometry.setAttribute('position',waveAttribute);
 const waveMaterial=new THREE.LineBasicMaterial({color:0x9bd1cd,transparent:true,opacity:.36,depthWrite:false});
 const waves=new THREE.LineSegments(waveGeometry,waveMaterial);waves.frustumCulled=false;group.add(waves);
 const clouds=new THREE.Group();group.add(clouds);
 for(let i=0;i<3;i++){
  const cloud=new THREE.Group();cloud.position.set(-15+i*14,8+i%2,-22-i*2);clouds.add(cloud);
  for(let j=0;j<3;j++){const puff=mesh(crown,0xe5e8df,0,0,0,2.3,.48,1.1);cloud.add(puff);puff.position.set((j-1)*1.8,j%2*.2,0);}
 }
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
 let time=0;
 return {group,update(dt:number){
  time+=dt;
  sea.position.y=-.48+Math.sin(time*.7)*.025;
  for(let i=0;i<48;i++){
   const side=i<24?-1:1,j=i%24;
   const x=side*(8.7+(j%4)*1.65+Math.sin(time*.6+j)*.2);
   const z=-11+Math.floor(j/4)*4+Math.sin(time*.35+j*1.7)*.4;
   const k=i*6,y=sea.position.y+.115;
   wavePositions[k]=x;wavePositions[k+1]=y;wavePositions[k+2]=z;
   wavePositions[k+3]=x+.45+(j%3)*.35;wavePositions[k+4]=y;wavePositions[k+5]=z+.08;
  }
  waveAttribute.needsUpdate=true;
  clouds.position.x=Math.sin(time*.025)*4;
 }};
}
