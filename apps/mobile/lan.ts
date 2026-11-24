import {useEffect,useRef,useState} from 'react';
import type {Player} from '../../packages/game-core/courtyard.mjs';
export type Remote=Player&{id:string};
type Snapshot={id?:string;revealed:boolean;players:Remote[]};
export function useLan(url:string|undefined,input:React.RefObject<{x:number;z:number}>,player:React.RefObject<Player>){
 const [status,setStatus]=useState(url?'Connecting':'Solo');const remotes=useRef<Remote[]>([]),action=useRef(false);
 useEffect(()=>{if(!url)return;let stopped=false,id='',timer:ReturnType<typeof setTimeout>;const base=url.replace(/\/$/,'');
 async function post(path:string,body:object){const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw Error('HTTP '+r.status);return await r.json() as Snapshot;}
 async function loop(){try{const s=await post(id?'/step':'/join',id?{id,...input.current,action:action.current}:{});if(stopped)return;action.current=false;id=s.id||id;const own=s.players.find(p=>p.id===id);if(own)player.current={...own,revealed:s.revealed};remotes.current=s.players.filter(p=>p.id!==id);setStatus('LAN connected');timer=setTimeout(loop,50);}catch(e){if(!stopped){setStatus('LAN error: '+String(e));remotes.current=[];}}}
 void loop();return()=>{stopped=true;clearTimeout(timer);if(id)void post('/leave',{id}).catch(()=>{});};
 },[url,input,player]);return {status,remotes,action};
}
