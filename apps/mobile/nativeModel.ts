import {Asset} from 'expo-asset';
import {File} from 'expo-file-system';
export async function readBundledModel(moduleId:number):Promise<ArrayBuffer>{
 const asset=Asset.fromModule(moduleId);
 await asset.downloadAsync();
 if(!asset.localUri)throw new Error('GLB asset has no local URI');
 const buffer=await new File(asset.localUri).arrayBuffer();
 const header=new DataView(buffer);
 if(buffer.byteLength<20||header.getUint32(0,true)!==0x46546c67||header.getUint32(4,true)!==2||header.getUint32(8,true)!==buffer.byteLength)throw new Error('Invalid GLB header');
 return buffer;
}

export function readBundledArch(){return readBundledModel(require('./assets/lantern-quay-arch.glb'));}
