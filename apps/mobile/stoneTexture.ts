import * as THREE from 'three';
// Original deterministic sandstone pixels; no external image or decoder.
export function sandstoneTexture(repeat=1){
 const size=128,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const i=(y*size+x)*4;
  const grain=((Math.imul(x+17,374761393)^Math.imul(y+31,668265263))>>>0)%23-11;
  const bands=7*Math.sin(y*.24+2*Math.sin(x*.08))+5*Math.sin(x*.13+y*.09);
  const value=Math.max(100,Math.min(255,218+grain+bands));
  data[i]=value;data[i+1]=value;data[i+2]=value;data[i+3]=255;
 }
 const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
 t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;
 t.repeat.set(repeat,repeat);t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;
 return t;
}
