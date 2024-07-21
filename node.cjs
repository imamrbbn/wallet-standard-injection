const fs = require('fs');

// Read the bundled file
const bundledCode = fs.readFileSync('lib/bundle.js', 'utf8');

fs.writeFileSync('lib/MobileWalletStandard.ts', `export default ${JSON.stringify(bundledCode)}`, {
  encoding: 'utf-8',
});

console.log('Finished');
