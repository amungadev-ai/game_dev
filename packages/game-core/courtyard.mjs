export const initialPlayer = Object.freeze({x:0,z:5,hasLamp:false,revealed:false});
export const obstacles = [{x:0,z:-5,w:5,d:0.7},{x:-4,z:0,w:1,d:1},{x:4,z:0,w:1,d:1}];
export function move(p,x,z,dt){
 const n=Math.max(1,Math.hypot(x,z)), s=4*Math.min(Math.max(dt,0),0.05)/n;
 const clear=(a,b)=>Math.abs(a)<=7.5&&Math.abs(b)<=7.5&&!obstacles.some(o=>Math.abs(a-o.x)<o.w/2+0.35&&Math.abs(b-o.z)<o.d/2+0.35);
 let a=p.x,b=p.z; if(clear(a+x*s,b))a+=x*s;if(clear(a,b+z*s))b+=z*s;
 return {...p,x:a,z:b};
}
export function interact(p){
 if(!p.hasLamp&&Math.hypot(p.x-3,p.z-2)<1.8)return {...p,hasLamp:true};
 if(p.hasLamp&&Math.hypot(p.x,p.z+3.8)<1.8)return {...p,revealed:true};
 return p;
}
