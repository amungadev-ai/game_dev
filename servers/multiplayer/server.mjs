import {createServer} from 'node:http';
import {randomUUID} from 'node:crypto';
import {initialPlayer,move,interact} from '../../packages/game-core/courtyard.mjs';
const players=new Map();let revealed=false;
const snapshot=()=>({revealed,players:[...players].map(([id,p])=>({id,...p.state}))});
const server=createServer(async(req,res)=>{
 res.setHeader('Content-Type','application/json');res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
 const send=(code,data)=>{res.writeHead(code);res.end(JSON.stringify(data));};
 if(req.method==='OPTIONS')return send(200,{});
 if(req.method==='GET'&&req.url==='/health')return send(200,{ok:true});
 if(req.method!=='POST')return send(404,{error:'not found'});
 try{
 let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>2048)return send(413,{error:'too large'});}
 const b=JSON.parse(raw||'{}'),now=Date.now();
 if(req.url==='/join'){if(players.size>=4)return send(409,{error:'room full'});const id=randomUUID();players.set(id,{state:{...initialPlayer},seen:now,last:now});return send(200,{id,...snapshot()});}
 const p=players.get(b.id);if(!p)return send(401,{error:'unknown player'});
 if(req.url==='/leave'){players.delete(b.id);return send(200,{});}
 if(req.url!=='/step')return send(404,{error:'not found'});
 const dt=Math.min((now-p.last)/1000,.15);p.last=now;p.seen=now;
 const axis=v=>typeof v==='number'&&Number.isFinite(v)?Math.max(-1,Math.min(1,v)):0;
 for(let t=dt;t>0;t-=.05)p.state=move(p.state,axis(b.x),axis(b.z),Math.min(t,.05));
 if(b.action===true)p.state=interact(p.state);
 if(p.state.revealed)revealed=true;
 return send(200,snapshot());
 }catch{return send(400,{error:'invalid request'});}
});
setInterval(()=>{for(const [id,p] of players)if(Date.now()-p.seen>15000)players.delete(id);if(!players.size)revealed=false;},1000).unref();
server.listen(2567,'0.0.0.0',()=>console.log('Local prototype server listening on port 2567. Trusted LAN only.'));
