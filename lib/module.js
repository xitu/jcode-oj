function sleep(ms = 50) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBlobURL(jsCode) {
  const blob = new Blob([jsCode], {type: 'text/javascript'});
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

export default async function getModule() {
  let script = document.querySelectorAll('script[type=module]');
  while(script.length <= 0) {
    // eslint-disable-next-line no-await-in-loop
    await sleep();
    script = document.querySelectorAll('script[type=module]');
  }
  const code = script[script.length - 1].textContent;
  const url = getBlobURL(code);
  const ret = await import(url);
  return ret;
}