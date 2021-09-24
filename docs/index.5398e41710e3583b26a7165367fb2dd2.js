(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // deno:https://cdn.skypack.dev/-/capsid@v1.7.0-evHDCFdG3Gl3tf0yl91t/dist=es2020,mode=imports/optimized/capsid.js
  function createCommonjsModule(fn, basedir, module) {
    return module = {
      path: basedir,
      exports: {},
      require: function(path, base) {
        return commonjsRequire(path, base === void 0 || base === null ? module.path : base);
      }
    }, fn(module, module.exports), module.exports;
  }
  function commonjsRequire() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
  }
  var capsidCjs = createCommonjsModule(function(module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ccc = {};
    function check(assertion, message) {
      if (!assertion) {
        throw new Error(message);
      }
    }
    function checkComponentNameIsValid(name) {
      check(typeof name === "string", "The name should be a string");
      check(!!ccc[name], "The coelement of the given name is not registered: " + name);
    }
    var READY_STATE_CHANGE = "readystatechange";
    var doc = document;
    var ready = new Promise(function(resolve) {
      var checkReady = function() {
        if (doc.readyState === "complete") {
          resolve();
          doc.removeEventListener(READY_STATE_CHANGE, checkReady);
        }
      };
      doc.addEventListener(READY_STATE_CHANGE, checkReady);
      checkReady();
    });
    var prep2 = function(name, el) {
      var classNames;
      if (!name) {
        classNames = Object.keys(ccc);
      } else {
        checkComponentNameIsValid(name);
        classNames = [name];
      }
      classNames.map(function(className) {
        [].map.call((el || doc).querySelectorAll(ccc[className].sel), ccc[className]);
      });
    };
    var COELEMENT_DATA_KEY_PREFIX = "C$";
    var KEY_EVENT_LISTENERS = "K$";
    var COMPONENT_NAME_KEY = "N$";
    var BEFORE_MOUNT_KEY = "B$";
    var mount2 = function(Constructor, el) {
      var coel = new Constructor();
      coel.el = el;
      var list = Constructor[BEFORE_MOUNT_KEY];
      if (Array.isArray(list)) {
        list.forEach(function(cb) {
          cb(el, coel);
        });
      }
      if (typeof coel.__mount__ === "function") {
        coel.__mount__();
      }
      return coel;
    };
    var addHiddenItem = function(target, key, hook) {
      target[key] = (target[key] || []).concat(hook);
    };
    var addMountHook2 = function(target, hook) {
      addHiddenItem(target, BEFORE_MOUNT_KEY, hook);
    };
    var def2 = function(name, Constructor) {
      check(typeof name === "string", "`name` of a class component has to be a string.");
      check(typeof Constructor === "function", "`Constructor` of a class component has to be a function");
      Constructor[COMPONENT_NAME_KEY] = name;
      var initClass = name + "-\u{1F48A}";
      addMountHook2(Constructor, function(el, coel) {
        el[COELEMENT_DATA_KEY_PREFIX + name] = coel;
        el.classList.add(name, initClass);
      });
      var initializer = function(el) {
        if (!el.classList.contains(initClass)) {
          mount2(Constructor, el);
        }
      };
      initializer.sel = "." + name + ":not(." + initClass + ")";
      ccc[name] = initializer;
      ready.then(function() {
        prep2(name);
      });
    };
    var get2 = function(name, el) {
      checkComponentNameIsValid(name);
      var coel = el[COELEMENT_DATA_KEY_PREFIX + name];
      check(coel, "no coelement named: " + name + ", on the dom: " + el.tagName);
      return coel;
    };
    var make2 = function(name, elm) {
      checkComponentNameIsValid(name);
      ccc[name](elm);
      return get2(name, elm);
    };
    var unmount2 = function(name, el) {
      var coel = get2(name, el);
      if (typeof coel.__unmount__ === "function") {
        coel.__unmount__();
      }
      el.classList.remove(name, name + "-\u{1F48A}");
      (coel[KEY_EVENT_LISTENERS] || []).forEach(function(listener) {
        listener.remove();
      });
      delete el[COELEMENT_DATA_KEY_PREFIX + name];
      delete coel.el;
    };
    var install$$1 = function(capsidModule, options) {
      check(typeof capsidModule.install === "function", "The given capsid module does not have `install` method. Please check the install call.");
      capsidModule.install(capsid2, options || {});
    };
    var on2 = function(event, _a) {
      var at = (_a === void 0 ? {} : _a).at;
      return function(target, key, _) {
        var constructor = target.constructor;
        check(!!event, "Empty event handler is given: constructor=" + constructor.name + " key=" + key);
        addMountHook2(constructor, function(el, coel) {
          var listener = function(e) {
            if (!at || [].some.call(el.querySelectorAll(at), function(node) {
              return node === e.target || node.contains(e.target);
            })) {
              coel[key](e);
            }
          };
          listener.remove = function() {
            el.removeEventListener(event, listener);
          };
          addHiddenItem(coel, KEY_EVENT_LISTENERS, listener);
          el.addEventListener(event, listener);
        });
      };
    };
    var useHandler = function(handlerName) {
      on2[handlerName] = on2(handlerName);
      on2[handlerName].at = function(selector) {
        return on2(handlerName, { at: selector });
      };
    };
    var triggerToElements = function(elements, type, bubbles, result) {
      var emit = function(r) {
        elements.forEach(function(el) {
          el.dispatchEvent(new CustomEvent(type, { detail: r, bubbles }));
        });
      };
      if (result && result.then) {
        result.then(emit);
      } else {
        emit(result);
      }
    };
    var emits2 = function(event) {
      return function(target, key, descriptor) {
        var method = descriptor.value;
        var constructor = target.constructor;
        check(!!event, "Unable to emits an empty event: constructor=" + constructor.name + " key=" + key);
        descriptor.value = function() {
          var result = method.apply(this, arguments);
          triggerToElements([this.el], event, true, result);
          return result;
        };
      };
    };
    var wired2 = function(sel) {
      return function(target, key) {
        Object.defineProperty(target.constructor.prototype, key, {
          get: function() {
            return this.el.querySelector(sel);
          },
          configurable: false
        });
      };
    };
    var wiredAll = function(sel) {
      return function(target, key) {
        Object.defineProperty(target.constructor.prototype, key, {
          get: function() {
            return this.el.querySelectorAll(sel);
          },
          configurable: false
        });
      };
    };
    wired2.all = wiredAll;
    var component2 = function(name) {
      check(typeof name === "string" && !!name, "Component name must be a non-empty string");
      return function(Cls) {
        def2(name, Cls);
      };
    };
    var is2 = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return function(Cls) {
        addMountHook2(Cls, function(el) {
          var _a;
          (_a = el.classList).add.apply(_a, args);
        });
      };
    };
    var innerHtml = function(innerHTML2) {
      return function(Cls) {
        addMountHook2(Cls, function(el) {
          el.innerHTML = innerHTML2;
          prep2(null, el);
        });
      };
    };
    var pub2 = function(event, targetSelector) {
      return function(target, key, descriptor) {
        var method = descriptor.value;
        var constructor = target.constructor;
        check(!!event, "Unable to publish empty event: constructor=" + constructor.name + " key=" + key);
        var selector = targetSelector || ".sub\\:" + event;
        descriptor.value = function() {
          var result = method.apply(this, arguments);
          triggerToElements([].concat.apply([], document.querySelectorAll(selector)), event, false, result);
          return result;
        };
      };
    };
    var sub2 = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return function(Cls) {
        is2.apply(void 0, args.map(function(event) {
          return "sub:" + event;
        }))(Cls);
      };
    };
    on2.useHandler = useHandler;
    on2.useHandler("click");
    var capsid2 = Object.freeze({
      def: def2,
      prep: prep2,
      make: make2,
      mount: mount2,
      unmount: unmount2,
      get: get2,
      install: install$$1,
      on: on2,
      emits: emits2,
      wired: wired2,
      component: component2,
      is: is2,
      innerHTML: innerHtml,
      pub: pub2,
      sub: sub2,
      addMountHook: addMountHook2,
      __ccc__: ccc
    });
    exports.def = def2;
    exports.prep = prep2;
    exports.make = make2;
    exports.mount = mount2;
    exports.unmount = unmount2;
    exports.get = get2;
    exports.install = install$$1;
    exports.on = on2;
    exports.emits = emits2;
    exports.wired = wired2;
    exports.component = component2;
    exports.is = is2;
    exports.innerHTML = innerHtml;
    exports.pub = pub2;
    exports.sub = sub2;
    exports.addMountHook = addMountHook2;
    exports.__ccc__ = ccc;
  });
  var capsid = createCommonjsModule(function(module) {
    {
      module.exports = capsidCjs;
    }
  });
  var __ccc__ = capsid.__ccc__;
  var addMountHook = capsid.addMountHook;
  var component = capsid.component;
  var def = capsid.def;
  var emits = capsid.emits;
  var get = capsid.get;
  var innerHTML = capsid.innerHTML;
  var install = capsid.install;
  var is = capsid.is;
  var make = capsid.make;
  var mount = capsid.mount;
  var on = capsid.on;
  var prep = capsid.prep;
  var pub = capsid.pub;
  var sub = capsid.sub;
  var unmount = capsid.unmount;
  var wired = capsid.wired;

  // deno:file:///Users/kt3k/oss/canvas_exercise/main.ts
  var CELL_SIZE = 10;
  var WAIT = 3;
  var Main = class {
    __mount__() {
      this.w = 750 / CELL_SIZE;
      this.h = 250 / CELL_SIZE;
      this.canvas.width = this.w * 2 * CELL_SIZE;
      this.canvas.height = this.h * 2 * CELL_SIZE;
      this.canvas.style.width = `${this.w * CELL_SIZE}px`;
      this.canvas.style.height = `${this.h * CELL_SIZE}px`;
      this.ctx = this.canvas.getContext("2d");
      this.palette = random3Colors();
      this.ctx.fillStyle = this.palette[0];
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
    }
    async draw() {
      const ctx = this.ctx;
      const { h, w } = this;
      ctx.fillStyle = "black";
      let n = 0;
      await forEach(range(w * 2), range(h * 2), async (i, j) => {
        const x = i / (w * 2);
        const r = 0.4;
        const th0 = (1 + Math.cos(2 * Math.PI * x)) / 3 + r;
        const y = j / (h * 2);
        const th1 = (1 + Math.cos(2 * Math.PI * y)) / 3 + r;
        if (probably(1 - th0 * th1)) {
          if (probably(1 - th1)) {
            ctx.fillStyle = this.palette[1];
          } else {
            ctx.fillStyle = this.palette[2];
          }
          ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        if (n++ % 50 === 0)
          await delay(WAIT);
      });
      n = 0;
      await forEach(range(w * 2), range(h * 2), async (i, j) => {
        if (i % 16 === 0 || i % 16 === 15 || (j % 16 === 0 || j % 16 === 15)) {
          if (probably(0.95)) {
            ctx.fillStyle = "black";
          } else {
            ctx.fillStyle = randomColor();
          }
          ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        if (n++ % 50 === 0)
          await delay(WAIT);
      });
      let ctxCopy;
      ctxCopy = clone(ctx);
      await forEach(range(w * 2), range(h * 2), async (i, j) => {
        const pixels = getPixels(ctxCopy, i, j);
        if (pixels[1]?.toUpperCase() === this.palette[2]) {
          ctx.fillStyle = randomColor();
          if (probably(0.2))
            ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        if (n++ % 50 === 0)
          await delay(WAIT);
      });
    }
  };
  __decorateClass([
    wired("canvas")
  ], Main.prototype, "canvas", 2);
  Main = __decorateClass([
    component("main"),
    innerHTML(`<canvas></canvas>`)
  ], Main);
  function getPixel(ctx, x, y) {
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
  function getPixels(ctx, x, y) {
    const res = Array(9);
    for (const i of range(3)) {
      for (const j of range(3)) {
        res[i + j * 3] = getPixel(ctx, x + i - 1, y + j - 1);
      }
    }
    return res;
  }
  function clone(ctx) {
    const newCanvas = document.createElement("canvas");
    const newCtx = newCanvas.getContext("2d");
    newCanvas.width = ctx.canvas.width;
    newCanvas.height = ctx.canvas.height;
    newCtx.drawImage(ctx.canvas, 0, 0);
    return newCtx;
  }
  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  async function forEach(arr0, arr1, fn) {
    for (const i of arr0) {
      for (const j of arr1) {
        await fn(i, j);
      }
    }
  }
  function range(n) {
    return [...new Array(n)].map((_, i) => i);
  }
  function dice(n) {
    return Math.floor(Math.random() * n);
  }
  function delay(n) {
    return new Promise((resolve) => {
      setTimeout(resolve, n);
    });
  }
  var PALETTE = {
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
    "3F": "#000000"
  };
  var choice = (arr) => {
    return arr[dice(arr.length)];
  };
  var randomColor = () => {
    return choice(Object.values(PALETTE));
  };
  var random3Colors = () => {
    return [
      choice(Object.values(PALETTE)),
      choice(Object.values(PALETTE)),
      choice(Object.values(PALETTE))
    ];
  };
  function probably(n) {
    return Math.random() < n;
  }
})();
