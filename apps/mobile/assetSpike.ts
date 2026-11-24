// Original geometry-only glTF fixture. No external assets or paid services.
// Embedded binary buffer avoids filesystem and browser image decoding dependencies.
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import type {Group} from 'three';
// GLTFParser r162 checks navigator.userAgent during construction.
// Hermes may expose navigator without that browser property.
function ensureLoaderEnvironment(){
 const nav=globalThis.navigator;
 if(typeof nav==='undefined'){
  Object.defineProperty(globalThis,'navigator',{value:{userAgent:'ReactNative'},configurable:true});
 }else if(typeof nav.userAgent!=='string'){
  Object.defineProperty(nav,'userAgent',{value:'ReactNative',configurable:true});
 }
}
export async function loadGeometryFixture():Promise<Group>{
 ensureLoaderEnvironment();
 // Reuse a unit cube mesh for modular masonry, with face normals.
 const vertices:number[]=[];const normals:number[]=[];
 const faces=[[[0,0,1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[[0,0,-1],[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[[1,0,0],[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[[-1,0,0],[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[[0,1,0],[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[[0,-1,0],[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];
 for(const face of faces)for(const i of [1,2,3,1,3,4]){vertices.push(...face[i].map(v=>v*.5));normals.push(...face[0]);}
 const positions=new Float32Array([...vertices,...normals]);
 const nodes:{mesh:number;translation:number[];scale:number[];rotation?:number[]}[]=[];
 function stone(x:number,y:number,z:number,w:number,h:number,d:number,material=0,angle=0){nodes.push({mesh:material,translation:[x,y,z],scale:[w,h,d],rotation:[0,0,Math.sin(angle/2),Math.cos(angle/2)]});}
 for(const side of [-1,1]){
  stone(side*1.55,.14,0,.85,.28,.65,2);
  for(let i=0;i<6;i++)stone(side*1.55,.48+i*.37,0,.65,.35,.55,i%2);
  stone(side*1.55,2.62,0,.86,.22,.68,2);
 }
 for(let i=0;i<11;i++){const a=(i+.5)*Math.PI/11;stone(1.55*Math.cos(a),2.7+1.55*Math.sin(a),0,.43,.52,.58,i===5?2:i%2,a-Math.PI/2);}
 const palette=[[.72,.52,.32,1],[.83,.65,.43,1],[.94,.76,.48,1]];
 const bytes=new Uint8Array(positions.buffer);
 const gltf={asset:{version:'2.0'},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes:palette.map((_,i)=>({primitives:[{attributes:{POSITION:0,NORMAL:1},material:i}]})),materials:palette.map(baseColorFactor=>({pbrMetallicRoughness:{baseColorFactor,metallicFactor:0,roughnessFactor:1}})),buffers:[{byteLength:bytes.length}],bufferViews:[{buffer:0,byteOffset:0,byteLength:vertices.length*4,target:34962},{buffer:0,byteOffset:vertices.length*4,byteLength:normals.length*4,target:34962}],accessors:[{bufferView:0,componentType:5126,count:36,type:'VEC3',min:[-.5,-.5,-.5],max:[.5,.5,.5]},{bufferView:1,componentType:5126,count:36,type:'VEC3'}]};
 const json=JSON.stringify(gltf);const n=(json.length+3)&~3;
 const buffer=new ArrayBuffer(12+8+n+8+bytes.length);const view=new DataView(buffer);const out=new Uint8Array(buffer);
 view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,buffer.byteLength,true);view.setUint32(12,n,true);view.setUint32(16,0x4e4f534a,true);out.fill(32,20,20+n);for(let i=0;i<json.length;i++)out[20+i]=json.charCodeAt(i);
 view.setUint32(20+n,bytes.length,true);view.setUint32(24+n,0x004e4942,true);out.set(bytes,28+n);
 return new Promise((resolve,reject)=>new GLTFLoader().parse(buffer,'./',g=>resolve(g.scene),e=>{console.error('GLB fixture parse failure',e);reject(e);}));
}
