import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Pressable,StyleSheet,PanResponder,AppState,ScrollView} from 'react-native';
import {GLView, type ExpoWebGLRenderingContext} from 'expo-gl';
import {useQuayAudio} from './quayAudio';
import {createDiscoveryEffects} from './discoveryEffects';
import {locomotionState} from './characterAnimation';
import {loadRigSpike} from './rigSpike';
import {createSeeker,animateSeeker} from './seeker';
import {buildQuayScenery} from './quayScenery';
import {sandstoneTexture} from './stoneTexture';
import {loadGeometryFixture} from './assetSpike';
import {useLan} from './lan';
import * as THREE from 'three';
import {initialPlayer,move,interact,obstacles} from '../../packages/game-core/courtyard.mjs';

export default function Courtyard({onBack,url,collection,onCollect}:{onBack:()=>void;url?:string;collection:{hasLamp:boolean;revealed:boolean};onCollect:(c:{hasLamp:boolean;revealed:boolean})=>void}){
 const player=useRef({...initialPlayer,...(!url?collection:{})}), input=useRef({x:0,z:0}), frame=useRef(0), cleanup=useRef<()=>void>(()=>{}), alive=useRef(true), active=useRef(true);
 const lan=useLan(url,input,player);
 const audio=useQuayAudio();
 const [assetStatus,setAssetStatus]=useState('GLB: loading');
 const [assetError,setAssetError]=useState('');const [showAssetError,setShowAssetError]=useState(false);
 const [inventory,setInventory]=useState(false);
 const [discovery,setDiscovery]=useState('');
 const jump=useRef({height:0,velocity:0});
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
 const scene=new THREE.Scene();scene.background=new THREE.Color('#a8c6cb');scene.fog=new THREE.Fog('#a8c6cb',19,45);
 const camera=new THREE.PerspectiveCamera(55,gl.drawingBufferWidth/gl.drawingBufferHeight,.1,60);
 scene.add(new THREE.HemisphereLight(0xfff0d0,0x536b70,1.65));
 const sun=new THREE.DirectionalLight(0xffe2b0,2.2);sun.position.set(5,10,4);scene.add(sun);
 const scenery=buildQuayScenery(scene);
 const effects=createDiscoveryEffects(scene);
 let previousLamp=player.current.hasLamp,previousReveal=player.current.revealed,noticeTime=0;
 setDiscovery('');
 function box(w:number,h:number,d:number,x:number,y:number,z:number,color:number,parent:THREE.Object3D=scene){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color}));m.position.set(x,y,z);parent.add(m);return m;}
 const floor=box(16,.3,16,0,-.15,0,0xb9a17c);
 const floorTexture=sandstoneTexture(8),archTexture=sandstoneTexture();
 (floor.material as THREE.MeshStandardMaterial).map=floorTexture;
 (floor.material as THREE.MeshStandardMaterial).needsUpdate=true;
 for(let i=-7;i<=7;i+=2){box(.035,.012,16,i,.01,0,0x8e8069);box(16,.012,.035,0,.01,i,0x8e8069);}
 obstacles.forEach(o=>box(o.w,o.w===5?3:2.5,o.d,o.x,o.w===5?1.5:1.25,o.z,0xd2b58b));
 for(const x of [-2.3,2.3]){box(.45,3.2,.85,x,1.6,-5,0xc4a27a);box(.65,.25,1,x,3.15,-5,0xe2c69b);}
 box(5.2,.25,.9,0,3.05,-5,0xe2c69b);
 function seeker(color:number){const a=createSeeker(color);scene.add(a.g);return a;}
 const avatar=seeker(0x237b79),hero=avatar.g;
 const lamp=box(.38,.55,.38,3,.65,2,0xffbf35);(lamp.material as THREE.MeshStandardMaterial).emissive.setHex(0xa56a10);const mark=box(.9,.9,.05,0,1.6,-4.61,0xffd45c);(mark.material as THREE.MeshStandardMaterial).emissive.setHex(0xa56a10);mark.visible=false; const ring=new THREE.Mesh(new THREE.TorusGeometry(.65,.035,6,24),new THREE.MeshBasicMaterial({color:0xffdf83}));ring.rotation.x=-Math.PI/2;ring.position.set(3,.04,2);scene.add(ring);
 const ghosts=new Map<string,ReturnType<typeof seeker>>();
 const pip=new THREE.Group();scene.add(pip);
 const pipBody=new THREE.Mesh(new THREE.IcosahedronGeometry(.23,0),new THREE.MeshStandardMaterial({color:0xf1c477}));pip.add(pipBody);
 const wings=[-1,1].map(side=>{const wing=box(.32,.06,.22,side*.24,0,0,0xffe7b0,pip);return wing;});
 pip.position.set(-1,1.3,5);
 let disposed=false;
 let rig:Awaited<ReturnType<typeof loadRigSpike>>|undefined;
 void loadRigSpike().then(r=>{if(disposed){r.controller.dispose();r.group.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});return;}rig=r;r.group.position.set(-2,1,-4.25);scene.add(r.group);console.log('RIG: skinned mesh and animation clip loaded');}).catch(e=>console.warn('RIG: failed',String(e),e?.stack));
 void loadGeometryFixture().then(model=>{if(disposed){model.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});return;}model.traverse(o=>{if(o instanceof THREE.Mesh){const g=o.geometry as THREE.BufferGeometry;const pos=g.getAttribute('position'),normal=g.getAttribute('normal');if(!g.getAttribute('uv')&&pos&&normal){const uv=new Float32Array(pos.count*2);for(let i=0;i<pos.count;i++){const nx=Math.abs(normal.getX(i)),ny=Math.abs(normal.getY(i));uv[i*2]=(nx>.5?pos.getZ(i):pos.getX(i))+.5;uv[i*2+1]=(ny>.5?pos.getZ(i):pos.getY(i))+.5;}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));}const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial){m.map=archTexture;m.needsUpdate=true;}});}});model.position.set(0,0,-4.48);scene.add(model);setAssetStatus('GLB: arch + textures assigned');}).catch(e=>{const detail=String(e)+'\n'+(typeof e?.stack==='string'?e.stack:'No stack available');console.log('GLB DIAGNOSTIC v3: '+detail);if(!disposed){setAssetStatus('GLB: failed — tap for details');setAssetError(detail);setShowAssetError(true);}});
 const target=new THREE.Vector3();camera.position.set(0,7,13);
 cleanup.current=()=>{disposed=true;effects.dispose();if(rig){rig.controller.dispose();}floorTexture.dispose();archTexture.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});renderer.dispose();};
 let last=0,windowStart=0,count=0;
 function tick(now:number){
 if(!alive.current)return;
 frame.current=requestAnimationFrame(tick);
 if(!active.current){last=now;windowStart=now;count=0;return;}
 const dt=last?Math.min((now-last)/1000,.05):0;last=now;
 if(!url)player.current=move(player.current,input.current.x,input.current.z,dt);
 const ids=new Set(lan.remotes.current.map(p=>p.id));for(const [id,m] of ghosts)if(!ids.has(id)){scene.remove(m.g);m.g.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(o.material as THREE.Material).dispose();}});ghosts.delete(id);}
 for(const remote of lan.remotes.current){let m=ghosts.get(remote.id);if(!m){m=seeker(0x9256c8);m.g.position.set(remote.x,0,remote.z);ghosts.set(remote.id,m);}const dx=remote.x-m.g.position.x,dz=remote.z-m.g.position.z;const moving=Math.hypot(dx,dz)>.03;if(moving)m.g.rotation.y=Math.atan2(dx,dz);m.g.position.lerp(new THREE.Vector3(remote.x,0,remote.z),1-Math.exp(-18*dt));animateSeeker(m,moving,now/1000,dt);}
 const p=player.current;
 if(p.revealed&&!previousReveal){effects.trigger(0,1.2,-4.3);audio.discover('fragment');setDiscovery('MERIDIAN FRAGMENT DISCOVERED');noticeTime=3;}
 else if(p.hasLamp&&!previousLamp){effects.trigger(3,.12,2);audio.discover('lamp');setDiscovery('WAYLAMP DISCOVERED');noticeTime=3;}
 previousLamp=p.hasLamp;previousReveal=p.revealed;
 if(noticeTime>0){noticeTime-=dt;if(noticeTime<=0)setDiscovery('');}
 effects.update(dt);scenery.update(dt);
 if(jump.current.height>0||jump.current.velocity>0){jump.current.velocity-=14*dt;jump.current.height=Math.max(0,jump.current.height+jump.current.velocity*dt);if(jump.current.height===0)jump.current.velocity=0;}
 hero.position.set(p.x,jump.current.height,p.z);
 pip.position.x+=(p.x-1.1-pip.position.x)*(1-Math.exp(-4*dt));pip.position.z+=(p.z+.6-pip.position.z)*(1-Math.exp(-4*dt));pip.position.y=1.25+Math.sin(now/240)*.16;
 wings.forEach((w,i)=>w.rotation.z=Math.sin(now/85)*(i===0?1:-1)*.65);
 if(Math.hypot(input.current.x,input.current.z)>.1)hero.rotation.y=Math.atan2(input.current.x,input.current.z);
 animateSeeker(avatar,Math.hypot(input.current.x,input.current.z)>.1,now/1000,dt);lamp.visible=!p.hasLamp;ring.visible=!p.hasLamp;lamp.rotation.y+=dt;lamp.position.y=.65+Math.sin(now/350)*.12;mark.visible=p.revealed;ring.scale.setScalar(1+.09*Math.sin(now/420));
 target.set(p.x,7,p.z+8);camera.position.lerp(target,1-Math.exp(-8*dt));camera.lookAt(p.x,.6,p.z-1);
 if(rig){rig.controller.setState(locomotionState(Math.hypot(input.current.x,input.current.z)));rig.controller.update(dt);}
 renderer.render(scene,camera);gl.endFrameEXP();
 if(!windowStart)windowStart=now;count++;if(now-windowStart>=1000){setFps(Math.round(count*1000/(now-windowStart)));windowStart=now;count=0;}
 }
 frame.current=requestAnimationFrame(tick);
 }catch(e){setError(String(e));}
 }
 function action(){if(url){lan.action.current=true;return;}player.current=interact(player.current);const p=player.current;setStatus(p.revealed?'Meridian Fragment discovered!':p.hasLamp?'Return to the stone wall and tap uncover':'Move closer to the golden Waylamp');}
 return <View style={s.root}><GLView style={StyleSheet.absoluteFill} onContextCreate={setup}/><View style={s.top}><Pressable onPress={()=>{onCollect({hasLamp:player.current.hasLamp,revealed:player.current.revealed});onBack();}}><Text style={s.text}>‹ Back</Text></Pressable><Text style={s.text}>LANTERN QUAY · {fps} FPS</Text><Pressable accessibilityRole="button" accessibilityLabel={audio.enabled?'Mute sound':'Enable sound'} onPress={audio.toggle}><Text style={s.text}>{audio.enabled?'Sound on':'Sound off'}</Text></Pressable></View><Pressable onPress={()=>setShowAssetError(v=>!v)} style={{position:'absolute',top:116,left:16,backgroundColor:'#20353d',padding:5}}><Text style={{color:'white'}}>{assetStatus}</Text></Pressable><Text style={s.status}>{error||(url?lan.status+' · '+(player.current.revealed?'Secret uncovered':player.current.hasLamp?'Find the wall':'Find the Waylamp'):status)}</Text><Pressable accessibilityRole="button" onPress={()=>setInventory(v=>!v)} style={{position:'absolute',right:16,top:140,backgroundColor:'#20353d',padding:12,borderRadius:10}}><Text style={s.text}>Treasures · {Number(player.current.hasLamp)+Number(player.current.revealed)}</Text></Pressable>{inventory&&<View style={{position:'absolute',top:192,left:16,right:16,backgroundColor:'#20353d',padding:18,borderRadius:14,gap:12}}><Text style={{color:'#e7bc72',fontSize:20,fontWeight:'bold'}}>Seeker's collection</Text><Text style={s.text}>{player.current.hasLamp?'Waylamp — discovered':'Waylamp — undiscovered'}</Text><Text style={{color:'#cbdad6'}}>Reveals what ordinary light cannot.</Text><Text style={s.text}>{player.current.revealed?'Meridian Fragment — discovered':'Meridian Fragment — undiscovered'}</Text><Text style={{color:'#cbdad6'}}>A clue to a forgotten route between islands.</Text><Pressable onPress={()=>setInventory(false)}><Text style={{color:'#e7bc72',padding:8}}>Continue exploring</Text></Pressable></View>}{!inventory&&!!discovery&&<View pointerEvents="none" style={{position:'absolute',top:200,left:24,right:24,backgroundColor:'#20353dee',borderColor:'#e7bc72',borderWidth:1,borderRadius:12,padding:14}}><Text accessibilityLiveRegion="polite" style={{color:'#ffe3a4',fontWeight:'bold',textAlign:'center'}}>{discovery}</Text></View>}<View style={s.bottom}><View style={s.pad} {...joystick.panHandlers}><View style={[s.knob,{transform:[{translateX:knob.x},{translateY:knob.y}]}]}/></View><View style={{gap:10,alignItems:'center'}}>{!url&&<Pressable accessibilityLabel="Jump" style={s.action} onPress={()=>{if(jump.current.height===0)jump.current.velocity=5;}}><Text style={{fontWeight:'bold',color:'#17252b'}}>JUMP</Text></Pressable>}<Pressable style={s.action} onPress={action}><Text style={{fontWeight:'bold',color:'#17252b'}}>UNCOVER</Text></Pressable></View></View>{showAssetError&&!!assetError&&<View style={{position:'absolute',top:70,bottom:70,left:12,right:12,backgroundColor:'#20353d',padding:12,borderRadius:10}}><Pressable onPress={()=>setShowAssetError(false)}><Text style={{color:'#e7bc72',padding:10}}>Close diagnostics</Text></Pressable><ScrollView><Text selectable style={{color:'white',fontSize:12}}>GLB DIAGNOSTIC v3{'\n'}{assetError}</Text></ScrollView></View>}</View>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#182d36'},top:{position:'absolute',top:12,left:16,right:16,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#20353ddd',padding:12,borderRadius:12},text:{color:'white',fontWeight:'bold'},status:{position:'absolute',top:72,left:16,right:16,color:'white',backgroundColor:'#20353ddd',padding:12,borderRadius:10,textAlign:'center'},bottom:{position:'absolute',bottom:24,left:24,right:24,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},pad:{width:112,height:112,borderRadius:56,backgroundColor:'#20353d99',alignItems:'center',justifyContent:'center'},knob:{width:42,height:42,borderRadius:21,backgroundColor:'#f4d7a0'},action:{backgroundColor:'#e7bc72',padding:20,borderRadius:36}});
