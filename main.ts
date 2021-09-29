/// <reference lib="dom" />
import {
  component,
  innerHTML,
  wired,
} from "https://cdn.skypack.dev/capsid@1.7.0";
import seedrandom from "https://cdn.skypack.dev/seedrandom";

console.log(seedrandom);

const rng = seedrandom("hello.p");

const CELL_SIZE = 5;
const WAIT_STEPS = 10000;
const WAIT = 3;

@component("main")
@innerHTML(`<canvas></canvas>`)
export class Main {
  @wired("canvas")
  canvas!: HTMLCanvasElement;

  w!: number;
  h!: number;
  ctx!: CanvasRenderingContext2D;
  palette!: string[];

  __mount__() {
    this.w = 750 / CELL_SIZE;
    this.h = 250 / CELL_SIZE;
    this.canvas.width = this.w * 2 * CELL_SIZE;
    this.canvas.height = this.h * 2 * CELL_SIZE;
    this.canvas.style.width = `${this.w * CELL_SIZE}px`;
    this.canvas.style.height = `${this.h * CELL_SIZE}px`;
    this.ctx = this.canvas.getContext("2d")!;
    this.palette = random3Colors();
    this.ctx.fillStyle = this.palette[0];
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
  }

  async forEach(fn: (i: number, j: number) => void): Promise<void> {
    const { h, w } = this;
    await forEach(range(w * 2), range(h * 2), fn);
  }

  async draw() {
    const ctx = this.ctx;
    const { h, w } = this;
    ctx.fillStyle = "black";
    let n = 0;
    await this.forEach(async (i, j) => {
      const x = i / (w * 2);
      const r = 0.4;
      const th0 = (1 + Math.cos(2 * Math.PI * x)) / 3 + r;
      const y = j / (h * 2);
      const th1 = (1 + Math.cos(2 * Math.PI * y)) / 3 + r;
      if (probably(1 - th0 * th1)) {
        const c = probably(1 - th1) ? this.palette[1] : this.palette[2];
        setPixel(ctx, i, j, c);
      }
      if (n++ % WAIT_STEPS === 0) await delay(WAIT);
    });
    n = 0;
    await this.forEach(async (i, j) => {
      if ((i % 16 === 0 || i % 16 === 15) || (j % 16 === 0 || j % 16 === 15)) {
        const c = probably(0.95) ? "black" : this.palette[1];
        setPixel(ctx, i, j, c);
      }
      if (n++ % WAIT_STEPS === 0) await delay(WAIT);
    });
    let ctxCopy: CanvasRenderingContext2D;
    ctxCopy = clone(ctx);
    await this.forEach(async (i, j) => {
      const pixels = getPixels(ctxCopy, i, j);
      if (pixels[4]?.toUpperCase() === this.palette[1]
      && pixels[6]?.toUpperCase() === this.palette[1]) {
        const c = randomColor();
        if (probably(0.99)) setPixel(ctx, i, j, c);
      }
      if (n++ % WAIT_STEPS === 0) await delay(WAIT);
    });
    ctxCopy = clone(ctx);
    await this.forEach(async (i, j) => {
      const pixels = getPixels(ctxCopy, i, j);
      if (pixels.slice(0, 3).filter((x) => x?.toUpperCase() === this.palette[2]).length >= 2) {
        if (probably(0.10)) setPixel(ctx, i, j, this.palette[2]);
      }
      if (n++ % WAIT_STEPS === 0) await delay(WAIT);
    });
  }
}

function setPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function getPixel(ctx: CanvasRenderingContext2D, x: number, y: number): string | null {
  x *= CELL_SIZE;
  y *= CELL_SIZE;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  if (x < 0 || x >= w || y < 0 || y >= h) {
    return null;
  }
  const data = ctx.getImageData(x, y, 1, 1).data;
  return "#" + hex(data[0]) + hex(data[1]) + hex(data[2]);
}

function getPixels(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const res = Array(9);
  for (const i of range(3)) {
    for (const j of range(3)) {
      res[i + j * 3] = getPixel(ctx, x + i - 1, y + j - 1);
    }
  }
  return res;
}

function clone(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D {
    //create a new canvas
    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d')!;

    //set dimensions
    newCanvas.width = ctx.canvas.width;
    newCanvas.height = ctx.canvas.height;

    //apply the old canvas to the new one
    newCtx.drawImage(ctx.canvas, 0, 0);

    //return the new canvas
    return newCtx;
}

function hex(n: number) {
  return n.toString(16).padStart(2, "0");
}

async function forEach<T, U>(arr0: T[], arr1: U[], fn: (i: T, j: U) => void) {
  for (const i of arr0) {
    for (const j of arr1) {
      await fn(i, j);
    }
  }
}

function range(n: number): number[] {
  return [...new Array(n)].map((_, i) => i);
}

function dice(n: number) {
  return Math.floor(rng() * n);
}

function delay(n: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

const PALETTE = {
  "00": "#757575",
  "01": "#271B8F",
  "02": "#0000AB",
  "03": "#47009F",
  "04": "#8F0077",
  "05": "#AB0013",
  "06": "#A70000",
  "07": "#7F0B00",
  "08": "#432F00",
  "09": "#004700",
  "0A": "#005100",
  "0B": "#003F17",
  "0C": "#1B3F5F",
  "0D": "#000000",
  "0E": "#000000",
  "0F": "#000000",
  "10": "#BCBCBC",
  "11": "#0073EF",
  "12": "#233BEF",
  "13": "#8300F3",
  "14": "#BF00BF",
  "15": "#E7005B",
  "16": "#DB2B00",
  "17": "#CB4F0F",
  "18": "#8B7300",
  "19": "#009700",
  "1A": "#00AB00",
  "1B": "#00933B",
  "1C": "#00838B",
  "1D": "#000000",
  "1E": "#000000",
  "1F": "#000000",
  "20": "#FFFFFF",
  "21": "#3FBFFF",
  "22": "#5F73FF",
  "23": "#A78BFD",
  "24": "#F77BFF",
  "25": "#FF77B7",
  "26": "#FF7763",
  "27": "#FF9B3B",
  "28": "#F3BF3F",
  "29": "#83D313",
  "2A": "#4FDF4B",
  "2B": "#58F898",
  "2C": "#00EBDB",
  "2D": "#757575",
  "2E": "#000000",
  "2F": "#000000",
  "30": "#FFFFFF",
  "31": "#ABE7FF",
  "32": "#C7D7FF",
  "33": "#D7CBFF",
  "34": "#FFC7FF",
  "35": "#FFC7DB",
  "36": "#FFBFB3",
  "37": "#FFDBAB",
  "38": "#FFE7A3",
  "39": "#E3FFA3",
  "3A": "#ABF3BF",
  "3B": "#B3FFCF",
  "3C": "#9FFFF3",
  "3D": "#BCBCBC",
  "3E": "#000000",
  "3F": "#000000",
};

const choice = <T>(arr: T[]) => {
  return arr[dice(arr.length)];
};

const randomColor = () => {
  return choice(Object.values(PALETTE));
};

const random3Colors = () => {
  return [
    choice(Object.values(PALETTE)),
    choice(Object.values(PALETTE)),
    choice(Object.values(PALETTE)),
  ];
};

function probably(n: number): boolean {
  return rng() < n
}
