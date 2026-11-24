import {useEffect,useRef,useState} from 'react';
import {AppState} from 'react-native';
import {useAudioPlayer} from 'expo-audio';
export function useQuayAudio(){
 const coast=useAudioPlayer(require('./assets/coast.wav'));
 const lamp=useAudioPlayer(require('./assets/waylamp.wav'));
 const fragment=useAudioPlayer(require('./assets/fragment.wav'));
 const step=useAudioPlayer(require('./assets/step.wav'));
 const jump=useAudioPlayer(require('./assets/jump.wav'));
 const land=useAudioPlayer(require('./assets/land.wav'));
 const [enabled,setEnabled]=useState(false);
 const enabledRef=useRef(false),active=useRef(AppState.currentState==='active');
 useEffect(()=>{
  enabledRef.current=enabled;
  coast.loop=true;coast.volume=.25;lamp.volume=.65;fragment.volume=.65;step.volume=.45;jump.volume=.5;land.volume=.5;
  if(enabled&&active.current)coast.play();else{coast.pause();lamp.pause();fragment.pause();step.pause();jump.pause();land.pause();}
  const sub=AppState.addEventListener('change',state=>{
   active.current=state==='active';
   if(active.current&&enabledRef.current)coast.play();else{coast.pause();lamp.pause();fragment.pause();step.pause();jump.pause();land.pause();}
  });
  return()=>{sub.remove();coast.pause();lamp.pause();fragment.pause();step.pause();jump.pause();land.pause();};
 },[enabled,coast,lamp,fragment,step,jump,land]);
 function discover(kind:'lamp'|'fragment'|'step'|'jump'|'land'){
  if(!enabledRef.current||!active.current)return;
  const player=kind==='lamp'?lamp:kind==='fragment'?fragment:kind==='step'?step:kind==='jump'?jump:land;
  void player.seekTo(0).then(()=>{if(enabledRef.current&&active.current)player.play();}).catch(e=>console.warn('Audio playback:',String(e)));
 }
 return {enabled,toggle:()=>setEnabled(v=>!v),discover};
}
