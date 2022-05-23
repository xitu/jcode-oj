import {getModule, desc, expect} from '../lib';

(async () => {
  const {add} = await getModule();
  const text = require('./a_plus_b.md');
  desc(text);

  expect('1 + 1', () => add(1, 1), 2);
  expect('a + b', () => add('a', 'b'), 'ab');
  expect('-1 + 1', () => add(-1, 1), 0);
})();