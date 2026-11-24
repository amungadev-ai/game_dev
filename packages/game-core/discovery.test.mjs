import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, advance } from './discovery.mjs';
test('lamp precedes reveal and restart resets experiment', () => {
 const acquired=advance(initialState);
 assert.deepEqual(acquired,{hasLamp:true,revealed:false});
 const revealed=advance(acquired);
 assert.deepEqual(revealed,{hasLamp:true,revealed:true});
 assert.deepEqual(advance(revealed),initialState);
 assert.deepEqual(initialState,{hasLamp:false,revealed:false});
});

