(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("electron/common"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["sharp", "canvas", "electron/common"], factory);
	else if(typeof exports === 'object')
		exports["DoorTextReader"] = factory((function webpackLoadOptionalExternalModule() { try { return require("sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("electron/common"); } catch(e) {} }()));
	else
		root["DoorTextReader"] = factory(root["sharp"], root["canvas"], root["electron/common"]);
})(self, (__WEBPACK_EXTERNAL_MODULE_sharp__, __WEBPACK_EXTERNAL_MODULE_canvas__, __WEBPACK_EXTERNAL_MODULE_electron_common__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/alt1/dist/base/index.js":
/*!***********************************************!*\
  !*** ../node_modules/alt1/dist/base/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return __webpack_require__(/*! sharp */ "sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return __webpack_require__(/*! canvas */ "canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return __webpack_require__(/*! electron/common */ "electron/common"); } catch(e) {} }()));
	else {}
})(globalThis, (__WEBPACK_EXTERNAL_MODULE_sharp__, __WEBPACK_EXTERNAL_MODULE_canvas__, __WEBPACK_EXTERNAL_MODULE_electron_common__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/base/alt1api.ts":
/*!*****************************!*\
  !*** ./src/base/alt1api.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/base/declarations.ts":
/*!**********************************!*\
  !*** ./src/base/declarations.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/base/imagedata-extensions.ts":
/*!******************************************!*\
  !*** ./src/base/imagedata-extensions.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_2062__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageData = void 0;
const a1lib = __importStar(__nested_webpack_require_2062__(/*! ./index */ "./src/base/index.ts"));
const nodeimports = __importStar(__nested_webpack_require_2062__(/*! ./nodepolyfill */ "./src/base/nodepolyfill.ts"));
(function () {
    var globalvar = (typeof self != "undefined" ? self : (typeof __nested_webpack_require_2062__.g != "undefined" ? __nested_webpack_require_2062__.g : null));
    var filltype = typeof globalvar.ImageData == "undefined";
    var fillconstr = filltype;
    if (!filltype) {
        var oldconstr = globalvar.ImageData;
        try {
            let data = new Uint8ClampedArray(4);
            data[0] = 1;
            let a = new globalvar.ImageData(data, 1, 1);
            fillconstr = a.data[0] != 1;
        }
        catch (e) {
            fillconstr = true;
        }
    }
    if (fillconstr) {
        var constr = function ImageDataShim() {
            var i = 0;
            var data = (arguments[i] instanceof Uint8ClampedArray ? arguments[i++] : null);
            var width = arguments[i++];
            var height = arguments[i++];
            if (filltype) {
                if (!data) {
                    data = new Uint8ClampedArray(width * height * 4);
                }
                this.width = width;
                this.height = height;
                this.data = data;
            }
            else if (fillconstr) {
                //WARNING This branch of code does not use the same pixel data backing store
                //(problem with wasm, however all wasm browser have a native constructor (unless asm.js is used))
                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                var imageData = ctx.createImageData(width, height);
                if (data) {
                    imageData.data.set(data);
                }
                return imageData;
            }
            // else {
            // 	//oh no...
            // 	//we need this monstrocity in order to call the native constructor with variable number of args
            // 	//when es5 transpile is enable (that strips the spread operator)
            // 	return new (Function.prototype.bind.apply(oldconstr, [null,...arguments]));
            // }
        };
        if (!filltype) {
            constr.prototype = globalvar.ImageData.prototype;
        }
        globalvar.ImageData = constr;
        exports.ImageData = constr;
    }
    else {
        exports.ImageData = globalvar.ImageData;
    }
})();
//Recast into a drawable imagedata class on all platforms, into a normal browser ImageData on browsers or a node-canvas imagedata on nodejs
exports.ImageData.prototype.toDrawableData = function () {
    if (typeof document == "undefined") {
        return nodeimports.imageDataToDrawable(this);
    }
    else {
        return this;
    }
};
exports.ImageData.prototype.putImageData = function (buf, cx, cy) {
    for (var dx = 0; dx < buf.width; dx++) {
        for (var dy = 0; dy < buf.height; dy++) {
            var i1 = (dx + cx) * 4 + (dy + cy) * 4 * this.width;
            var i2 = dx * 4 + dy * 4 * buf.width;
            this.data[i1] = buf.data[i2];
            this.data[i1 + 1] = buf.data[i2 + 1];
            this.data[i1 + 2] = buf.data[i2 + 2];
            this.data[i1 + 3] = buf.data[i2 + 3];
        }
    }
};
exports.ImageData.prototype.pixelOffset = function (x, y) {
    return x * 4 + y * this.width * 4;
};
//creates a hash of a portion of the buffer used to check for changes
exports.ImageData.prototype.getPixelHash = function (rect) {
    if (!rect) {
        rect = new a1lib.Rect(0, 0, this.width, this.height);
    }
    var hash = 0;
    for (var x = rect.x; x < rect.x + rect.width; x++) {
        for (var y = rect.y; y < rect.y + rect.height; y++) {
            var i = x * 4 + y * 4 * this.width;
            hash = (((hash << 5) - hash) + this.data[i]) | 0;
            hash = (((hash << 5) - hash) + this.data[i + 1]) | 0;
            hash = (((hash << 5) - hash) + this.data[i + 2]) | 0;
            hash = (((hash << 5) - hash) + this.data[i + 3]) | 0;
        }
    }
    return hash;
};
exports.ImageData.prototype.clone = function (rect) {
    let res = new exports.ImageData(rect.width, rect.height);
    this.copyTo(res, rect.x, rect.y, rect.width, rect.height, 0, 0);
    return res;
};
exports.ImageData.prototype.show = function (x = 5, y = 5, zoom = 1) {
    if (typeof document == "undefined") {
        console.error("need a document to show an imagedata object");
        return;
    }
    var imgs = document.getElementsByClassName("debugimage");
    while (imgs.length > exports.ImageData.prototype.show.maxImages) {
        imgs[0].remove();
    }
    var el = this.toImage();
    el.classList.add("debugimage");
    el.style.position = "absolute";
    el.style.zIndex = "1000";
    el.style.left = x / zoom + "px";
    el.style.top = y / zoom + "px";
    el.style.background = "purple";
    el.style.cursor = "pointer";
    el.style.imageRendering = "pixelated";
    el.style.outline = "1px solid #0f0";
    el.style.width = (this.width == 1 ? 100 : this.width) * zoom + "px";
    el.style.height = (this.height == 1 ? 100 : this.height) * zoom + "px";
    el.onclick = function () { el.remove(); };
    document.body.appendChild(el);
    return el;
};
exports.ImageData.prototype.show.maxImages = 10;
exports.ImageData.prototype.toImage = function (rect) {
    if (!rect) {
        rect = new a1lib.Rect(0, 0, this.width, this.height);
    }
    if (typeof document != "undefined") {
        var el = document.createElement("canvas");
        el.width = rect.width;
        el.height = rect.height;
    }
    else {
        el = nodeimports.createCanvas(rect.width, rect.height);
    }
    var ctx = el.getContext("2d");
    ctx.putImageData(this.toDrawableData(), -rect.x, -rect.y);
    return el;
};
exports.ImageData.prototype.getPixel = function (x, y) {
    var i = x * 4 + y * 4 * this.width;
    return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]];
};
exports.ImageData.prototype.getPixelValueSum = function (x, y) {
    var i = x * 4 + y * 4 * this.width;
    return this.data[i] + this.data[i + 1] + this.data[i + 2];
};
exports.ImageData.prototype.getPixelInt = function (x, y) {
    var i = x * 4 + y * 4 * this.width;
    return (this.data[i + 3] << 24) + (this.data[i + 0] << 16) + (this.data[i + 1] << 8) + (this.data[i + 2] << 0);
};
exports.ImageData.prototype.getColorDifference = function (x, y, r, g, b, a = 255) {
    var i = x * 4 + y * 4 * this.width;
    return Math.abs(this.data[i] - r) + Math.abs(this.data[i + 1] - g) + Math.abs(this.data[i + 2] - b) * a / 255;
};
exports.ImageData.prototype.setPixel = function (x, y, ...color) {
    var r, g, b, a;
    var [r, g, b, a] = (Array.isArray(color[0]) ? color[0] : color);
    var i = x * 4 + y * 4 * this.width;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
    this.data[i + 3] = a == undefined ? 255 : a;
};
exports.ImageData.prototype.setPixelInt = function (x, y, color) {
    var i = x * 4 + y * 4 * this.width;
    this.data[i] = (color >> 24) & 0xff;
    this.data[i + 1] = (color >> 16) & 0xff;
    this.data[i + 2] = (color >> 8) & 0xff;
    this.data[i + 3] = (color >> 0) & 0xff;
};
exports.ImageData.prototype.toFileBytes = function (format, quality) {
    if (typeof HTMLCanvasElement != "undefined") {
        return new Promise(d => this.toImage().toBlob(b => {
            var r = new FileReader();
            r.readAsArrayBuffer(b);
            r.onload = () => d(new Uint8Array(r.result));
        }, format, quality));
    }
    else {
        return nodeimports.imageDataToFileBytes(this, format, quality);
    }
};
exports.ImageData.prototype.toPngBase64 = function () {
    if (typeof HTMLCanvasElement != "undefined") {
        var str = this.toImage().toDataURL("image/png");
        return str.slice(str.indexOf(",") + 1);
    }
    else {
        throw new Error("synchronous image conversion not supported in nodejs, try using ImageData.prototype.toFileBytes");
    }
};
exports.ImageData.prototype.pixelCompare = function (buf, x = 0, y = 0, max) {
    return a1lib.ImageDetect.simpleCompare(this, buf, x, y, max);
};
exports.ImageData.prototype.copyTo = function (target, sourcex, sourcey, width, height, targetx, targety) {
    //convince v8 that these are 31bit uints
    const targetwidth = target.width | 0;
    const thiswidth = this.width | 0;
    const copywidth = width | 0;
    const fastwidth = Math.floor(width / 4) * 4;
    const thisdata = new Int32Array(this.data.buffer, this.data.byteOffset, this.data.byteLength / 4);
    const targetdata = new Int32Array(target.data.buffer, target.data.byteOffset, target.data.byteLength / 4);
    for (let cy = 0; cy < height; cy++) {
        let cx = 0;
        let it = (cx + targetx) + (cy + targety) * targetwidth;
        let is = (cx + sourcex) + (cy + sourcey) * thiswidth;
        //copy 4 pixels per iter (xmm)
        for (; cx < fastwidth; cx += 4) {
            targetdata[it] = thisdata[is];
            targetdata[it + 1] = thisdata[is + 1];
            targetdata[it + 2] = thisdata[is + 2];
            targetdata[it + 3] = thisdata[is + 3];
            it += 4;
            is += 4;
        }
        //copy remainder per pixel
        for (; cx < copywidth; cx++) {
            targetdata[it] = thisdata[is];
            it += 1;
            is += 1;
        }
    }
};


/***/ }),

/***/ "./src/base/imagedetect.ts":
/*!*********************************!*\
  !*** ./src/base/imagedetect.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_12931__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageDataSet = exports.webpackImages = exports.asyncMap = exports.coldif = exports.simpleCompareRMSE = exports.simpleCompare = exports.findSubbuffer = exports.findSubimage = exports.clearPngColorspace = exports.isPngBuffer = exports.imageDataFromFileBuffer = exports.imageDataFromBase64 = exports.imageDataFromUrl = void 0;
const imgref_1 = __nested_webpack_require_12931__(/*! ./imgref */ "./src/base/imgref.ts");
const wapper = __importStar(__nested_webpack_require_12931__(/*! ./wrapper */ "./src/base/wrapper.ts"));
const nodeimports = __importStar(__nested_webpack_require_12931__(/*! ./nodepolyfill */ "./src/base/nodepolyfill.ts"));
const _1 = __nested_webpack_require_12931__(/*! . */ "./src/base/index.ts");
/**
* Downloads an image and returns the ImageData.
* Cleans sRGB headers from downloaded png images. Assumes that data url's are already cleaned from sRGB and other headers
* @param url http(s) or data url to the image
*/
async function imageDataFromUrl(url) {
    var hdr = "data:image/png;base64,";
    var isdataurl = url.startsWith(hdr);
    if (typeof Image != "undefined") {
        if (isdataurl) {
            return loadImageDataFromUrl(url);
        }
        else {
            let res = await fetch(url);
            if (!res.ok) {
                throw new Error("failed to load image: " + url);
            }
            let file = new Uint8Array(await res.arrayBuffer());
            return imageDataFromFileBuffer(file);
        }
    }
    else {
        if (isdataurl) {
            return imageDataFromBase64(url.slice(hdr.length));
        }
        throw new Error("loading remote images in nodejs has been disabled, load the raw bytes and use imageDataFromNodeBuffer instead");
    }
}
exports.imageDataFromUrl = imageDataFromUrl;
function loadImageDataFromUrl(url) {
    if (typeof Image == "undefined") {
        throw new Error("Browser environment expected");
    }
    return new Promise((done, fail) => {
        var img = new Image();
        img.crossOrigin = "crossorigin";
        img.onload = function () { done(new imgref_1.ImgRefCtx(img).toData()); };
        img.onerror = fail;
        img.src = url;
    });
}
/**
* Loads an ImageData object from a base64 encoded png image
* Make sure the png image does not have a sRGB chunk or the resulting pixels will differ for different users!!!
* @param data a base64 encoded png image
*/
async function imageDataFromBase64(data) {
    if (typeof Image != "undefined") {
        return imageDataFromUrl("data:image/png;base64," + data);
    }
    else {
        return nodeimports.imageDataFromBase64(data);
    }
}
exports.imageDataFromBase64 = imageDataFromBase64;
/**
 * Loads an ImageData object directly from a png encoded file buffer
 * This method ensures that png color space headers are taken care off
 * @param data The bytes of a png file
 */
async function imageDataFromFileBuffer(data) {
    if (isPngBuffer(data)) {
        clearPngColorspace(data);
    }
    if (typeof Image != "undefined") {
        let blob = new Blob([data], { type: "image/png" });
        let url = URL.createObjectURL(blob);
        let r = await loadImageDataFromUrl(url);
        URL.revokeObjectURL(url);
        return r;
    }
    else {
        return nodeimports.imageDataFromBuffer(data);
    }
}
exports.imageDataFromFileBuffer = imageDataFromFileBuffer;
/**
* Checks if a given byte array is a png file (by checking for ?PNG as first 4 bytes)
* @param bytes Raw bytes of the png file
*/
function isPngBuffer(bytes) {
    return bytes[0] == 137 && bytes[1] == 80 && bytes[2] == 78 && bytes[3] == 71;
}
exports.isPngBuffer = isPngBuffer;
/**
* Resets the colorspace data in the png file.
* This makes sure the browser renders the exact colors in the file instead of filtering it in order to obtain the best real life representation of
* what it looked like on the authors screen. (this feature is often broken and not supported)
* For example a round trip printscreen -> open in browser results in different colors than the original
* @param data Raw bytes of the png file
*/
function clearPngColorspace(data) {
    if (!isPngBuffer(data)) {
        throw new Error("non-png image received");
    }
    var i = 8;
    while (i < data.length) {
        var length = data[i++] * 0x1000000 + data[i++] * 0x10000 + data[i++] * 0x100 + data[i++];
        var ancillary = !!((data[i] >> 5) & 1);
        var chunkname = String.fromCharCode(data[i], data[i + 1], data[i + 2], data[i + 3]);
        var chunkid = chunkname.toLowerCase();
        if (chunkid != "trns" && ancillary) {
            data[i + 0] = "n".charCodeAt(0);
            data[i + 1] = "o".charCodeAt(0);
            data[i + 2] = "P".charCodeAt(0);
            data[i + 3] = "E".charCodeAt(0);
            //calculate new chunk checksum
            //http://www.libpng.org/pub/png/spec/1.2/PNG-CRCAppendix.html
            var end = i + 4 + length;
            var crc = 0xffffffff;
            //should be fast enough like this
            var bitcrc = function (bit) {
                for (var k = 0; k < 8; k++) {
                    if (bit & 1) {
                        bit = 0xedb88320 ^ (bit >>> 1);
                    }
                    else {
                        bit = bit >>> 1;
                    }
                }
                return bit;
            };
            for (var a = i; a < end; a++) {
                if (a >= i + 4) {
                    data[a] = 0;
                }
                var bit = data[a];
                crc = bitcrc((crc ^ bit) & 0xff) ^ (crc >>> 8);
            }
            crc = crc ^ 0xffffffff;
            //new chunk checksum
            data[i + 4 + length + 0] = (crc >> 24) & 0xff;
            data[i + 4 + length + 1] = (crc >> 16) & 0xff;
            data[i + 4 + length + 2] = (crc >> 8) & 0xff;
            data[i + 4 + length + 3] = (crc >> 0) & 0xff;
        }
        if (chunkname == "IEND") {
            break;
        }
        i += 4; //type
        i += length; //data
        i += 4; //crc
    }
}
exports.clearPngColorspace = clearPngColorspace;
/**
* finds the given needle ImageBuffer in the given haystack ImgRef this function uses the best optimized available
* code depending on the type of the haystack. It will use fast c# searching if the haystack is an ImgRefBind, js searching
* is used otherwise.
* the checklist argument is no longer used and should ignored or null/undefined
* The optional sx,sy,sw,sh arguments indicate a bounding rectangle in which to search the needle. The rectangle should be bigger than the needle
* @returns An array of points where the needle is found. The array is empty if none are found
*/
function findSubimage(haystackImgref, needleBuffer, sx = 0, sy = 0, sw = haystackImgref.width, sh = haystackImgref.height) {
    if (!haystackImgref) {
        throw new TypeError();
    }
    if (!needleBuffer) {
        throw new TypeError();
    }
    var max = 30;
    //check if we can do this in alt1
    if (haystackImgref instanceof imgref_1.ImgRefBind && wapper.hasAlt1 && alt1.bindFindSubImg) {
        var needlestr = wapper.encodeImageString(needleBuffer);
        var r = alt1.bindFindSubImg(haystackImgref.handle, needlestr, needleBuffer.width, sx, sy, sw, sh);
        if (!r) {
            throw new wapper.Alt1Error();
        }
        return JSON.parse(r);
    }
    return findSubbuffer(haystackImgref.read(), needleBuffer, sx, sy, sw, sh);
}
exports.findSubimage = findSubimage;
/**
* Uses js to find the given needle ImageBuffer in the given haystack ImageBuffer. It is better to use the alt1.bind- functions in
* combination with a1nxt.findsubimg.
* the optional sx,sy,sw,sh arguments indicate a bounding rectangle in which to search.
* @returns An array of points where the needle is found. The array is empty if none are found
*/
function findSubbuffer(haystack, needle, sx = 0, sy = 0, sw = haystack.width, sh = haystack.height) {
    var r = [];
    var maxdif = 30;
    var maxresults = 50;
    var needlestride = needle.width * 4;
    var heystackstride = haystack.width * 4;
    //built list of non trans pixel to check
    var checkList = [];
    for (var y = 0; y < needle.height; y++) {
        for (var x = 0; x < needle.width; x++) {
            var i = x * 4 + y * needlestride;
            if (needle.data[i + 3] == 255) {
                checkList.push({ x: x, y: y });
            }
            if (checkList.length == 10) {
                break;
            }
        }
        if (checkList.length == 10) {
            break;
        }
    }
    var cw = (sx + sw) - needle.width;
    var ch = (sy + sh) - needle.height;
    var checklength = checkList.length;
    for (var y = sy; y <= ch; y++) {
        outer: for (var x = sx; x <= cw; x++) {
            for (var a = 0; a < checklength; a++) {
                var i1 = (x + checkList[a].x) * 4 + (y + checkList[a].y) * heystackstride;
                var i2 = checkList[a].x * 4 + checkList[a].y * needlestride;
                var d = 0;
                d = d + Math.abs(haystack.data[i1 + 0] - needle.data[i2 + 0]) | 0;
                d = d + Math.abs(haystack.data[i1 + 1] - needle.data[i2 + 1]) | 0;
                d = d + Math.abs(haystack.data[i1 + 2] - needle.data[i2 + 2]) | 0;
                d *= 255 / needle.data[i2 + 3];
                if (d > maxdif) {
                    continue outer;
                }
            }
            if (simpleCompare(haystack, needle, x, y, maxdif) != Infinity) {
                r.push({ x, y });
                if (r.length > maxresults) {
                    return r;
                }
            }
        }
    }
    return r;
}
exports.findSubbuffer = findSubbuffer;
/**
* Compares two images and returns the average color difference per pixel between them
* @param max The max color difference at any point in the image before short circuiting the function and returning Infinity. set to -1 to always continue.
* @returns The average color difference per pixel or Infinity if the difference is more than max at any point in the image
*/
function simpleCompare(bigbuf, checkbuf, x, y, max = 30) {
    if (x < 0 || y < 0) {
        throw new RangeError();
    }
    if (x + checkbuf.width > bigbuf.width || y + checkbuf.height > bigbuf.height) {
        throw new RangeError();
    }
    if (max == -1) {
        max = 255 * 4;
    }
    var dif = 0;
    for (var step = 8; step >= 1; step /= 2) {
        for (var cx = 0; cx < checkbuf.width; cx += step) {
            for (var cy = 0; cy < checkbuf.height; cy += step) {
                var i1 = (x + cx) * 4 + (y + cy) * bigbuf.width * 4;
                var i2 = cx * 4 + cy * checkbuf.width * 4;
                var d = 0;
                d = d + Math.abs(bigbuf.data[i1 + 0] - checkbuf.data[i2 + 0]) | 0;
                d = d + Math.abs(bigbuf.data[i1 + 1] - checkbuf.data[i2 + 1]) | 0;
                d = d + Math.abs(bigbuf.data[i1 + 2] - checkbuf.data[i2 + 2]) | 0;
                d *= checkbuf.data[i2 + 3] / 255;
                if (step == 1) {
                    dif += d;
                }
                if (d > max) {
                    return Infinity;
                }
            }
        }
    }
    return dif / checkbuf.width / checkbuf.height;
}
exports.simpleCompare = simpleCompare;
/**
* Calculates the root mean square error between the two buffers at the given coordinate, this method can be used in situations with significant blur or
* transparency, it does not bail early on non-matching images like simpleCompare does so it can be expected to be much slower when called often.
* @returns The root mean square error beteen the images, high single pixel errors are penalized more than consisten low errors. return of 0 means perfect match.
*/
function simpleCompareRMSE(bigbuf, checkbuf, x, y) {
    if (x < 0 || y < 0) {
        throw new RangeError();
    }
    if (x + checkbuf.width > bigbuf.width || y + checkbuf.height > bigbuf.height) {
        throw new RangeError();
    }
    var dif = 0;
    var numpix = 0;
    for (var cx = 0; cx < checkbuf.width; cx++) {
        for (var cy = 0; cy < checkbuf.height; cy++) {
            var i1 = (x + cx) * 4 + (y + cy) * bigbuf.width * 4;
            var i2 = cx * 4 + cy * checkbuf.width * 4;
            var d = 0;
            d = d + Math.abs(bigbuf.data[i1 + 0] - checkbuf.data[i2 + 0]) | 0;
            d = d + Math.abs(bigbuf.data[i1 + 1] - checkbuf.data[i2 + 1]) | 0;
            d = d + Math.abs(bigbuf.data[i1 + 2] - checkbuf.data[i2 + 2]) | 0;
            var weight = checkbuf.data[i2 + 3] / 255;
            numpix += weight;
            dif += d * d * weight;
        }
    }
    return Math.sqrt(dif / numpix);
}
exports.simpleCompareRMSE = simpleCompareRMSE;
/**
* Returns the difference between two colors (scaled to the alpha of the second color)
*/
function coldif(r1, g1, b1, r2, g2, b2, a2) {
    return (Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)) * a2 / 255; //only applies alpha for 2nd buffer!
}
exports.coldif = coldif;
/**
 * Turns map of promises into a map that contains the resolved values after loading.
 * @param input
 */
function asyncMap(input) {
    var raw = {};
    var promises = [];
    for (var a in input) {
        if (input.hasOwnProperty(a)) {
            raw[a] = null;
            promises.push(input[a].then(function (a, i) { raw[a] = i; r[a] = i; }.bind(null, a)));
        }
    }
    var r = {};
    var promise = Promise.all(promises).then(() => { r.loaded = true; return r; });
    Object.defineProperty(r, "loaded", { enumerable: false, value: false, writable: true });
    Object.defineProperty(r, "promise", { enumerable: false, value: promise });
    Object.defineProperty(r, "raw", { enumerable: false, value: raw });
    return Object.assign(r, raw);
}
exports.asyncMap = asyncMap;
/**
* Same as asyncMap, but casts the properties to ImageData in typescript
*/
function webpackImages(input) {
    return asyncMap(input);
}
exports.webpackImages = webpackImages;
class ImageDataSet {
    constructor() {
        this.buffers = [];
    }
    matchBest(img, x, y, max) {
        let best = null;
        let bestscore = max;
        for (let a = 0; a < this.buffers.length; a++) {
            let score = img.pixelCompare(this.buffers[a], x, y, bestscore);
            if (isFinite(score) && (bestscore == undefined || score < bestscore)) {
                bestscore = score;
                best = a;
            }
        }
        if (best == null) {
            return null;
        }
        return { index: best, score: bestscore };
    }
    static fromFilmStrip(baseimg, width) {
        if ((baseimg.width % width) != 0) {
            throw new Error("slice size does not fit in base img");
        }
        let r = new ImageDataSet();
        for (let x = 0; x < baseimg.width; x += width) {
            r.buffers.push(baseimg.clone(new _1.Rect(x, 0, width, baseimg.height)));
        }
        return r;
    }
    static fromFilmStripUneven(baseimg, widths) {
        let r = new ImageDataSet();
        let x = 0;
        for (let w of widths) {
            r.buffers.push(baseimg.clone(new _1.Rect(x, 0, w, baseimg.height)));
            x += w;
            if (x > baseimg.width) {
                throw new Error("sampling filmstrip outside bounds");
            }
        }
        if (x != baseimg.width) {
            throw new Error("unconsumed pixels left in film strip imagedata");
        }
        return r;
    }
    static fromAtlas(baseimg, slices) {
        let r = new ImageDataSet();
        for (let slice of slices) {
            r.buffers.push(baseimg.clone(slice));
        }
        return r;
    }
}
exports.ImageDataSet = ImageDataSet;


/***/ }),

/***/ "./src/base/imgref.ts":
/*!****************************!*\
  !*** ./src/base/imgref.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_29896__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImgRefData = exports.ImgRefBind = exports.ImgRefCtx = exports.ImgRef = void 0;
const index_1 = __nested_webpack_require_29896__(/*! ./index */ "./src/base/index.ts");
/**
 * Represents an image that might be in different types of memory
 * This is mostly used to represent images still in Alt1 memory that have
 * not been transfered to js yet. Various a1lib api's use this type and
 * choose the most efficient approach based on the memory type
 */
class ImgRef {
    constructor(x, y, w, h) {
        this.t = "none";
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    read(x = 0, y = 0, w = this.width, h = this.height) {
        throw new Error("This imgref (" + this.t + ") does not support toData");
    }
    findSubimage(needle, sx = 0, sy = 0, w = this.width, h = this.height) {
        return index_1.ImageDetect.findSubimage(this, needle, sx, sy, w, h);
    }
    toData(x = this.x, y = this.y, w = this.width, h = this.height) {
        return this.read(x - this.x, y - this.y, w, h);
    }
    ;
    containsArea(rect) {
        return this.x <= rect.x && this.y <= rect.y && this.x + this.width >= rect.x + rect.width && this.y + this.height >= rect.y + rect.height;
    }
}
exports.ImgRef = ImgRef;
/**
 * Represents an image in js render memory (canvas/image tag)
 */
class ImgRefCtx extends ImgRef {
    constructor(img, x = 0, y = 0) {
        if (img instanceof CanvasRenderingContext2D) {
            super(x, y, img.canvas.width, img.canvas.height);
            this.ctx = img;
        }
        else {
            super(x, y, img.width, img.height);
            if (img instanceof HTMLCanvasElement) {
                this.ctx = img.getContext("2d", { willReadFrequently: true });
            }
            else {
                var cnv = document.createElement("canvas");
                cnv.width = img.width;
                cnv.height = img.height;
                this.ctx = cnv.getContext("2d", { willReadFrequently: true });
                this.ctx.drawImage(img, 0, 0);
            }
        }
        this.t = "ctx";
    }
    read(x = 0, y = 0, w = this.width, h = this.height) {
        return this.ctx.getImageData(x, y, w, h);
    }
}
exports.ImgRefCtx = ImgRefCtx;
/**
 * Represents in image in Alt1 memory, This type of image can be searched for subimages
 * very efficiently and transfering the full image to js can be avoided this way
 */
class ImgRefBind extends ImgRef {
    constructor(handle, x = 0, y = 0, w = 0, h = 0) {
        super(x, y, w, h);
        this.handle = handle;
        this.t = "bind";
    }
    read(x = 0, y = 0, w = this.width, h = this.height) {
        return (0, index_1.transferImageData)(this.handle, x, y, w, h);
    }
}
exports.ImgRefBind = ImgRefBind;
/**
 * Represents an image in js memory
 */
class ImgRefData extends ImgRef {
    constructor(buf, x = 0, y = 0) {
        super(x, y, buf.width, buf.height);
        this.buf = buf;
        this.t = "data";
    }
    read(x = 0, y = 0, w = this.width, h = this.height) {
        if (x == 0 && y == 0 && w == this.width && h == this.height) {
            return this.buf;
        }
        var r = new ImageData(w, h);
        for (var b = y; b < y + h; b++) {
            for (var a = x; a < x + w; a++) {
                var i1 = (a - x) * 4 + (b - y) * w * 4;
                var i2 = a * 4 + b * 4 * this.buf.width;
                r.data[i1] = this.buf.data[i2];
                r.data[i1 + 1] = this.buf.data[i2 + 1];
                r.data[i1 + 2] = this.buf.data[i2 + 2];
                r.data[i1 + 3] = this.buf.data[i2 + 3];
            }
        }
        return r;
    }
}
exports.ImgRefData = ImgRefData;


/***/ }),

/***/ "./src/base/index.ts":
/*!***************************!*\
  !*** ./src/base/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_33868__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.imageDataFromUrl = exports.ImageDataSet = exports.findSubbuffer = exports.simpleCompare = exports.findSubimage = exports.webpackImages = exports.NodePolyfill = exports.ImageData = exports.Rect = exports.PasteInput = exports.ImageDetect = void 0;
__nested_webpack_require_33868__(/*! ./declarations */ "./src/base/declarations.ts");
exports.ImageDetect = __importStar(__nested_webpack_require_33868__(/*! ./imagedetect */ "./src/base/imagedetect.ts"));
exports.PasteInput = __importStar(__nested_webpack_require_33868__(/*! ./pasteinput */ "./src/base/pasteinput.ts"));
var rect_1 = __nested_webpack_require_33868__(/*! ./rect */ "./src/base/rect.ts");
Object.defineProperty(exports, "Rect", ({ enumerable: true, get: function () { return __importDefault(rect_1).default; } }));
var imagedata_extensions_1 = __nested_webpack_require_33868__(/*! ./imagedata-extensions */ "./src/base/imagedata-extensions.ts");
Object.defineProperty(exports, "ImageData", ({ enumerable: true, get: function () { return imagedata_extensions_1.ImageData; } }));
exports.NodePolyfill = __importStar(__nested_webpack_require_33868__(/*! ./nodepolyfill */ "./src/base/nodepolyfill.ts"));
__exportStar(__nested_webpack_require_33868__(/*! ./imgref */ "./src/base/imgref.ts"), exports);
__exportStar(__nested_webpack_require_33868__(/*! ./wrapper */ "./src/base/wrapper.ts"), exports);
var imagedetect_1 = __nested_webpack_require_33868__(/*! ./imagedetect */ "./src/base/imagedetect.ts");
Object.defineProperty(exports, "webpackImages", ({ enumerable: true, get: function () { return imagedetect_1.webpackImages; } }));
Object.defineProperty(exports, "findSubimage", ({ enumerable: true, get: function () { return imagedetect_1.findSubimage; } }));
Object.defineProperty(exports, "simpleCompare", ({ enumerable: true, get: function () { return imagedetect_1.simpleCompare; } }));
Object.defineProperty(exports, "findSubbuffer", ({ enumerable: true, get: function () { return imagedetect_1.findSubbuffer; } }));
Object.defineProperty(exports, "ImageDataSet", ({ enumerable: true, get: function () { return imagedetect_1.ImageDataSet; } }));
Object.defineProperty(exports, "imageDataFromUrl", ({ enumerable: true, get: function () { return imagedetect_1.imageDataFromUrl; } }));


/***/ }),

/***/ "./src/base/nodepolyfill.ts":
/*!**********************************!*\
  !*** ./src/base/nodepolyfill.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_37680__) => {


//nodejs and electron polyfills for web api's
//commented out type info as that breaks webpack with optional dependencies
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.imageDataFromBuffer = exports.imageDataFromBase64 = exports.imageDataToFileBytes = exports.createCanvas = exports.imageDataToDrawable = exports.requireElectronCommon = exports.requireNodeCanvas = exports.requireSharp = exports.polyfillRequire = void 0;
const index_1 = __nested_webpack_require_37680__(/*! ./index */ "./src/base/index.ts");
const imagedetect_1 = __nested_webpack_require_37680__(/*! ./imagedetect */ "./src/base/imagedetect.ts");
var requirefunction = null;
/**
 * Call this function to let the libs require extra dependencies on nodejs in order
 * to polyfill some browser api's (mostly image compression/decompression)
 * `NodePolifill.polyfillRequire(require);` should solve most cases
 */
function polyfillRequire(requirefn) {
    requirefunction = requirefn;
}
exports.polyfillRequire = polyfillRequire;
function requireSharp() {
    try {
        if (requirefunction) {
            return requirefunction("sharp");
        }
        else {
            return __nested_webpack_require_37680__(/* webpackIgnore: true */ /*! sharp */ "sharp"); // as typeof import("sharp");
        }
    }
    catch (e) { }
    return null;
}
exports.requireSharp = requireSharp;
function requireNodeCanvas() {
    //attempt to require sharp first, after loading canvas the module sharp fails to load
    requireSharp();
    try {
        if (requirefunction) {
            return requirefunction("canvas");
        }
        else {
            return __nested_webpack_require_37680__(/* webpackIgnore: true */ /*! canvas */ "canvas"); // as typeof import("sharp");
        }
    }
    catch (e) { }
    return null;
}
exports.requireNodeCanvas = requireNodeCanvas;
function requireElectronCommon() {
    try {
        if (requirefunction) {
            return requirefunction("electron/common");
        }
        else {
            return __nested_webpack_require_37680__(/* webpackIgnore: true */ /*! electron/common */ "electron/common");
        }
    }
    catch (e) { }
    return null;
}
exports.requireElectronCommon = requireElectronCommon;
function imageDataToDrawable(buf) {
    let nodecnv = requireNodeCanvas();
    if (!nodecnv) {
        throw new Error("couldn't find built-in canvas or the module 'canvas'");
    }
    return new nodecnv.ImageData(buf.data, buf.width, buf.height);
}
exports.imageDataToDrawable = imageDataToDrawable;
function createCanvas(w, h) {
    let nodecnv = requireNodeCanvas();
    if (!nodecnv) {
        throw new Error("couldn't find built-in canvas or the module 'canvas'");
    }
    return nodecnv.createCanvas(w, h);
}
exports.createCanvas = createCanvas;
function flipBGRAtoRGBA(data) {
    for (let i = 0; i < data.length; i += 4) {
        let tmp = data[i + 2];
        data[i + 2] = data[i + 0];
        data[i + 0] = tmp;
    }
}
async function imageDataToFileBytes(buf, format, quality) {
    //use the electron API if we're in electron
    var electronCommon;
    var sharp;
    if (electronCommon = requireElectronCommon()) {
        let nativeImage = electronCommon.nativeImage;
        //need to copy the buffer in order to flip it without destroying the original
        let bufcpy = Buffer.from(buf.data.slice(buf.data.byteOffset, buf.data.byteLength));
        flipBGRAtoRGBA(bufcpy);
        let nativeimg = nativeImage.createFromBitmap(bufcpy, { width: buf.width, height: buf.height });
        return nativeimg.toPNG();
    }
    else if (sharp = requireSharp()) {
        let img = sharp(Buffer.from(buf.data.buffer), { raw: { width: buf.width, height: buf.height, channels: 4 } });
        if (format == "image/png") {
            img.png();
        }
        else if (format == "image/webp") {
            var opts = { quality: 80 };
            if (typeof quality == "number") {
                opts.quality = quality * 100;
            }
            img.webp(opts);
        }
        else {
            throw new Error("unknown image format: " + format);
        }
        return await img.toBuffer({ resolveWithObject: false }).buffer;
    }
    throw new Error("coulnd't find build-in image compression methods or the module 'electron/common' or 'sharp'");
}
exports.imageDataToFileBytes = imageDataToFileBytes;
function imageDataFromBase64(base64) {
    return imageDataFromBuffer(Buffer.from(base64, "base64"));
}
exports.imageDataFromBase64 = imageDataFromBase64;
async function imageDataFromBuffer(buffer) {
    (0, imagedetect_1.clearPngColorspace)(buffer);
    //use the electron API if we're in electron
    var electronCommon;
    var nodecnv;
    if (electronCommon = requireElectronCommon()) {
        let nativeImage = electronCommon.nativeImage;
        let img = nativeImage.createFromBuffer(buffer);
        let pixels = img.toBitmap();
        let size = img.getSize();
        let pixbuf = new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, pixels.byteLength);
        flipBGRAtoRGBA(pixbuf);
        return new index_1.ImageData(pixbuf, size.width, size.height);
    }
    else if (nodecnv = requireNodeCanvas()) {
        return new Promise((done, err) => {
            let img = new nodecnv.Image();
            img.onerror = err;
            img.onload = () => {
                var cnv = nodecnv.createCanvas(img.naturalWidth, img.naturalHeight);
                var ctx = cnv.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
                //use our own class
                done(new index_1.ImageData(data.data, data.width, data.height));
            };
            img.src = Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        });
    }
    throw new Error("couldn't find built-in canvas, module 'electron/common' or the module 'canvas'");
}
exports.imageDataFromBuffer = imageDataFromBuffer;


/***/ }),

/***/ "./src/base/pasteinput.ts":
/*!********************************!*\
  !*** ./src/base/pasteinput.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_43872__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fileDialog = exports.start = exports.startDragNDrop = exports.triggerPaste = exports.unlisten = exports.listen = exports.lastref = void 0;
const index_1 = __nested_webpack_require_43872__(/*! ./index */ "./src/base/index.ts");
const ImageDetect = __importStar(__nested_webpack_require_43872__(/*! ./imagedetect */ "./src/base/imagedetect.ts"));
var listeners = [];
var started = false;
var dndStarted = false;
var pasting = false;
exports.lastref = null;
function listen(func, errorfunc, dragndrop) {
    listeners.push({ cb: func, error: errorfunc });
    if (!started) {
        start();
    }
    if (dragndrop && !dndStarted) {
        startDragNDrop();
    }
}
exports.listen = listen;
function unlisten(func) {
    let i = listeners.findIndex(c => c.cb == func);
    if (i != -1) {
        listeners.splice(i, 1);
    }
}
exports.unlisten = unlisten;
/**
 * currently used in multiple document situations (iframe), might be removed in the future
 */
function triggerPaste(img) {
    exports.lastref = img;
    for (var a in listeners) {
        listeners[a].cb(exports.lastref);
    }
}
exports.triggerPaste = triggerPaste;
function pasted(img) {
    pasting = false;
    triggerPaste(new index_1.ImgRefCtx(img));
}
function error(error, mes) {
    var _a, _b;
    pasting = false;
    for (var a in listeners) {
        (_b = (_a = listeners[a]).error) === null || _b === void 0 ? void 0 : _b.call(_a, mes, error);
    }
}
function startDragNDrop() {
    var getitem = function (items) {
        var foundimage = "";
        for (var a = 0; a < items.length; a++) {
            var item = items[a];
            var m = item.type.match(/^image\/(\w+)$/);
            if (m) {
                if (m[1] == "png") {
                    return item;
                }
                else {
                    foundimage = m[1];
                }
            }
        }
        if (foundimage) {
            error("notpng", "The image you uploaded is not a .png image. Other image type have compression noise and can't be used for image detection.");
        }
        return null;
    };
    window.addEventListener("dragover", function (e) {
        e.preventDefault();
    });
    window.addEventListener("drop", function (e) {
        if (!e.dataTransfer) {
            return;
        }
        var item = getitem(e.dataTransfer.items);
        e.preventDefault();
        if (!item) {
            return;
        }
        fromFile(item.getAsFile());
    });
}
exports.startDragNDrop = startDragNDrop;
function start() {
    if (started) {
        return;
    }
    started = true;
    //determine if we have a clipboard api
    //try{a=new Event("clipboard"); a="clipboardData" in a;}
    //catch(e){a=false;}
    var ischrome = !!navigator.userAgent.match(/Chrome/) && !navigator.userAgent.match(/Edge/);
    //old method breaks after chrome 41, revert to good old user agent sniffing
    //nvm, internet explorer (edge) decided that it wants to be chrome, however fails at delivering
    //turns out this one is interesting, edge is a hybrid between the paste api's
    var apipasted = function (e) {
        if (!e.clipboardData) {
            return;
        }
        for (var a = 0; a < e.clipboardData.items.length; a++) { //loop all data types
            if (e.clipboardData.items[a].type.indexOf("image") != -1) {
                var file = e.clipboardData.items[a].getAsFile();
                if (file) {
                    var img = new Image();
                    img.src = (window.URL || window.webkitURL).createObjectURL(file);
                    if (img.width > 0) {
                        pasted(img);
                    }
                    else {
                        img.onload = function () { pasted(img); };
                    }
                }
            }
        }
    };
    if (ischrome) {
        document.addEventListener("paste", apipasted);
    }
    else {
        var catcher = document.createElement("div");
        catcher.setAttribute("contenteditable", "");
        catcher.className = "forcehidden"; //retarded ie safety/bug, cant apply styles using js//TODO i don't even know what's going on
        catcher.onpaste = function (e) {
            if (e.clipboardData && e.clipboardData.items) {
                apipasted(e);
                return;
            }
            setTimeout(function () {
                var b = catcher.children[0];
                if (!b || b.tagName != "IMG") {
                    return;
                }
                var img = new Image();
                img.src = b.src;
                var a = img.src.match(/^data:([\w\/]+);/);
                if (img.width > 0) {
                    pasted(img);
                }
                else {
                    img.onload = function () { pasted(img); };
                }
                catcher.innerHTML = "";
            }, 1);
        };
        document.body.appendChild(catcher);
    }
    //detect if ctrl-v is pressed and focus catcher if needed
    document.addEventListener("keydown", function (e) {
        if (e.target.tagName == "INPUT") {
            return;
        }
        if (e.keyCode != "V".charCodeAt(0) || !e.ctrlKey) {
            return;
        }
        pasting = true;
        setTimeout(function () {
            if (pasting) {
                error("noimg", "You pressed Ctrl+V, but no image was pasted by your browser, make sure your clipboard contains an image, and not a link to an image.");
            }
        }, 1000);
        if (catcher) {
            catcher.focus();
        }
    });
}
exports.start = start;
function fileDialog() {
    var fileinput = document.createElement("input");
    fileinput.type = "file";
    fileinput.accept = "image/png";
    fileinput.onchange = function () { if (fileinput.files && fileinput.files[0]) {
        fromFile(fileinput.files[0]);
    } };
    fileinput.click();
    return fileinput;
}
exports.fileDialog = fileDialog;
function fromFile(file) {
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function () {
        var bytearray = new Uint8Array(reader.result);
        if (ImageDetect.isPngBuffer(bytearray)) {
            ImageDetect.clearPngColorspace(bytearray);
        }
        var blob = new Blob([bytearray], { type: "image/png" });
        var img = new Image();
        var bloburl = URL.createObjectURL(blob);
        img.onerror = () => {
            URL.revokeObjectURL(bloburl);
            error("invalidfile", "The file you uploaded could not be opened as an image.");
        };
        img.src = bloburl;
        if (img.width > 0) {
            pasted(img);
            URL.revokeObjectURL(bloburl);
        }
        else {
            img.onload = function () {
                pasted(img);
                URL.revokeObjectURL(bloburl);
            };
        }
    };
    reader.readAsArrayBuffer(file);
}


/***/ }),

/***/ "./src/base/rect.ts":
/*!**************************!*\
  !*** ./src/base/rect.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


//util class for rectangle maths
//TODO shit this sucks can we remove it again?
//more of a shorthand to get {x,y,width,height} than a class
//kinda starting to like it again
//TODO remove rant
Object.defineProperty(exports, "__esModule", ({ value: true }));
;
/**
 * Simple rectangle class with some util functions
 */
class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    static fromArgs(...args) {
        if (typeof args[0] == "object") {
            return new Rect(args[0].x, args[0].y, args[0].width, args[0].height);
        }
        else if (typeof args[0] == "number" && args.length >= 4) {
            return new Rect(args[0], args[1], args[2], args[3]);
        }
        else {
            throw new Error("invalid rect args");
        }
    }
    /**
     * Resizes this Rect to include the full size of a given second rectangle
     */
    union(r2) {
        var x = Math.min(this.x, r2.x);
        var y = Math.min(this.y, r2.y);
        this.width = Math.max(this.x + this.width, r2.x + r2.width) - x;
        this.height = Math.max(this.y + this.height, r2.y + r2.height) - y;
        this.x = x;
        this.y = y;
        return this;
    }
    /**
     * Resizes this Rect to include a given point
     */
    includePoint(x, y) {
        this.union(new Rect(x, y, 0, 0));
    }
    /**
     * Grows the rectangle with the given dimensions
     */
    inflate(w, h) {
        this.x -= w;
        this.y -= h;
        this.width += 2 * w;
        this.height += 2 * h;
    }
    /**
     * Resizes this Rect to the area that overlaps a given Rect
     * width and height will be set to 0 if the intersection does not exist
     */
    intersect(r2) {
        if (this.x < r2.x) {
            this.width -= r2.x - this.x;
            this.x = r2.x;
        }
        if (this.y < r2.y) {
            this.height -= r2.y - this.y;
            this.y = r2.y;
        }
        this.width = Math.min(this.x + this.width, r2.x + r2.width) - this.x;
        this.height = Math.min(this.y + this.height, r2.y + r2.height) - this.y;
        if (this.width <= 0 || this.height <= 0) {
            this.width = 0;
            this.height = 0;
        }
    }
    /**
     * Returns wether this Rect has at least one pixel overlap with a given Rect
     */
    overlaps(r2) {
        return this.x < r2.x + r2.width && this.x + this.width > r2.x && this.y < r2.y + r2.height && this.y + this.height > r2.y;
    }
    /**
     * Returns wether a given Rect fits completely inside this Rect
     * @param r2
     */
    contains(r2) {
        return this.x <= r2.x && this.x + this.width >= r2.x + r2.width && this.y <= r2.y && this.y + this.height >= r2.y + r2.height;
    }
    /**
     * Returns wether a given point lies inside this Rect
     */
    containsPoint(x, y) {
        return this.x <= x && this.x + this.width > x && this.y <= y && this.y + this.height > y;
    }
}
exports["default"] = Rect;


/***/ }),

/***/ "./src/base/wrapper.ts":
/*!*****************************!*\
  !*** ./src/base/wrapper.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_55275__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.captureStream = exports.captureMultiAsync = exports.captureAsync = exports.ImageStreamReader = exports.once = exports.removeListener = exports.on = exports.addResizeElement = exports.getMousePosition = exports.hasAlt1Version = exports.resetEnvironment = exports.identifyApp = exports.unmixColor = exports.mixColor = exports.encodeImageString = exports.decodeImageString = exports.transferImageData = exports.captureHoldFullRs = exports.captureHoldScreen = exports.captureHold = exports.capture = exports.getdisplaybounds = exports.requireAlt1 = exports.openbrowser = exports.skinName = exports.hasAlt1 = exports.newestversion = exports.Alt1Error = exports.NoAlt1Error = void 0;
const rect_1 = __importDefault(__nested_webpack_require_55275__(/*! ./rect */ "./src/base/rect.ts"));
const imgref_1 = __nested_webpack_require_55275__(/*! ./imgref */ "./src/base/imgref.ts");
const imagedata_extensions_1 = __nested_webpack_require_55275__(/*! ./imagedata-extensions */ "./src/base/imagedata-extensions.ts");
__nested_webpack_require_55275__(/*! ./alt1api */ "./src/base/alt1api.ts");
/**
 * Thrown when a method is called that can not be used outside of Alt1
 */
class NoAlt1Error extends Error {
    constructor() {
        super();
        this.message = "This method can not be ran outside of Alt1";
    }
}
exports.NoAlt1Error = NoAlt1Error;
;
/**
 * Thrown when the Alt1 API returns an invalid result
 * Errors of a different type are throw when internal Alt1 errors occur
 */
class Alt1Error extends Error {
}
exports.Alt1Error = Alt1Error;
/**
 * The latest Alt1 version
 */
exports.newestversion = "1.5.5";
/**
 * Whether the Alt1 API is available
 */
exports.hasAlt1 = (typeof alt1 != "undefined");
/**
 * The name of the Alt1 interface skin. (Always "default" if running in a browser)
 */
exports.skinName = exports.hasAlt1 ? alt1.skinName : "default";
/**
 * Max number of bytes that can be sent by alt1 in one function
 * Not completely sure why this number is different than window.alt1.maxtranfer
 */
var maxtransfer = 4000000;
/**
 * Open a link in the default browser
 * @deprecated use window.open instead
 */
function openbrowser(url) {
    if (exports.hasAlt1) {
        alt1.openBrowser(url);
    }
    else {
        window.open(url, '_blank');
    }
}
exports.openbrowser = openbrowser;
/**
 * Throw if Alt1 API is not available
 */
function requireAlt1() {
    if (!exports.hasAlt1) {
        throw new NoAlt1Error();
    }
}
exports.requireAlt1 = requireAlt1;
/**
 * Returns an object with a rectangle that spans all screens
 */
function getdisplaybounds() {
    if (!exports.hasAlt1) {
        return false;
    }
    return new rect_1.default(alt1.screenX, alt1.screenY, alt1.screenWidth, alt1.screenHeight);
}
exports.getdisplaybounds = getdisplaybounds;
/**
 * gets an imagebuffer with pixel data about the requested region
 */
function capture(...args) {
    //TODO change null return on error into throw instead (x3)
    if (!exports.hasAlt1) {
        throw new NoAlt1Error();
    }
    var rect = rect_1.default.fromArgs(...args);
    if (alt1.capture) {
        return new imagedata_extensions_1.ImageData(alt1.capture(rect.x, rect.y, rect.width, rect.height), rect.width, rect.height);
    }
    var buf = new imagedata_extensions_1.ImageData(rect.width, rect.height);
    if (rect.width * rect.height * 4 <= maxtransfer) {
        var data = alt1.getRegion(rect.x, rect.y, rect.width, rect.height);
        if (!data) {
            return null;
        }
        decodeImageString(data, buf, 0, 0, rect.width, rect.height);
    }
    else {
        //split up the request to to exceed the single transfer limit (for now)
        var x1 = rect.x;
        var ref = alt1.bindRegion(rect.x, rect.y, rect.width, rect.height);
        if (ref <= 0) {
            return null;
        }
        while (x1 < rect.x + rect.width) {
            var x2 = Math.min(rect.x + rect.width, Math.floor(x1 + (maxtransfer / 4 / rect.height)));
            var data = alt1.bindGetRegion(ref, x1, rect.y, x2 - x1, rect.height);
            if (!data) {
                return null;
            }
            decodeImageString(data, buf, x1 - rect.x, 0, x2 - x1, rect.height);
            x1 = x2;
        }
    }
    return buf;
}
exports.capture = capture;
/**
 * Makes alt1 bind an area of the rs client in memory without sending it to the js client
 * returns an imgref object which can be used to get pixel data using the imgreftobuf function
 * currently only one bind can exist per app and the ref in (v) will always be 1
 */
function captureHold(x, y, w, h) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    requireAlt1();
    var r = alt1.bindRegion(x, y, w, h);
    if (r <= 0) {
        throw new Alt1Error("capturehold failed");
    }
    return new imgref_1.ImgRefBind(r, x, y, w, h);
}
exports.captureHold = captureHold;
/**
 * Same as captureHoldRegion, but captures the screen instead of the rs client. it also uses screen coordinates instead and can capture outside of the rs client
 */
function captureHoldScreen(x, y, w, h) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    requireAlt1();
    var r = alt1.bindScreenRegion(x, y, w, h);
    if (r <= 0) {
        return false;
    }
    return new imgref_1.ImgRefBind(r, x, y, w, h);
}
exports.captureHoldScreen = captureHoldScreen;
/**
 * bind the full rs window
 */
function captureHoldFullRs() {
    return captureHold(0, 0, alt1.rsWidth, alt1.rsHeight);
}
exports.captureHoldFullRs = captureHoldFullRs;
/**
 * returns a subregion from a bound image
 * used internally in imgreftobuf if imgref is a bound image
 * @deprecated This should be handled internall by the imgrefbind.toData method
 */
function transferImageData(handle, x, y, w, h) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    requireAlt1();
    if (alt1.bindGetRegionBuffer) {
        return new imagedata_extensions_1.ImageData(alt1.bindGetRegionBuffer(handle, x, y, w, h), w, h);
    }
    var r = new imagedata_extensions_1.ImageData(w, h);
    var x1 = x;
    while (true) { //split up the request to to exceed the single transfer limit (for now)
        var x2 = Math.min(x + w, Math.floor(x1 + (maxtransfer / 4 / h)));
        var a = alt1.bindGetRegion(handle, x1, y, x2 - x1, h);
        if (!a) {
            throw new Alt1Error();
        }
        decodeImageString(a, r, x1 - x, 0, x2 - x1, h);
        x1 = x2;
        if (x1 == x + w) {
            break;
        }
        ;
    }
    return r;
}
exports.transferImageData = transferImageData;
/**
 * decodes a returned string from alt1 to an imagebuffer. You generally never have to do this yourself
 */
function decodeImageString(imagestring, target, x, y, w, h) {
    var bin = atob(imagestring);
    var bytes = target.data;
    w |= 0;
    h |= 0;
    var offset = 4 * x + 4 * y * target.width;
    var target_width = target.width | 0;
    for (var a = 0; a < w; a++) {
        for (var b = 0; b < h; b++) {
            var i1 = (offset + (a * 4 | 0) + (b * target_width * 4 | 0)) | 0;
            var i2 = ((a * 4 | 0) + (b * 4 * w | 0)) | 0;
            bytes[i1 + 0 | 0] = bin.charCodeAt(i2 + 2 | 0); //fix weird red/blue swap in c#
            bytes[i1 + 1 | 0] = bin.charCodeAt(i2 + 1 | 0);
            bytes[i1 + 2 | 0] = bin.charCodeAt(i2 + 0 | 0);
            bytes[i1 + 3 | 0] = bin.charCodeAt(i2 + 3 | 0);
        }
    }
    return target;
}
exports.decodeImageString = decodeImageString;
/**
 * encodes an imagebuffer to a string
 */
function encodeImageString(buf, sx = 0, sy = 0, sw = buf.width, sh = buf.height) {
    var raw = "";
    for (var y = sy; y < sy + sh; y++) {
        for (var x = sx; x < sx + sw; x++) {
            var i = 4 * x + 4 * buf.width * y | 0;
            raw += String.fromCharCode(buf.data[i + 2 | 0]);
            raw += String.fromCharCode(buf.data[i + 1 | 0]);
            raw += String.fromCharCode(buf.data[i + 0 | 0]);
            raw += String.fromCharCode(buf.data[i + 3 | 0]);
        }
    }
    return btoa(raw);
}
exports.encodeImageString = encodeImageString;
/**
 * mixes the given color into a single int. This format is used by alt1
 */
function mixColor(r, g, b, a = 255) {
    return (b << 0) + (g << 8) + (r << 16) + (a << 24);
}
exports.mixColor = mixColor;
function unmixColor(col) {
    var r = (col >> 16) & 0xff;
    var g = (col >> 8) & 0xff;
    var b = (col >> 0) & 0xff;
    return [r, g, b];
}
exports.unmixColor = unmixColor;
function identifyApp(url) {
    if (exports.hasAlt1) {
        alt1.identifyAppUrl(url);
    }
}
exports.identifyApp = identifyApp;
function resetEnvironment() {
    exports.hasAlt1 = (typeof alt1 != "undefined");
    exports.skinName = exports.hasAlt1 ? alt1.skinName : "default";
}
exports.resetEnvironment = resetEnvironment;
function convertAlt1Version(str) {
    var a = str.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!a) {
        throw new RangeError("Invalid version string");
    }
    return (+a[1]) * 1000 * 1000 + (+a[2]) * 1000 + (+a[3]) * 1;
}
var cachedVersionInt = -1;
/**
 * checks if alt1 is running and at least the given version. versionstr should be a string with the version eg: 1.3.2
 * @param versionstr
 */
function hasAlt1Version(versionstr) {
    if (!exports.hasAlt1) {
        return false;
    }
    if (cachedVersionInt == -1) {
        cachedVersionInt = alt1.versionint;
    }
    return cachedVersionInt >= convertAlt1Version(versionstr);
}
exports.hasAlt1Version = hasAlt1Version;
/**
 * Gets the current cursor position in the game, returns null if the rs window is not active (alt1.rsActive)
 */
function getMousePosition() {
    var pos = alt1.mousePosition;
    if (pos == -1) {
        return null;
    }
    return { x: pos >>> 16, y: pos & 0xFFFF };
}
exports.getMousePosition = getMousePosition;
/**
 * Registers a given HTML element as a frame border, when this element is dragged by the user the Alt1 frame will resize accordingly
 * Use the direction arguements to make a given direction stick to the mouse. eg. Only set left to true to make the element behave as the left border
 * Or set all to true to move the whole window. Not all combinations are permitted
 */
function addResizeElement(el, left, top, right, bot) {
    if (!exports.hasAlt1 || !alt1.userResize) {
        return;
    }
    el.addEventListener("mousedown", function (e) {
        alt1.userResize(left, top, right, bot);
        e.preventDefault();
    });
}
exports.addResizeElement = addResizeElement;
/**
 * Add an event listener
 */
function on(type, listener) {
    if (!exports.hasAlt1) {
        return;
    }
    if (!alt1.events) {
        alt1.events = {};
    }
    if (!alt1.events[type]) {
        alt1.events[type] = [];
    }
    alt1.events[type].push(listener);
}
exports.on = on;
/**
 * Removes an event listener
 */
function removeListener(type, listener) {
    var elist = exports.hasAlt1 && alt1.events && alt1.events[type];
    if (!elist) {
        return;
    }
    var i = elist.indexOf(listener);
    if (i == -1) {
        return;
    }
    elist.splice(i, 1);
}
exports.removeListener = removeListener;
/**
 * Listens for the event to fire once and then stops listening
 * @param event
 * @param cb
 */
function once(type, listener) {
    var fn = (e) => {
        removeListener(type, fn);
        listener(e);
    };
    on(type, fn);
}
exports.once = once;
;
/**
 * Used to read a set of images from a binary stream returned by the Alt1 API
 */
class ImageStreamReader {
    constructor(reader, ...args) {
        this.framebuffer = null;
        this.pos = 0;
        this.reading = false;
        this.closed = false;
        //paused state
        this.pausedindex = -1;
        this.pausedbuffer = null;
        this.streamreader = reader;
        if (args[0] instanceof imagedata_extensions_1.ImageData) {
            this.setFrameBuffer(args[0]);
        }
        else if (typeof args[0] == "number") {
            this.setFrameBuffer(new imagedata_extensions_1.ImageData(args[0], args[1]));
        }
    }
    /**
     *
     */
    setFrameBuffer(buffer) {
        if (this.reading) {
            throw new Error("can't change framebuffer while reading");
        }
        this.framebuffer = buffer;
    }
    /**
     * Closes the underlying stream and ends reading
     */
    close() {
        this.streamreader.cancel();
    }
    /**
     * Reads a single image from the stream
     */
    async nextImage() {
        if (this.reading) {
            throw new Error("already reading from this stream");
        }
        if (!this.framebuffer) {
            throw new Error("framebuffer not set");
        }
        this.reading = true;
        var synctime = -Date.now();
        var starttime = Date.now();
        var r = false;
        while (!r) {
            if (this.pausedindex != -1 && this.pausedbuffer) {
                r = this.readChunk(this.pausedindex, this.framebuffer.data, this.pausedbuffer);
            }
            else {
                synctime += Date.now();
                var res = await this.streamreader.read();
                synctime -= Date.now();
                if (res.done) {
                    throw new Error("Stream closed while reading");
                }
                var data = res.value;
                r = this.readChunk(0, this.framebuffer.data, data);
            }
        }
        synctime += Date.now();
        //console.log("Decoded async image, " + this.framebuffer.width + "x" + this.framebuffer.height + " time: " + (Date.now() - starttime) + "ms (" + synctime + "ms main thread)");
        this.reading = false;
        return this.framebuffer;
    }
    readChunk(i, framedata, buffer) {
        //very hot code, explicit int32 casting with |0 speeds it up by ~ x2
        i = i | 0;
        var framesize = framedata.length | 0;
        var pos = this.pos;
        var datalen = buffer.length | 0;
        //var data32 = new Float64Array(buffer.buffer);
        //var framedata32 = new Float64Array(framedata.buffer);
        //fix possible buffer misalignment
        //align to 16 for extra loop unrolling
        while (i < datalen) {
            //slow loop, fix alignment and other issues
            while (i < datalen && pos < framesize && (pos % 16 != 0 || !((i + 16 | 0) <= datalen && (pos + 16 | 0) <= framesize))) {
                var rel = pos;
                if (pos % 4 == 0) {
                    rel = rel + 2 | 0;
                }
                if (pos % 4 == 2) {
                    rel = rel - 2 | 0;
                }
                framedata[rel | 0] = buffer[i | 0];
                i = i + 1 | 0;
                pos = pos + 1 | 0;
            }
            //fast unrolled loop for large chunks i wish js had some sort of memcpy
            if (pos % 16 == 0) {
                while ((i + 16 | 0) <= datalen && (pos + 16 | 0) <= framesize) {
                    framedata[pos + 0 | 0] = buffer[i + 2 | 0];
                    framedata[pos + 1 | 0] = buffer[i + 1 | 0];
                    framedata[pos + 2 | 0] = buffer[i + 0 | 0];
                    framedata[pos + 3 | 0] = buffer[i + 3 | 0];
                    framedata[pos + 4 | 0] = buffer[i + 6 | 0];
                    framedata[pos + 5 | 0] = buffer[i + 5 | 0];
                    framedata[pos + 6 | 0] = buffer[i + 4 | 0];
                    framedata[pos + 7 | 0] = buffer[i + 7 | 0];
                    framedata[pos + 8 | 0] = buffer[i + 10 | 0];
                    framedata[pos + 9 | 0] = buffer[i + 9 | 0];
                    framedata[pos + 10 | 0] = buffer[i + 8 | 0];
                    framedata[pos + 11 | 0] = buffer[i + 11 | 0];
                    framedata[pos + 12 | 0] = buffer[i + 14 | 0];
                    framedata[pos + 13 | 0] = buffer[i + 13 | 0];
                    framedata[pos + 14 | 0] = buffer[i + 12 | 0];
                    framedata[pos + 15 | 0] = buffer[i + 15 | 0];
                    //could speed it up another x2 but wouldn't be able to swap r/b swap and possible alignment issues
                    //framedata32[pos / 8 + 0 | 0] = data32[i / 8 + 0 | 0];
                    //framedata32[pos / 8 + 1 | 0] = data32[i / 8 + 1 | 0];
                    //framedata32[pos / 4 + 2 | 0] = data32[i / 4 + 2 | 0];
                    //framedata32[pos / 4 + 3 | 0] = data32[i / 4 + 3 | 0];
                    pos = pos + 16 | 0;
                    i = i + 16 | 0;
                }
            }
            if (pos >= framesize) {
                this.pausedbuffer = null;
                this.pausedindex = -1;
                this.pos = 0;
                if (i != buffer.length - 1) {
                    this.pausedbuffer = buffer;
                    this.pausedindex = i;
                }
                return true;
            }
        }
        this.pos = pos;
        this.pausedbuffer = null;
        this.pausedindex = -1;
        return false;
    }
}
exports.ImageStreamReader = ImageStreamReader;
/**
 * Asynchronously captures a section of the game screen
 */
async function captureAsync(...args) {
    requireAlt1();
    var rect = rect_1.default.fromArgs(...args);
    if (alt1.captureAsync) {
        let img = await alt1.captureAsync(rect.x, rect.y, rect.width, rect.height);
        return new imagedata_extensions_1.ImageData(img, rect.width, rect.height);
    }
    if (!hasAlt1Version("1.4.6")) {
        return capture(rect.x, rect.y, rect.width, rect.height);
    }
    var url = "https://alt1api/pixel/getregion/" + encodeURIComponent(JSON.stringify(Object.assign(Object.assign({}, rect), { format: "raw", quality: 1 })));
    var res = await fetch(url);
    var imgreader = new ImageStreamReader(res.body.getReader(), rect.width, rect.height);
    return imgreader.nextImage();
}
exports.captureAsync = captureAsync;
/**
 * Asynchronously captures multple area's. This method captures the images in the same render frame if possible
 * @param areas
 */
async function captureMultiAsync(areas) {
    requireAlt1();
    var r = {};
    if (alt1.captureMultiAsync) {
        let bufs = await alt1.captureMultiAsync(areas);
        for (let a in areas) {
            if (!bufs[a]) {
                r[a] = null;
            }
            r[a] = new imagedata_extensions_1.ImageData(bufs[a], areas[a].width, areas[a].height);
        }
        return r;
    }
    var capts = [];
    var captids = [];
    for (var id in areas) {
        if (areas[id]) {
            capts.push(areas[id]);
            captids.push(id);
        }
        else {
            r[id] = null;
        }
    }
    if (capts.length == 0) {
        return r;
    }
    if (!hasAlt1Version("1.5.1")) {
        var proms = [];
        for (var a = 0; a < capts.length; a++) {
            proms.push(captureAsync(capts[a]));
        }
        var results = await Promise.all(proms);
        for (var a = 0; a < capts.length; a++) {
            r[captids[a]] = results[a];
        }
    }
    else {
        var res = await fetch("https://alt1api/pixel/getregionmulti/" + encodeURIComponent(JSON.stringify({ areas: capts, format: "raw", quality: 1 })));
        var imgreader = new ImageStreamReader(res.body.getReader());
        for (var a = 0; a < capts.length; a++) {
            var capt = capts[a];
            imgreader.setFrameBuffer(new imagedata_extensions_1.ImageData(capt.width, capt.height));
            r[captids[a]] = await imgreader.nextImage();
        }
    }
    return r;
}
exports.captureMultiAsync = captureMultiAsync;
/**
 * Starts capturing a realtime stream of the game. Make sure you keep reading the stream and close it when you're done or Alt1 WILL crash
 * @param framecb Called whenever a new frame is decoded
 * @param errorcb Called whenever an error occurs, the error is rethrown if not defined
 * @param fps Maximum fps of the stream
 */
function captureStream(x, y, width, height, fps, framecb, errorcb) {
    requireAlt1();
    if (!hasAlt1Version("1.4.6")) {
        throw new Alt1Error("This function is not supported in this version of Alt1");
    }
    var url = "https://alt1api/pixel/streamregion/" + encodeURIComponent(JSON.stringify({ x, y, width, height, fps, format: "raw" }));
    var res = fetch(url).then(async (res) => {
        var reader = new ImageStreamReader(res.body.getReader(), width, height);
        try {
            while (!reader.closed && !state.closed) {
                var img = await reader.nextImage();
                if (!state.closed) {
                    framecb(img);
                    state.framenr++;
                }
            }
        }
        catch (e) {
            if (!state.closed) {
                reader.close();
                if (errorcb) {
                    errorcb(e);
                }
                else {
                    throw e;
                }
            }
        }
        if (!reader.closed && state.closed) {
            reader.close();
        }
    });
    var state = {
        x, y, width, height,
        framenr: 0,
        close: () => { state.closed = true; },
        closed: false,
    };
    return state;
}
exports.captureStream = captureStream;


/***/ }),

/***/ "canvas":
/*!*************************!*\
  !*** external "canvas" ***!
  \*************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_canvas__ === 'undefined') { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_canvas__;

/***/ }),

/***/ "electron/common":
/*!**********************************!*\
  !*** external "electron/common" ***!
  \**********************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_electron_common__ === 'undefined') { var e = new Error("Cannot find module 'electron/common'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_electron_common__;

/***/ }),

/***/ "sharp":
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_sharp__ === 'undefined') { var e = new Error("Cannot find module 'sharp'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_sharp__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_78005__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_78005__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__nested_webpack_require_78005__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __nested_webpack_exports__ = __nested_webpack_require_78005__("./src/base/index.ts");
/******/ 	
/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});

/***/ }),

/***/ "../node_modules/is-electron/index.js":
/*!********************************************!*\
  !*** ../node_modules/is-electron/index.js ***!
  \********************************************/
/***/ ((module) => {

// https://github.com/electron/electron/issues/2288
function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to false
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

module.exports = isElectron;


/***/ }),

/***/ "../node_modules/regenerator-runtime/runtime.js":
/*!******************************************************!*\
  !*** ../node_modules/regenerator-runtime/runtime.js ***!
  \******************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next mehtod, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "../node_modules/tesseract.js/package.json":
/*!*************************************************!*\
  !*** ../node_modules/tesseract.js/package.json ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "package.json";

/***/ }),

/***/ "../node_modules/tesseract.js/src/Tesseract.js":
/*!*****************************************************!*\
  !*** ../node_modules/tesseract.js/src/Tesseract.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const createWorker = __webpack_require__(/*! ./createWorker */ "../node_modules/tesseract.js/src/createWorker.js");

const recognize = async (image, langs, options) => {
  const worker = await createWorker(options);
  await worker.loadLanguage(langs);
  await worker.initialize(langs);
  return worker.recognize(image)
    .finally(async () => {
      await worker.terminate();
    });
};

const detect = async (image, options) => {
  const worker = await createWorker(options);
  await worker.loadLanguage('osd');
  await worker.initialize('osd');
  return worker.detect(image)
    .finally(async () => {
      await worker.terminate();
    });
};

module.exports = {
  recognize,
  detect,
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/constants/OEM.js":
/*!*********************************************************!*\
  !*** ../node_modules/tesseract.js/src/constants/OEM.js ***!
  \*********************************************************/
/***/ ((module) => {

/*
 * OEM = OCR Engine Mode, and there are 4 possible modes.
 *
 * By default tesseract.js uses LSTM_ONLY mode.
 *
 */
module.exports = {
  TESSERACT_ONLY: 0,
  LSTM_ONLY: 1,
  TESSERACT_LSTM_COMBINED: 2,
  DEFAULT: 3,
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/constants/PSM.js":
/*!*********************************************************!*\
  !*** ../node_modules/tesseract.js/src/constants/PSM.js ***!
  \*********************************************************/
/***/ ((module) => {

/*
 * PSM = Page Segmentation Mode
 */
module.exports = {
  OSD_ONLY: '0',
  AUTO_OSD: '1',
  AUTO_ONLY: '2',
  AUTO: '3',
  SINGLE_COLUMN: '4',
  SINGLE_BLOCK_VERT_TEXT: '5',
  SINGLE_BLOCK: '6',
  SINGLE_LINE: '7',
  SINGLE_WORD: '8',
  CIRCLE_WORD: '9',
  SINGLE_CHAR: '10',
  SPARSE_TEXT: '11',
  SPARSE_TEXT_OSD: '12',
  RAW_LINE: '13',
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/constants/config.js":
/*!************************************************************!*\
  !*** ../node_modules/tesseract.js/src/constants/config.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const OEM = __webpack_require__(/*! ./OEM */ "../node_modules/tesseract.js/src/constants/OEM.js");

module.exports = {
  defaultOEM: OEM.DEFAULT,
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/constants/defaultOptions.js":
/*!********************************************************************!*\
  !*** ../node_modules/tesseract.js/src/constants/defaultOptions.js ***!
  \********************************************************************/
/***/ ((module) => {

module.exports = {
  /*
   * default path for downloading *.traineddata
   */
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  /*
   * Use BlobURL for worker script by default
   * TODO: remove this option
   *
   */
  workerBlobURL: true,
  logger: () => {},
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/constants/languages.js":
/*!***************************************************************!*\
  !*** ../node_modules/tesseract.js/src/constants/languages.js ***!
  \***************************************************************/
/***/ ((module) => {

/*
 * languages with existing tesseract traineddata
 * https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016
 */

/**
 * @typedef {object} Languages
 * @property {string} AFR Afrikaans
 * @property {string} AMH Amharic
 * @property {string} ARA Arabic
 * @property {string} ASM Assamese
 * @property {string} AZE Azerbaijani
 * @property {string} AZE_CYRL Azerbaijani - Cyrillic
 * @property {string} BEL Belarusian
 * @property {string} BEN Bengali
 * @property {string} BOD Tibetan
 * @property {string} BOS Bosnian
 * @property {string} BUL Bulgarian
 * @property {string} CAT Catalan; Valencian
 * @property {string} CEB Cebuano
 * @property {string} CES Czech
 * @property {string} CHI_SIM Chinese - Simplified
 * @property {string} CHI_TRA Chinese - Traditional
 * @property {string} CHR Cherokee
 * @property {string} CYM Welsh
 * @property {string} DAN Danish
 * @property {string} DEU German
 * @property {string} DZO Dzongkha
 * @property {string} ELL Greek, Modern (1453-)
 * @property {string} ENG English
 * @property {string} ENM English, Middle (1100-1500)
 * @property {string} EPO Esperanto
 * @property {string} EST Estonian
 * @property {string} EUS Basque
 * @property {string} FAS Persian
 * @property {string} FIN Finnish
 * @property {string} FRA French
 * @property {string} FRK German Fraktur
 * @property {string} FRM French, Middle (ca. 1400-1600)
 * @property {string} GLE Irish
 * @property {string} GLG Galician
 * @property {string} GRC Greek, Ancient (-1453)
 * @property {string} GUJ Gujarati
 * @property {string} HAT Haitian; Haitian Creole
 * @property {string} HEB Hebrew
 * @property {string} HIN Hindi
 * @property {string} HRV Croatian
 * @property {string} HUN Hungarian
 * @property {string} IKU Inuktitut
 * @property {string} IND Indonesian
 * @property {string} ISL Icelandic
 * @property {string} ITA Italian
 * @property {string} ITA_OLD Italian - Old
 * @property {string} JAV Javanese
 * @property {string} JPN Japanese
 * @property {string} KAN Kannada
 * @property {string} KAT Georgian
 * @property {string} KAT_OLD Georgian - Old
 * @property {string} KAZ Kazakh
 * @property {string} KHM Central Khmer
 * @property {string} KIR Kirghiz; Kyrgyz
 * @property {string} KOR Korean
 * @property {string} KUR Kurdish
 * @property {string} LAO Lao
 * @property {string} LAT Latin
 * @property {string} LAV Latvian
 * @property {string} LIT Lithuanian
 * @property {string} MAL Malayalam
 * @property {string} MAR Marathi
 * @property {string} MKD Macedonian
 * @property {string} MLT Maltese
 * @property {string} MSA Malay
 * @property {string} MYA Burmese
 * @property {string} NEP Nepali
 * @property {string} NLD Dutch; Flemish
 * @property {string} NOR Norwegian
 * @property {string} ORI Oriya
 * @property {string} PAN Panjabi; Punjabi
 * @property {string} POL Polish
 * @property {string} POR Portuguese
 * @property {string} PUS Pushto; Pashto
 * @property {string} RON Romanian; Moldavian; Moldovan
 * @property {string} RUS Russian
 * @property {string} SAN Sanskrit
 * @property {string} SIN Sinhala; Sinhalese
 * @property {string} SLK Slovak
 * @property {string} SLV Slovenian
 * @property {string} SPA Spanish; Castilian
 * @property {string} SPA_OLD Spanish; Castilian - Old
 * @property {string} SQI Albanian
 * @property {string} SRP Serbian
 * @property {string} SRP_LATN Serbian - Latin
 * @property {string} SWA Swahili
 * @property {string} SWE Swedish
 * @property {string} SYR Syriac
 * @property {string} TAM Tamil
 * @property {string} TEL Telugu
 * @property {string} TGK Tajik
 * @property {string} TGL Tagalog
 * @property {string} THA Thai
 * @property {string} TIR Tigrinya
 * @property {string} TUR Turkish
 * @property {string} UIG Uighur; Uyghur
 * @property {string} UKR Ukrainian
 * @property {string} URD Urdu
 * @property {string} UZB Uzbek
 * @property {string} UZB_CYRL Uzbek - Cyrillic
 * @property {string} VIE Vietnamese
 * @property {string} YID Yiddish
 */

/**
  * @type {Languages}
  */
module.exports = {
  AFR: 'afr',
  AMH: 'amh',
  ARA: 'ara',
  ASM: 'asm',
  AZE: 'aze',
  AZE_CYRL: 'aze_cyrl',
  BEL: 'bel',
  BEN: 'ben',
  BOD: 'bod',
  BOS: 'bos',
  BUL: 'bul',
  CAT: 'cat',
  CEB: 'ceb',
  CES: 'ces',
  CHI_SIM: 'chi_sim',
  CHI_TRA: 'chi_tra',
  CHR: 'chr',
  CYM: 'cym',
  DAN: 'dan',
  DEU: 'deu',
  DZO: 'dzo',
  ELL: 'ell',
  ENG: 'eng',
  ENM: 'enm',
  EPO: 'epo',
  EST: 'est',
  EUS: 'eus',
  FAS: 'fas',
  FIN: 'fin',
  FRA: 'fra',
  FRK: 'frk',
  FRM: 'frm',
  GLE: 'gle',
  GLG: 'glg',
  GRC: 'grc',
  GUJ: 'guj',
  HAT: 'hat',
  HEB: 'heb',
  HIN: 'hin',
  HRV: 'hrv',
  HUN: 'hun',
  IKU: 'iku',
  IND: 'ind',
  ISL: 'isl',
  ITA: 'ita',
  ITA_OLD: 'ita_old',
  JAV: 'jav',
  JPN: 'jpn',
  KAN: 'kan',
  KAT: 'kat',
  KAT_OLD: 'kat_old',
  KAZ: 'kaz',
  KHM: 'khm',
  KIR: 'kir',
  KOR: 'kor',
  KUR: 'kur',
  LAO: 'lao',
  LAT: 'lat',
  LAV: 'lav',
  LIT: 'lit',
  MAL: 'mal',
  MAR: 'mar',
  MKD: 'mkd',
  MLT: 'mlt',
  MSA: 'msa',
  MYA: 'mya',
  NEP: 'nep',
  NLD: 'nld',
  NOR: 'nor',
  ORI: 'ori',
  PAN: 'pan',
  POL: 'pol',
  POR: 'por',
  PUS: 'pus',
  RON: 'ron',
  RUS: 'rus',
  SAN: 'san',
  SIN: 'sin',
  SLK: 'slk',
  SLV: 'slv',
  SPA: 'spa',
  SPA_OLD: 'spa_old',
  SQI: 'sqi',
  SRP: 'srp',
  SRP_LATN: 'srp_latn',
  SWA: 'swa',
  SWE: 'swe',
  SYR: 'syr',
  TAM: 'tam',
  TEL: 'tel',
  TGK: 'tgk',
  TGL: 'tgl',
  THA: 'tha',
  TIR: 'tir',
  TUR: 'tur',
  UIG: 'uig',
  UKR: 'ukr',
  URD: 'urd',
  UZB: 'uzb',
  UZB_CYRL: 'uzb_cyrl',
  VIE: 'vie',
  YID: 'yid',
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/createJob.js":
/*!*****************************************************!*\
  !*** ../node_modules/tesseract.js/src/createJob.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const getId = __webpack_require__(/*! ./utils/getId */ "../node_modules/tesseract.js/src/utils/getId.js");

let jobCounter = 0;

module.exports = ({
  id: _id,
  action,
  payload = {},
}) => {
  let id = _id;
  if (typeof id === 'undefined') {
    id = getId('Job', jobCounter);
    jobCounter += 1;
  }

  return {
    id,
    action,
    payload,
  };
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/createScheduler.js":
/*!***********************************************************!*\
  !*** ../node_modules/tesseract.js/src/createScheduler.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const createJob = __webpack_require__(/*! ./createJob */ "../node_modules/tesseract.js/src/createJob.js");
const { log } = __webpack_require__(/*! ./utils/log */ "../node_modules/tesseract.js/src/utils/log.js");
const getId = __webpack_require__(/*! ./utils/getId */ "../node_modules/tesseract.js/src/utils/getId.js");

let schedulerCounter = 0;

module.exports = () => {
  const id = getId('Scheduler', schedulerCounter);
  const workers = {};
  const runningWorkers = {};
  let jobQueue = [];

  schedulerCounter += 1;

  const getQueueLen = () => jobQueue.length;
  const getNumWorkers = () => Object.keys(workers).length;

  const dequeue = () => {
    if (jobQueue.length !== 0) {
      const wIds = Object.keys(workers);
      for (let i = 0; i < wIds.length; i += 1) {
        if (typeof runningWorkers[wIds[i]] === 'undefined') {
          jobQueue[0](workers[wIds[i]]);
          break;
        }
      }
    }
  };

  const queue = (action, payload) => (
    new Promise((resolve, reject) => {
      const job = createJob({ action, payload });
      jobQueue.push(async (w) => {
        jobQueue.shift();
        runningWorkers[w.id] = job;
        try {
          resolve(await w[action].apply(this, [...payload, job.id]));
        } catch (err) {
          reject(err);
        } finally {
          delete runningWorkers[w.id];
          dequeue();
        }
      });
      log(`[${id}]: Add ${job.id} to JobQueue`);
      log(`[${id}]: JobQueue length=${jobQueue.length}`);
      dequeue();
    })
  );

  const addWorker = (w) => {
    workers[w.id] = w;
    log(`[${id}]: Add ${w.id}`);
    log(`[${id}]: Number of workers=${getNumWorkers()}`);
    dequeue();
    return w.id;
  };

  const addJob = async (action, ...payload) => {
    if (getNumWorkers() === 0) {
      throw Error(`[${id}]: You need to have at least one worker before adding jobs`);
    }
    return queue(action, payload);
  };

  const terminate = async () => {
    Object.keys(workers).forEach(async (wid) => {
      await workers[wid].terminate();
    });
    jobQueue = [];
  };

  return {
    addWorker,
    addJob,
    terminate,
    getQueueLen,
    getNumWorkers,
  };
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/createWorker.js":
/*!********************************************************!*\
  !*** ../node_modules/tesseract.js/src/createWorker.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const resolvePaths = __webpack_require__(/*! ./utils/resolvePaths */ "../node_modules/tesseract.js/src/utils/resolvePaths.js");
const circularize = __webpack_require__(/*! ./utils/circularize */ "../node_modules/tesseract.js/src/utils/circularize.js");
const createJob = __webpack_require__(/*! ./createJob */ "../node_modules/tesseract.js/src/createJob.js");
const { log } = __webpack_require__(/*! ./utils/log */ "../node_modules/tesseract.js/src/utils/log.js");
const getId = __webpack_require__(/*! ./utils/getId */ "../node_modules/tesseract.js/src/utils/getId.js");
const { defaultOEM } = __webpack_require__(/*! ./constants/config */ "../node_modules/tesseract.js/src/constants/config.js");
const {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  onMessage,
  loadImage,
  send,
} = __webpack_require__(/*! ./worker/node */ "../node_modules/tesseract.js/src/worker/browser/index.js");

let workerCounter = 0;

module.exports = async (_options = {}) => {
  const id = getId('Worker', workerCounter);
  const {
    logger,
    errorHandler,
    ...options
  } = resolvePaths({
    ...defaultOptions,
    ..._options,
  });
  const resolves = {};
  const rejects = {};

  let workerResReject;
  let workerResResolve;
  const workerRes = new Promise((resolve, reject) => {
    workerResResolve = resolve;
    workerResReject = reject;
  });
  const workerError = (event) => { workerResReject(event.message); };

  let worker = spawnWorker(options);
  worker.onerror = workerError;

  workerCounter += 1;

  const setResolve = (action, res) => {
    resolves[action] = res;
  };

  const setReject = (action, rej) => {
    rejects[action] = rej;
  };

  const startJob = ({ id: jobId, action, payload }) => (
    new Promise((resolve, reject) => {
      log(`[${id}]: Start ${jobId}, action=${action}`);
      setResolve(action, resolve);
      setReject(action, reject);
      send(worker, {
        workerId: id,
        jobId,
        action,
        payload,
      });
    })
  );

  const load = () => (
    console.warn('`load` is depreciated and should be removed from code (workers now come pre-loaded)')
  );

  const loadInternal = (jobId) => (
    startJob(createJob({
      id: jobId, action: 'load', payload: { options },
    }))
  );

  const writeText = (path, text, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'writeFile', args: [path, text] },
    }))
  );

  const readText = (path, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'readFile', args: [path, { encoding: 'utf8' }] },
    }))
  );

  const removeFile = (path, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'unlink', args: [path] },
    }))
  );

  const FS = (method, args, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method, args },
    }))
  );

  const loadLanguage = (langs = 'eng', jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'loadLanguage',
      payload: { langs, options },
    }))
  );

  const initialize = (langs = 'eng', oem = defaultOEM, config, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'initialize',
      payload: { langs, oem, config },
    }))
  );

  const setParameters = (params = {}, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'setParameters',
      payload: { params },
    }))
  );

  const recognize = async (image, opts = {}, output = {
    blocks: true, text: true, hocr: true, tsv: true,
  }, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'recognize',
      payload: { image: await loadImage(image), options: opts, output },
    }))
  );

  const getPDF = (title = 'Tesseract OCR Result', textonly = false, jobId) => {
    console.log('`getPDF` function is depreciated. `recognize` option `savePDF` should be used instead.');
    return startJob(createJob({
      id: jobId,
      action: 'getPDF',
      payload: { title, textonly },
    }));
  };

  const detect = async (image, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'detect',
      payload: { image: await loadImage(image) },
    }))
  );

  const terminate = async () => {
    if (worker !== null) {
      /*
      await startJob(createJob({
        id: jobId,
        action: 'terminate',
      }));
      */
      terminateWorker(worker);
      worker = null;
    }
    return Promise.resolve();
  };

  onMessage(worker, ({
    workerId, jobId, status, action, data,
  }) => {
    if (status === 'resolve') {
      log(`[${workerId}]: Complete ${jobId}`);
      let d = data;
      if (action === 'recognize') {
        d = circularize(data);
      } else if (action === 'getPDF') {
        d = Array.from({ ...data, length: Object.keys(data).length });
      }
      resolves[action]({ jobId, data: d });
    } else if (status === 'reject') {
      rejects[action](data);
      if (action === 'load') workerResReject(data);
      if (errorHandler) {
        errorHandler(data);
      } else {
        throw Error(data);
      }
    } else if (status === 'progress') {
      logger({ ...data, userJobId: jobId });
    }
  });

  const resolveObj = {
    id,
    worker,
    setResolve,
    setReject,
    load,
    writeText,
    readText,
    removeFile,
    FS,
    loadLanguage,
    initialize,
    setParameters,
    recognize,
    getPDF,
    detect,
    terminate,
  };

  loadInternal().then(() => workerResResolve(resolveObj)).catch(() => {});

  return workerRes;
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/index.js":
/*!*************************************************!*\
  !*** ../node_modules/tesseract.js/src/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 *
 * Entry point for tesseract.js, should be the entry when bundling.
 *
 * @fileoverview entry point for tesseract.js
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
__webpack_require__(/*! regenerator-runtime/runtime */ "../node_modules/regenerator-runtime/runtime.js");
const createScheduler = __webpack_require__(/*! ./createScheduler */ "../node_modules/tesseract.js/src/createScheduler.js");
const createWorker = __webpack_require__(/*! ./createWorker */ "../node_modules/tesseract.js/src/createWorker.js");
const Tesseract = __webpack_require__(/*! ./Tesseract */ "../node_modules/tesseract.js/src/Tesseract.js");
const languages = __webpack_require__(/*! ./constants/languages */ "../node_modules/tesseract.js/src/constants/languages.js");
const OEM = __webpack_require__(/*! ./constants/OEM */ "../node_modules/tesseract.js/src/constants/OEM.js");
const PSM = __webpack_require__(/*! ./constants/PSM */ "../node_modules/tesseract.js/src/constants/PSM.js");
const { setLogging } = __webpack_require__(/*! ./utils/log */ "../node_modules/tesseract.js/src/utils/log.js");

module.exports = {
  languages,
  OEM,
  PSM,
  createScheduler,
  createWorker,
  setLogging,
  ...Tesseract,
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/utils/circularize.js":
/*!*************************************************************!*\
  !*** ../node_modules/tesseract.js/src/utils/circularize.js ***!
  \*************************************************************/
/***/ ((module) => {

/**
 * In the recognition result of tesseract, there
 * is a deep JSON object for details, it has around
 *
 * The result of dump.js is a big JSON tree
 * which can be easily serialized (for instance
 * to be sent from a webworker to the main app
 * or through Node's IPC), but we want
 * a (circular) DOM-like interface for walking
 * through the data.
 *
 * @fileoverview DOM-like interface for walking through data
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

module.exports = (page) => {
  const blocks = [];
  const paragraphs = [];
  const lines = [];
  const words = [];
  const symbols = [];

  if (page.blocks) {
    page.blocks.forEach((block) => {
      block.paragraphs.forEach((paragraph) => {
        paragraph.lines.forEach((line) => {
          line.words.forEach((word) => {
            word.symbols.forEach((sym) => {
              symbols.push({
                ...sym, page, block, paragraph, line, word,
              });
            });
            words.push({
              ...word, page, block, paragraph, line,
            });
          });
          lines.push({
            ...line, page, block, paragraph,
          });
        });
        paragraphs.push({
          ...paragraph, page, block,
        });
      });
      blocks.push({
        ...block, page,
      });
    });
  }

  return {
    ...page, blocks, paragraphs, lines, words, symbols,
  };
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/utils/getEnvironment.js":
/*!****************************************************************!*\
  !*** ../node_modules/tesseract.js/src/utils/getEnvironment.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isElectron = __webpack_require__(/*! is-electron */ "../node_modules/is-electron/index.js");

module.exports = (key) => {
  const env = {};

  if (typeof WorkerGlobalScope !== 'undefined') {
    env.type = 'webworker';
  } else if (isElectron()) {
    env.type = 'electron';
  } else if (typeof document === 'object') {
    env.type = 'browser';
  } else if (typeof process === 'object' && "function" === 'function') {
    env.type = 'node';
  }

  if (typeof key === 'undefined') {
    return env;
  }

  return env[key];
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/utils/getId.js":
/*!*******************************************************!*\
  !*** ../node_modules/tesseract.js/src/utils/getId.js ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = (prefix, cnt) => (
  `${prefix}-${cnt}-${Math.random().toString(16).slice(3, 8)}`
);


/***/ }),

/***/ "../node_modules/tesseract.js/src/utils/log.js":
/*!*****************************************************!*\
  !*** ../node_modules/tesseract.js/src/utils/log.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports) {

let logging = false;

exports.logging = logging;

exports.setLogging = (_logging) => {
  logging = _logging;
};

exports.log = (...args) => (logging ? console.log.apply(this, args) : null);


/***/ }),

/***/ "../node_modules/tesseract.js/src/utils/resolvePaths.js":
/*!**************************************************************!*\
  !*** ../node_modules/tesseract.js/src/utils/resolvePaths.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isBrowser = __webpack_require__(/*! ./getEnvironment */ "../node_modules/tesseract.js/src/utils/getEnvironment.js")('type') === 'browser';

const resolveURL = isBrowser ? s => (new URL(s, window.location.href)).href : s => s; // eslint-disable-line

module.exports = (options) => {
  const opts = { ...options };
  ['corePath', 'workerPath', 'langPath'].forEach((key) => {
    if (options[key]) {
      opts[key] = resolveURL(opts[key]);
    }
  });
  return opts;
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/worker/browser/defaultOptions.js":
/*!*************************************************************************!*\
  !*** ../node_modules/tesseract.js/src/worker/browser/defaultOptions.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const resolveURL = (s) => (new URL(s, window.location.href)).href;
const { version } = __webpack_require__(/*! ../../../package.json */ "../node_modules/tesseract.js/package.json");
const defaultOptions = __webpack_require__(/*! ../../constants/defaultOptions */ "../node_modules/tesseract.js/src/constants/defaultOptions.js");

/*
 * Default options for browser worker
 */
module.exports = {
  ...defaultOptions,
  workerPath: (typeof process !== 'undefined' && process.env.TESS_ENV === 'development')
    ? resolveURL(`/dist/worker.dev.js?nocache=${Math.random().toString(36).slice(3)}`)
    : `https://cdn.jsdelivr.net/npm/tesseract.js@v${version}/dist/worker.min.js`,
  /*
   * If browser doesn't support WebAssembly,
   * load ASM version instead
   */
  corePath: null,
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/worker/browser/index.js":
/*!****************************************************************!*\
  !*** ../node_modules/tesseract.js/src/worker/browser/index.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 *
 * Tesseract Worker adapter for browser
 *
 * @fileoverview Tesseract Worker adapter for browser
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
const defaultOptions = __webpack_require__(/*! ./defaultOptions */ "../node_modules/tesseract.js/src/worker/browser/defaultOptions.js");
const spawnWorker = __webpack_require__(/*! ./spawnWorker */ "../node_modules/tesseract.js/src/worker/browser/spawnWorker.js");
const terminateWorker = __webpack_require__(/*! ./terminateWorker */ "../node_modules/tesseract.js/src/worker/browser/terminateWorker.js");
const onMessage = __webpack_require__(/*! ./onMessage */ "../node_modules/tesseract.js/src/worker/browser/onMessage.js");
const send = __webpack_require__(/*! ./send */ "../node_modules/tesseract.js/src/worker/browser/send.js");
const loadImage = __webpack_require__(/*! ./loadImage */ "../node_modules/tesseract.js/src/worker/browser/loadImage.js");

module.exports = {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  onMessage,
  send,
  loadImage,
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/worker/browser/loadImage.js":
/*!********************************************************************!*\
  !*** ../node_modules/tesseract.js/src/worker/browser/loadImage.js ***!
  \********************************************************************/
/***/ ((module) => {

/**
 * readFromBlobOrFile
 *
 * @name readFromBlobOrFile
 * @function
 * @access private
 */
const readFromBlobOrFile = (blob) => (
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
      reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
  })
);

/**
 * loadImage
 *
 * @name loadImage
 * @function load image from different source
 * @access private
 */
const loadImage = async (image) => {
  let data = image;
  if (typeof image === 'undefined') {
    return 'undefined';
  }

  if (typeof image === 'string') {
    // Base64 Image
    if (/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
      data = atob(image.split(',')[1])
        .split('')
        .map((c) => c.charCodeAt(0));
    } else {
      const resp = await fetch(image);
      data = await resp.arrayBuffer();
    }
  } else if (typeof HTMLElement !== 'undefined' && image instanceof HTMLElement) {
    if (image.tagName === 'IMG') {
      data = await loadImage(image.src);
    }
    if (image.tagName === 'VIDEO') {
      data = await loadImage(image.poster);
    }
    if (image.tagName === 'CANVAS') {
      await new Promise((resolve) => {
        image.toBlob(async (blob) => {
          data = await readFromBlobOrFile(blob);
          resolve();
        });
      });
    }
  } else if (typeof OffscreenCanvas !== 'undefined' && image instanceof OffscreenCanvas) {
    const blob = await image.convertToBlob();
    data = await readFromBlobOrFile(blob);
  } else if (image instanceof File || image instanceof Blob) {
    data = await readFromBlobOrFile(image);
  }

  return new Uint8Array(data);
};

module.exports = loadImage;


/***/ }),

/***/ "../node_modules/tesseract.js/src/worker/browser/onMessage.js":
/*!********************************************************************!*\
  !*** ../node_modules/tesseract.js/src/worker/browser/onMessage.js ***!
  \********************************************************************/
/***/ ((module) => {

module.exports = (worker, handler) => {
  worker.onmessage = ({ data }) => { // eslint-disable-line
    handler(data);
  };
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/worker/browser/send.js":
/*!***************************************************************!*\
  !*** ../node_modules/tesseract.js/src/worker/browser/send.js ***!
  \***************************************************************/
/***/ ((module) => {

/**
 * send
 *
 * @name send
 * @function send packet to worker and create a job
 * @access public
 */
module.exports = async (worker, packet) => {
  worker.postMessage(packet);
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/worker/browser/spawnWorker.js":
/*!**********************************************************************!*\
  !*** ../node_modules/tesseract.js/src/worker/browser/spawnWorker.js ***!
  \**********************************************************************/
/***/ ((module) => {

/**
 * spawnWorker
 *
 * @name spawnWorker
 * @function create a new Worker in browser
 * @access public
 */
module.exports = ({ workerPath, workerBlobURL }) => {
  let worker;
  if (Blob && URL && workerBlobURL) {
    const blob = new Blob([`importScripts("${workerPath}");`], {
      type: 'application/javascript',
    });
    worker = new Worker(URL.createObjectURL(blob));
  } else {
    worker = new Worker(workerPath);
  }

  return worker;
};


/***/ }),

/***/ "../node_modules/tesseract.js/src/worker/browser/terminateWorker.js":
/*!**************************************************************************!*\
  !*** ../node_modules/tesseract.js/src/worker/browser/terminateWorker.js ***!
  \**************************************************************************/
/***/ ((module) => {

/**
 * terminateWorker
 *
 * @name terminateWorker
 * @function terminate worker
 * @access public
 */
module.exports = (worker) => {
  worker.terminate();
};


/***/ }),

/***/ "canvas":
/*!*************************!*\
  !*** external "canvas" ***!
  \*************************/
/***/ ((module) => {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE_canvas__ === 'undefined') { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_canvas__;

/***/ }),

/***/ "electron/common":
/*!**********************************!*\
  !*** external "electron/common" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE_electron_common__ === 'undefined') { var e = new Error("Cannot find module 'electron/common'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_electron_common__;

/***/ }),

/***/ "sharp":
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
/***/ ((module) => {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE_sharp__ === 'undefined') { var e = new Error("Cannot find module 'sharp'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_sharp__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! alt1 */ "../node_modules/alt1/dist/base/index.js");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tesseract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tesseract.js */ "../node_modules/tesseract.js/src/index.js");
/* harmony import */ var tesseract_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tesseract_js__WEBPACK_IMPORTED_MODULE_0__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Import required libraries


// Helper function to get mouse position from Alt1
function getAlt1MousePosition() {
    if (!window.alt1)
        return null;
    var pos = window.alt1.mousePosition;
    if (pos === -1)
        return null;
    return {
        x: pos >>> 16,
        y: pos & 0xFFFF
    };
}
var DoorTextReader = /** @class */ (function () {
    function DoorTextReader() {
        var _this = this;
        this.isReading = false;
        this.worker = null;
        this.lastMousePosition = { x: 0, y: 0 };
        this.showPreviewBox = true;
        this.mouseTrackingInterval = null;
        this.overlayGroup = 'door_text_reader_overlay';
        this.lastCaptureTime = 0;
        this.captureUpdateInterval = 250; // Milliseconds between capture updates
        // Add a property to store the last recognized text
        this.lastRecognizedText = '';
        // Text box detection settings
        this.enableTextBoxDetection = true;
        this.borderColorThreshold = 20;
        this.cropMargin = 2;
        this.showDebugOverlay = false;
        // Capture dimensions
        this.captureWidth = 250;
        this.captureHeight = 35;
        this.captureYOffset = 30;
        // Initialize viewport canvas
        this.viewportCanvas = document.getElementById('previewCanvas');
        if (!this.viewportCanvas) {
            throw new Error('Preview canvas not found');
        }
        this.viewportCtx = this.viewportCanvas.getContext('2d');
        this.viewportCtx.imageSmoothingEnabled = false;
        // Initialize cropped canvas
        this.croppedCanvas = document.getElementById('croppedCanvas');
        if (!this.croppedCanvas) {
            throw new Error('Cropped canvas not found');
        }
        this.croppedCtx = this.croppedCanvas.getContext('2d');
        this.croppedCtx.imageSmoothingEnabled = false;
        // Initialize checkbox state
        var showPreviewCheckbox = document.getElementById('showPreviewBox');
        this.showPreviewBox = showPreviewCheckbox.checked;
        showPreviewCheckbox.addEventListener('change', function (e) {
            _this.showPreviewBox = e.target.checked;
            if (_this.showPreviewBox) {
                _this.drawPreviewRect();
                // Also update the overlay in the game
                if (window.alt1) {
                    try {
                        _this.updateGameOverlay();
                    }
                    catch (error) {
                        console.warn('Failed to update game overlay:', error);
                    }
                }
            }
            else {
                _this.viewportCtx.clearRect(0, 0, _this.viewportCanvas.width, _this.viewportCanvas.height);
                // Clear the overlay in the game
                if (window.alt1) {
                    try {
                        window.alt1.overLayClearGroup(_this.overlayGroup);
                    }
                    catch (error) {
                        console.warn('Failed to clear overlay group:', error);
                    }
                }
            }
        });
        // Sync the other checkbox
        var enablePreviewCheckbox = document.getElementById('enablePreviewBox');
        if (enablePreviewCheckbox) {
            enablePreviewCheckbox.checked = this.showPreviewBox;
            enablePreviewCheckbox.addEventListener('change', function (e) {
                _this.showPreviewBox = e.target.checked;
                showPreviewCheckbox.checked = _this.showPreviewBox;
                // Trigger the same behavior as the main checkbox
                if (_this.showPreviewBox) {
                    _this.drawPreviewRect();
                    if (window.alt1) {
                        try {
                            _this.updateGameOverlay();
                        }
                        catch (error) {
                            console.warn('Failed to update game overlay:', error);
                        }
                    }
                }
                else {
                    _this.viewportCtx.clearRect(0, 0, _this.viewportCanvas.width, _this.viewportCanvas.height);
                    if (window.alt1) {
                        try {
                            window.alt1.overLayClearGroup(_this.overlayGroup);
                        }
                        catch (error) {
                            console.warn('Failed to clear overlay group:', error);
                        }
                    }
                }
            });
        }
        // Initialize text box detection settings
        var enableTextBoxDetectionCheckbox = document.getElementById('enableTextBoxDetection');
        this.enableTextBoxDetection = enableTextBoxDetectionCheckbox.checked;
        enableTextBoxDetectionCheckbox.addEventListener('change', function (e) {
            _this.enableTextBoxDetection = e.target.checked;
        });
        var borderColorThresholdSlider = document.getElementById('borderColorThreshold');
        this.borderColorThreshold = parseInt(borderColorThresholdSlider.value);
        borderColorThresholdSlider.addEventListener('input', function (e) {
            _this.borderColorThreshold = parseInt(e.target.value);
            var valueDisplay = document.getElementById('borderColorThresholdValue');
            if (valueDisplay) {
                valueDisplay.textContent = _this.borderColorThreshold.toString();
            }
        });
        var cropMarginSlider = document.getElementById('cropMargin');
        this.cropMargin = parseInt(cropMarginSlider.value);
        cropMarginSlider.addEventListener('input', function (e) {
            _this.cropMargin = parseInt(e.target.value);
            var valueDisplay = document.getElementById('cropMarginValue');
            if (valueDisplay) {
                valueDisplay.textContent = _this.cropMargin.toString();
            }
        });
        var showDebugOverlayCheckbox = document.getElementById('showDebugOverlay');
        this.showDebugOverlay = showDebugOverlayCheckbox.checked;
        showDebugOverlayCheckbox.addEventListener('change', function (e) {
            _this.showDebugOverlay = e.target.checked;
        });
        // Initialize Tesseract worker
        this.initWorker();
        // Start tracking mouse position in the RuneScape window
        this.startMouseTracking();
    }
    DoorTextReader.prototype.startMouseTracking = function () {
        var _this = this;
        var mousePositionElement = document.getElementById('mousePosition');
        var captureRegionElement = document.getElementById('captureRegion');
        // Clear any existing interval
        if (this.mouseTrackingInterval) {
            clearInterval(this.mouseTrackingInterval);
        }
        // Poll for mouse position every 100ms
        this.mouseTrackingInterval = window.setInterval(function () {
            var pos = getAlt1MousePosition();
            if (pos) {
                _this.lastMousePosition = pos;
                mousePositionElement.textContent = "Mouse Position: (".concat(pos.x, ", ").concat(pos.y, ")");
                // Update capture region info
                var region = _this.getCaptureRegion();
                captureRegionElement.textContent = "Capture Region: (".concat(region.x, ", ").concat(region.y, ") ").concat(region.width, "x").concat(region.height);
                // Only update the game overlay, don't redraw the preview box on every mouse move
                if (_this.showPreviewBox && window.alt1) {
                    try {
                        _this.updateGameOverlay();
                    }
                    catch (error) {
                        console.warn('Failed to update game overlay:', error);
                    }
                }
            }
        }, 100);
        // Draw the initial preview rectangle
        if (this.showPreviewBox) {
            this.drawPreviewRect();
        }
    };
    // Update the overlay rectangle in the game window
    DoorTextReader.prototype.updateGameOverlay = function () {
        if (!window.alt1 || !this.showPreviewBox)
            return;
        try {
            // Only show overlay when RS is active
            if (!window.alt1.rsActive) {
                try {
                    window.alt1.overLayClearGroup(this.overlayGroup);
                }
                catch (error) {
                    console.warn('Failed to clear overlay group:', error);
                }
                return;
            }
            var region = this.getCaptureRegion();
            // Set the overlay group
            window.alt1.overLaySetGroup(this.overlayGroup);
            // Clear previous overlay
            window.alt1.overLayClearGroup(this.overlayGroup);
            // Draw a green rectangle
            // Use a1lib.mixColor to create the color (RGBA)
            var greenColor = alt1__WEBPACK_IMPORTED_MODULE_1__.mixColor(0, 255, 0, 255); // Bright green
            // Draw the rectangle with a 2px border
            // Note: The duration is set to 2000ms (2 seconds) to ensure it stays visible
            // between updates which happen every captureUpdateInterval ms
            var success = window.alt1.overLayRect(greenColor, region.x, region.y, region.width, region.height, 2000, // Duration in ms (2 seconds)
            2 // Thickness in pixels
            );
            // Force refresh the overlay group
            window.alt1.overLayRefreshGroup(this.overlayGroup);
            if (!success) {
                console.warn('Failed to draw overlay rectangle');
            }
        }
        catch (error) {
            console.warn('Overlay permission not available:', error);
            // We'll just continue without the overlay
        }
    };
    // Calculate the capture region based on mouse position
    DoorTextReader.prototype.getCaptureRegion = function () {
        var _a = this.lastMousePosition, x = _a.x, y = _a.y;
        // Center the box horizontally with the mouse at the top center
        var captureX = Math.round(x - (this.captureWidth / 2));
        var captureY = y + this.captureYOffset; // Mouse position plus offset
        return {
            x: captureX,
            y: captureY,
            width: this.captureWidth,
            height: this.captureHeight
        };
    };
    // Draw a rectangle on our preview canvas to show where we'll capture
    DoorTextReader.prototype.drawPreviewRect = function () {
        var _this = this;
        // Only update canvas size once at initialization
        if (this.viewportCanvas.width !== this.captureWidth || this.viewportCanvas.height !== this.captureHeight) {
            this.viewportCanvas.width = this.captureWidth;
            this.viewportCanvas.height = this.captureHeight;
        }
        // Use requestAnimationFrame for smoother visual updates
        requestAnimationFrame(function () {
            // Clear the canvas
            _this.viewportCtx.clearRect(0, 0, _this.viewportCanvas.width, _this.viewportCanvas.height);
            // Draw a green rectangle border
            _this.viewportCtx.strokeStyle = '#00FF00';
            _this.viewportCtx.lineWidth = 2;
            _this.viewportCtx.strokeRect(0, 0, _this.captureWidth, _this.captureHeight);
        });
    };
    DoorTextReader.prototype.initWorker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = this;
                        return [4 /*yield*/, (0,tesseract_js__WEBPACK_IMPORTED_MODULE_0__.createWorker)({
                                workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/worker.min.js',
                                langPath: 'https://tessdata.projectnaptha.com/4.0.0',
                                logger: function (m) { return console.debug('Tesseract:', m); },
                                errorHandler: function (err) { return console.error('Tesseract Error:', err); }
                            })];
                    case 1:
                        _a.worker = _b.sent();
                        return [4 /*yield*/, this.worker.loadLanguage('eng')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.worker.initialize('eng')];
                    case 3:
                        _b.sent();
                        // Set basic parameters using the typed interface
                        // Keep it simple - just set the page segmentation mode and character whitelist
                        return [4 /*yield*/, this.worker.setParameters({
                                tessedit_pageseg_mode: tesseract_js__WEBPACK_IMPORTED_MODULE_0__.PSM.SINGLE_LINE, // Explicitly set to SINGLE_LINE mode for game UI text
                                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \'"-:,.!?()[]{}', // Special characters for game text
                            })];
                    case 4:
                        // Set basic parameters using the typed interface
                        // Keep it simple - just set the page segmentation mode and character whitelist
                        _b.sent();
                        console.log('Tesseract worker initialized successfully');
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        console.error('Failed to initialize Tesseract worker:', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DoorTextReader.prototype.readText = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, region, imgData, img, offscreenCanvas_1, offscreenCtx, croppedCanvas_1, result, recognizedText, error_2;
            var _this = this;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.isReading || !this.worker || !window.alt1)
                            return [2 /*return*/];
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        // Check for pixel permission
                        if (!window.alt1.permissionPixel) {
                            console.error('Pixel permission not enabled');
                            (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, 'Pixel permission not enabled. Please enable it in Alt1 settings.');
                            return [2 /*return*/];
                        }
                        now = Date.now();
                        if (now - this.lastCaptureTime < this.captureUpdateInterval) {
                            // Schedule next check
                            setTimeout(function () { return _this.readText(); }, 50);
                            return [2 /*return*/];
                        }
                        this.lastCaptureTime = now;
                        region = this.getCaptureRegion();
                        imgData = null;
                        try {
                            img = alt1__WEBPACK_IMPORTED_MODULE_1__.captureHoldFullRs();
                            if (img) {
                                imgData = img.toData(region.x, region.y, region.width, region.height);
                            }
                        }
                        catch (error) {
                            console.error('Failed to capture screen:', error);
                            (_b = this.callback) === null || _b === void 0 ? void 0 : _b.call(this, 'Failed to capture screen');
                            return [2 /*return*/];
                        }
                        if (!imgData) {
                            console.error('Failed to capture screen region');
                            (_c = this.callback) === null || _c === void 0 ? void 0 : _c.call(this, 'Failed to capture screen');
                            return [2 /*return*/];
                        }
                        offscreenCanvas_1 = document.createElement('canvas');
                        offscreenCanvas_1.width = region.width;
                        offscreenCanvas_1.height = region.height;
                        offscreenCtx = offscreenCanvas_1.getContext('2d', { alpha: false });
                        // Draw the image data to the offscreen canvas
                        offscreenCtx.putImageData(imgData, 0, 0);
                        // Update the original capture canvas
                        // Only update the main canvas dimensions if they've changed
                        if (this.viewportCanvas.width !== region.width || this.viewportCanvas.height !== region.height) {
                            this.viewportCanvas.width = region.width;
                            this.viewportCanvas.height = region.height;
                        }
                        // Use requestAnimationFrame for smoother visual updates
                        requestAnimationFrame(function () {
                            // Clear and draw the image from the offscreen canvas to the main canvas
                            _this.viewportCtx.clearRect(0, 0, _this.viewportCanvas.width, _this.viewportCanvas.height);
                            _this.viewportCtx.drawImage(offscreenCanvas_1, 0, 0);
                            // Draw a green border around the original capture
                            _this.viewportCtx.strokeStyle = '#00FF00';
                            _this.viewportCtx.lineWidth = 2;
                            _this.viewportCtx.strokeRect(0, 0, _this.viewportCanvas.width, _this.viewportCanvas.height);
                        });
                        croppedCanvas_1 = this.detectAndCropTextBox(offscreenCanvas_1);
                        // Update the cropped canvas
                        // Only update the cropped canvas dimensions if they've changed
                        if (this.croppedCanvas.width !== croppedCanvas_1.width || this.croppedCanvas.height !== croppedCanvas_1.height) {
                            this.croppedCanvas.width = croppedCanvas_1.width;
                            this.croppedCanvas.height = croppedCanvas_1.height;
                        }
                        // Use requestAnimationFrame for smoother visual updates
                        requestAnimationFrame(function () {
                            // Clear and draw the image from the cropped canvas to the cropped canvas display
                            _this.croppedCtx.clearRect(0, 0, _this.croppedCanvas.width, _this.croppedCanvas.height);
                            _this.croppedCtx.drawImage(croppedCanvas_1, 0, 0);
                        });
                        return [4 /*yield*/, this.worker.recognize(croppedCanvas_1)];
                    case 2:
                        result = _f.sent();
                        recognizedText = result.data.text.trim();
                        // Store the recognized text
                        this.lastRecognizedText = recognizedText;
                        // Update the output with the recognized text
                        (_d = this.callback) === null || _d === void 0 ? void 0 : _d.call(this, recognizedText);
                        // Update the overlay in the game
                        if (this.showPreviewBox) {
                            try {
                                this.updateGameOverlay();
                            }
                            catch (error) {
                                console.warn('Failed to update game overlay:', error);
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _f.sent();
                        console.error('Error reading text:', error_2);
                        (_e = this.callback) === null || _e === void 0 ? void 0 : _e.call(this, 'Error reading text');
                        return [3 /*break*/, 4];
                    case 4:
                        if (this.isReading) {
                            // Use setTimeout with a consistent interval for smoother updates
                            setTimeout(function () { return _this.readText(); }, this.captureUpdateInterval);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Detect and crop to the black box border around RuneScape hover text
    DoorTextReader.prototype.detectAndCropTextBox = function (sourceCanvas) {
        // If text box detection is disabled, return the original canvas
        if (!this.enableTextBoxDetection) {
            return sourceCanvas;
        }
        var ctx = sourceCanvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        var data = imageData.data;
        // Find the bounding box of the black border
        var left = sourceCanvas.width;
        var right = 0;
        var top = sourceCanvas.height;
        var bottom = 0;
        var foundBorder = false;
        // Create a debug canvas if debug overlay is enabled
        var debugCanvas = document.createElement('canvas');
        var debugCtx = null;
        if (this.showDebugOverlay) {
            debugCanvas.width = sourceCanvas.width;
            debugCanvas.height = sourceCanvas.height;
            debugCtx = debugCanvas.getContext('2d');
            debugCtx.drawImage(sourceCanvas, 0, 0);
        }
        // Count of dark pixels in each row and column to help identify the box
        var rowCounts = new Array(sourceCanvas.height).fill(0);
        var colCounts = new Array(sourceCanvas.width).fill(0);
        // First pass: count dark pixels in each row and column
        for (var y = 0; y < sourceCanvas.height; y++) {
            for (var x = 0; x < sourceCanvas.width; x++) {
                var idx = (y * sourceCanvas.width + x) * 4;
                var r = data[idx];
                var g = data[idx + 1];
                var b = data[idx + 2];
                // Check if this pixel is dark enough to be part of the border
                if (r <= this.borderColorThreshold && g <= this.borderColorThreshold && b <= this.borderColorThreshold) {
                    rowCounts[y]++;
                    colCounts[x]++;
                    // Mark dark pixels in debug view only
                    if (this.showDebugOverlay && debugCtx) {
                        debugCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                        debugCtx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }
        // Visualize row and column counts in debug view only
        if (this.showDebugOverlay && debugCtx) {
            this.visualizePixelCounts(debugCtx, rowCounts, colCounts, sourceCanvas.width, sourceCanvas.height);
        }
        // Find the edges of the box using the counts
        // We're looking for rows/columns with a significant number of dark pixels
        var threshold = Math.max(3, Math.min(sourceCanvas.width, sourceCanvas.height) * 0.05); // At least 5% of pixels or 3 pixels
        // Find top edge
        for (var y = 0; y < sourceCanvas.height; y++) {
            if (rowCounts[y] >= threshold) {
                top = y;
                foundBorder = true;
                break;
            }
        }
        // Find bottom edge
        for (var y = sourceCanvas.height - 1; y >= 0; y--) {
            if (rowCounts[y] >= threshold) {
                bottom = y;
                foundBorder = true;
                break;
            }
        }
        // Find left edge
        for (var x = 0; x < sourceCanvas.width; x++) {
            if (colCounts[x] >= threshold) {
                left = x;
                foundBorder = true;
                break;
            }
        }
        // Find right edge
        for (var x = sourceCanvas.width - 1; x >= 0; x--) {
            if (colCounts[x] >= threshold) {
                right = x;
                foundBorder = true;
                break;
            }
        }
        // If we found a border, crop to it with the specified margin
        if (foundBorder && right > left && bottom > top) {
            console.log("Border detected: (".concat(left, ",").concat(top, ") to (").concat(right, ",").concat(bottom, "), size: ").concat(right - left + 1, "x").concat(bottom - top + 1));
            // Create a new canvas for the cropped image
            var croppedCanvas = document.createElement('canvas');
            var width = right - left + 1 + (this.cropMargin * 2);
            var height = bottom - top + 1 + (this.cropMargin * 2);
            croppedCanvas.width = width;
            croppedCanvas.height = height;
            var croppedCtx = croppedCanvas.getContext('2d');
            // Draw the cropped region from the original source canvas (no color manipulation)
            croppedCtx.drawImage(sourceCanvas, // Always use the original source canvas
            Math.max(0, left - this.cropMargin), Math.max(0, top - this.cropMargin), Math.min(sourceCanvas.width - left + this.cropMargin, width), Math.min(sourceCanvas.height - top + this.cropMargin, height), 0, 0, width, height);
            // Draw debug overlay if enabled (only on debug canvas)
            if (this.showDebugOverlay) {
                // Draw a red border around the detected text box
                croppedCtx.strokeStyle = '#FF0000';
                croppedCtx.lineWidth = 1;
                croppedCtx.strokeRect(this.cropMargin, this.cropMargin, right - left + 1, bottom - top + 1);
                // Add text showing the dimensions
                croppedCtx.fillStyle = '#FFFFFF';
                croppedCtx.font = '10px Arial';
                croppedCtx.fillText("".concat(right - left + 1, "x").concat(bottom - top + 1), this.cropMargin, this.cropMargin - 2);
            }
            return croppedCanvas;
        }
        else {
            console.log('No border detected or invalid border dimensions');
            // If no border was found but debug is enabled, return the debug canvas
            if (this.showDebugOverlay && debugCtx) {
                // Add text showing no border was found
                debugCtx.fillStyle = '#FF0000';
                debugCtx.font = '14px Arial';
                debugCtx.fillText('No border detected', 10, 20);
                return debugCanvas;
            }
            // If no border was found, return the original canvas
            return sourceCanvas;
        }
    };
    // Helper method to visualize pixel counts for debugging
    DoorTextReader.prototype.visualizePixelCounts = function (ctx, rowCounts, colCounts, width, height) {
        var maxRowCount = Math.max.apply(Math, rowCounts);
        var maxColCount = Math.max.apply(Math, colCounts);
        // Draw row counts on the right side
        if (maxRowCount > 0) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            for (var y = 0; y < height; y++) {
                var barWidth = (rowCounts[y] / maxRowCount) * 20; // Max bar width of 20px
                if (barWidth > 0) {
                    ctx.fillRect(width - barWidth, y, barWidth, 1);
                }
            }
        }
        // Draw column counts at the bottom
        if (maxColCount > 0) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            for (var x = 0; x < width; x++) {
                var barHeight = (colCounts[x] / maxColCount) * 20; // Max bar height of 20px
                if (barHeight > 0) {
                    ctx.fillRect(x, height - barHeight, 1, barHeight);
                }
            }
        }
    };
    DoorTextReader.prototype.startReading = function (callback) {
        this.callback = callback;
        this.isReading = true;
        this.readText();
    };
    DoorTextReader.prototype.stopReading = function () {
        this.isReading = false;
        this.drawPreviewRect(); // Restore the preview rectangle
        // Clear the overlay in the game
        if (window.alt1) {
            try {
                window.alt1.overLayClearGroup(this.overlayGroup);
            }
            catch (error) {
                console.warn('Failed to clear overlay group:', error);
            }
        }
    };
    DoorTextReader.prototype.terminate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stopReading();
                        if (this.mouseTrackingInterval) {
                            clearInterval(this.mouseTrackingInterval);
                            this.mouseTrackingInterval = null;
                        }
                        if (!this.worker) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.worker.terminate()];
                    case 1:
                        _a.sent();
                        this.worker = null;
                        _a.label = 2;
                    case 2:
                        // Clear the overlay in the game
                        if (window.alt1) {
                            try {
                                window.alt1.overLayClearGroup(this.overlayGroup);
                            }
                            catch (error) {
                                console.warn('Failed to clear overlay group:', error);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Add a method to get the last recognized text
    DoorTextReader.prototype.getLastText = function () {
        return this.lastRecognizedText;
    };
    return DoorTextReader;
}());
// Initialize the app
function initializeApp() {
    return __awaiter(this, void 0, void 0, function () {
        var output_1, toggleBtn_1, checkbox, addappurl, reader_1;
        return __generator(this, function (_a) {
            try {
                output_1 = document.getElementById('output');
                toggleBtn_1 = document.getElementById('toggleScan');
                checkbox = document.getElementById('showPreviewBox');
                // Check if we are running inside alt1 by checking if the alt1 global exists
                if (window.alt1) {
                    // Tell alt1 about the app
                    alt1.identifyAppUrl("./appconfig.json");
                    // Check for pixel permission
                    if (!alt1.permissionPixel) {
                        output_1.textContent = "Pixel permission not enabled. Please enable it in Alt1 settings.";
                        toggleBtn_1.style.display = "none";
                        checkbox.disabled = true;
                        return [2 /*return*/];
                    }
                    output_1.textContent = "Ready to start";
                    toggleBtn_1.style.display = "block";
                    checkbox.disabled = false;
                }
                else {
                    addappurl = "alt1://addapp/".concat(new URL("./appconfig.json", document.location.href).href);
                    output_1.innerHTML = "Alt1 not detected, click <a href='".concat(addappurl, "'>here</a> to add this app to Alt1");
                    toggleBtn_1.style.display = "none";
                    checkbox.disabled = true;
                    return [2 /*return*/];
                }
                reader_1 = new DoorTextReader();
                window.reader = reader_1;
                // Button click handler
                toggleBtn_1.addEventListener("click", function () {
                    if (toggleBtn_1.classList.contains('scanning')) {
                        // Stop scanning
                        reader_1.stopReading();
                        toggleBtn_1.textContent = "Start Scanning";
                        toggleBtn_1.classList.remove("scanning");
                        output_1.textContent = "Scanning stopped";
                    }
                    else {
                        // Start scanning
                        reader_1.startReading(function (text) {
                            output_1.textContent = text || "No text detected";
                        });
                        toggleBtn_1.textContent = "Stop Scanning";
                        toggleBtn_1.classList.add("scanning");
                    }
                });
                console.log("App initialized"); // Debug log
            }
            catch (error) {
                console.error('Failed to initialize app:', error);
            }
            return [2 /*return*/];
        });
    });
}
// Initialize when the document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    initializeApp();
}
// Export for global use
if (typeof window !== 'undefined') {
    window.DoorTextReader = DoorTextReader;
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});