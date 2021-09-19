/// <reference lib="dom" />
import {
  component,
  innerHTML,
  wired,
} from "https://cdn.skypack.dev/capsid@1.7.0";

const CELL_SIZE = 10;

@component("main")
@innerHTML(`<canvas></canvas>`)
export class Main {
  @wired("canvas")
  canvas!: HTMLCanvasElement;

  w!: number;
  h!: number;
  ctx!: CanvasRenderingContext2D;

  __mount__() {
    this.w = 750 / CELL_SIZE;
    this.h = 250 / CELL_SIZE;
    this.canvas.width = this.w * 2 * CELL_SIZE;
    this.canvas.height = this.h * 2 * CELL_SIZE;
    this.canvas.style.width = `${this.w * CELL_SIZE}px`;
    this.canvas.style.height = `${this.h * CELL_SIZE}px`;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
  }

  async draw() {
    const ctx = this.ctx;
    const { h, w } = this;
    // ctx.fillStyle = "#1E3A8A";
    ctx.fillStyle = "black";
    let n = 0;
    for (const i of range(w * 2)) {
      const x = i / (w * 2);
      const r = 0.4;
      const th0 = (1 + Math.cos(2 * Math.PI * x)) / 3 + r;
      for (const j of range(h * 2)) {
        const y = j / (h * 2);
        const th1 = (1 + Math.cos(2 * Math.PI * y)) / 3 + r;
        if (Math.random() > th0 * th1) {
          ctx.fillStyle = randomColor();
          ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          if (n++ % 50 === 0) await delay(10);
        }
      }
    }
  }
}

function range(n: number): number[] {
  return [...new Array(n)].map((_, i) => i);
}

function dice(n: number) {
  return Math.floor(Math.random() * n);
}

function delay(n: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

const PALETTE = {
  '00': "#757575",
  '01': "#271B8F",
  '02': "#0000AB",
  '03': "#47009F",
  '04': "#8F0077",
  '05': "#AB0013",
  '06': "#A70000",
  '07': "#7F0B00",
  '08': "#432F00",
  '09': "#004700",
  '0A': "#005100",
  '0B': "#003F17",
  '0C': "#1B3F5F",
  '0D': "#000000",
  '0E': "#000000",
  '0F': "#000000",
  '10': "#BCBCBC",
  '11': "#0073EF",
  '12': "#233BEF",
  '13': "#8300F3",
  '14': "#BF00BF",
  '15': "#E7005B",
  '16': "#DB2B00",
  '17': "#CB4F0F",
  '18': "#8B7300",
  '19': "#009700",
  '1A': "#00AB00",
  '1B': "#00933B",
  '1C': "#00838B",
  '1D': "#000000",
  '1E': "#000000",
  '1F': "#000000",
  '20': "#FFFFFF",
  '21': "#3FBFFF",
  '22': "#5F73FF",
  '23': "#A78BFD",
  '24': "#F77BFF",
  '25': "#FF77B7",
  '26': "#FF7763",
  '27': "#FF9B3B",
  '28': "#F3BF3F",
  '29': "#83D313",
  '2A': "#4FDF4B",
  '2B': "#58F898",
  '2C': "#00EBDB",
  '2D': "#757575",
  '2E': "#000000",
  '2F': "#000000",
  '30': "#FFFFFF",
  '31': "#ABE7FF",
  '32': "#C7D7FF",
  '33': "#D7CBFF",
  '34': "#FFC7FF",
  '35': "#FFC7DB",
  '36': "#FFBFB3",
  '37': "#FFDBAB",
  '38': "#FFE7A3",
  '39': "#E3FFA3",
  '3A': "#ABF3BF",
  '3B': "#B3FFCF",
  '3C': "#9FFFF3",
  '3D': "#BCBCBC",
  '3E': "#000000",
  '3F': "#000000"
};

const randomColor = () => {
  const colors = Object.values(PALETTE);
  return colors[dice(colors.length)];
}
