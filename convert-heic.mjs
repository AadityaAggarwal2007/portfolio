import { readFileSync, writeFileSync, readdirSync } from 'fs';
import convert from 'heic-convert';
import { join } from 'path';

const srcDir = 'C:/Users/Aaditya Aggarwal/Desktop/Photos';
const outDir = 'C:/Users/Aaditya Aggarwal/Desktop/Billing phone app]/urja-website/public/photos';

const files = readdirSync(srcDir).filter(f => f.toLowerCase().endsWith('.heic'));

for (const file of files) {
  try {
    console.log(`Converting ${file}...`);
    const inputBuffer = readFileSync(join(srcDir, file));
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.85
    });
    const outName = file.replace(/\.heic$/i, '.jpg');
    writeFileSync(join(outDir, outName), outputBuffer);
    console.log(`  -> ${outName} done`);
  } catch (e) {
    console.error(`  Failed: ${e.message}`);
  }
}
console.log('All done!');
