var i,u,r,o,t,n,e,a,c,l,f;function h(t){var n=0;return function(){return n<t.length?{done:!1,value:t[n++]}:{done:!0}}}function s(t,n){var e,r,o;if(n)t:{for(e=u,t=t.split("."),r=0;r<t.length-1;r++){if(!((o=t[r])in e))break t;e=e[o]}(n=n(r=e[t=t[t.length-1]]))!=r&&null!=n&&i(e,t,{configurable:!0,writable:!0,value:n})}}function d(t){var n="undefined"!=typeof Symbol&&Symbol.iterator&&t[Symbol.iterator];if(n)return n.call(t);if("number"==typeof t.length)return{next:h(t)};throw Error(t+" is not an iterable or ArrayLike")}function p(t){if(!(t instanceof Array)){t=d(t);for(var n,e=[];!(n=t.next()).done;)e.push(n.value);t=e}return t}function g(){this.j=!1,this.h=null,this.o=void 0,this.g=1,this.m=0,this.i=null}function m(t){if(t.j)throw new TypeError("Generator is already running");t.j=!0}function y(t,n){t.i={v:n,A:!0},t.g=t.m}function v(t,n,e){return t.g=e,{value:n}}function E(t){this.g=new g,this.h=t}function b(n,t,e,r){var o,i;try{if(!((o=t.call(n.g.h,e))instanceof Object))throw new TypeError("Iterator result "+o+" is not an object");if(!o.done)return n.g.j=!1,o;i=o.value}catch(t){return n.g.h=null,y(n.g,t),w(n)}return n.g.h=null,r.call(n.g,i),w(n)}function w(n){for(;n.g.g;)try{var t=n.h(n.g);if(t)return{value:t.value,done:n.g.j=!1}}catch(t){n.g.o=void 0,y(n.g,t)}if(n.g.j=!1,n.g.i){if(t=n.g.i,n.g.i=null,t.A)throw t.v;return{value:t.return,done:!0}}return{value:void 0,done:!0}}function T(r){this.next=function(t){return m(r.g),r.g.h?b(r,r.g.h.next,t,r.g.l):(r.g.l(t),w(r))},this.throw=function(t){return m(r.g),r.g.h?b(r,r.g.h.throw,t,r.g.l):(y(r.g,t),w(r))},this.return=function(t){return t=t,m((n=r).g),(e=n.g.h)?b(n,"return"in e?e.return:function(t){return{value:t,done:!0}},t,n.g.return):(n.g.return(t),w(n));var n,e},this[Symbol.iterator]=function(){return this}}function x(i){var o=document.createDocumentFragment();return(t=>{for(var n=[],e="",r="",o=(t=d(i)).next();!o.done;o=t.next())"\n"===(o=o.value)?(e&&(n.push(e),e=""),n.push(o)):(e+=o,"."!==r&&"!"!==r&&"?"!==r||!C(o)||(n.push(e),e=""),r=o);return e&&n.push(e),n})(i).forEach(function(i){(t=>{for(var n=[],e="",r="",o=(t=d(i)).next();!o.done;o=t.next())C(o=o.value)?(e&&(n.push(e),e=""),n.push(o)):(N(o)&&!N(r)&&e&&(n.push(e),e=""),e+=o,r=o);return e&&n.push(e),n})(i).forEach(function(t){var n,e,r;!t.trim()||1===(n=[].concat(p(t))).length||n.every(N)?o.appendChild(document.createTextNode(t)):(n=document.createElement("span"),e=Math.ceil((t=[].concat(p(t))).length/2),(r=document.createElement("strong")).textContent=t.slice(0,e).join(""),n.appendChild(r),n.appendChild(document.createTextNode(t.slice(e).join(""))),o.appendChild(n))})}),o}function C(t){return" "===t||"\t"===t||"\n"===t||"\r"===t}function N(t){return!!(t=t.codePointAt(0))&&(8192<=t&&t<=8303||8592<=t&&t<=8703||8960<=t&&t<=9215||9728<=t&&t<=9983||9984<=t&&t<=10175||65024<=t&&t<=65039||126976<=t&&t<=129535)}function A(){var e=this;this.i=new WeakSet,this.o=new WeakSet,this.j=[],this.g=[],this.h=!1,this.s=new IntersectionObserver(function(t){return t.forEach(function(t){t.isIntersecting&&t.target instanceof Element&&(j(e,function(){return function e(r,t){var o,i,u;D(r,t)&&(Array.from(t.children).filter(function(t){return!P(r,t)}).forEach(function(t){return e(r,t)}),0<(o=Array.from(t.childNodes).filter(function(t){return t instanceof Element?!_(t):t.nodeType===Node.TEXT_NODE&&(null==(t=t.textContent)?void 0:t.trim())})).length)&&(i=document.createDocumentFragment(),u=new Set,Array.from(t.childNodes).forEach(function(t){var n;o.includes(t)?t.nodeType===Node.TEXT_NODE&&null!=(n=t.textContent)&&n.trim()?i.appendChild(x(t.textContent)):t instanceof Element&&!_(t)?((n=t.cloneNode(!0))instanceof Element&&e(r,n),i.appendChild(n)):i.appendChild(t.cloneNode(!0)):i.appendChild(t.cloneNode(!0)),u.add(t)}),t.textContent="",t.appendChild(i),r.i.add(t))}(e,t.target)}),e.s.unobserve(t.target))})},{threshold:t,rootMargin:n}),this.u=new MutationObserver(function(t){t.forEach(function(t){var n;"childList"===t.type?t.addedNodes.forEach(function(t){t instanceof Element&&!P(e,t)&&j(e,function(){return L(e,t)})}):"characterData"!==t.type&&"attributes"!==t.type||(n="characterData"===t.type?t.target.parentElement:t.target)instanceof Element&&!P(e,n)&&j(e,function(){return L(e,n)})})}),this.l=this.D.bind(this),this.B=this.C.bind(this),window.addEventListener("scroll",this.B,{passive:!0})}function j(t,n){var e,r,o;function i(t){return o.next(t)}function u(t){return o.throw(t)}t.j.push(n),t.h||(e=t,o=new T(new E(function(t){switch(t.g){case 1:if(e.h)return t.return();e.h=!0;case 2:if(0<e.j.length||0<e.g.length){if(0<e.g.length&&O(e),r=e.j.shift())return v(t,r(),6);t.g=2}else t.g=4;break;case 6:if(0<e.j.length)return v(t,new Promise(function(t){return setTimeout(t,0)}),2);t.g=2;break;case 4:e.h=!1,t.g=0}})),new Promise(function(e,r){!function t(n){n.done?e(n.value):Promise.resolve(n.value).then(i,u).then(t,r)}(o.next())}))}function S(t){if(!t.length)return t;t=t.map(function(t){var n=t.getBoundingClientRect();return{element:t,x:n.left,y:n.top,width:n.width}});var n=[],e=[];return t.sort(function(t,n){return t.x-n.x}),t.forEach(function(t){0===e.length||Math.abs(t.x-e[0].x)<=f?e.push(t):(n.push(e.sort(function(t,n){return t.y-n.y}).map(function(t){return t.element})),e=[t])}),0<e.length&&n.push(e.sort(function(t,n){return t.y-n.y}).map(function(t){return t.element})),n.reduce(function(t,n){return t.concat(n)},[])}function O(t){var n,e,r,o;0!==t.g.length&&(e=(n=d(t.g.reduce(function(t,n){var e=d(t);return t=e.next().value,e=e.next().value,(I(n)?t:e).push(n),[t,e]},[[],[]]))).next().value,r=n.next().value,t.g=[],0<(o=S(e)).length&&j(t,function(){return M(t,o)}),0<r.length)&&j(t,function(){return M(t,r)})}function D(t,n){for(var e=n;e;){if(r.has(e.tagName))return!1;e=e.parentElement}return document.contains(n)&&!P(t,n)&&!(n instanceof HTMLElement&&n.matches(a)&&!n.matches(c))&&!(n instanceof HTMLElement&&null===n.offsetParent)}function M(i,t){t.forEach(function(t){var n,e,r,o;D(i,t)&&(n=i,0<(e=Array.from((t=t).children).filter(function(t){return!P(n,t)})).length&&j(n,function(){M(n,e)}),0<(r=Array.from(t.childNodes).filter(function(t){return t instanceof Element?!_(t):t.nodeType===Node.TEXT_NODE&&(null==(t=t.textContent)?void 0:t.trim())})).length)&&(o=document.createDocumentFragment(),Array.from(t.childNodes).forEach(function(t){var n;r.includes(t)?t.nodeType===Node.TEXT_NODE&&null!=(n=t.textContent)&&n.trim()?o.appendChild(x(t.textContent)):(t instanceof Element&&_(t),o.appendChild(t)):o.appendChild(t)}),t.textContent="",t.appendChild(o),n.i.add(t))})}function L(n,t){var e,r;t=(e=d((t=[].concat(p(t.querySelectorAll("*"))).filter(function(t){return Array.from(t.childNodes).some(function(t){return t.nodeType===Node.TEXT_NODE&&(null==(t=t.textContent)?void 0:t.trim())})&&D(n,t)})).reduce(function(t,n){var e=d(t);return t=e.next().value,e=e.next().value,(I(n)?t:e).push(n),[t,e]},[[],[]]))).next().value,e=e.next().value,0<(r=S(t)).length&&j(n,function(){M(n,r)}),e.forEach(function(t){n.o.has(t)||(n.o.add(t),n.g.push(t),o<=n.g.length&&O(n))}),0<n.g.length&&O(n)}function P(t,n){if(n instanceof Element){if(t.i.has(n)||_(n))return 1;for(var e=n.parentElement;e;){if(t.i.has(e)||_(e))return 1;e=e.parentElement}return Array.from(n.getElementsByTagName("span")).some(_)}}function _(t){return t instanceof HTMLSpanElement&&2===t.childNodes.length&&t.firstChild instanceof HTMLElement&&"STRONG"===t.firstChild.tagName&&(null==(t=t.lastChild)?void 0:t.nodeType)===Node.TEXT_NODE}function I(t){return t instanceof HTMLElement&&(t=t.getBoundingClientRect()).top<=window.innerHeight+l&&-l<=t.bottom}i="function"==typeof Object.defineProperties?Object.defineProperty:function(t,n,e){return t!=Array.prototype&&t!=Object.prototype&&(t[n]=e.value),t},u=(t=>{var n,e;for(t=["object"==typeof globalThis&&globalThis,t,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global],n=0;n<t.length;++n)if((e=t[n])&&e.Math==Math)return e;throw Error("Cannot find global object")})(this),s("Symbol",function(t){function e(t,n){this.g=t,i(this,"description",{configurable:!0,writable:!0,value:n})}if(t)return t;e.prototype.toString=function(){return this.g};var r="jscomp_symbol_"+(1e9*Math.random()>>>0)+"_",o=0;return function t(n){if(this instanceof t)throw new TypeError("Symbol is not a constructor");return new e(r+(n||"")+"_"+o++,n)}}),s("Symbol.iterator",function(t){var n,e,r;if(!t)for(t=Symbol("Symbol.iterator"),n="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),e=0;e<10;e++)"function"==typeof(r=u[n[e]])&&"function"!=typeof r.prototype[t]&&i(r.prototype,t,{configurable:!0,writable:!0,value:function(){return(t={next:t=h(this)})[Symbol.iterator]=function(){return this},t;var t}});return t}),g.prototype.l=function(t){this.o=t},g.prototype.return=function(t){this.i={return:t},this.g=this.m},A.prototype.D=function(){var t=function(){for(var t=+(""+this),n=[],e=t;e<arguments.length;e++)n[e-t]=arguments[e];return n}.apply(0,arguments);this.m&&(this.m.apply(document,t),L(this,document.body))},A.prototype.C=function(){0<this.g.length&&O(this)},A.prototype.start=function(){this.m=document.write,Object.defineProperties(document,{write:{value:this.l},writeln:{value:this.l}}),L(this,document.body),this.u.observe(document.body,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:e})},r=new Set("SCRIPT STYLE CODE PRE TEXTAREA INPUT NOSCRIPT CANVAS SVG".split(" ")),o=10,t=.1,n="50px",e=["class","style","contenteditable"],a="a[href], button, input, select, textarea",c="a:not([href])",l=100,f=50,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){(new A).start()}):(new A).start();