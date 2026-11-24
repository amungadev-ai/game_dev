import {Asset} from 'expo-asset';
import {File} from 'expo-file-system';
import {PNG} from 'pngjs/browser';
import {Buffer} from 'buffer';
import * as THREE from 'three';
// Decode bundled PNG in JS rather than relying on browser Image APIs.
export async function loadSandstoneImage(){
 const asset=Asset.fromModule(require('./assets/sandstone.png'));await asset.downloadAsync();
 if(!asset.localUri)throw new Error('Missing texture URI');
 const bytes=new Uint8Array(await new File(asset.localUri).arrayBuffer());
 const image=PNG.sync.read(Buffer.from(bytes));
 const texture=new THREE.DataTexture(new Uint8Array(image.data),image.width,image.height,THREE.RGBAFormat);
 texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
 texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;
 return texture;
}
