import {useEffect,useRef,useState} from 'react';
import {AppState} from 'react-native';
import {useAudioPlayer} from 'expo-audio';
import * as Speech from 'expo-speech';
export function useQuayAudio(){
 const coast=useAudioPlayer(require('./assets/coast.wav'));
 const lamp=useAudioPlayer(require('./assets/waylamp.wav'));
 const fragment=useAudioPlayer(require('./assets/fragment.wav'));
 const step=useAudioPlayer(require('./assets/step.wav'));
 const jump=useAudioPlayer(require('./assets/jump.wav'));
 const land=useAudioPlayer(require('./assets/land.wav'));
 const pip=useAudioPlayer(require('./assets/pip.wav'));
 const mechanism=useAudioPlayer(require('./assets/mechanism.wav'));
 const theme=useAudioPlayer(require('./assets/theme.wav'));
 const [enabled,setEnabled]=useState(false),[music,setMusic]=useState(false),[voice,setVoice]=useState(false);
 const settings=useRef({enabled:false,music:false,voice:false}),active=useRef(AppState.currentState==='active');
 useEffect(()=>{
  settings.current={enabled,music,voice};
  coast.loop=true;theme.loop=true;coast.volume=.25;theme.volume=.22;
  lamp.volume=.65;fragment.volume=.65;step.volume=.45;jump.volume=.5;land.volume=.5;pip.volume=.4;mechanism.volume=.45;
  function sync(){
   if(active.current&&settings.current.enabled)coast.play();else{coast.pause();for(const p of [lamp,fragment,step,jump,land,pip,mechanism])p.pause();}
   if(active.current&&settings.current.music)theme.play();else theme.pause();
   if(!active.current||!settings.current.voice)void Speech.stop();
  }
  sync();const sub=AppState.addEventListener('change',state=>{active.current=state==='active';sync();});
  return()=>{sub.remove();for(const p of [coast,lamp,fragment,step,jump,land,pip,mechanism,theme])p.pause();void Speech.stop();};
 },[enabled,music,voice,coast,lamp,fragment,step,jump,land,pip,mechanism,theme]);
 function discover(kind:'lamp'|'fragment'|'step'|'jump'|'land'|'pip'|'mechanism'){
  if(!settings.current.enabled||!active.current)return;
  const player={lamp,fragment,step,jump,land,pip,mechanism}[kind];
  void player.seekTo(0).then(()=>{if(settings.current.enabled&&active.current)player.play();}).catch(e=>console.warn('Audio playback:',String(e)));
 }
 function speak(line:string){if(settings.current.voice&&active.current){void Speech.stop().then(()=>{if(settings.current.voice&&active.current)Speech.speak(line,{language:'en',rate:.9});}).catch(e=>console.warn('Dialogue:',String(e)));}}
 return {enabled,music,voice,toggle:()=>setEnabled(v=>!v),toggleMusic:()=>setMusic(v=>!v),toggleVoice:()=>setVoice(v=>!v),discover,speak};
}
