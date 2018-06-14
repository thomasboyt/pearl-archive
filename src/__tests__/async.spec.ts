// import test from 'ava';

import AsyncManager from '../Async';

function* immediate() {
  yield new Promise((resolve) => {resolve(); });
}

describe('async manager', () => {
  test('runs scheduled coroutines', (done) => {

    const asyncManager = new AsyncManager();
    asyncManager.startAt(0);

    asyncManager.schedule(function* (): IterableIterator<Promise<any>> {
      done();
    });
  })

  test('coroutines that yield promises are correctly executed', (done) => {
    const asyncManager = new AsyncManager();
    asyncManager.startAt(0);

    asyncManager.schedule(function* () {
      yield new Promise((resolve) => {resolve(); });
      done();
    });
  });

  test('nested coroutines are correctly executed', (done) => {
    const asyncManager = new AsyncManager();
    asyncManager.startAt(0);

    asyncManager.schedule(function* () {
      yield immediate();
      done();
    });
  });

  test('ensure waitMs() yields correctly', (done) => {
    const asyncManager = new AsyncManager();
    asyncManager.startAt(0);

    asyncManager.schedule(function* () {
      yield asyncManager.waitMs(25);

      done();
    });

    asyncManager.update(25);
  });

  test('multiple waitForMs timers set for the same time are executed', (done) => {
    const asyncManager = new AsyncManager();
    asyncManager.startAt(0);

    let numExecuted = 0;

    const incExecuted = () => {
      numExecuted += 1;
      if (numExecuted === 2) {
        done();
      }
    };

    asyncManager.schedule(function* () {
      yield asyncManager.waitMs(25);
      incExecuted();
    });

    asyncManager.schedule(function* () {
      yield asyncManager.waitMs(25);
      incExecuted();
    });

    asyncManager.update(25);
  });

  // TODO
  test.skip(
    'ensure timers are executed in the correct order when multiple timers are triggered in one frame',
    (done) => {
    const asyncManager = new AsyncManager();
    asyncManager.startAt(0);

    let numReached = 0;

    asyncManager.schedule(function* () {
      yield asyncManager.waitMs(100);

      numReached += 1;
      expect(numReached).toBe(2);
      done();
    });

    asyncManager.schedule(function* () {
      yield asyncManager.waitMs(50);

      numReached += 1;
      expect(numReached).toBe(1);
    });

    asyncManager.update(200);
  });
});