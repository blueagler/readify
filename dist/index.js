var r,e,t,a=window.innerWidth,i=window.innerHeight,n={m:"data-readify-observed",i:"data-readify-processed"};function o(e){return e instanceof HTMLElement&&(e.hasAttribute(r.h.i)||e.parentElement?.hasAttribute(r.h.i)||e instanceof HTMLSpanElement&&e.firstElementChild instanceof HTMLElement&&"STRONG"===e.firstElementChild.tagName)}function s(e){var t=e.getBoundingClientRect();return{N:e,oa:t.width,B:t.left,C:t.top}}function h(e){return!!(e=e.codePointAt(0))&&(8192<=e&&e<=8303||8592<=e&&e<=8703||8960<=e&&e<=9215||9728<=e&&e<=9983||9984<=e&&e<=10175||65024<=e&&e<=65039||126976<=e&&e<=129535)}r={l:{D:!1,u:1,A:!1,K:new Set("the be of and to a in have it you for not that on with do as he we this at they but from by will or his say go she so all about if one would can which there know more get who like when think make time see what up some other out good people year take no well because very just come could work use than now then also into only look want give first new way find over any after thing our still even back too mean may here many such last child tell really call before company through down show life man change place long between feel same lot great help where problem try leave number part start case turn each end world school might need home course house us move system provide small service around however again ask large group war off always write point mother father question late night live run car set water area money name book both own read less friend month city business value side social story young fact lot study eye job word though issue kind four head far black long both little house yes since provide service around friend important father sit away until power hour game often yet line political end among ever stand bad lose however member pay law meet car city almost include continue set later community much name five once white least president learn real change team minute best several idea kid body information nothing ago right lead social understand whether watch together follow parent stop face anything create public already speak others office three room national point hold keep next hear example question during work play government run small number off always move night live Mr bring without before large million must home under water room write mother area national money story young fact month different lot study book eye job word though business issue side kind four head far black long both little house yes since provide service around friend important father sit away until power hour game often yet line political end among ever stand bad lose however member pay law meet car city almost include continue set later community much name five once white least president learn real change team minute best several idea kid body information nothing ago right lead social understand whether watch together follow parent stop face anything create public already speak others office three room national point hold keep next hear example question during work play government run small number off always move night live Mr bring without before large million must home under water room write mother area national money story young fact month different lot".split(" ")),ba:Math.min(5,Math.ceil(a/200)),pa:1,ea:/^(?:un|de|re|pre|pro|in|en|em|dis|mis|sub|inter|super|trans|non|over|under|out|up|down|anti|auto|bi|co|contra|counter|extra|hyper|i[lr]|im|inter|mid|multi|post|semi|sub|super|tele|tri|ultra|uni)/,o:{X:.35,H:{Y:.65,ja:.55,ka:.45},I:{aa:.45,ca:.4,SHORT:.35}},s:{U:/(?:ia|riet|dien|iu|io|ii|[aeiouy]ing|[^aeiouy]ying$|ui[aeiouy]|eo|[aeiou]{2}|[aeiou]y[aeiou]|[aeiou](?:le|les|ed|es|est|eth|ist|ism|ize|ous|ship|tion|tive|ture|ure|ward|wise|yer|ying)$)/g,fa:/[^l]e$/,ga:/(?:[^td]|^)ed$/,ha:/[^sz]es$/,ia:/(?:cial|tia|cius|cious|giu|ion|iou|sia$|[^aeiouy]eo|[aeiouy]ing$|[^aeiouy]y[aeiouy]|eous$|gue$|que$|[aeiou]{2}|[aeiou](?:re|le|les|ed|es|est|eth|ist|ism|ize|ous|ship|tion|tive|ture|ure|ward|wise|yer|ying)$)/g,la:/[aeiouy]+/g},M:new Map([["business",2],["camera",3],["chocolate",3],["comfortable",3],["different",2],["evening",2],["every",2],["family",3],["favorite",3],["general",3],["interest",3],["interesting",3],["jewelry",3],["literature",3],["memory",3],["naturally",3],["restaurant",3],["science",2],["several",3],["temperature",4],["vegetable",4],["wednesday",2]])},W:Math.max(50,Math.min(200,Math.floor(.1*a))),h:n,ma:new Set("SCRIPT STYLE CODE PRE TEXTAREA INPUT NOSCRIPT CANVAS SVG IFRAME IMG VIDEO AUDIO OBJECT EMBED MAP FIGURE MATH".split(" ")),Z:Math.floor(.2*i)+"px",$:/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)?.1:.05,O:{V:new Set(["class","style","contenteditable","role",n.i,n.m]),da:{attributeOldValue:!1,attributes:!0,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0}},P:Math.max(100,Math.min(400,Math.floor(.5*i)))};let u=new Map,c=new WeakMap;function l(e,t){e.L.push(t),e.F||(async e=>{if(!e.F){for(e.F=!0;0<e.L.length;){var t=e.L.shift();t&&t()}e.F=!1}})(e)}function m(t,e){var a,n;f(t,e)&&(Array.from(e.children).filter(e=>!g(t,e)&&!o(e)&&!e.querySelector("strong")).forEach(e=>m(t,e)),(a=d(e)).length)&&(n=document.createDocumentFragment(),a.forEach(e=>{e.textContent&&n.appendChild(((s,l)=>{var e,t;if("string"!=typeof s||!s.trim())return document.createDocumentFragment();if(/<\/?(?:strong|span)/.test(s))(e=document.createDocumentFragment()).appendChild(document.createTextNode(s));else{e=document.createDocumentFragment();let i=document.createElement("span");if(i.setAttribute(l.h.i,""),0===(t=(t=>{let a,n=[],o=null;a=[...t];for(let e=0;e<a.length;e++)/[a-zA-Z]/.test(a[e])?o?o.v=e+1:o={v:e+1,j:e}:o&&(/[a-zA-Z]{2,}/.test(t.slice(o.j,o.v))&&n.push({...o}),o=null);return o&&/[a-zA-Z]{2,}/.test(t.slice(o.j,o.v))&&n.push(o),n})(s).filter(({v:e,j:t})=>/^[a-zA-Z]+(?:[\s'][a-zA-Z]+)*$/.test(s.slice(t,e).trim()))).length)i.appendChild(document.createTextNode(s));else{let e=0;t.forEach(({v:o,j:r})=>{r>e&&i.appendChild(document.createTextNode(s.slice(e,r))),(()=>{var e,t=[];let a="",n="";for(e of s.slice(r,o))" "===e||"\t"===e||"\n"===e||"\r"===e?(a&&(t.push(a),a=""),t.push(e)):(h(e)&&!h(n)&&a&&(t.push(a),a=""),a+=e,n=e);return a&&t.push(a),t})().forEach(e=>{var t,a,n;(t=(t=!e.trim())||1===(t=[...e]).length||t.every(h))?i.appendChild(document.createTextNode(e)):(t=document.createElement("span"),0===(a=((e,t)=>{var a,n,o,r,i;if(!e||"string"!=typeof e)return{J:0,R:!1,T:0};let s=c.get(t);if(s){if(a=s.get(e))return a}else s=new Map,c.set(t,s);return 0===(a=e.length)?{J:0,R:!1,T:0}:(n=t.K.has(e.toLowerCase()),o=e,r=t,r=void 0!==(i=u.get(o))?i:(o=o.toLowerCase().replace(/[^a-z]/g,"")).length<=3?1:void 0!==(i=r.M.get(o))?i:0===(i=(o.match(r.s.la)||[]).length)?1:(i=(i-=(o.match(r.s.ia)||[]).length)+(o.match(r.s.U)||[]).length,r.ea.test(o)&&i++,r.s.fa.test(o)&&i--,r.s.ga.test(o)&&i--,r.s.ha.test(o)&&i--,u.size<1e4&&u.set(o,i),Math.max(1,i)),t={J:Math.min(t.ba,Math.min(a,n?t.D?Math.max(1,Math.ceil(a*t.o.X*t.u)):0:1!==r||t.A?Math.max(1,a<=0||r<=0?Math.min(Math.ceil(.4*a),4):Math.ceil(a<=4?a*t.o.I.SHORT*t.u:a*(r<=1?a<=7?t.o.I.ca:t.o.I.aa:2===r?t.o.H.ka:3===r?t.o.H.ja:t.o.H.Y)*t.u*(8<a?1+.005*(a-8):1)*Math.max(.8,Math.min(1.2,2<r?1.1:1)))):0)),R:n,T:r},s.size<1e4&&s.set(e,t),t)})(e,l.l).J)?t.textContent=e:((n=document.createElement("strong")).textContent=e.slice(0,a),t.appendChild(n),a<e.length&&t.appendChild(document.createTextNode(e.slice(a)))),i.appendChild(t))}),e=o}),e<s.length&&i.appendChild(document.createTextNode(s.slice(e)))}e.appendChild(i)}return e})(e.textContent,t.g))}),a.forEach(e=>e.parentNode?.removeChild(e)),e.appendChild(n),e instanceof HTMLElement)&&e.setAttribute(t.g.h.i,"")}function d(e){return Array.from(e.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE&&e.textContent?.trim())}function g(e,t){return t instanceof HTMLElement&&t.hasAttribute(e.g.h.i)}function f(e,t){return!(!(t&&t instanceof HTMLElement)||t.hasAttribute(e.g.h.i)||t.closest(`[${e.g.h.i}]`)||e.g.ma.has(t.tagName)||o(t))}function p(t,e){var a,n,o;e=[...e.querySelectorAll("*")].filter(e=>0<d(e).length&&f(t,e)),t.G.push(...e),0!==(a=t).G.length&&([e,o]=a.G.reduce(([e,t],a)=>{var n;return((n=a instanceof HTMLElement&&(n=a.getBoundingClientRect()).top<=i+r.P&&-r.P<=n.bottom)?e:t).push(a),[e,t]},[[],[]]),a.G=[],0<(n=((t,e)=>{if(e.length<=1)return e;e=e.map(s);let a=[],n=[];return e.sort((e,t)=>e.B-t.B),e.forEach(e=>{0===n.length||Math.abs(e.B-n[0].B)<=t.g.W?n.push(e):(a.push(n.sort((e,t)=>e.C-t.C).map(e=>e.N)),n=[e])}),0<n.length&&a.push(n.sort((e,t)=>e.C-t.C).map(e=>e.N)),a.reduce((e,t)=>e.concat(t),[])})(a,e)).length&&l(a,()=>n.forEach(e=>m(a,e))),o.forEach(e=>{e instanceof HTMLElement&&!e.hasAttribute(a.g.h.m)&&(e.setAttribute(a.g.h.m,""),a.S.observe(e))}))}e=class{constructor(){var a,e=t;this.g=r,this.F=!1,this.G=[],this.L=[],this.g.l.u=e?.u||this.g.l.u,this.g.l.A=e?.A||this.g.l.A,this.g.l.D=e?.D||this.g.l.D,e?.K?.forEach(e=>this.g.l.K.add(e)),e?.M?.forEach((e,t)=>this.g.l.M.set(t,e)),(a=this).S=new IntersectionObserver(e=>e.forEach(e=>{e.isIntersecting&&e.target instanceof Element&&(l(a,()=>m(a,e.target)),a.S.unobserve(e.target),e.target instanceof HTMLElement)&&e.target.removeAttribute(a.g.h.m)}),{rootMargin:a.g.Z,threshold:a.g.$}),a.na=new MutationObserver(e=>{e.forEach(e=>{"childList"===e.type&&0<e.removedNodes.length&&e.removedNodes.forEach(e=>{var t;e instanceof Element&&(t=a,(e=e)instanceof HTMLElement&&(e.removeAttribute(t.g.h.i),e.removeAttribute(t.g.h.m)),e.querySelectorAll(`[${t.g.h.i}], [${t.g.h.m}]`).forEach(e=>{e instanceof HTMLElement&&(e.removeAttribute(t.g.h.i),e.removeAttribute(t.g.h.m))}))});let t="characterData"===e.type?e.target.parentElement:e.target instanceof Element?e.target:null;t instanceof Element&&!g(a,t)?l(a,()=>p(a,t)):"childList"===e.type&&e.addedNodes.forEach(e=>{e instanceof Element&&!g(a,e)&&l(a,()=>p(a,e))})})})}j(){p(this,document.body),this.na.observe(document.body,{...this.g.O.da,attributeFilter:[...this.g.O.V]})}},a=null,"undefined"!=typeof window&&(t={A:!0},n=a||=new class{constructor(){this.g=new e}j(){this.g.j()}},"loading"===document.readyState?document.addEventListener("DOMContentLoaded",n.j):n.j());