import {getModule, desc, expect} from '../lib';

(async () => {
  // set description
  const text = require('./a_plus_b.md');
  desc(text);

  const {add} = await getModule();

  // add testcases
  expect('1 + 1', () => add(1, 1), 2);
  expect('a + b', () => add('a', 'b'), 'ab');
  expect('-1 + 1', () => add(-1, 1), 0);
})();