var n,a,i,t,o,e,r;function m(e){var t;return e instanceof HTMLElement&&"none"!==(t=window.getComputedStyle(e)).display&&"hidden"!==t.visibility&&(e=e.getBoundingClientRect()).top<=n+a.V&&-a.V<=e.bottom&&0<e.height&&0<e.width}function p(e){var t=e.getBoundingClientRect();return{T:e,xa:t.width,G:t.left,H:t.top}}function h(e){return!!(e=e.codePointAt(0))&&(8192<=e&&e<=8303||8592<=e&&e<=8703||8960<=e&&e<=9215||9728<=e&&e<=9983||9984<=e&&e<=10175||65024<=e&&e<=65039||126976<=e&&e<=129535)}r=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent),e=window.innerWidth,n=window.innerHeight,a={j:{B:!1,u:1,C:!1,P:new Set("the be of and to a in have it you for not that on with do as he we this at they but from by will or his say go she so all about if one would can which there know more get who like when think make time see what up some other out good people year take no well because very just come could work use than now then also into only look want give first new way find over any after thing our still even back too mean may here many such last child tell really call before company through down show life man change place long between feel same lot great help where problem try leave number part start case turn each end world school might need home course house us move system provide small service around however again ask large group war off always write point mother father question late night live run car set water area money name book both own read less friend month city business value side social story young fact lot study eye job word though issue kind four head far black long both little house yes since provide service around friend important father sit away until power hour game often yet line political end among ever stand bad lose however member pay law meet car city almost include continue set later community much name five once white least president learn real change team minute best several idea kid body information nothing ago right lead social understand whether watch together follow parent stop face anything create public already speak others office three room national point hold keep next hear example question during work play government run small number off always move night live Mr bring without before large million must home under water room write mother area national money story young fact month different lot".split(" ")),ja:Math.min(5,Math.ceil(e/200)),Aa:1,na:/^(?:un|de|re|pre|pro|in|en|em|dis|mis|sub|inter|super|trans|non|over|under|out|up|down|anti|auto|bi|co|contra|counter|extra|hyper|i[lr]|im|inter|mid|multi|post|semi|sub|super|tele|tri|ultra|uni)/,m:{ba:.35,L:{fa:.65,sa:.55,ta:.45},N:{Y:.35,ia:.45,ka:.4}},s:{Z:/(?:ia|riet|dien|iu|io|ii|[aeiouy]ing|[^aeiouy]ying$|ui[aeiouy]|eo|[aeiou]{2}|[aeiou]y[aeiou]|[aeiou](?:le|les|ed|es|est|eth|ist|ism|ize|ous|ship|tion|tive|ture|ure|ward|wise|yer|ying)$)/g,oa:/[^l]e$/,pa:/(?:[^td]|^)ed$/,qa:/[^sz]es$/,ra:/(?:cial|tia|cius|cious|giu|ion|iou|sia$|[^aeiouy]eo|[aeiouy]ing$|[^aeiouy]y[aeiouy]|eous$|gue$|que$|[aeiou]{2}|[aeiou](?:re|le|les|ed|es|est|eth|ist|ism|ize|ous|ship|tion|tive|ture|ure|ward|wise|yer|ying)$)/g,ua:/[aeiouy]+/g},R:new Map([["business",2],["camera",3],["chocolate",3],["comfortable",3],["different",2],["evening",2],["every",2],["family",3],["favorite",3],["general",3],["interest",3],["interesting",3],["jewelry",3],["literature",3],["memory",3],["naturally",3],["restaurant",3],["science",2],["several",3],["temperature",4],["vegetable",4],["wednesday",2]])},aa:Math.max(50,Math.min(200,Math.floor(.1*e))),ca:{ea:{[3]:{$:[["contenteditable","true"],["contenteditable","plaintext-only"]],J:["contenteditable","ng-model","v-model","data-reactroot"],K:"editable editor wysiwyg rich-text quill monaco-editor CodeMirror ace_editor ql-editor tox-tinymce cke_editable".split(" "),M:"combobox progressbar scrollbar searchbox slider spinbutton textbox".split(" "),U:[["cursor","text"],["cursor","text !important"]],O:["INPUT","TEXTAREA","SELECT","BUTTON","OPTION"]},1:{J:["aria-hidden"],K:["code","math","syntax"],U:[["display","none"],["visibility","hidden"],["opacity","0"],["clipPath","inset(100%)"],["clip","rect(0, 0, 0, 0)"]]},2:{J:["data-player","data-unity","data-phaser","data-visualization"],K:"video video-js plyr three-js webgl gsap-marker-root lottie unity phaser highcharts-container echarts visualization".split(" "),M:["presentation"],O:["CANVAS","OBJECT","EMBED"]},0:{O:"SCRIPT STYLE CODE PRE TEXTAREA INPUT NOSCRIPT CANVAS SVG IFRAME IMG VIDEO AUDIO OBJECT EMBED MAP FIGURE MATH SELECT OPTION BUTTON METER PROGRESS TIME OUTPUT TEMPLATE SLOT PORTAL DATALIST OPTGROUP MARQUEE EDITOR WYSIWYG DETAILS SUMMARY MENU MENUITEM TRACK SOURCE PICTURE HEAD LINK META BASE TITLE PATH CIRCLE RECT LINE POLYGON MTEXT MI MO MN ROUTER-VIEW ROUTER-LINK".split(" ")}}},da:r?10:20,ga:Math.floor(.2*n)+"px",ha:r?.1:.05,la:{za:100,ma:{attributeOldValue:!1,attributes:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0}},V:Math.max(100,Math.min(400,Math.floor(.5*n)))};let u=new Map,d=new WeakMap,l=globalThis.queueMicrotask||("undefined"!=typeof Promise?e=>Promise.resolve().then(e):e=>setTimeout(e,0));function g(e,n,t){var a;return n instanceof HTMLElement&&(null!=(a=(e=e.g.ca.ea[t]).O)&&a.includes(n.tagName)||3===t&&n.isContentEditable||null!=(a=e.J)&&a.some(e=>n.hasAttribute(e))||null!=(t=e.$)&&t.some(([e,t])=>n.getAttribute(e)===t)||null!=(a=e.K)&&a.some(e=>"string"==typeof n.className&&n.className.includes(e))||null!=(t=e.U)&&t.some(([e,t])=>window.getComputedStyle(n)[e]===t)||e.M&&n.hasAttribute("role")&&e.M.includes((null==(a=n.getAttribute("role"))?void 0:a.toLowerCase())||"")||null!=(a=null==(t=e.ya)?void 0:t.some(e=>null!==n.closest(e)))&&a)}function s(t,e){var n;for(t.l.delete(e),t.i.delete(e),e=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:e=>e instanceof HTMLElement&&(t.i.has(e)||t.l.has(e))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP});n=e.nextNode();)t.i.delete(n),t.l.delete(n)}function f(e,t){return t instanceof HTMLElement&&(e.i.has(t)||t.parentElement&&e.i.has(t.parentElement)||t instanceof HTMLSpanElement&&t.firstElementChild instanceof HTMLElement&&"STRONG"===t.firstElementChild.tagName)}function E(e,t){if(t instanceof Element&&e.i.has(t))return 1;for(t=t.parentElement;t;){if(e.i.has(t))return 1;t=t.parentElement}}function c(d,c){!c||g(d,c,0)||d.o.has(c)||l(()=>{let a=new Set,o=new Set,i=new WeakSet;for(var t,e,n,r,l,s,h,u=document.createTreeWalker(c,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode:e=>{var t,n;return!e||E(d,e)||e instanceof Element&&(t=e.parentElement)&&i.has(t)?NodeFilter.FILTER_REJECT:e.nodeType===Node.TEXT_NODE?!(t=e.parentElement)||i.has(t)||d.o.has(t)||g(d,t,0)||g(d,t,3)||g(d,t,2)||f(d,t)||!(e=null==(n=e.textContent)?void 0:n.trim())||/^[\s\u2026]+$/.test(e)?NodeFilter.FILTER_REJECT:(i.add(t),(m(t)?a:o).add(t),NodeFilter.FILTER_SKIP):e instanceof HTMLElement?g(d,e,0)||d.o.has(e)||g(d,e,3)||g(d,e,2)||f(d,e)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});u.nextNode(););0<a.size&&(u=Array.from(a).filter(e=>{for(e=e.parentElement;e;){if(a.has(e))return!1;e=e.parentElement}return!0}),d.F.push(...u),0!==(t=d).F.length)&&([n,r]=(e=(h=t.F).filter(e=>{return t=e,!h.some(e=>e.contains(t)&&e!==t);var t})).reduce(([e,t],n)=>((m(n)?e:t).push(n),[e,t]),[[],[]]),t.F=[],0<(e=((t,e)=>{if(e.length<=1)return e;e=e.map(p);let n=[],a=[];return e.sort((e,t)=>e.G-t.G),e.forEach(e=>{0===a.length||Math.abs(e.G-a[0].G)<=t.g.aa?a.push(e):(n.push(a.sort((e,t)=>e.H-t.H).map(e=>e.T)),a=[e])}),0<a.length&&n.push(a.sort((e,t)=>e.H-t.H).map(e=>e.T)),n.reduce((e,t)=>e.concat(t),[])})(t,n)).length&&(l=t,0!==(s=e).length)&&v(l,()=>{let a=0,o=()=>{for(var e,t=performance.now(),n=Math.min(a+l.g.da,s.length);a<n&&(m(e=s[a])?y(l,e):(l.l.add(e),l.v.observe(e)),a++,!(16<performance.now()-t)););a<s.length&&requestAnimationFrame(o)};l.S||(l.S=!0,requestAnimationFrame(()=>{o(),l.S=!1}))}),r.forEach(e=>{e instanceof HTMLElement&&!t.l.has(e)&&(t.l.add(e),t.v.observe(e))})),o.forEach(e=>{e instanceof HTMLElement&&!d.l.has(e)&&(d.l.add(e),d.v.observe(e))})})}function y(n,e){var t,a,o,i,r,l,s=n;if((r=e)instanceof HTMLElement&&!E(s,r)&&!g(s,r,0)&&!g(s,r,3)&&!g(s,r,1)&&!g(s,r,2)&&0<(l=r.textContent||"").trim().length&&/[a-zA-Z]/.test(l)&&Array.from(r.childNodes).some(e=>{var t;return e.nodeType===Node.TEXT_NODE&&(null==(t=e.textContent)?void 0:t.trim())&&!/^[\s\u2026]+$/.test(e.textContent)&&!E(s,e)})&&!n.o.has(e)){for(n.o.add(e),o=[],i=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);t=i.nextNode();)null==(a=t.textContent)||!a.trim()||E(n,t)||/^[\s\u2026]+$/.test(t.textContent)||!t.parentElement||g(n,t.parentElement,0)||o.push(t);o.forEach(e=>{var t=((r,s)=>{if(null==r||!r.trim())return document.createDocumentFragment();var e;if(/<\/?(?:strong|span)/.test(r))(e=document.createDocumentFragment()).appendChild(document.createTextNode(r));else{e=document.createDocumentFragment();let l=document.createElement("span"),t=(t=>{let n,a=[],o=null;n=[...t];for(let e=0;e<n.length;e++)/[a-zA-Z]/.test(n[e])?o?o.A=e+1:o={A:e+1,h:e}:o&&(/[a-zA-Z]{2,}/.test(t.slice(o.h,o.A))&&a.push(Object.assign({},o)),o=null);return o&&/[a-zA-Z]{2,}/.test(t.slice(o.h,o.A))&&a.push(o),a})(r).filter(({A:e,h:t})=>/^[a-zA-Z]+(?:[\s'][a-zA-Z]+)*$/.test(r.slice(t,e).trim()));if(0===t.length)l.appendChild(document.createTextNode(r));else{t.sort((e,t)=>e.h-t.h);let e=0;t.forEach(({A:o,h:i})=>{i>e&&l.append(r.slice(e,i)),(()=>{var e,t=[];let n="",a="";for(e of r.slice(i,o))" "===e||"\t"===e||"\n"===e||"\r"===e?(n&&(t.push(n),n=""),t.push(e)):(h(e)&&!h(a)&&n&&(t.push(n),n=""),n+=e,a=e);return n&&t.push(n),t})().forEach(e=>{var t,n,a,o,i,r;(t=(t=!e.trim())||1===(t=[...e]).length||t.every(h))||(n=s.j,0===(t=(t=e?(a=(t=null!=(a=d.get(n))?a:new Map).get(e))||(d.has(n)||d.set(n,t),a=n.P.has(e.toLowerCase()),o=e,i=n,i=void 0!==(r=u.get(o))?r:(o=o.toLowerCase().replace(/[^a-z]/g,"")).length<=3?1:void 0!==(r=i.R.get(o))?r:0===(r=(o.match(i.s.ua)||[]).length)?1:(r=(r-=(o.match(i.s.ra)||[]).length)+(o.match(i.s.Z)||[]).length,i.na.test(o)&&r++,i.s.oa.test(o)&&r--,i.s.pa.test(o)&&r--,i.s.qa.test(o)&&r--,u.size<1e4&&u.set(o,r),Math.max(1,r)),n={W:Math.min(n.ja,Math.min(o=e.length,a?n.B?Math.max(1,Math.ceil(o*n.m.ba*n.u)):0:1!==i||n.C?Math.max(1,o<=0||i<=0?Math.min(Math.ceil(.4*o),4):Math.ceil(o<=4?o*n.m.N.Y*n.u:o*(i<=1?o<=7?n.m.N.ka:n.m.N.ia:2===i?n.m.L.ta:3===i?n.m.L.sa:n.m.L.fa)*n.u*(8<o?1+.005*(o-8):1)*Math.max(.8,Math.min(1.2,2<i?1.1:1)))):0)),va:a,wa:i},t.size<1e4&&t.set(e,n),n):{W:0,va:!1,wa:0}).W))?l.append(e):(n=document.createElement("span"),(a=document.createElement("strong")).className="readify-bionic-salienced",a.textContent=e.slice(0,t),n.append(a),t<e.length&&((a=document.createElement("span")).className="readify-bionic-ignored",a.textContent=e.slice(t),n.append(a)),l.append(n))}),e=o}),e<r.length&&l.appendChild(document.createTextNode(r.slice(e)))}e.appendChild(l)}return e})(e.textContent,n.g);e.parentNode.replaceChild(t,e)}),n.i.add(e),n.o.delete(e)}}function v(e,t){e.I.push(t),e.D||l(()=>{return n=e,t=function*(){if(!n.D){for(n.D=!0;0<n.I.length;){yield new Promise(l);var e=n.I.shift();e&&e()}n.D=!1}}(),new Promise(function(n,a){!function e(t){t.done?n(t.value):Promise.resolve(t.value).then(o,i).then(e,a)}(t.next())});function o(e){return t.next(e)}function i(e){return t.throw(e)}var t,n})}i=class{constructor(e){this.g=a,this.D=this.S=!1,this.l=new WeakSet,this.i=new WeakSet,this.o=new Set,this.F=[],this.I=[],this.g.j.u=(null==e?void 0:e.u)||this.g.j.u,this.g.j.C=(null==e?void 0:e.C)||this.g.j.C,this.g.j.B=(null==e?void 0:e.B)||this.g.j.B;let t;null!=e&&null!=(t=e.P)&&t.forEach(e=>this.g.j.P.add(e));let n;var o;null!=e&&null!=(n=e.R)&&n.forEach((e,t)=>this.g.j.R.set(t,e)),(o=this).v=new IntersectionObserver(e=>e.forEach(e=>{e.isIntersecting&&e.target instanceof Element&&!o.i.has(e.target)&&(v(o,()=>y(o,e.target)),o.v.unobserve(e.target),o.l.delete(e.target))}),{rootMargin:o.g.ga,threshold:o.g.ha}),o.X=new MutationObserver(e=>{let a=new Set;e.forEach(e=>{var t,n=e.target;n&&!(n instanceof Element&&o.o.has(n)||n instanceof Element&&g(o,n,3)||n instanceof Element&&g(o,n,2))&&("childList"===e.type&&0<e.removedNodes.length&&e.removedNodes.forEach(e=>{e instanceof Element&&(s(o,e),o.v.unobserve(e))}),t=null,n instanceof Element?t=n:n.parentElement&&(t=n.parentElement),t)&&!a.has(t)&&(a.add(t),o.i.has(t)||v(o,()=>c(o,t)))})})}h(){c(this,document.body),this.X.observe(document.body,this.g.la.ma)}},t=class{constructor(e){var t,n,a,o=new CSSStyleSheet;for([t,n]of Object.entries({"readify-bionic-ignored":{opacity:".9"},"readify-bionic-salienced":{fontWeight:"bold!important"}}))o.insertRule(`.${t} { ${a=n,Object.entries(a).map(([e,t])=>e.replace(/[A-Z]/g,e=>"-"+e.toLowerCase())+`: ${t};`).join(" ")} }`);document.adoptedStyleSheets=[...document.adoptedStyleSheets,o],this.g=new i(e)}h(){this.g.h()}};let T=o=null;e=()=>{var e={B:!0,C:!0},e=o=o||new t(e);"loading"===document.readyState?document.addEventListener("DOMContentLoaded",e.h):e.h(),T=e},r=()=>{var e;null!=(e=T)&&((e=e.g).v.disconnect(),e.X.disconnect(),e.I=[],e.F=[],e.D=!1,s(e,document.body))};export{e as start,r as stop};