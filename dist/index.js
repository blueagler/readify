var i,a,t,e,n,r,o,s,l,u,c,h;function f(e){var t=0;return function(){return t<e.length?{done:!1,value:e[t++]}:{done:!0}}}function d(e,t){var n,r,o;if(t)e:{for(n=a,e=e.split("."),r=0;r<e.length-1;r++){if(!((o=e[r])in n))break e;n=n[o]}(t=t(r=n[e=e[e.length-1]]))!=r&&null!=t&&i(n,e,{configurable:!0,writable:!0,value:t})}}function m(e){var t="undefined"!=typeof Symbol&&Symbol.iterator&&e[Symbol.iterator];if(t)return t.call(e);if("number"==typeof e.length)return{next:f(e)};throw Error(e+" is not an iterable or ArrayLike")}function g(e){if(!(e instanceof Array)){e=m(e);for(var t,n=[];!(t=e.next()).done;)n.push(t.value);e=n}return e}function p(){this.m=!1,this.i=null,this.G=void 0,this.g=1,this.C=0,this.l=null}function y(e){if(e.m)throw new TypeError("Generator is already running");e.m=!0}function v(e,t){e.l={ra:t,sa:!0},e.g=e.C}function b(e){this.g=new p,this.i=e}function w(t,e,n,r){var o,i;try{if(!((o=e.call(t.g.i,n))instanceof Object))throw new TypeError("Iterator result "+o+" is not an object");if(!o.done)return t.g.m=!1,o;i=o.value}catch(e){return t.g.i=null,v(t.g,e),E(t)}return t.g.i=null,r.call(t.g,i),E(t)}function E(t){for(;t.g.g;)try{var e=t.i(t.g);if(e)return{value:e.value,done:t.g.m=!1}}catch(e){t.g.G=void 0,v(t.g,e)}if(t.g.m=!1,t.g.l){if(e=t.g.l,t.g.l=null,e.sa)throw e.ra;return{value:e.return,done:!0}}return{value:void 0,done:!0}}function A(r){this.next=function(e){return y(r.g),r.g.i?w(r,r.g.i.next,e,r.g.v):(r.g.v(e),E(r))},this.throw=function(e){return y(r.g),r.g.i?w(r,r.g.i.throw,e,r.g.v):(v(r.g,e),E(r))},this.return=function(e){return e=e,y((t=r).g),(n=t.g.i)?w(t,"return"in n?n.return:function(e){return{value:e,done:!0}},e,t.g.return):(t.g.return(e),E(t));var t,n},this[Symbol.iterator]=function(){return this}}function M(e){var t;return e instanceof HTMLElement&&"none"!==(t=window.getComputedStyle(e)).display&&"hidden"!==t.visibility&&(e=e.getBoundingClientRect()).top<=window.innerHeight+o.T&&-o.T<=e.bottom&&0<e.height&&0<e.width}function T(e){var t=e.getBoundingClientRect();return{S:e,ta:t.width,J:t.left,K:t.top}}function C(e,t){for(;e;){if(t.has(e.tagName))return!0;e=e.parentElement}return!1}function N(e){return!!(e=e.codePointAt(0))&&(8192<=e&&e<=8303||8592<=e&&e<=8703||8960<=e&&e<=9215||9728<=e&&e<=9983||9984<=e&&e<=10175||65024<=e&&e<=65039||126976<=e&&e<=129535)}function x(e){var t,n,r=this;this.g=o,this.m=this.G=!1,this.i=[],this.C=[],this.v=new Set,this.g.s.F=(null==e?void 0:e.F)||this.g.s.F,this.g.s.I=(null==e?void 0:e.I)||this.g.s.I,this.g.s.L=(null==e?void 0:e.L)||this.g.s.L,null!=e&&null!=(t=e.P)&&t.forEach(function(e){return r.g.s.P.add(e)}),null!=e&&null!=(t=e.R)&&t.forEach(function(e,t){return r.g.s.R.set(t,e)}),(n=this).l=new IntersectionObserver(function(e){return e.forEach(function(e){e.isIntersecting&&e.target instanceof Element&&!C(e.target,n.g.B)&&!j(n,e.target)&&(F(n,function(){return S(n,e.target)}),n.l.unobserve(e.target),e.target instanceof HTMLElement)&&e.target.removeAttribute(n.g.h.u)})},{rootMargin:n.g.ca,threshold:n.g.da}),n.V=new MutationObserver(function(e){e.forEach(function(e){"childList"===e.type&&0<e.removedNodes.length&&e.removedNodes.forEach(function(e){e instanceof Element&&L(n,e)});var t="characterData"===e.type?e.target.parentElement:e.target instanceof Element?e.target:null;t instanceof Element&&!j(n,t)&&!C(t,n.g.B)?F(n,function(){return k(n,t)}):"childList"===e.type&&e.addedNodes.forEach(function(e){e instanceof Element&&!j(n,e)&&!C(e,n.g.B)&&F(n,function(){return k(n,e)})})})})}function L(t,e){e instanceof HTMLElement&&(e.removeAttribute(t.g.h.o),e.removeAttribute(t.g.h.u)),e=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:function(e){return e instanceof HTMLElement&&(e.hasAttribute(t.g.h.o)||e.hasAttribute(t.g.h.u))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(var n;n=e.nextNode();)n instanceof HTMLElement&&(n.removeAttribute(t.g.h.o),n.removeAttribute(t.g.h.u))}function j(e,t){return t instanceof HTMLElement&&t.hasAttribute(e.g.h.o)}function k(l,c){u(function(){var t,n,e,r,o,i,a,u,s;if(!C(c,l.g.B)&&!l.v.has(c)){for(t=new Set,n=new Set,e=document.createTreeWalker(c,NodeFilter.SHOW_ELEMENT,{acceptNode:function(e){return e instanceof HTMLElement?l.g.B.has(e.tagName)||l.v.has(e)?NodeFilter.FILTER_REJECT:O(l,e)&&Array.from(e.childNodes).some(function(e){return e.nodeType===Node.TEXT_NODE&&(null==(e=e.textContent)?void 0:e.trim())})?((M(e)?t:n).add(e),NodeFilter.FILTER_REJECT):NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});e.nextNode(););n.forEach(function(e){e instanceof HTMLElement&&!e.hasAttribute(l.g.h.u)&&(e.setAttribute(l.g.h.u,""),l.l.observe(e))}),0<t.size&&(l.i.push.apply(l.i,g(t)),0!==(r=l).i.length)&&(o=(i=m((o=(s=r.i).filter(function(e){return t=e,!s.some(function(e){return e.contains(t)&&e!==t});var t})).reduce(function(e,t){var n=m(e);return e=n.next().value,n=n.next().value,(M(t)?e:n).push(t),[e,n]},[[],[]]))).next().value,i=i.next().value,r.i=[],0<(o=((t,e)=>{if(e.length<=1)return e;e=e.map(T);var n=[],r=[];return e.sort(function(e,t){return e.J-t.J}),e.forEach(function(e){0===r.length||Math.abs(e.J-r[0].J)<=t.g.Z?r.push(e):(n.push(r.sort(function(e,t){return e.K-t.K}).map(function(e){return e.S})),r=[e])}),0<r.length&&n.push(r.sort(function(e,t){return e.K-t.K}).map(function(e){return e.S})),n.reduce(function(e,t){return e.concat(t)},[])})(r,o)).length&&(a=r,0!==(u=o).length)&&F(a,function(){function r(){for(var e,t=performance.now(),n=Math.min(o+a.g.aa,u.length);o<n&&(M(e=u[o])?S(a,e):e instanceof HTMLElement&&(e.setAttribute(a.g.h.u,""),a.l.observe(e)),o++,!(16<performance.now()-t)););o<u.length&&requestAnimationFrame(r)}var o=0;a.G||(a.G=!0,requestAnimationFrame(function(){r(),a.G=!1}))}),i.forEach(function(e){e instanceof HTMLElement&&!e.hasAttribute(r.g.h.u)&&(e.setAttribute(r.g.h.u,""),r.l.observe(e))}))}})}function S(u,e){if(O(u,e)&&!u.v.has(e)){u.v.add(e);try{var t=Array.from(e.childNodes).filter(function(e){return e.nodeType===Node.TEXT_NODE&&(null==(e=e.textContent)?void 0:e.trim())});t.length&&(t.forEach(function(e){var n,o,t,i,r,a;e.textContent&&(n=e.textContent,o=u.g,r="string"==typeof n&&n.trim()?(/<\/?(?:strong|span)/.test(n)?(t=document.createDocumentFragment()).appendChild(document.createTextNode(n)):(t=document.createDocumentFragment(),(i=document.createElement("span")).setAttribute(o.h.o,""),0===(r=(e=>{for(var t=[],n=null,r=[].concat(g(e)),o=0;o<r.length;o++)/[a-zA-Z]/.test(r[o])?n?n.H=o+1:n={H:o+1,j:o}:n&&(/[a-zA-Z]{2,}/.test(e.slice(n.j,n.H))&&t.push(Object.assign({},n)),n=null);return n&&/[a-zA-Z]{2,}/.test(e.slice(n.j,n.H))&&t.push(n),t})(n).filter(function(e){return/^[a-zA-Z]+(?:[\s'][a-zA-Z]+)*$/.test(n.slice(e.j,e.H).trim())})).length?i.appendChild(document.createTextNode(n)):(r.sort(function(e,t){return e.j-t.j}),a=0,r.forEach(function(e){var t=e.H;a<(e=e.j)&&i.appendChild(document.createTextNode(n.slice(a,e))),(e=>{for(var t=[],n="",r="",o=(e=m(e)).next();!o.done;o=e.next())" "===(o=o.value)||"\t"===o||"\n"===o||"\r"===o?(n&&(t.push(n),n=""),t.push(o)):(N(o)&&!N(r)&&n&&(t.push(n),n=""),n+=o,r=o);return n&&t.push(n),t})(n.slice(e,t)).forEach(function(e){var t,n,r;(t=(t=!e.trim())||1===(t=[].concat(g(e))).length||t.every(N))?i.appendChild(document.createTextNode(e)):(t=document.createElement("span"),0===(n=((e,t)=>{var n,r,o,i,a,u;if(!e||"string"!=typeof e)return{O:0,U:!1,W:0};if(n=l.get(t)){if(r=n.get(e))return r}else l.set(t,n=new Map);return 0===(r=e.length)?{O:0,U:!1,W:0}:(o=t.P.has(e.toLowerCase()),a=t,a=void 0!==(u=s.get(i=e))?u:(i=i.toLowerCase().replace(/[^a-z]/g,"")).length<=3?1:void 0!==(u=a.R.get(i))?u:0===(u=(i.match(a.D.qa)||[]).length)?1:(u=(u-=(i.match(a.D.na)||[]).length)+(i.match(a.D.Y)||[]).length,a.ja.test(i)&&u++,a.D.ka.test(i)&&u--,a.D.la.test(i)&&u--,a.D.ma.test(i)&&u--,s.size<1e4&&s.set(i,u),Math.max(1,u)),t={O:Math.min(t.fa,Math.min(r,o?t.L?Math.max(1,Math.ceil(r*t.A.$*t.F)):0:1!==a||t.I?Math.max(1,r<=0||a<=0?Math.min(Math.ceil(.4*r),4):Math.ceil(r<=4?r*t.A.N.X*t.F:r*(a<=1?r<=7?t.A.N.ga:t.A.N.ea:2===a?t.A.M.pa:3===a?t.A.M.oa:t.A.M.ba)*t.F*(8<r?1+.005*(r-8):1)*Math.max(.8,Math.min(1.2,2<a?1.1:1)))):0)),U:o,W:a},n.size<1e4&&n.set(e,t),t)})(e,o.s).O)?t.textContent=e:((r=document.createElement("strong")).textContent=e.slice(0,n),t.appendChild(r),n<e.length&&t.appendChild(document.createTextNode(e.slice(n)))),i.appendChild(t))}),a=t}),a<n.length&&i.appendChild(document.createTextNode(n.slice(a)))),t.appendChild(i)),t):document.createDocumentFragment(),null!=(t=e.parentNode))&&t.replaceChild(r,e)}),e instanceof HTMLElement)&&e.setAttribute(u.g.h.o,"")}finally{u.v.delete(e)}}}function F(e,t){e.C.push(t),e.m||u(function(){return n=e,t=new A(new b(function(e){switch(e.g){case 1:if(n.m)return e.return();n.m=!0;case 2:var t;if(0<n.C.length)return t=new Promise(u),e.g=5,{value:t};e.g=4;break;case 5:(r=n.C.shift())&&r(),e.g=2;break;case 4:n.m=!1,e.g=0}})),new Promise(function(n,r){!function e(t){t.done?n(t.value):Promise.resolve(t.value).then(o,i).then(e,r)}(t.next())});function o(e){return t.next(e)}function i(e){return t.throw(e)}var t,n,r})}function O(e,t){return!((e=!(t&&t instanceof HTMLElement)||t.hasAttribute(e.g.h.o)||t.closest("["+e.g.h.o+"]")||e.g.B.has(t.tagName)||C(t,e.g.B))||t instanceof HTMLElement&&(t.hasAttribute(o.h.o)||null!=(e=t.parentElement)&&e.hasAttribute(o.h.o)||t instanceof HTMLSpanElement&&t.firstElementChild instanceof HTMLElement&&"STRONG"===t.firstElementChild.tagName))}function I(e){this.g=new x(e)}function H(){var e={I:!0},e=c=c||new I(e);"loading"===document.readyState?document.addEventListener("DOMContentLoaded",e.j):e.j(),h=e}function P(){null!=h&&h.stop()}i="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,n){return e!=Array.prototype&&e!=Object.prototype&&(e[t]=n.value),e},a=(e=>{var t,n;for(e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global],t=0;t<e.length;++t)if((n=e[t])&&n.Math==Math)return n;throw Error("Cannot find global object")})(this),d("Symbol",function(e){function n(e,t){this.g=e,i(this,"description",{configurable:!0,writable:!0,value:t})}if(e)return e;n.prototype.toString=function(){return this.g};var r="jscomp_symbol_"+(1e9*Math.random()>>>0)+"_",o=0;return function e(t){if(this instanceof e)throw new TypeError("Symbol is not a constructor");return new n(r+(t||"")+"_"+o++,t)}}),d("Symbol.iterator",function(e){var t,n,r;if(!e)for(e=Symbol("Symbol.iterator"),t="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),n=0;n<10;n++)"function"==typeof(r=a[t[n]])&&"function"!=typeof r.prototype[e]&&i(r.prototype,e,{configurable:!0,writable:!0,value:function(){return(e={next:e=f(this)})[Symbol.iterator]=function(){return this},e;var e}});return e}),t="function"==typeof Object.assign?Object.assign:function(e,t){for(var n,r,o=1;o<arguments.length;o++)if(n=arguments[o])for(r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r]);return e},d("Object.assign",function(e){return e||t}),p.prototype.v=function(e){this.G=e},p.prototype.return=function(e){this.l={return:e},this.g=this.C},e=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent),n=window.innerWidth,r=window.innerHeight,o={s:{L:!1,F:1,I:!1,P:new Set("the be of and to a in have it you for not that on with do as he we this at they but from by will or his say go she so all about if one would can which there know more get who like when think make time see what up some other out good people year take no well because very just come could work use than now then also into only look want give first new way find over any after thing our still even back too mean may here many such last child tell really call before company through down show life man change place long between feel same lot great help where problem try leave number part start case turn each end world school might need home course house us move system provide small service around however again ask large group war off always write point mother father question late night live run car set water area money name book both own read less friend month city business value side social story young fact lot study eye job word though issue kind four head far black long both little house yes since provide service around friend important father sit away until power hour game often yet line political end among ever stand bad lose however member pay law meet car city almost include continue set later community much name five once white least president learn real change team minute best several idea kid body information nothing ago right lead social understand whether watch together follow parent stop face anything create public already speak others office three room national point hold keep next hear example question during work play government run small number off always move night live Mr bring without before large million must home under water room write mother area national money story young fact month different lot study book eye job word though business issue side kind four head far black long both little house yes since provide service around friend important father sit away until power hour game often yet line political end among ever stand bad lose however member pay law meet car city almost include continue set later community much name five once white least president learn real change team minute best several idea kid body information nothing ago right lead social understand whether watch together follow parent stop face anything create public already speak others office three room national point hold keep next hear example question during work play government run small number off always move night live Mr bring without before large million must home under water room write mother area national money story young fact month different lot".split(" ")),fa:Math.min(5,Math.ceil(n/200)),va:1,ja:/^(?:un|de|re|pre|pro|in|en|em|dis|mis|sub|inter|super|trans|non|over|under|out|up|down|anti|auto|bi|co|contra|counter|extra|hyper|i[lr]|im|inter|mid|multi|post|semi|sub|super|tele|tri|ultra|uni)/,A:{$:.35,M:{ba:.65,oa:.55,pa:.45},N:{ea:.45,ga:.4,X:.35}},D:{Y:/(?:ia|riet|dien|iu|io|ii|[aeiouy]ing|[^aeiouy]ying$|ui[aeiouy]|eo|[aeiou]{2}|[aeiou]y[aeiou]|[aeiou](?:le|les|ed|es|est|eth|ist|ism|ize|ous|ship|tion|tive|ture|ure|ward|wise|yer|ying)$)/g,ka:/[^l]e$/,la:/(?:[^td]|^)ed$/,ma:/[^sz]es$/,na:/(?:cial|tia|cius|cious|giu|ion|iou|sia$|[^aeiouy]eo|[aeiouy]ing$|[^aeiouy]y[aeiouy]|eous$|gue$|que$|[aeiou]{2}|[aeiou](?:re|le|les|ed|es|est|eth|ist|ism|ize|ous|ship|tion|tive|ture|ure|ward|wise|yer|ying)$)/g,qa:/[aeiouy]+/g},R:new Map([["business",2],["camera",3],["chocolate",3],["comfortable",3],["different",2],["evening",2],["every",2],["family",3],["favorite",3],["general",3],["interest",3],["interesting",3],["jewelry",3],["literature",3],["memory",3],["naturally",3],["restaurant",3],["science",2],["several",3],["temperature",4],["vegetable",4],["wednesday",2]])},Z:Math.max(50,Math.min(200,Math.floor(.1*n))),h:{u:"data-readify-observed",o:"data-readify-processed"},aa:e?10:20,B:new Set("SCRIPT STYLE CODE PRE TEXTAREA INPUT NOSCRIPT CANVAS SVG IFRAME IMG VIDEO AUDIO OBJECT EMBED MAP FIGURE MATH".split(" ")),ca:Math.floor(.2*r)+"px",da:e?.1:.05,ha:{ua:100,ia:{attributeOldValue:!1,attributes:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0}},T:Math.max(100,Math.min(400,Math.floor(.5*r)))},s=new Map,l=new WeakMap,u=globalThis.queueMicrotask||("undefined"!=typeof Promise?function(e){return Promise.resolve().then(e)}:function(e){return setTimeout(e,0)}),x.prototype.j=function(){k(this,document.body),this.V.observe(document.body,this.g.ha.ia)},x.prototype.stop=function(){this.l.disconnect(),this.V.disconnect(),this.C=[],this.i=[],this.m=!1,L(this,document.body)},I.prototype.j=function(){this.g.j()},I.prototype.stop=function(){this.g.stop()},h=c=null;export{H as start,P as stop};