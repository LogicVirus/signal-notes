import { deflateSync } from "node:zlib";

const width = 1200;
const height = 630;
const pixels = new Uint8ClampedArray(width * height * 4);

const ink = [21, 21, 21, 255];
const paper = [248, 247, 242, 255];
const panel = [255, 255, 255, 255];
const lineColor = [222, 219, 208, 255];
const teal = [15, 111, 104, 255];
const rust = [162, 77, 43, 255];
const plum = [79, 61, 117, 255];
const gold = [155, 122, 36, 255];
const sky = [61, 100, 119, 255];

fill(paper);
rect(46, 42, 1108, 546, panel);
strokeRect(46, 42, 1108, 546, ink, 3);

rect(82, 84, 392, 464, [246, 244, 237, 255]);
rect(512, 84, 560, 88, [246, 244, 237, 255]);
rect(512, 206, 560, 104, [246, 244, 237, 255]);
rect(512, 344, 560, 104, [246, 244, 237, 255]);
rect(512, 482, 560, 40, [246, 244, 237, 255]);

strokeRect(82, 84, 392, 464, lineColor, 2);
strokeRect(512, 84, 560, 88, lineColor, 2);
strokeRect(512, 206, 560, 104, lineColor, 2);
strokeRect(512, 344, 560, 104, lineColor, 2);
strokeRect(512, 482, 560, 40, lineColor, 2);

line(150, 175, 406, 175, ink, 8);
line(150, 232, 330, 232, rust, 8);
line(150, 289, 380, 289, teal, 8);
line(150, 346, 292, 346, plum, 8);
line(150, 403, 350, 403, gold, 8);

circle(664, 128, 19, teal);
circle(780, 128, 19, rust);
circle(896, 128, 19, gold);
circle(1012, 128, 19, plum);

line(610, 258, 1024, 258, ink, 7);
line(610, 284, 860, 284, sky, 7);
line(610, 396, 1018, 396, ink, 7);
line(610, 422, 900, 422, rust, 7);
line(610, 502, 956, 502, gold, 7);

for (let x = 144; x <= 412; x += 67) {
  circle(x, 500, 11, x % 2 === 0 ? rust : teal);
}

for (let x = 620; x <= 1030; x += 82) {
  line(x, 92, x, 164, lineColor, 2);
  line(x, 214, x, 302, lineColor, 2);
  line(x, 352, x, 440, lineColor, 2);
}

circle(98, 101, 10, teal);
circle(126, 101, 10, rust);
circle(154, 101, 10, gold);

await Bun.write("public/signal-notes-og.png", encodePng());

function encodePng(): Buffer {
  const scanlines = Buffer.alloc((width * 4 + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    scanlines[rowStart] = 0;

    for (let x = 0; x < width; x += 1) {
      const source = (y * width + x) * 4;
      const target = rowStart + 1 + x * 4;
      scanlines[target] = pixels[source];
      scanlines[target + 1] = pixels[source + 1];
      scanlines[target + 2] = pixels[source + 2];
      scanlines[target + 3] = pixels[source + 3];
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr()),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function ihdr(): Buffer {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = 8;
  data[9] = 6;
  data[10] = 0;
  data[11] = 0;
  data[12] = 0;
  return data;
}

function chunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let index = 0; index < 8; index += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function fill(color: number[]) {
  rect(0, 0, width, height, color);
}

function rect(x: number, y: number, w: number, h: number, color: number[]) {
  for (let py = y; py < y + h; py += 1) {
    for (let px = x; px < x + w; px += 1) {
      setPixel(px, py, color);
    }
  }
}

function strokeRect(x: number, y: number, w: number, h: number, color: number[], size: number) {
  rect(x, y, w, size, color);
  rect(x, y + h - size, w, size, color);
  rect(x, y, size, h, color);
  rect(x + w - size, y, size, h, color);
}

function line(x1: number, y1: number, x2: number, y2: number, color: number[], size: number) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let error = dx - dy;
  let x = x1;
  let y = y1;

  while (true) {
    circle(x, y, Math.max(1, Math.floor(size / 2)), color);

    if (x === x2 && y === y2) {
      break;
    }

    const doubleError = error * 2;
    if (doubleError > -dy) {
      error -= dy;
      x += sx;
    }

    if (doubleError < dx) {
      error += dx;
      y += sy;
    }
  }
}

function circle(cx: number, cy: number, radius: number, color: number[]) {
  const radiusSquared = radius * radius;

  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      const dx = x - cx;
      const dy = y - cy;

      if (dx * dx + dy * dy <= radiusSquared) {
        setPixel(x, y, color);
      }
    }
  }
}

function setPixel(x: number, y: number, color: number[]) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return;
  }

  const offset = (y * width + x) * 4;
  pixels[offset] = color[0];
  pixels[offset + 1] = color[1];
  pixels[offset + 2] = color[2];
  pixels[offset + 3] = color[3];
}
