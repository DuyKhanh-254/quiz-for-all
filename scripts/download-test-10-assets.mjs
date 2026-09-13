import fs from 'node:fs';
import path from 'node:path';

async function downloadTest10() {
  const base = 'https://online.flipbuilder.com/sdtta/motw/';
  const rootDir = path.resolve('content/test-10-assets');
  const audioDir = path.join(rootDir, 'audio');
  const rawDir = path.join(rootDir, 'raw');
  const imgDir = path.join(rootDir, 'images');

  fs.mkdirSync(audioDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });

  // Download audio track
  const audioFile = '10 Track 10_3.mp3';
  const audioUrl = `${base}files/pageConfig/${encodeURIComponent(audioFile)}`;
  const audioDest = path.join(audioDir, 'test10-lis-part2.mp3');

  console.log(`Downloading audio from ${audioUrl}...`);
  const aRes = await fetch(audioUrl);
  if (!aRes.ok) throw new Error(`Audio download failed: ${aRes.status}`);
  const aBuf = Buffer.from(await aRes.arrayBuffer());
  fs.writeFileSync(audioDest, aBuf);
  console.log(`Saved audio to ${audioDest} (${aBuf.length} bytes)`);

  // Download pages 33, 34, 35
  for (const p of [33, 34, 35]) {
    const pageUrl = `${base}files/mobile/${p}.jpg`;
    const pageDest = path.join(rawDir, `page-${p}.jpg`);
    console.log(`Downloading page ${p} from ${pageUrl}...`);
    const pRes = await fetch(pageUrl);
    if (!pRes.ok) {
      console.log(`Page ${p} status: ${pRes.status}`);
      continue;
    }
    const pBuf = Buffer.from(await pRes.arrayBuffer());
    fs.writeFileSync(pageDest, pBuf);
    console.log(`Saved page-${p}.jpg (${pBuf.length} bytes)`);
  }

  console.log('Download complete!');
}

downloadTest10().catch(console.error);
