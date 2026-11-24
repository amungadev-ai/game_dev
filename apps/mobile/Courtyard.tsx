import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Pressable,StyleSheet,PanResponder,AppState} from 'react-native';
import {GLView, type ExpoWebGLRenderingContext} from 'expo-gl';
import {useLan} from './lan';
import * as THREE from 'three';
import {initialPlayer,move,interact,obstacles} from '../../packages/game-core/courtyard.mjs';

export default function Courtyard({onBack,url}:{onBack:()=>void;url?:string}){
 const player=useRef({...initialPlayer}), input=useRef({x:0,z:0}), frame=useRef(0), cleanup=useRef<()=>void>(()=>{}), alive=useRef(true), active=useRef(true);
 const lan=useLan(url,input,player);
 const [fps,setFps]=useState(0),[status,setStatus]=useState('Find the golden Waylamp'),[error,setError]=useState(''),[knob,setKnob]=useState({x:0,y:0});
 useEffect(()=>{alive.current=true;const sub=AppState.addEventListener('change',s=>{active.current=s==='active';input.current={x:0,z:0};});return()=>{alive.current=false;cancelAnimationFrame(frame.current);cleanup.current();sub.remove();};},[]);
 const joystick=useRef(PanResponder.create({
 onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:()=>true,
 onPanResponderMove:(_,g)=>{const n=Math.max(1,Math.hypot(g.dx,g.dy)/38);const x=g.dx/n,y=g.dy/n;input.current={x:x/38,z:y/38};setKnob({x,y});},
 onPanResponderRelease:()=>{input.current={x:0,z:0};setKnob({x:0,y:0});},
 onPanResponderTerminate:()=>{input.current={x:0,z:0};setKnob({x:0,y:0});}
 })).current;
 function setup(gl:ExpoWebGLRenderingContext){
 try{
 cancelAnimationFrame(frame.current);cleanup.current();
 const canvas = {
 width:gl.drawingBufferWidth,height:gl.drawingBufferHeight,
 clientWidth:gl.drawingBufferWidth,clientHeight:gl.drawingBufferHeight,
 style:{},addEventListener:()=>{},removeEventListener:()=>{},
 getContext:()=>gl
 } as unknown as NonNullable<THREE.WebGLRendererParameters['canvas']>;
 const renderer=new THREE.WebGLRenderer({canvas,context:gl as unknown as NonNullable<THREE.WebGLRendererParameters['context']>,antialias:false});
 renderer.setSize(gl.drawingBufferWidth,gl.drawingBufferHeight,false);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#8ca9b3');scene.fog=new THREE.Fog('#8ca9b3',18,45);
 const camera=new THREE.PerspectiveCamera(55,gl.drawingBufferWidth/gl.drawingBufferHeight,.1,60);
 scene.add(new THREE.HemisphereLight(0xfff0d0,0x536b70,2));
 const sun=new THREE.DirectionalLight(0xffe2b0,2);sun.position.set(5,10,4);scene.add(sun);
 function box(w:number,h:number,d:number,x:number,y:number,z:number,color:number,parent:THREE.Object3D=scene){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color}));m.position.set(x,y,z);parent.add(m);return m;}
 box(16,.3,16,0,-.15,0,0xb9a17c);
 for(let i=-7;i<=7;i+=2){box(.035,.012,16,i,.01,0,0x8e8069);box(16,.012,.035,0,.01,i,0x8e8069);}
 obstacles.forEach(o=>box(o.w,o.w===5?3:2.5,o.d,o.x,o.w===5?1.5:1.25,o.z,0xd2b58b));
 // Decorative elements remain outside the navigable collision layout.
 for(const x of [-7.8,7.8])for(const z of [-6,-2,2,6]){
 box(.5,1.2,.5,x,.6,z,0x92734d);
 const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.85,0),new THREE.MeshStandardMaterial({color:0x537d57}));crown.position.set(x,1.7,z);scene.add(crown);
 }
 for(const x of [-2.3,2.3]){box(.45,3.2,.85,x,1.6,-5,0xc4a27a);box(.65,.25,1,x,3.15,-5,0xe2c69b);}
 box(5.2,.25,.9,0,3.05,-5,0xe2c69b);
 function seeker(color:number){
 const g=new THREE.Group();scene.add(g);
 box(.55,.65,.38,0,.85,0,color,g);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.25,12,8),new THREE.MeshStandardMaterial({color:0xd8ac78}));head.position.y=1.38;g.add(head);
 box(.49,.15,.48,0,1.57,0,0x513b2e,g);
 box(.35,.4,.15,0,.88,-.25,0x8d623c,g);
 const limbs:THREE.Group[]=[];
 for(const side of [-1,1]){
 const leg=new THREE.Group();leg.position.set(side*.15,.55,0);g.add(leg);box(.21,.42,.23,0,-.2,0,0x344554,leg);box(.23,.13,.35,0,-.44,.06,0x503d30,leg);limbs.push(leg);
 const arm=new THREE.Group();arm.position.set(side*.37,1.08,0);g.add(arm);box(.17,.45,.19,0,-.19,0,color,arm);limbs.push(arm);
 }
 return {g,limbs};
 }
 const avatar=seeker(0x237b79),hero=avatar.g;
 function animate(a:ReturnType<typeof seeker>,moving:boolean,time:number){a.limbs.forEach((l,i)=>{l.rotation.x=moving?Math.sin(time*10)*(i===0||i===3?1:-1)*.55:0;});}

 const lamp=box(.38,.55,.38,3,.65,2,0xffbf35);(lamp.material as THREE.MeshStandardMaterial).emissive.setHex(0xa56a10);const mark=box(.9,.9,.05,0,1.6,-4.61,0xffd45c);(mark.material as THREE.MeshStandardMaterial).emissive.setHex(0xa56a10);mark.visible=false; const ring=new THREE.Mesh(new THREE.TorusGeometry(.65,.035,6,24),new THREE.MeshBasicMaterial({color:0xffdf83}));ring.rotation.x=-Math.PI/2;ring.position.set(3,.04,2);scene.add(ring);
 const ghosts=new Map<string,ReturnType<typeof seeker>>();
 const target=new THREE.Vector3();camera.position.set(0,7,13);
 cleanup.current=()=>{scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});renderer.dispose();};
 let last=0,windowStart=0,count=0;
 function tick(now:number){
 if(!alive.current)return;
 frame.current=requestAnimationFrame(tick);
 if(!active.current){last=now;windowStart=now;count=0;return;}
 const dt=last?Math.min((now-last)/1000,.05):0;last=now;
 if(!url)player.current=move(player.current,input.current.x,input.current.z,dt);
 const ids=new Set(lan.remotes.current.map(p=>p.id));for(const [id,m] of ghosts)if(!ids.has(id)){scene.remove(m.g);m.g.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(o.material as THREE.Material).dispose();}});ghosts.delete(id);}
 for(const remote of lan.remotes.current){let m=ghosts.get(remote.id);if(!m){m=seeker(0x9256c8);m.g.position.set(remote.x,0,remote.z);ghosts.set(remote.id,m);}const dx=remote.x-m.g.position.x,dz=remote.z-m.g.position.z;const moving=Math.hypot(dx,dz)>.03;if(moving)m.g.rotation.y=Math.atan2(dx,dz);m.g.position.lerp(new THREE.Vector3(remote.x,0,remote.z),1-Math.exp(-18*dt));animate(m,moving,now/1000);}
 const p=player.current;hero.position.set(p.x,0,p.z);
 if(Math.hypot(input.current.x,input.current.z)>.1)hero.rotation.y=Math.atan2(input.current.x,input.current.z);
 animate(avatar,Math.hypot(input.current.x,input.current.z)>.1,now/1000);lamp.visible=!p.hasLamp;ring.visible=!p.hasLamp;lamp.rotation.y+=dt;lamp.position.y=.65+Math.sin(now/350)*.12;mark.visible=p.revealed;
 target.set(p.x,7,p.z+8);camera.position.lerp(target,1-Math.exp(-8*dt));camera.lookAt(p.x,.6,p.z-1);
 renderer.render(scene,camera);gl.endFrameEXP();
 if(!windowStart)windowStart=now;count++;if(now-windowStart>=1000){setFps(Math.round(count*1000/(now-windowStart)));windowStart=now;count=0;}
 }
 frame.current=requestAnimationFrame(tick);
 }catch(e){setError(String(e));}
 }
 function action(){if(url){lan.action.current=true;return;}player.current=interact(player.current);const p=player.current;setStatus(p.revealed?'Secret uncovered!':p.hasLamp?'Return to the stone wall and tap uncover':'Move closer to the golden Waylamp');}
 return <View style={s.root}><GLView style={StyleSheet.absoluteFill} onContextCreate={setup}/><View style={s.top}><Pressable onPress={onBack}><Text style={s.text}>‹ Back</Text></Pressable><Text style={s.text}>LANTERN QUAY · {fps} FPS</Text></View><Text style={s.status}>{error||(url?lan.status+' · '+(player.current.revealed?'Secret uncovered':player.current.hasLamp?'Find the wall':'Find the Waylamp'):status)}</Text><View style={s.bottom}><View style={s.pad} {...joystick.panHandlers}><View style={[s.knob,{transform:[{translateX:knob.x},{translateY:knob.y}]}]}/></View><Pressable style={s.action} onPress={action}><Text style={{fontWeight:'bold',color:'#17252b'}}>UNCOVER</Text></Pressable></View></View>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#182d36'},top:{position:'absolute',top:12,left:16,right:16,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#20353ddd',padding:12,borderRadius:12},text:{color:'white',fontWeight:'bold'},status:{position:'absolute',top:72,left:16,right:16,color:'white',backgroundColor:'#20353ddd',padding:12,borderRadius:10,textAlign:'center'},bottom:{position:'absolute',bottom:24,left:24,right:24,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},pad:{width:112,height:112,borderRadius:56,backgroundColor:'#20353d99',alignItems:'center',justifyContent:'center'},knob:{width:42,height:42,borderRadius:21,backgroundColor:'#f4d7a0'},action:{backgroundColor:'#e7bc72',padding:20,borderRadius:36}});
