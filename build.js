const fs = require('fs');
const path = require('path');
const {version} = require('./package.json');

function getAllCases(dir = 'src') {
  const ret = [];
  fs.readdirSync(dir).forEach((filename) => {
    if(filename.endsWith('.js')) {
      ret.push(path.join(dir, filename));
    }
  });
  return ret;
}

const options = {
  entryPoints: getAllCases(),
  outdir: 'dist',
  bundle: true,
  loader: {
    '.md': 'text',
    '.css': 'text',
  },
  define: {
    VERSION: `"${version}"`,
  },
};

if(process.env.mode === 'production') {
  require('esbuild').buildSync({minify: true, ...options});
} else {
  require('esbuild').serve({
    servedir: '.',
  }, options).then((server) => {
    console.log(`Server is running at ${server.host}:${server.port}`);
    const scriptURL = `http://localhost:${server.port}/${options.outdir}`;
    console.log(`打开 https://code.juejin.cn
设置 ${scriptURL}/<case文件名> 到 script 依赖资源，进行调试。`);
  });
}