import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// Original two-bone skinned geometry and embedded animation test.
export async function loadRigSpike(){
 const nav=globalThis.navigator;
 if(nav&&typeof nav.userAgent!=='string')Object.defineProperty(nav,'userAgent',{value:'ReactNative',configurable:true});
 const chunks:Uint8Array[]=[],views:any[]=[],accessors:any[]=[];let length=0;
 function add(data:Float32Array|Uint16Array,type:string,count:number,extra:object={}){
  const bytes=new Uint8Array(data.buffer);const view=views.length;
  views.push({buffer:0,byteOffset:length,byteLength:bytes.length});chunks.push(bytes);length+=bytes.length;
  const index=accessors.length;accessors.push({bufferView:view,componentType:data instanceof Float32Array?5126:5123,count,type,...extra});return index;
 }
 const pos=add(new Float32Array([-.18,0,0,.18,0,0,-.18,.5,0,.18,.5,0,-.18,1,0,.18,1,0]),'VEC3',6,{min:[-.18,0,0],max:[.18,1,0]});
 const joints=add(new Uint16Array([0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0]),'VEC4',6);
 const weights=add(new Float32Array([1,0,0,0,1,0,0,0,.5,.5,0,0,.5,.5,0,0,1,0,0,0,1,0,0,0]),'VEC4',6);
 const indices=add(new Uint16Array([0,1,2,1,3,2,2,3,4,3,5,4]),'SCALAR',12);
 const bind=add(new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,-.5,0,1]),'MAT4',2);
 const times=add(new Float32Array([0,.5,1,1.5,2]),'SCALAR',5,{min:[0],max:[2]});
 const rotations=add(new Float32Array([0,0,0,1,0,0,.382683,.92388,0,0,0,1,0,0,-.382683,.92388,0,0,0,1]),'VEC4',5);
 const json=JSON.stringify({asset:{version:'2.0'},scene:0,scenes:[{nodes:[0,1]}],nodes:[{mesh:0,skin:0},{name:'Root',children:[2]},{name:'Tip',translation:[0,.5,0]}],skins:[{joints:[1,2],inverseBindMatrices:bind,skeleton:1}],meshes:[{primitives:[{attributes:{POSITION:pos,JOINTS_0:joints,WEIGHTS_0:weights},indices,material:0}]}],materials:[{doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[.2,.8,.6,1],metallicFactor:0,roughnessFactor:1}}],animations:[{name:'Bend',samplers:[{input:times,output:rotations,interpolation:'LINEAR'}],channels:[{sampler:0,target:{node:2,path:'rotation'}}]}],buffers:[{byteLength:length}],bufferViews:views,accessors});
 const n=(json.length+3)&~3,buffer=new ArrayBuffer(28+n+length),v=new DataView(buffer),out=new Uint8Array(buffer);
 [0x46546c67,2,buffer.byteLength,n,0x4e4f534a].forEach((x,i)=>v.setUint32(i*4,x,true));out.fill(32,20,20+n);for(let i=0;i<json.length;i++)out[20+i]=json.charCodeAt(i);
 v.setUint32(20+n,length,true);v.setUint32(24+n,0x004e4942,true);let offset=28+n;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.length;}
 const gltf=await new Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTF>((resolve,reject)=>new GLTFLoader().parse(buffer,'./',resolve,reject));
 let skinned=false;gltf.scene.traverse(o=>{if(o instanceof THREE.SkinnedMesh){skinned=true;o.frustumCulled=false;}});
 if(!skinned||!gltf.animations.length)throw new Error('Rig spike missing skin or clip');
 const mixer=new THREE.AnimationMixer(gltf.scene);mixer.clipAction(gltf.animations[0]).play();
 return {group:gltf.scene,mixer};
}
