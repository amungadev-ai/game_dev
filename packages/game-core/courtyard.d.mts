export interface Player {x:number;z:number;hasLamp:boolean;revealed:boolean}
export const initialPlayer:Player;
export const obstacles:{x:number;z:number;w:number;d:number}[];
export function move(p:Player,x:number,z:number,dt:number):Player;
export function interact(p:Player):Player;
