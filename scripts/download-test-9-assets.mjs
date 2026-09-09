import fs from 'node:fs';
import path from 'node:path';

async function downloadAssets() {
  const base = 'https://online.flipbuilder.com/sdtta/lwxv/';
  const rootDir = path.resolve('content/test-9-assets');
  const audioDir = path.join(rootDir, 'audio');
  const rawDir = path.join(rootDir, 'raw');
  const imgDir = path.join(rootDir, 'images');

  fs.mkdirSync(audioDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });

  // Download audio tracks
  const audios = [
    { track: '02.mp3', name: 'test9-lis-part1.mp3' }, // Part 2 in book = Part 1 in Test 9
    { track: '03.mp3', name: 'test9-lis-part2.mp3' }, // Part 3 in book = Part 2 in Test 9
    { track: '04.mp3', name: 'test9-lis-part3.mp3' }, // Part 4 in book = Part 3 in Test 9
  ];

  for (const a of audios) {
    const dest = path.join(audioDir, a.name);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading ${a.track} -> ${a.name}...`);
      const res = await fetch(`${base}files/pageConfig/${a.track}`);
      if (!res.ok) throw new Error(`Failed to download ${a.track}: ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`Saved ${a.name} (${buf.length} bytes)`);
    } else {
      console.log(`Already exists: ${a.name}`);
    }
  }

  // Download raw pages
  for (const p of [6, 7, 8, 9, 10, 11]) {
    const dest = path.join(rawDir, `page-${p}.jpg`);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading page ${p}...`);
      const res = await fetch(`${base}files/mobile/${p}.jpg`);
      if (!res.ok) throw new Error(`Failed to download page ${p}: ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`Saved page-${p}.jpg (${buf.length} bytes)`);
    } else {
      console.log(`Already exists: page-${p}.jpg`);
    }
  }

  console.log('All basic assets downloaded successfully.');
}

downloadAssets().catch(console.error);
