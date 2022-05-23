import {getModule, desc, expect} from '../lib';

(async () => {
  const {solve} = await getModule();
  const text = require('./array_sum.md');
  desc(text);

  expect('1,2,3', () => solve([1, 2, 3]), []);
  expect('1,8,9,-1,11', () => solve([1, 8, 9, -1, 11])
    .sort((a, b) => a - b), [-1, 1, 9, 11]);
  expect('3,3,3,7,7', () => solve([3, 3, 3, 7, 7])
    .sort((a, b) => a - b), [3, 3, 7, 7]);
})();