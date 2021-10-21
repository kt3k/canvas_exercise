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

  // deno:https://cdn.skypack.dev/-/seedrandom@v3.0.5-893MnPdhjZohiVrYd6CW/dist=es2020,mode=imports/optimized/seedrandom.js
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function createCommonjsModule2(fn, basedir, module) {
    return module = {
      path: basedir,
      exports: {},
      require: function(path, base) {
        return commonjsRequire2(path, base === void 0 || base === null ? module.path : base);
      }
    }, fn(module, module.exports), module.exports;
  }
  function getDefaultExportFromNamespaceIfNotNamed(n) {
    return n && Object.prototype.hasOwnProperty.call(n, "default") && Object.keys(n).length === 1 ? n["default"] : n;
  }
  function commonjsRequire2() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
  }
  var alea = createCommonjsModule2(function(module) {
    (function(global2, module2, define) {
      function Alea(seed) {
        var me = this, mash = Mash();
        me.next = function() {
          var t = 2091639 * me.s0 + me.c * 23283064365386963e-26;
          me.s0 = me.s1;
          me.s1 = me.s2;
          return me.s2 = t - (me.c = t | 0);
        };
        me.c = 1;
        me.s0 = mash(" ");
        me.s1 = mash(" ");
        me.s2 = mash(" ");
        me.s0 -= mash(seed);
        if (me.s0 < 0) {
          me.s0 += 1;
        }
        me.s1 -= mash(seed);
        if (me.s1 < 0) {
          me.s1 += 1;
        }
        me.s2 -= mash(seed);
        if (me.s2 < 0) {
          me.s2 += 1;
        }
        mash = null;
      }
      function copy(f, t) {
        t.c = f.c;
        t.s0 = f.s0;
        t.s1 = f.s1;
        t.s2 = f.s2;
        return t;
      }
      function impl(seed, opts) {
        var xg = new Alea(seed), state = opts && opts.state, prng = xg.next;
        prng.int32 = function() {
          return xg.next() * 4294967296 | 0;
        };
        prng.double = function() {
          return prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
        };
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      function Mash() {
        var n = 4022871197;
        var mash = function(data) {
          data = String(data);
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 4294967296;
          }
          return (n >>> 0) * 23283064365386963e-26;
        };
        return mash;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define && define.amd) {
        define(function() {
          return impl;
        });
      } else {
        this.alea = impl;
      }
    })(commonjsGlobal, module, false);
  });
  var xor128 = createCommonjsModule2(function(module) {
    (function(global2, module2, define) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.x = 0;
        me.y = 0;
        me.z = 0;
        me.w = 0;
        me.next = function() {
          var t = me.x ^ me.x << 11;
          me.x = me.y;
          me.y = me.z;
          me.z = me.w;
          return me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
        };
        if (seed === (seed | 0)) {
          me.x = seed;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 64; k++) {
          me.x ^= strseed.charCodeAt(k) | 0;
          me.next();
        }
      }
      function copy(f, t) {
        t.x = f.x;
        t.y = f.y;
        t.z = f.z;
        t.w = f.w;
        return t;
      }
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define && define.amd) {
        define(function() {
          return impl;
        });
      } else {
        this.xor128 = impl;
      }
    })(commonjsGlobal, module, false);
  });
  var xorwow = createCommonjsModule2(function(module) {
    (function(global2, module2, define) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.next = function() {
          var t = me.x ^ me.x >>> 2;
          me.x = me.y;
          me.y = me.z;
          me.z = me.w;
          me.w = me.v;
          return (me.d = me.d + 362437 | 0) + (me.v = me.v ^ me.v << 4 ^ (t ^ t << 1)) | 0;
        };
        me.x = 0;
        me.y = 0;
        me.z = 0;
        me.w = 0;
        me.v = 0;
        if (seed === (seed | 0)) {
          me.x = seed;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 64; k++) {
          me.x ^= strseed.charCodeAt(k) | 0;
          if (k == strseed.length) {
            me.d = me.x << 10 ^ me.x >>> 4;
          }
          me.next();
        }
      }
      function copy(f, t) {
        t.x = f.x;
        t.y = f.y;
        t.z = f.z;
        t.w = f.w;
        t.v = f.v;
        t.d = f.d;
        return t;
      }
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define && define.amd) {
        define(function() {
          return impl;
        });
      } else {
        this.xorwow = impl;
      }
    })(commonjsGlobal, module, false);
  });
  var xorshift7 = createCommonjsModule2(function(module) {
    (function(global2, module2, define) {
      function XorGen(seed) {
        var me = this;
        me.next = function() {
          var X = me.x, i = me.i, t, v;
          t = X[i];
          t ^= t >>> 7;
          v = t ^ t << 24;
          t = X[i + 1 & 7];
          v ^= t ^ t >>> 10;
          t = X[i + 3 & 7];
          v ^= t ^ t >>> 3;
          t = X[i + 4 & 7];
          v ^= t ^ t << 7;
          t = X[i + 7 & 7];
          t = t ^ t << 13;
          v ^= t ^ t << 9;
          X[i] = v;
          me.i = i + 1 & 7;
          return v;
        };
        function init(me2, seed2) {
          var j, w, X = [];
          if (seed2 === (seed2 | 0)) {
            w = X[0] = seed2;
          } else {
            seed2 = "" + seed2;
            for (j = 0; j < seed2.length; ++j) {
              X[j & 7] = X[j & 7] << 15 ^ seed2.charCodeAt(j) + X[j + 1 & 7] << 13;
            }
          }
          while (X.length < 8)
            X.push(0);
          for (j = 0; j < 8 && X[j] === 0; ++j)
            ;
          if (j == 8)
            w = X[7] = -1;
          else
            w = X[j];
          me2.x = X;
          me2.i = 0;
          for (j = 256; j > 0; --j) {
            me2.next();
          }
        }
        init(me, seed);
      }
      function copy(f, t) {
        t.x = f.x.slice();
        t.i = f.i;
        return t;
      }
      function impl(seed, opts) {
        if (seed == null)
          seed = +new Date();
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (state.x)
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define && define.amd) {
        define(function() {
          return impl;
        });
      } else {
        this.xorshift7 = impl;
      }
    })(commonjsGlobal, module, false);
  });
  var xor4096 = createCommonjsModule2(function(module) {
    (function(global2, module2, define) {
      function XorGen(seed) {
        var me = this;
        me.next = function() {
          var w = me.w, X = me.X, i = me.i, t, v;
          me.w = w = w + 1640531527 | 0;
          v = X[i + 34 & 127];
          t = X[i = i + 1 & 127];
          v ^= v << 13;
          t ^= t << 17;
          v ^= v >>> 15;
          t ^= t >>> 12;
          v = X[i] = v ^ t;
          me.i = i;
          return v + (w ^ w >>> 16) | 0;
        };
        function init(me2, seed2) {
          var t, v, i, j, w, X = [], limit = 128;
          if (seed2 === (seed2 | 0)) {
            v = seed2;
            seed2 = null;
          } else {
            seed2 = seed2 + "\0";
            v = 0;
            limit = Math.max(limit, seed2.length);
          }
          for (i = 0, j = -32; j < limit; ++j) {
            if (seed2)
              v ^= seed2.charCodeAt((j + 32) % seed2.length);
            if (j === 0)
              w = v;
            v ^= v << 10;
            v ^= v >>> 15;
            v ^= v << 4;
            v ^= v >>> 13;
            if (j >= 0) {
              w = w + 1640531527 | 0;
              t = X[j & 127] ^= v + w;
              i = t == 0 ? i + 1 : 0;
            }
          }
          if (i >= 128) {
            X[(seed2 && seed2.length || 0) & 127] = -1;
          }
          i = 127;
          for (j = 4 * 128; j > 0; --j) {
            v = X[i + 34 & 127];
            t = X[i = i + 1 & 127];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            X[i] = v ^ t;
          }
          me2.w = w;
          me2.X = X;
          me2.i = i;
        }
        init(me, seed);
      }
      function copy(f, t) {
        t.i = f.i;
        t.w = f.w;
        t.X = f.X.slice();
        return t;
      }
      function impl(seed, opts) {
        if (seed == null)
          seed = +new Date();
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (state.X)
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define && define.amd) {
        define(function() {
          return impl;
        });
      } else {
        this.xor4096 = impl;
      }
    })(commonjsGlobal, module, false);
  });
  var tychei = createCommonjsModule2(function(module) {
    (function(global2, module2, define) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.next = function() {
          var b = me.b, c = me.c, d = me.d, a = me.a;
          b = b << 25 ^ b >>> 7 ^ c;
          c = c - d | 0;
          d = d << 24 ^ d >>> 8 ^ a;
          a = a - b | 0;
          me.b = b = b << 20 ^ b >>> 12 ^ c;
          me.c = c = c - d | 0;
          me.d = d << 16 ^ c >>> 16 ^ a;
          return me.a = a - b | 0;
        };
        me.a = 0;
        me.b = 0;
        me.c = 2654435769 | 0;
        me.d = 1367130551;
        if (seed === Math.floor(seed)) {
          me.a = seed / 4294967296 | 0;
          me.b = seed | 0;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 20; k++) {
          me.b ^= strseed.charCodeAt(k) | 0;
          me.next();
        }
      }
      function copy(f, t) {
        t.a = f.a;
        t.b = f.b;
        t.c = f.c;
        t.d = f.d;
        return t;
      }
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object")
            copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define && define.amd) {
        define(function() {
          return impl;
        });
      } else {
        this.tychei = impl;
      }
    })(commonjsGlobal, module, false);
  });
  var _nodeResolve_empty = {};
  var _nodeResolve_empty$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    default: _nodeResolve_empty
  });
  var require$$0 = /* @__PURE__ */ getDefaultExportFromNamespaceIfNotNamed(_nodeResolve_empty$1);
  var seedrandom = createCommonjsModule2(function(module) {
    (function(global2, pool, math) {
      var width = 256, chunks = 6, digits = 52, rngname = "random", startdenom = math.pow(width, chunks), significance = math.pow(2, digits), overflow = significance * 2, mask = width - 1, nodecrypto;
      function seedrandom2(seed, options, callback) {
        var key = [];
        options = options == true ? { entropy: true } : options || {};
        var shortseed = mixkey(flatten(options.entropy ? [seed, tostring(pool)] : seed == null ? autoseed() : seed, 3), key);
        var arc4 = new ARC4(key);
        var prng = function() {
          var n = arc4.g(chunks), d = startdenom, x = 0;
          while (n < significance) {
            n = (n + x) * width;
            d *= width;
            x = arc4.g(1);
          }
          while (n >= overflow) {
            n /= 2;
            d /= 2;
            x >>>= 1;
          }
          return (n + x) / d;
        };
        prng.int32 = function() {
          return arc4.g(4) | 0;
        };
        prng.quick = function() {
          return arc4.g(4) / 4294967296;
        };
        prng.double = prng;
        mixkey(tostring(arc4.S), pool);
        return (options.pass || callback || function(prng2, seed2, is_math_call, state) {
          if (state) {
            if (state.S) {
              copy(state, arc4);
            }
            prng2.state = function() {
              return copy(arc4, {});
            };
          }
          if (is_math_call) {
            math[rngname] = prng2;
            return seed2;
          } else
            return prng2;
        })(prng, shortseed, "global" in options ? options.global : this == math, options.state);
      }
      function ARC4(key) {
        var t, keylen = key.length, me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
        if (!keylen) {
          key = [keylen++];
        }
        while (i < width) {
          s[i] = i++;
        }
        for (i = 0; i < width; i++) {
          s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
          s[j] = t;
        }
        (me.g = function(count) {
          var t2, r = 0, i2 = me.i, j2 = me.j, s2 = me.S;
          while (count--) {
            t2 = s2[i2 = mask & i2 + 1];
            r = r * width + s2[mask & (s2[i2] = s2[j2 = mask & j2 + t2]) + (s2[j2] = t2)];
          }
          me.i = i2;
          me.j = j2;
          return r;
        })(width);
      }
      function copy(f, t) {
        t.i = f.i;
        t.j = f.j;
        t.S = f.S.slice();
        return t;
      }
      function flatten(obj, depth) {
        var result = [], typ = typeof obj, prop;
        if (depth && typ == "object") {
          for (prop in obj) {
            try {
              result.push(flatten(obj[prop], depth - 1));
            } catch (e) {
            }
          }
        }
        return result.length ? result : typ == "string" ? obj : obj + "\0";
      }
      function mixkey(seed, key) {
        var stringseed = seed + "", smear, j = 0;
        while (j < stringseed.length) {
          key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
        }
        return tostring(key);
      }
      function autoseed() {
        try {
          var out;
          if (nodecrypto && (out = nodecrypto.randomBytes)) {
            out = out(width);
          } else {
            out = new Uint8Array(width);
            (global2.crypto || global2.msCrypto).getRandomValues(out);
          }
          return tostring(out);
        } catch (e) {
          var browser = global2.navigator, plugins = browser && browser.plugins;
          return [+new Date(), global2, plugins, global2.screen, tostring(pool)];
        }
      }
      function tostring(a) {
        return String.fromCharCode.apply(0, a);
      }
      mixkey(math.random(), pool);
      if (module.exports) {
        module.exports = seedrandom2;
        try {
          nodecrypto = require$$0;
        } catch (ex) {
        }
      } else {
        math["seed" + rngname] = seedrandom2;
      }
    })(typeof self !== "undefined" ? self : commonjsGlobal, [], Math);
  });
  seedrandom.alea = alea;
  seedrandom.xor128 = xor128;
  seedrandom.xorwow = xorwow;
  seedrandom.xorshift7 = xorshift7;
  seedrandom.xor4096 = xor4096;
  seedrandom.tychei = tychei;
  var seedrandom$1 = seedrandom;
  var seedrandom_default = seedrandom$1;

  // deno:file:///Users/kt3k/oss/canvas_exercise/main.ts
  var rng;
  var CELL_SIZE = 5;
  var WAIT_STEPS = 1e4;
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
      this.input.value = Math.random().toString(36);
    }
    onDraw() {
      rng = seedrandom_default(this.input.value);
      this.draw();
    }
    onRandom() {
      this.input.value = Math.random().toString(36);
      this.onDraw();
    }
    async forEach(fn) {
      const { h, w } = this;
      await forEach(range(w * 2), range(h * 2), fn);
    }
    rollPalette() {
      this.palette = random3Colors();
      this.paletteDiv.textContent = JSON.stringify(this.palette);
    }
    async draw() {
      const ctx = this.ctx;
      const { h, w } = this;
      this.rollPalette();
      ctx.fillStyle = this.palette[0];
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
        if (n++ % WAIT_STEPS === 0)
          await delay(WAIT);
      });
      n = 0;
      await this.forEach(async (i, j) => {
        if (i % 16 === 0 || i % 16 === 15 || (j % 16 === 0 || j % 16 === 15)) {
          const c = probably(0.95) ? "black" : this.palette[1];
          setPixel(ctx, i, j, c);
        }
        if (n++ % WAIT_STEPS === 0)
          await delay(WAIT);
      });
      let ctxCopy;
      ctxCopy = clone(ctx);
      await this.forEach(async (i, j) => {
        const pixels = getPixels(ctxCopy, i, j);
        if (pixels[4]?.toUpperCase() === this.palette[1] && pixels[6]?.toUpperCase() === this.palette[1]) {
          const c = randomColor();
          if (probably(0.99))
            setPixel(ctx, i, j, c);
        }
        if (n++ % WAIT_STEPS === 0)
          await delay(WAIT);
      });
      ctxCopy = clone(ctx);
      await this.forEach(async (i, j) => {
        const pixels = getPixels(ctxCopy, i, j);
        if (pixels.slice(0, 3).filter((x) => x?.toUpperCase() === this.palette[2]).length >= 2) {
          if (probably(0.1))
            setPixel(ctx, i, j, this.palette[2]);
        }
        if (n++ % WAIT_STEPS === 0)
          await delay(WAIT);
      });
    }
  };
  __decorateClass([
    wired("canvas")
  ], Main.prototype, "canvas", 2);
  __decorateClass([
    wired("input")
  ], Main.prototype, "input", 2);
  __decorateClass([
    wired(".palette")
  ], Main.prototype, "paletteDiv", 2);
  __decorateClass([
    on.click.at(".draw")
  ], Main.prototype, "onDraw", 1);
  __decorateClass([
    on.click.at(".random")
  ], Main.prototype, "onRandom", 1);
  Main = __decorateClass([
    component("main"),
    innerHTML(`
  <input type="text" />
  <button class="draw">draw</button>
  <button class="random">random</button>
  <br />
  <canvas></canvas>
  <div class="palette"></div>
`)
  ], Main);
  function setPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
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
    return Math.floor(rng() * n);
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
    return rng() < n;
  }
})();
