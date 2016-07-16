import test from 'ava';

import AsyncManager, {CoroutineIterator} from '../src/Async';

function* immediate() {
  yield new Promise((resolve) => {resolve()});
}

test.cb('scheduled coroutines are executed', (t) => {
  t.plan(1);

  const asyncManager = new AsyncManager();
  asyncManager.startAt(0);

  asyncManager.schedule(function* (): CoroutineIterator {
    t.pass();
    t.end();
  });
});

test.cb('coroutines that yield promises are correctly executed', (t) => {
  t.plan(1);

  const asyncManager = new AsyncManager();
  asyncManager.startAt(0);

  asyncManager.schedule(function* () {
    yield new Promise((resolve) => {resolve()});
    t.pass();
    t.end();
  });
});

test.cb('nested coroutines are correctly executed', (t) => {
  t.plan(1);

  const asyncManager = new AsyncManager();
  asyncManager.startAt(0);

  asyncManager.schedule(function* () {
    yield immediate();
    t.pass();
    t.end();
  });
});