import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lightWeights, scrollProgress } from '../src/scripts/scroll-progress.ts';
test('short pages and overscroll stay in the valid range', () => {
  assert.equal(scrollProgress(0, 600, 800), 0);
  assert.equal(scrollProgress(-20, 1800, 800), 0);
  assert.equal(scrollProgress(2000, 1800, 800), 1);
});
test('actual document progress is reversible and responds to content height changes', () => {
  assert.equal(scrollProgress(500, 1800, 800), .5);
  assert.equal(scrollProgress(500, 2800, 800), .25);
  const first = lightWeights(scrollProgress(500, 1800, 800));
  lightWeights(scrollProgress(800, 1800, 800));
  assert.deepEqual(lightWeights(scrollProgress(500, 1800, 800)), first);
});
test('illumination weights stay bounded and change continuously', () => {
  let previous = lightWeights(0);
  for (let i = 1; i <= 1000; i++) {
    const current = lightWeights(i / 1000);
    for (const key of ['sage', 'lilac', 'pink'] as const) {
      assert.ok(current[key] >= 0 && current[key] <= 1);
      assert.ok(Math.abs(current[key] - previous[key]) < .005);
    }
    previous = current;
  }
});
