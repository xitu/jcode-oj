const all = {passed: 0, failed: 0, timeout: 0, total: 0};
let root = null;
function getRoot() {
  if(root) return root;
  const el = document.querySelector('oj-test');
  if(!el) {
    return;
  }
  root = el;
  if(el.attachShadow) {
    root = el.attachShadow({mode: 'open'});
  } else if(el.createShadowRoot) {
    root = el.createShadowRoot();
  }
  const total = document.createElement('div');
  root.appendChild(total);
  total.setAttribute('part', 'oj-total');
  const ul = document.createElement('ul');
  root.appendChild(ul);
  ul.setAttribute('part', 'oj-list');

  total.addEventListener('click', ({target}) => {
    target.className = target.classNam === 'expand' ? target.classNam = '' : target.classNam = 'expand';
  });

  const style = document.createElement('style');
  style.textContent = `
div {
  cursor: pointer;
}
div::before {
  content: ' ';
  display: inline-block;
  border: 8px solid transparent;
  border-left: 10px solid;
  position: relative;
  top: 3px;
  transition: transform .5s;
}
div.expand::before {
  transform: rotate(90deg);
  top: 6px;
  left: -3px;
}
ul {
  display: none;
}
div.expand + ul {
  display: block;
}
  `;
  root.appendChild(style);
  return root;
}

function outputResult({status, desc, costTime}) {
  const list = getRoot().querySelector('ul');
  if(list) {
    const row = document.createElement('li');
    if(status === 'pass') {
      row.innerHTML = `${desc} 结果<span style="color:green">正确</span> 耗时 ${costTime}`;
    } else if(status === 'timeout') {
      row.innerHTML = `${desc} 运行<span style="color:red">超时</span>`;
    } else {
      row.innerHTML = `${desc} 结果<span style="color:red">错误</span>`;
    }
    list.appendChild(row);
  } else if(status === 'pass') {
    console.log(`${desc} 结果正确 耗时 ${costTime}`);
  } else if(status === 'timeout') {
    console.error(`${desc} 运行超时`);
  } else {
    console.error(`${desc} 结果错误`);
  }
  if(status === 'pass') {
    all.passed++;
  } else if(status === 'timeout') {
    all.timeout++;
  } else {
    all.failed++;
  }
  const total = getRoot().querySelector('div');
  total.innerHTML = `运行结果：正确 ${all.passed}, 错误 ${all.failed}, 超时 ${all.timeout}`;
  all.total++;
}

const isPrimitive = val => !['object', 'function'].includes(typeof val) || val === null;

function equal(a, b) {
  if(isPrimitive(a) && isPrimitive(b) && a === b) return true;
  if(!isPrimitive(a) && !isPrimitive(b)) {
    if(Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
      return a.every((item, index) => equal(item, b[index]));
    }
    if(JSON.stringify(a) === JSON.stringify(b)) return true;
  }
  return false;
}

export default async function expect(desc, expr, accept = true, timeLimit = Infinity) {
  const ret = {desc};
  const startTime = performance.now();
  const result = await expr();
  ret.costTime = performance.now() - startTime;
  if(equal(result, accept)) {
    ret.status = ret.costTime <= timeLimit ? 'pass' : 'timeout';
  } else {
    ret.status = 'fail';
  }
  outputResult(ret);
  return ret;
}