import * as THREE from 'three';
export type MotionState='idle'|'walk'|'run'|'jump'|'discover';
export class CharacterAnimation {
 private mixer:THREE.AnimationMixer;
 private actions=new Map<MotionState,THREE.AnimationAction>();
 private current?:THREE.AnimationAction;
 constructor(private root:THREE.Object3D,clips:THREE.AnimationClip[]){
  this.mixer=new THREE.AnimationMixer(root);
  for(const state of ['idle','walk','run','jump','discover'] as const){
   const clip=clips.find(c=>c.name.trim().toLowerCase()===state);
   if(clip){const action=this.mixer.clipAction(clip);if(state==='jump'||state==='discover'){action.setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;}this.actions.set(state,action);}
  }
 }
 setState(state:MotionState){
  const next=this.actions.get(state)??(state==='run'?this.actions.get('walk'):undefined)??this.actions.get('idle');
  if(!next||next===this.current)return;
  next.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).play();
  if(this.current)this.current.crossFadeTo(next,.18,false);
  this.current=next;
 }
 update(dt:number){this.mixer.update(Math.max(0,Math.min(dt,.05)));}
 dispose(){this.mixer.stopAllAction();this.mixer.uncacheRoot(this.root);this.actions.clear();this.current=undefined;}
}
export function locomotionState(speed:number):MotionState{return speed<.08?'idle':speed<.8?'walk':'run';}
