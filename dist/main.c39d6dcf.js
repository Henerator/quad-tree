// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"helpers/classes/point.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Point =
/** @class */
function () {
  function Point(x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    this.x = x;
    this.y = y;
  }

  Point.prototype.clone = function () {
    return new Point(this.x, this.y);
  };

  Point.prototype.add = function (point) {
    return new Point(this.x + point.x, this.y + point.y);
  };

  Point.prototype.mul = function (point) {
    return new Point(this.x * point.x, this.y * point.y);
  };

  return Point;
}();

exports.Point = Point;
},{}],"helpers/classes/rect.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Rect =
/** @class */
function () {
  function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  Object.defineProperty(Rect.prototype, "right", {
    get: function get() {
      return this.x + this.width;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Rect.prototype, "bottom", {
    get: function get() {
      return this.y + this.height;
    },
    enumerable: true,
    configurable: true
  });

  Rect.prototype.changePosition = function (x, y) {
    return new Rect(x, y, this.width, this.height);
  };

  Rect.prototype.changeSize = function (widthRatio, heightRatio) {
    return new Rect(this.x, this.y, this.width * widthRatio, this.height * heightRatio);
  };

  return Rect;
}();

exports.Rect = Rect;
},{}],"helpers/intersection-detector.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var IntersectionDetector =
/** @class */
function () {
  function IntersectionDetector() {}

  IntersectionDetector.PointToRect = function (pt, rect) {
    return pt.x >= rect.x && pt.x <= rect.right && pt.y >= rect.y && pt.y <= rect.bottom;
  };

  IntersectionDetector.RectToRect = function (rectA, rectB) {
    if (rectA.right >= rectB.x && rectA.x <= rectB.right && rectA.bottom >= rectB.y && rectA.y <= rectB.bottom) {
      return true;
    }

    return false;
  };

  return IntersectionDetector;
}();

exports.IntersectionDetector = IntersectionDetector;
},{}],"quad-tree/quad-tree.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var intersection_detector_1 = require("../helpers/intersection-detector");

var QuadTree =
/** @class */
function () {
  function QuadTree(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
  }

  QuadTree.prototype.insert = function (pt) {
    if (!intersection_detector_1.IntersectionDetector.PointToRect(pt, this.boundary)) {
      return false;
    }

    if (this.capacity > this.points.length) {
      this.points.push(pt);
      return true;
    }

    if (!this.isSplitted) {
      this.split();
    }

    if (this.tlChild.insert(pt)) return true;
    if (this.trChild.insert(pt)) return true;
    if (this.blChild.insert(pt)) return true;
    if (this.brChild.insert(pt)) return true;
  };

  QuadTree.prototype.getRangePoints = function (range, rangePoints) {
    if (rangePoints === void 0) {
      rangePoints = [];
    }

    if (!intersection_detector_1.IntersectionDetector.RectToRect(this.boundary, range)) {
      return rangePoints;
    }

    this.points.forEach(function (pt) {
      if (intersection_detector_1.IntersectionDetector.PointToRect(pt, range)) {
        rangePoints.push(pt);
      }
    });

    if (!this.isSplitted) {
      return rangePoints;
    }

    this.tlChild.getRangePoints(range, rangePoints);
    this.trChild.getRangePoints(range, rangePoints);
    this.blChild.getRangePoints(range, rangePoints);
    this.brChild.getRangePoints(range, rangePoints);
    return rangePoints;
  };

  QuadTree.prototype.split = function () {
    this.tlChild = new QuadTree(this.boundary.changeSize(1 / 2, 1 / 2), this.capacity);
    var trChildRect = this.boundary.changePosition(this.boundary.x + this.boundary.width / 2, this.boundary.y).changeSize(1 / 2, 1 / 2);
    this.trChild = new QuadTree(trChildRect, this.capacity);
    var blChildRect = this.boundary.changePosition(this.boundary.x, this.boundary.y + this.boundary.height / 2).changeSize(1 / 2, 1 / 2);
    this.blChild = new QuadTree(blChildRect, this.capacity);
    var brChildRect = this.boundary.changePosition(this.boundary.x + this.boundary.width / 2, this.boundary.y + this.boundary.height / 2).changeSize(1 / 2, 1 / 2);
    this.brChild = new QuadTree(brChildRect, this.capacity);
    this.isSplitted = true;
  };

  return QuadTree;
}();

exports.QuadTree = QuadTree;
},{"../helpers/intersection-detector":"helpers/intersection-detector.ts"}],"helpers/random/random.helper.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var RandomHelper =
/** @class */
function () {
  function RandomHelper() {}

  RandomHelper.range = function (min, max) {
    return min + Math.random() * (max - min);
  };

  RandomHelper.rangeInteger = function (min, max) {
    return min + Math.floor(Math.random() * (max - min));
  };

  return RandomHelper;
}();

exports.RandomHelper = RandomHelper;
},{}],"main.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var point_1 = require("./helpers/classes/point");

var rect_1 = require("./helpers/classes/rect");

var quad_tree_1 = require("./quad-tree/quad-tree");

var random_helper_1 = require("./helpers/random/random.helper");

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var POINT_COUNT = 300;
var width;
var height;
var centerPoint;
var quadTreeWidth;
var quadTree;
var points = [];
var rangeRectWidth = 150;
var rangeRect = new rect_1.Rect(0, 0, rangeRectWidth, rangeRectWidth);
var rangePoints;
start();

function start() {
  window.addEventListener('resize', update, false);
  document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
      update();
    }
  });
  update();
  canvas.addEventListener('mousemove', function (event) {
    rangeRect = rangeRect.changePosition(event.clientX - centerPoint.x + quadTreeWidth / 2, event.clientY - centerPoint.y + quadTreeWidth / 2);
    rangePoints = quadTree.getRangePoints(rangeRect);
    draw();
  });
}

function update() {
  resizeCanvas();
  var rect = new rect_1.Rect(0, 0, quadTreeWidth, quadTreeWidth);
  points = [];
  quadTree = new quad_tree_1.QuadTree(rect, 1);

  for (var index = 0; index < POINT_COUNT; index++) {
    var pt = new point_1.Point(random_helper_1.RandomHelper.rangeInteger(0, quadTreeWidth), random_helper_1.RandomHelper.rangeInteger(0, quadTreeWidth));
    points.push(pt);
    quadTree.insert(pt);
  }

  rangePoints = quadTree.getRangePoints(rangeRect);
  draw();
}

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  centerPoint = new point_1.Point(width / 2, height / 2);
  quadTreeWidth = Math.min(width, height) - 20;
}

function draw() {
  clear();
  var pt = centerPoint.add(new point_1.Point(-quadTreeWidth / 2, -quadTreeWidth / 2));
  context.save();
  context.translate(pt.x, pt.y);
  drawQuadTree();
  drawPoints();
  drawRange();
  drawRangePoints();
  context.restore();
}

function clear() {
  context.fillStyle = '#333';
  context.fillRect(0, 0, width, height);
}

function drawQuadTree() {
  context.strokeStyle = '#f5f5f5';
  drawQuadTreeRecursive(quadTree);
}

function drawQuadTreeRecursive(tree) {
  var rect = tree.boundary;
  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  if (tree.tlChild) drawQuadTreeRecursive(tree.tlChild);
  if (tree.trChild) drawQuadTreeRecursive(tree.trChild);
  if (tree.blChild) drawQuadTreeRecursive(tree.blChild);
  if (tree.brChild) drawQuadTreeRecursive(tree.brChild);
}

function drawPoints() {
  context.fillStyle = '#3399ff';
  points.forEach(function (pt) {
    context.beginPath();
    context.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
    context.fill();
  });
}

function drawRange() {
  context.strokeStyle = '#66ff66';
  context.lineWidth = 4;
  context.strokeRect(rangeRect.x, rangeRect.y, rangeRect.width, rangeRect.height);
}

function drawRangePoints() {
  context.fillStyle = '#66ff66';
  rangePoints.forEach(function (pt) {
    context.beginPath();
    context.arc(pt.x, pt.y, 3, 0, 2 * Math.PI);
    context.fill();
  });
}
},{"./helpers/classes/point":"helpers/classes/point.ts","./helpers/classes/rect":"helpers/classes/rect.ts","./quad-tree/quad-tree":"quad-tree/quad-tree.ts","./helpers/random/random.helper":"helpers/random/random.helper.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60156" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map