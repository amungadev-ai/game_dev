import * as THREE from 'three';
export function createSeeker(color:number){
 const g=new THREE.Group();
 function part(geometry:THREE.BufferGeometry,c:number,x:number,y:number,z:number,parent:THREE.Object3D=g){
  const m=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:c,roughness:.85}));m.position.set(x,y,z);parent.add(m);return m;
 }
 const box=(w:number,h:number,d:number,c:number,x:number,y:number,z:number,p:THREE.Object3D=g)=>part(new THREE.BoxGeometry(w,h,d),c,x,y,z,p);
 const oval=(w:number,h:number,d:number,c:number,x:number,y:number,z:number,p:THREE.Object3D=g)=>{const m=part(new THREE.SphereGeometry(1,12,8),c,x,y,z,p);m.scale.set(w,h,d);return m;};
 const skin=0xc99365,leather=0x674733;
 const torso=oval(.29,.36,.19,color,0,.87,0);
 box(.49,.095,.36,leather,0,.64,0);box(.12,.1,.045,0xd7b16a,0,.64,.2);
 oval(.095,.12,.09,skin,0,1.19,0);
 oval(.225,.25,.205,skin,0,1.39,0);
 oval(.237,.12,.21,0x49352b,0,1.54,-.025);
 for(const side of [-1,1]){
  oval(.055,.085,.05,skin,side*.218,1.39,0);
  oval(.027,.035,.018,0x302d2b,side*.082,1.43,.19);
 }
 oval(.042,.048,.045,skin,0,1.36,.2);
 box(.35,.4,.18,0x98683e,0,.91,-.24);
 box(.36,.1,.19,leather,0,1.07,-.24);
 for(const side of [-1,1])box(.055,.45,.045,leather,side*.17,.92,.18);
 const limbs:THREE.Group[]=[];
 for(const side of [-1,1]){
  const leg=new THREE.Group();leg.position.set(side*.145,.59,0);g.add(leg);
  oval(.105,.22,.11,0x344554,0,-.19,0,leg);
  box(.19,.18,.24,leather,0,-.43,.035,leg);
  box(.21,.09,.31,0x49392d,0,-.52,.07,leg);limbs.push(leg);
  const arm=new THREE.Group();arm.position.set(side*.29,1.08,0);g.add(arm);
  oval(.105,.15,.11,color,0,-.09,0,arm);
  oval(.075,.15,.075,skin,0,-.29,0,arm);
  box(.15,.07,.15,leather,0,-.36,0,arm);
  oval(.075,.085,.07,skin,0,-.43,0,arm);limbs.push(arm);
 }
 return {g,limbs,torso};
}
export function animateSeeker(a:ReturnType<typeof createSeeker>,moving:boolean,time:number,dt:number){
 const blend=1-Math.exp(-12*dt);
 a.limbs.forEach((l,i)=>{const target=moving?Math.sin(time*10)*(i===0||i===3?1:-1)*.48:0;l.rotation.x+=(target-l.rotation.x)*blend;});
 a.torso.scale.y=.36*(1+.012*Math.sin(time*3));
}
