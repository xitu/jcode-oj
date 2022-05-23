import {marked} from 'marked';

const opts = {
  highlight(code, lang) {
    const Prism = require('prismjs');
    const language = Prism.languages[lang];
    if(language) {
      return Prism.highlight(code, language, lang);
    }
    return code;
  },
  // langPrefix: 'language-',
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  headerIds: false,
};

export default function (mdText) {
  const el = document.querySelector('oj-desc');
  if(el) {
    let root = el;
    if(el.attachShadow) {
      root = el.attachShadow({mode: 'open'});
    } else if(el.createShadowRoot) {
      root = el.createShadowRoot();
    }
    marked.setOptions(opts);
    const html = marked.parse(mdText);
    root.innerHTML = html;
    const css = require('./css/prism.css');
    const style = document.createElement('style');
    style.textContent = css;
    root.appendChild(style);
  }
  return el;
}