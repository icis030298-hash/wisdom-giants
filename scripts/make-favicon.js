/**
 * Rebuild src/app/favicon.ico from public/brand-solid.svg.
 *
 * The .ico is a container: header, one directory entry per size, then the
 * payloads. PNG payloads are legal from Vista on and are what every current
 * browser reads, so each entry is just a rasterised PNG rather than a BMP
 * with its own palette and mask.
 *
 * 16 / 32 / 48 to match what the manifest already advertises.
 */
const fs = require('fs');
const sharp = require('sharp');

const SVG = fs.readFileSync('public/brand-solid.svg');
const SIZES = [16, 32, 48];
const OUT = 'src/app/favicon.ico';

(async () => {
  const pngs = [];
  for (const s of SIZES) {
    const buf = await sharp(SVG, { density: 384 })
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    pngs.push({ size: s, buf });
    console.log('  ' + s + 'x' + s + '  ' + buf.length + ' bytes');
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type: icon
  header.writeUInt16LE(pngs.length, 4);  // count

  const dirSize = 16 * pngs.length;
  let offset = 6 + dirSize;
  const entries = [];
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0); // width
    e.writeUInt8(size === 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2);                       // palette colours
    e.writeUInt8(0, 3);                       // reserved
    e.writeUInt16LE(1, 4);                    // colour planes
    e.writeUInt16LE(32, 6);                   // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += buf.length;
  }

  const ico = Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
  fs.writeFileSync(OUT, ico);
  console.log('\nwrote ' + OUT + '  ' + ico.length + ' bytes');
})();
