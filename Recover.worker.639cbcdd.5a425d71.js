(()=>{function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},n={},o=t.parcelRequiree8ef;null==o&&((o=function(e){if(e in r)return r[e].exports;if(e in n){var t=n[e];delete n[e];var o={id:e,exports:{}};return r[e]=o,t.call(o.exports,o,o.exports),o.exports}var s=new Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){n[e]=t},t.parcelRequiree8ef=o),importScripts("./Sync.worker.74d5cb94.6f7271ee.js");var s,i,a,u,c={};s=c,i="expose",a=()=>O,u=e=>O=e,Object.defineProperty(s,i,{get:a,set:u,enumerable:!0,configurable:!0});var f;f=e=>!!e&&("symbol"==typeof Symbol.observable&&"function"==typeof e[Symbol.observable]?e===e[Symbol.observable]():"function"==typeof e["@@observable"]&&e===e["@@observable"]());const l={deserialize:e=>Object.assign(Error(e.message),{name:e.name,stack:e.stack}),serialize:e=>({__error_marker:"$$error",message:e.message,name:e.name,stack:e.stack})};let d={deserialize(e){return(t=e)&&"object"==typeof t&&"__error_marker"in t&&"$$error"===t.__error_marker?l.deserialize(e):e;var t},serialize:e=>e instanceof Error?l.serialize(e):e};function p(e){return d.deserialize(e)}function b(e){return d.serialize(e)}Symbol("thread.errors"),Symbol("thread.events"),Symbol("thread.terminate");const m=Symbol("thread.transferable");Symbol("thread.worker");function y(e){return e&&"object"==typeof e&&e[m]}var g,h,v,M;(h=g||(g={})).cancel="cancel",h.run="run",(M=v||(v={})).error="error",M.init="init",M.result="result",M.running="running",M.uncaughtError="uncaughtError";var x={isWorkerRuntime:function(){const e="undefined"!=typeof self&&"undefined"!=typeof Window&&self instanceof Window;return!("undefined"==typeof self||!self.postMessage||e)},postMessageToMaster:function(e,t){self.postMessage(e,t)},subscribeToMasterMessages:function(e){const t=t=>{e(t.data)};return self.addEventListener("message",t),()=>{self.removeEventListener("message",t)}}},T=o("6Xzky"),k=function(e,t,r,n){return new(r||(r=Promise))((function(o,s){function i(e){try{u(n.next(e))}catch(e){s(e)}}function a(e){try{u(n.throw(e))}catch(e){s(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(i,a)}u((n=n.apply(e,t||[])).next())}))};let w=!1;const E=new Map,_=e=>e&&e.type===g.run,j=t=>e(f)(t)||function(e){return e&&"object"==typeof e&&"function"==typeof e.subscribe}(t);function S(e){return y(e)?{payload:e.send,transferables:e.transferables}:{payload:e,transferables:void 0}}function z(e,t){const{payload:r,transferables:n}=S(t),o={type:v.error,uid:e,error:b(r)};x.postMessageToMaster(o,n)}function $(e,t,r){const{payload:n,transferables:o}=S(r),s={type:v.result,uid:e,complete:!!t||void 0,payload:n};x.postMessageToMaster(s,o)}function L(e){try{const t={type:v.uncaughtError,error:b(e)};x.postMessageToMaster(t)}catch(t){console.error("Not reporting uncaught error back to master thread as it occured while reporting an uncaught error already.\nLatest error:",t,"\nOriginal error:",e)}}function N(e,t,r){return k(this,void 0,void 0,(function*(){let n;try{n=t(...r)}catch(t){return z(e,t)}const o=j(n)?"observable":"promise";if(function(e,t){const r={type:v.running,uid:e,resultType:t};x.postMessageToMaster(r)}(e,o),j(n)){const t=n.subscribe((t=>$(e,!1,b(t))),(t=>{z(e,b(t)),E.delete(e)}),(()=>{$(e,!0),E.delete(e)}));E.set(e,t)}else try{const t=yield n;$(e,!0,b(t))}catch(t){z(e,b(t))}}))}function O(e){if(!x.isWorkerRuntime())throw Error("expose() called in the master thread.");if(w)throw Error("expose() called more than once. This is not possible. Pass an object to expose() if you want to expose multiple functions.");if(w=!0,"function"==typeof e)x.subscribeToMasterMessages((t=>{_(t)&&!t.method&&N(t.uid,e,t.args.map(p))})),function(){const e={type:v.init,exposed:{type:"function"}};x.postMessageToMaster(e)}();else{if("object"!=typeof e||!e)throw Error(`Invalid argument passed to expose(). Expected a function or an object, got: ${e}`);x.subscribeToMasterMessages((t=>{_(t)&&t.method&&N(t.uid,e[t.method],t.args.map(p))}));!function(e){const t={type:v.init,exposed:{type:"module",methods:e}};x.postMessageToMaster(t)}(Object.keys(e).filter((t=>"function"==typeof e[t])))}x.subscribeToMasterMessages((e=>{if((t=e)&&t.type===g.cancel){const t=e.uid,r=E.get(t);r&&(r.unsubscribe(),E.delete(t))}var t}))}"undefined"!=typeof self&&"function"==typeof self.addEventListener&&x.isWorkerRuntime()&&(self.addEventListener("error",(e=>{setTimeout((()=>L(e.error||e)),250)})),self.addEventListener("unhandledrejection",(e=>{const t=e.reason;t&&"string"==typeof t.message&&setTimeout((()=>L(t)),250)}))),void 0!==T&&"function"==typeof T.on&&x.isWorkerRuntime()&&(T.on("uncaughtException",(e=>{setTimeout((()=>L(e)),250)})),T.on("unhandledRejection",(e=>{e&&"string"==typeof e.message&&setTimeout((()=>L(e)),250)})));var R=o("k05Ls"),W=o("iCNHY");function H(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}var P={};function B(e){return`(${e.version},${e.id},${(0,R.keccak256)(e.data)},${e.timestamp})`}function D(e){return W.BigNumber.isBigNumber(e)||"0x"===e.substring(0,2)?W.BigNumber.from(e).toHexString():e}function C(e){return W.BigNumber.from(e).toHexString()}H(P,"messagePayload",(()=>B)),H(P,"formatEntityID",(()=>D)),H(P,"formatComponentID",(()=>C)),(0,c.expose)({recoverAddress:function(e){return(0,R.verifyMessage)(B(e),e.signature)}})})();
//# sourceMappingURL=Recover.worker.639cbcdd.5a425d71.js.map