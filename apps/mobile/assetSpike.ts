// Original geometry-only glTF fixture. No external assets or paid services.
// Embedded binary buffer avoids filesystem and browser image decoding dependencies.
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import type {Group} from 'three';
export async function loadGeometryFixture():Promise<Group>{
 const positions=new Float32Array([-0.5,0,0,0.5,0,0,0,1,0]);
 const bytes=new Uint8Array(positions.buffer);
 const gltf={extensionsUsed:[],extensionsRequired:[],asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0},material:0}]}],materials:[{doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[0.8,0.55,0.25,1],metallicFactor:0,roughnessFactor:1}}],buffers:[{byteLength:bytes.length,type:'arraybuffer'}],bufferViews:[{buffer:0,byteOffset:0,byteLength:bytes.length,target:34962}],accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[-0.5,0,0],max:[0.5,1,0]}]};
 const json=JSON.stringify(gltf);const n=(json.length+3)&~3;
 const buffer=new ArrayBuffer(12+8+n+8+bytes.length);const view=new DataView(buffer);const out=new Uint8Array(buffer);
 view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,buffer.byteLength,true);view.setUint32(12,n,true);view.setUint32(16,0x4e4f534a,true);out.fill(32,20,20+n);for(let i=0;i<json.length;i++)out[20+i]=json.charCodeAt(i);
 view.setUint32(20+n,bytes.length,true);view.setUint32(24+n,0x004e4942,true);out.set(bytes,28+n);
 return new Promise((resolve,reject)=>new GLTFLoader().parse(buffer,'./',g=>resolve(g.scene),e=>{console.error('GLB fixture parse failure',e);reject(e);}));
}
