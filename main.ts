/// <reference lib="dom" />
import {
  component,
  innerHTML,
  wired,
} from "https://cdn.skypack.dev/capsid@1.7.0";

@component("main")
@innerHTML(`<canvas></canvas>`)
export class Main {
  @wired("canvas")
  canvas!: HTMLCanvasElement;

  w!: number;
  h!: number;
  ctx!: CanvasRenderingContext2D;

  __mount__() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.w = 750;
    this.h = 250;
    this.canvas.width = this.w * 2;
    this.canvas.height = this.h * 2;
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx = this.canvas.getContext("2d")!;
    console.log(this.w, this.h);
    // this.ctx.fillStyle = "white";
    this.ctx.fillStyle = "#93C5FD";
    this.ctx.fillStyle = "#F9FAFB";
    this.ctx.fillRect(0, 0, this.w * 2, this.h * 2);
    this.draw();
  }

  async draw() {
    const ctx = this.ctx;
    const { h, w } = this;
    // ctx.fillStyle = "#1E3A8A";
    ctx.fillStyle = "#60A5FA";
    ctx.fillStyle = "#374151";
    let n = 0;
    for (const i of range(w * 2)) {
      const x = i / (w * 2);
      const r = 0.7;
      const th0 = (1 + Math.cos(6 * 6 * Math.PI * x)) / 3 + r;
      const th0_1 = (1 + Math.cos(6 * Math.PI * x)) / 3 + r;
      for (const j of range(h * 2)) {
        const y = j / (h * 2);
        const th1 = (1 + Math.cos(6 * 2 * Math.PI * y)) / 3 + r;
        const th1_1 = (1 + Math.cos(2 * Math.PI * y)) / 3 + r;
        if (Math.random() < th0 * th0_1 * th1 * th1_1) {
          ctx.fillRect(i, j, 1, 1);
          if (n++ % 1000 === 0) await delay(1);
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
