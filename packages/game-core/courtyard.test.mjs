import test from 'node:test';
import assert from 'node:assert/strict';
import {initialPlayer,move,interact} from './courtyard.mjs';
test('movement stays within courtyard',()=>{let p=initialPlayer;for(let i=0;i<300;i++)p=move(p,1,0,.05);assert.ok(p.x<=7.5);});
test('wall blocks movement',()=>{let p={...initialPlayer,z:-3};for(let i=0;i<100;i++)p=move(p,0,-1,.05);assert.ok(p.z>-4.4);});
test('lamp and wall require proximity and order',()=>{assert.equal(interact(initialPlayer).hasLamp,false);let p=interact({...initialPlayer,x:3,z:2});assert.equal(p.hasLamp,true);assert.equal(interact(p).revealed,false);assert.equal(interact({...p,x:0,z:-3.8}).revealed,true);});
