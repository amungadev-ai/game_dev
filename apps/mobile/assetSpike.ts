// Bundled model package; binary GLB reconstructed without browser fetch or decoding.
import {readBundledArch} from './nativeModel';
import arch from './assets/lantern-quay-arch.json';
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
 try{
  const native=await readBundledArch();
  const group=await new Promise<Group>((resolve,reject)=>new GLTFLoader().parse(native,'./',g=>resolve(g.scene),reject));
  console.log('GLB SOURCE: native binary asset');
  return group;
 }catch(error){console.warn('GLB SOURCE: JSON fallback',String(error));}
 const gltf=arch.gltf;
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
 const encoded=arch.binaryBase64;
 const bytes=new Uint8Array(gltf.buffers[0].byteLength);
 let offset=0;
 for(let i=0;i<encoded.length;i+=4){
  const n=(alphabet.indexOf(encoded[i])<<18)|(alphabet.indexOf(encoded[i+1])<<12)|((alphabet.indexOf(encoded[i+2])&63)<<6)|(alphabet.indexOf(encoded[i+3])&63);
  if(offset<bytes.length)bytes[offset++]=(n>>16)&255;
  if(offset<bytes.length)bytes[offset++]=(n>>8)&255;
  if(offset<bytes.length)bytes[offset++]=n&255;
 }
 const json=JSON.stringify(gltf);const n=(json.length+3)&~3;
 const buffer=new ArrayBuffer(12+8+n+8+bytes.length);const view=new DataView(buffer);const out=new Uint8Array(buffer);
 view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,buffer.byteLength,true);view.setUint32(12,n,true);view.setUint32(16,0x4e4f534a,true);out.fill(32,20,20+n);for(let i=0;i<json.length;i++)out[20+i]=json.charCodeAt(i);
 view.setUint32(20+n,bytes.length,true);view.setUint32(24+n,0x004e4942,true);out.set(bytes,28+n);
 return new Promise((resolve,reject)=>new GLTFLoader().parse(buffer,'./',g=>resolve(g.scene),e=>{console.error('GLB fixture parse failure',e);reject(e);}));
}
