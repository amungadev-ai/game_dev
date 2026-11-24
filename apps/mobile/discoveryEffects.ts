import * as THREE from 'three';
// Fixed-size, reusable effects. No flashing lights or camera shake.
export function createDiscoveryEffects(scene:THREE.Scene){
 const group=new THREE.Group();scene.add(group);group.visible=false;
 const material=new THREE.MeshBasicMaterial({color:0xffd889,transparent:true,opacity:0,depthWrite:false});
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.035,6,32),material);ring.rotation.x=-Math.PI/2;group.add(ring);
 const positions=new Float32Array(24*3),geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const sparkMaterial=new THREE.PointsMaterial({color:0xffe6a6,size:.085,transparent:true,opacity:0,depthWrite:false});
 const sparks=new THREE.Points(geometry,sparkMaterial);sparks.frustumCulled=false;group.add(sparks);
 let elapsed=2;
 return {
  trigger(x:number,y:number,z:number){group.position.set(x,y,z);elapsed=0;group.visible=true;},
  update(dt:number){
   if(!group.visible)return;elapsed+=dt;const t=Math.min(1,elapsed/1.4);
   if(t>=1){group.visible=false;return;}
   ring.scale.setScalar(.25+t*1.7);material.opacity=(1-t)*.8;sparkMaterial.opacity=1-t;
   for(let i=0;i<24;i++){const a=i*2.399963;const r=(.2+(i%5)*.12)*t*2;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=Math.sin(t*Math.PI)*(.3+(i%7)*.15);positions[i*3+2]=Math.sin(a)*r;}
   geometry.attributes.position.needsUpdate=true;
  },
  dispose(){scene.remove(group);ring.geometry.dispose();material.dispose();geometry.dispose();sparkMaterial.dispose();}
 };
}
