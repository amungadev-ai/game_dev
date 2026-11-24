import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Pressable,StyleSheet} from 'react-native';
import {GLView,type ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';
export type Collection={hasLamp:boolean;revealed:boolean};
export default function Sanctuary({collection,onBack}:{collection:Collection;onBack:()=>void}){
 const dispose=useRef(()=>{});const [error,setError]=useState('');
 useEffect(()=>()=>dispose.current(),[]);
 function setup(gl:ExpoWebGLRenderingContext){
 try{
 dispose.current();
 const canvas={width:gl.drawingBufferWidth,height:gl.drawingBufferHeight,clientWidth:gl.drawingBufferWidth,clientHeight:gl.drawingBufferHeight,style:{},addEventListener:()=>{},removeEventListener:()=>{},getContext:()=>gl} as unknown as NonNullable<THREE.WebGLRendererParameters['canvas']>;
 const renderer=new THREE.WebGLRenderer({canvas,context:gl as unknown as NonNullable<THREE.WebGLRendererParameters['context']>,antialias:false});
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x233e48);
 const camera=new THREE.PerspectiveCamera(48,gl.drawingBufferWidth/gl.drawingBufferHeight,.1,40);camera.position.set(5,5,8);camera.lookAt(0,1,0);
 renderer.setSize(gl.drawingBufferWidth,gl.drawingBufferHeight,false);
 dispose.current=()=>{scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(o.material as THREE.Material).dispose();}});renderer.dispose();};
 scene.add(new THREE.HemisphereLight(0xffefd0,0x536b70,2));const light=new THREE.DirectionalLight(0xffdfaa,2);light.position.set(3,6,5);scene.add(light);
 function box(w:number,h:number,d:number,x:number,y:number,z:number,color:number){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color}));m.position.set(x,y,z);scene.add(m);return m;}
 box(6,.3,5,0,-.15,0,0xb99a72);box(6,3,.25,0,1.5,-2.5,0xd2b58b);box(.25,3,5,-3,1.5,0,0xc3a27a);
 for(const x of [-1.4,1.4]){box(1.3,.9,1.1,x,.45,-.8,0x536d69);box(1.45,.15,1.25,x,.98,-.8,0xe0bf8d);}
 if(collection.hasLamp){const m=box(.42,.65,.42,-1.4,1.4,-.8,0xffbf35);(m.material as THREE.MeshStandardMaterial).emissive.setHex(0xa56a10);}
 if(collection.revealed){const m=box(.65,.65,.15,1.4,1.4,-.8,0xe8bf65);m.rotation.z=.3;}
 renderer.render(scene,camera);gl.endFrameEXP();
 }catch(e){setError(String(e));}
 }
 return <View style={{flex:1,backgroundColor:'#233e48'}}><GLView style={StyleSheet.absoluteFill} onContextCreate={setup}/><View style={{padding:20,gap:8,backgroundColor:'#20353ddd'}}><Pressable onPress={onBack}><Text style={{color:'#e7bc72'}}>‹ Back</Text></Pressable><Text style={{color:'white',fontSize:24,fontWeight:'bold'}}>Living Sanctuary</Text><Text style={{color:'white'}}>{error||'A home for your discoveries'}</Text></View><View style={{position:'absolute',bottom:24,left:16,right:16,padding:16,gap:8,backgroundColor:'#20353d',borderRadius:12}}><Text style={{color:'white'}}>Waylamp · {collection.hasLamp?'Displayed':'Not yet discovered'}</Text><Text style={{color:'white'}}>Meridian Fragment · {collection.revealed?'Displayed':'Not yet discovered'}</Text><Text style={{color:'#e7bc72'}}>Explore Lantern Quay to fill your collection.</Text></View></View>;
}
