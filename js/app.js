/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/***/ (() => {



/***/ }),

/***/ "./src/js/project.js":
/*!***************************!*\
  !*** ./src/js/project.js ***!
  \***************************/
/***/ (() => {

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initProject();
  });
} else {
  initProject();
}
function initProject() {
  var project = document.querySelector('.projects');
  if (project.length <= 0) {
    return;
  }
  var container = project.querySelector('.content-projects');
  var swapy = Swapy.createSwapy(container);
  swapy.enable(true);
  console.log(swapy, container);
}

/***/ }),

/***/ "./src/js/transform-urls.js":
/*!**********************************!*\
  !*** ./src/js/transform-urls.js ***!
  \**********************************/
/***/ (() => {

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    transformUrls();
  });
} else {
  transformUrls();
}
function transformUrls() {
  var url_alternates = document.querySelectorAll('[data-alternate]');
  var currentUrl = window.location.pathname; // Get current page URL
  var langToggle = document.querySelector('.lang-toggle a');
  url_alternates.forEach(function (element) {
    if (currentUrl !== element.getAttribute('href')) {
      return;
    }
    langToggle.setAttribute('href', element.getAttribute('data-alternate'));
  });
}

/***/ }),

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/swapy/dist/swapy.min.js":
/*!**********************************************!*\
  !*** ./node_modules/swapy/dist/swapy.min.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
(function(N,j){typeof exports=="object"&&typeof module<"u"?j(exports):typeof define=="function"&&define.amd?define(["exports"],j):(N=typeof globalThis<"u"?globalThis:N||self,j(N.Swapy={}))})(undefined,function(N){"use strict";function j(t){return typeof t=="object"&&t!==null&&"x"in t&&"y"in t&&"unit"in t&&typeof t.unit=="string"&&typeof t.x=="object"&&typeof t.y=="object"&&"topLeft"in t.x&&"topRight"in t.x&&"bottomRight"in t.x&&"bottomLeft"in t.x&&"topLeft"in t.y&&"topRight"in t.y&&"bottomRight"in t.y&&"bottomLeft"in t.y}function lt(t){var h;const e=t.match(/(\d+(?:\.\d+)?)(px|%)/g);if(!e)return{x:{topLeft:0,topRight:0,bottomRight:0,bottomLeft:0},y:{topLeft:0,topRight:0,bottomRight:0,bottomLeft:0},unit:"px"};const n=e.map(c=>{const[s,f,m]=c.match(/(\d+(?:\.\d+)?)(px|%)/)??[];return{value:parseFloat(f),unit:m}}),o=((h=n[0])==null?void 0:h.unit)||"px";if(n.some(c=>c.unit!==o))throw new Error("Inconsistent units in border-radius string.");const[l,i,d,u]=n.map(c=>c.value),a={topLeft:l??0,topRight:i??l??0,bottomRight:d??l??0,bottomLeft:u??i??l??0};return{x:{...a},y:{...a},unit:o}}function rt({x:t,y:e,unit:n},o,l){if(n==="px"){const i={topLeft:t.topLeft/o,topRight:t.topRight/o,bottomLeft:t.bottomLeft/o,bottomRight:t.bottomRight/o},d={topLeft:e.topLeft/l,topRight:e.topRight/l,bottomLeft:e.bottomLeft/l,bottomRight:e.bottomRight/l};return{x:i,y:d,unit:"px"}}else if(n==="%")return{x:t,y:e,unit:"%"};return{x:t,y:e,unit:n}}function Z(t){return`
    ${t.x.topLeft}${t.unit} ${t.x.topRight}${t.unit} ${t.x.bottomRight}${t.unit} ${t.x.bottomLeft}${t.unit}
    /
    ${t.y.topLeft}${t.unit} ${t.y.topRight}${t.unit} ${t.y.bottomRight}${t.unit} ${t.y.bottomLeft}${t.unit}
  `}function it(t){return t.x.topLeft===0&&t.x.topRight===0&&t.x.bottomRight===0&&t.x.bottomLeft===0&&t.y.topLeft===0&&t.y.topRight===0&&t.y.bottomRight===0&&t.y.bottomLeft===0}function at(t){return typeof t=="object"&&"x"in t&&"y"in t}function R(t,e){return{x:t,y:e}}function xt(t,e){return R(t.x+e.x,t.y+e.y)}function vt(t,e){return R(t.x-e.x,t.y-e.y)}function It(t,e){return R(t.x*e,t.y*e)}function L(t,e,n){return t+(e-t)*n}function At(t,e,n){return xt(t,It(vt(e,t),n))}function st(t,e,n){return{x:{topLeft:L(t.x.topLeft,e.x.topLeft,n),topRight:L(t.x.topRight,e.x.topRight,n),bottomRight:L(t.x.bottomRight,e.x.bottomRight,n),bottomLeft:L(t.x.bottomLeft,e.x.bottomLeft,n)},y:{topLeft:L(t.y.topLeft,e.y.topLeft,n),topRight:L(t.y.topRight,e.y.topRight,n),bottomRight:L(t.y.bottomRight,e.y.bottomRight,n),bottomLeft:L(t.y.bottomLeft,e.y.bottomLeft,n)},unit:t.unit}}function Et(t,e,n){return W((n-t)/(e-t),0,1)}function K(t,e,n,o,l){return L(n,o,Et(t,e,l))}function W(t,e,n){return Math.min(Math.max(t,e),n)}const Tt={duration:350,easing:t=>t};function ct(t,e,n,o){let l=!1;const i=()=>{l=!0},d={...Tt,...o};let u;function a(h){u===void 0&&(u=h);const c=h-u,s=W(c/d.duration,0,1),f=Object.keys(t),m=Object.keys(e);if(!f.every(g=>m.includes(g))){console.error("animate Error: `from` keys are different than `to`");return}const v={};f.forEach(g=>{typeof t[g]=="number"&&typeof e[g]=="number"?v[g]=L(t[g],e[g],d.easing(s)):j(t[g])&&j(e[g])?v[g]=st(t[g],e[g],d.easing(s)):at(t[g])&&at(e[g])&&(v[g]=At(t[g],e[g],d.easing(s)))}),n(v,s>=1,s),s<1&&!l&&requestAnimationFrame(a)}return requestAnimationFrame(a),i}const Xt={startDelay:0,targetEl:null};function Mt(t,e){const n={...Xt,...e};let o=t.el(),l=!1,i=null,d=null,u=null,a=null,h=0,c=0,s=0,f=0,m=0,v=0,g=0,X=0,r=0,I=0,E=null,p;o.addEventListener("pointerdown",w),document.body.addEventListener("pointerup",x),document.body.addEventListener("pointermove",T),document.body.addEventListener("touchmove",M,{passive:!1});function w(y){if(n.targetEl&&y.target!==n.targetEl&&!n.targetEl.contains(y.target)||l||!y.isPrimary)return;n.startDelay>0?(u==null||u({el:y.target}),p=setTimeout(()=>{B()},n.startDelay)):B();function B(){E=y.target;const C=t.boundingRect(),V=t.layoutRect();m=V.x,v=V.y,s=C.x-m,f=C.y-v,h=y.clientX-s,c=y.clientY-f,g=y.clientX,X=y.clientY,r=(y.clientX-C.x)/C.width,I=(y.clientY-C.y)/C.height,l=!0,T(y)}}function A(){const y=t.layoutRect();h-=m-y.x,c-=v-y.y,m=y.x,v=y.y}function x(y){if(!l){p&&(clearTimeout(p),p=null,a==null||a({el:y.target}));return}if(!y.isPrimary)return;l=!1;const B=y.clientX-g,C=y.clientY-X;d==null||d({x:s,y:f,pointerX:y.clientX,pointerY:y.clientY,width:B,height:C,relativeX:r,relativeY:I,el:E}),E=null}function T(y){if(!l){p&&(clearTimeout(p),p=null,a==null||a({el:y.target}));return}if(!y.isPrimary)return;const B=y.clientX-g,C=y.clientY-X,V=s=y.clientX-h,nt=f=y.clientY-c;i==null||i({width:B,height:C,x:V,y:nt,pointerX:y.clientX,pointerY:y.clientY,relativeX:r,relativeY:I,el:E})}function M(y){if(!l)return!0;y.preventDefault()}function b(y){i=y}function H(y){d=y}function _(y){u=y}function P(y){a=y}function $(){o.removeEventListener("pointerdown",w),o=t.el(),o.addEventListener("pointerdown",w)}function q(){t.el().removeEventListener("pointerdown",w),document.body.removeEventListener("pointerup",x),document.body.removeEventListener("pointermove",T),document.body.removeEventListener("touchmove",M),i=null,d=null,u=null,a=null}return{onDrag:b,onDrop:H,onHold:_,onRelease:P,onElementUpdate:$,destroy:q,readjust:A}}function bt(t){return 1+2.70158*Math.pow(t-1,3)+1.70158*Math.pow(t-1,2)}function Dt(t){return 1-Math.pow(1-t,3)}function G(t){return{x:t.x,y:t.y,width:t.width,height:t.height}}function Lt(t){const e=t.getBoundingClientRect();let n=0,o=0,l=t.parentElement;for(;l;){const d=getComputedStyle(l).transform;if(d&&d!=="none"){const u=d.match(/matrix.*\((.+)\)/);if(u){const a=u[1].split(", ").map(Number);n+=a[4]||0,o+=a[5]||0}}l=l.parentElement}return{y:e.top-o,x:e.left-n,width:e.width,height:e.height}}function Q(t){let e=t,n=0,o=0;for(;e;)n+=e.offsetTop,o+=e.offsetLeft,e=e.offsetParent;return{x:o,y:n,width:t.offsetWidth,height:t.offsetHeight}}function ft(t,e){return t.x>=e.x&&t.x<=e.x+e.width&&t.y>=e.y&&t.y<=e.y+e.height}function Ct(t){let e=t,n=0,o=0;for(;e;){const l=i=>{const d=getComputedStyle(i);return/(auto|scroll)/.test(d.overflow+d.overflowY+d.overflowX)};if(e===document.body){o+=window.scrollX,n+=window.scrollY;break}l(e)&&(o+=e.scrollLeft,n+=e.scrollTop),e=e.parentElement}return{x:o,y:n}}function tt(t){let e="unread",n,o,l,i,d,u,a,h,c,s,f;function m(){n=t.currentTransform(),o=Lt(t.el()),l=Ct(t.el()),f=ut(t.el()).map(({parent:I,children:E})=>({parent:{el:I,initialRect:G(I.getBoundingClientRect())},children:E.filter(p=>p instanceof HTMLElement).map(p=>{const w=p;return w.originalBorderRadius||(w.originalBorderRadius=getComputedStyle(p).borderRadius),{el:p,borderRadius:lt(w.originalBorderRadius),initialRect:G(p.getBoundingClientRect())}})})),e="readInitial"}function v(){if(e!=="readInitial")throw new Error("FlipView: Cannot read final values before reading initial values");c=t.layoutRect(),u=o.width/c.width,a=o.height/c.height,i=o.x-c.x-n.dragX+l.x,d=o.y-c.y-n.dragY+l.y,h=rt(t.borderRadius(),u,a);const r=ut(t.el());f=f.map(({parent:E,children:p},w)=>{const A=r[w].parent;return{parent:{...E,el:A,finalRect:Q(A)},children:p.map((x,T)=>{const M=r[w].children[T];let b=Q(M);return M.hasAttribute("data-swapy-text")&&(b={...b,width:x.initialRect.width,height:x.initialRect.height}),{...x,el:M,finalRect:b}})}});const I={translateX:i,translateY:d,scaleX:u,scaleY:a};t.el().style.transformOrigin="0 0",t.el().style.borderRadius=Z(h),t.setTransform(I),s=[],f.forEach(({parent:E,children:p})=>{const w=p.map(({el:A,initialRect:x,finalRect:T,borderRadius:M})=>Yt(A,x,T,M,E.initialRect,E.finalRect));s.push(...w)}),e="readFinal"}function g(){if(e!=="readFinal")throw new Error("FlipView: Cannot get transition values before reading");return{from:{width:o.width,height:o.height,translate:R(i,d),scale:R(u,a),borderRadius:h},to:{width:c.width,height:c.height,translate:R(0,0),scale:R(1,1),borderRadius:t.borderRadius()}}}function X(){if(e!=="readFinal")throw new Error("FlipView: Cannot get children transition values before reading");return s}return{readInitial:m,readFinalAndReverse:v,transitionValues:g,childrenTransitionData:X}}function Yt(t,e,n,o,l,i){t.style.transformOrigin="0 0";const d=l.width/i.width,u=l.height/i.height,a=e.width/n.width,h=e.height/n.height,c=rt(o,a,h),s=e.x-l.x,f=n.x-i.x,m=e.y-l.y,v=n.y-i.y,g=(s-f*d)/d,X=(m-v*u)/u;return t.style.transform=`translate(${g}px, ${X}px) scale(${a/d}, ${h/u})`,t.style.borderRadius=Z(c),{el:t,fromTranslate:R(g,X),fromScale:R(a,h),fromBorderRadius:c,toBorderRadius:o,parentScale:{x:d,y:u}}}function ut(t){const e=[];function n(o){const l=Array.from(o.children).filter(i=>i instanceof HTMLElement);l.length>0&&(e.push({parent:o,children:l}),l.forEach(i=>n(i)))}return n(t),e}function dt(t){const e=[];let n=t,o={dragX:0,dragY:0,translateX:0,translateY:0,scaleX:1,scaleY:1};const l=lt(window.getComputedStyle(n).borderRadius),i={el:()=>n,setTransform:d,clearTransform:u,currentTransform:()=>o,borderRadius:()=>l,layoutRect:()=>Q(n),boundingRect:()=>G(n.getBoundingClientRect()),usePlugin:h,destroy:c,updateElement:s};function d(f){o={...o,...f},a()}function u(){o={dragX:0,dragY:0,translateX:0,translateY:0,scaleX:1,scaleY:1},a()}function a(){const{dragX:f,dragY:m,translateX:v,translateY:g,scaleX:X,scaleY:r}=o;f===0&&m===0&&v===0&&g===0&&X===1&&r===1?n.style.transform="":n.style.transform=`translate(${f+v}px, ${m+g}px) scale(${X}, ${r})`}function h(f,m){const v=f(i,m);return e.push(v),v}function c(){e.forEach(f=>f.destroy())}function s(f){if(!f)return;const m=n.hasAttribute("data-swapy-dragging"),v=n.style.cssText;n=f,m&&n.setAttribute("data-swapy-dragging",""),n.style.cssText=v,e.forEach(g=>g.onElementUpdate())}return i}function Rt(t,e,n){return n.map(o=>({slotId:o.slot,itemId:o.item,item:o.item===""?null:t.find(l=>o.item===l[e])}))}function Ht(t,e){return t.map(n=>({item:n[e],slot:n[e]}))}function $t(t,e,n,o,l,i=!1){const d=e.filter(h=>!o.some(c=>c.item===h[n])).map(h=>({slot:h[n],item:h[n]}));let u;i?u=o.map(h=>e.some(c=>c[n]===h.item)?h:{slot:h.slot,item:""}):u=o.filter(h=>e.some(c=>c[n]===h.item)||!h.item);const a=[...u,...d];l(a),(d.length>0||u.length!==o.length)&&requestAnimationFrame(()=>{t==null||t.update()})}const Bt=Object.freeze(Object.defineProperty({__proto__:null,dynamicSwapy:$t,initSlotItemMap:Ht,toSlottedItems:Rt},Symbol.toStringTag,{value:"Module"})),Ot={animation:"dynamic",enabled:!0,swapMode:"hover",dragOnHold:!1,autoScrollOnDrag:!1,dragAxis:"both",manualSwap:!1};function gt(t){switch(t){case"dynamic":return{easing:Dt,duration:300};case"spring":return{easing:bt,duration:350};case"none":return{easing:e=>e,duration:1}}}function _t(t,e){const n={...Ot,...e},o=Pt({slots:[],items:[],config:n});let l=[],i=[];d();function d(){if(!jt(t))throw new Error("Cannot create a Swapy instance because your HTML structure is invalid. Fix all above errors and then try!");l=Array.from(t.querySelectorAll("[data-swapy-slot]")).map(r=>Nt(r,o)),o.setSlots(l),i=Array.from(t.querySelectorAll("[data-swapy-item]")).map(r=>qt(r,o)),o.setItems(i),o.syncSlotItemMap(),i.forEach(r=>{r.onDrag(({pointerX:I,pointerY:E})=>{a();let p=!1;l.forEach(w=>{const A=w.rect();ft({x:I,y:E},A)&&(p=!0,w.isHighlighted()||w.highlight())}),!p&&o.config().swapMode==="drop"&&r.slot().highlight(),n.swapMode==="hover"&&u(r,{pointerX:I,pointerY:E})}),r.onDrop(({pointerX:I,pointerY:E})=>{h(),n.swapMode==="drop"&&u(r,{pointerX:I,pointerY:E})}),r.onHold(()=>{a()}),r.onRelease(()=>{h()})})}function u(r,{pointerX:I,pointerY:E}){l.forEach(p=>{const w=p.rect();if(ft({x:I,y:E},w)){if(r.id()===p.itemId())return;o.config().swapMode==="hover"&&r.setContinuousDrag(!0);const A=r.slot(),x=p.item();if(!o.eventHandlers().onBeforeSwap({fromSlot:A.id(),toSlot:p.id(),draggingItem:r.id(),swapWithItem:(x==null?void 0:x.id())||""}))return;if(o.config().manualSwap){const T=structuredClone(o.slotItemMap());o.swapItems(r,p);const M=o.slotItemMap(),b=tt(r.view());b.readInitial();const H=x?tt(x.view()):null;H==null||H.readInitial();let _=0,P=0;const $=J(r.view().el());$ instanceof Window?(_=$.scrollY,P=$.scrollX):(_=$.scrollTop,P=$.scrollLeft),o.eventHandlers().onSwap({oldSlotItemMap:T,newSlotItemMap:M,fromSlot:A.id(),toSlot:p.id(),draggingItem:r.id(),swappedWithItem:(x==null?void 0:x.id())||""}),requestAnimationFrame(()=>{const q=t.querySelectorAll("[data-swapy-item]");o.items().forEach(y=>{const B=Array.from(q).find(C=>C.dataset.swapyItem===y.id());y.view().updateElement(B)}),o.syncSlotItemMap(),b.readFinalAndReverse(),H==null||H.readFinalAndReverse(),et(r,b),x&&H&&et(x,H),$.scrollTo({left:P,top:_})})}else{let T=0,M=0;const b=J(r.view().el());b instanceof Window?(T=b.scrollY,M=b.scrollX):(T=b.scrollTop,M=b.scrollLeft),ht(r,p,!0),x&&ht(x,A),b.scrollTo({left:M,top:T});const H=o.slotItemMap();o.syncSlotItemMap();const _=o.slotItemMap();o.eventHandlers().onSwap({oldSlotItemMap:H,newSlotItemMap:_,fromSlot:A.id(),toSlot:p.id(),draggingItem:r.id(),swappedWithItem:(x==null?void 0:x.id())||""})}}})}function a(){t.querySelectorAll("img").forEach(r=>{r.style.pointerEvents="none"}),t.style.userSelect="none",t.style.webkitUserSelect="none"}function h(){t.querySelectorAll("img").forEach(r=>{r.style.pointerEvents=""}),t.style.userSelect="",t.style.webkitUserSelect=""}function c(r){o.config().enabled=r}function s(r){o.eventHandlers().onSwapStart=r}function f(r){o.eventHandlers().onSwap=r}function m(r){o.eventHandlers().onSwapEnd=r}function v(r){o.eventHandlers().onBeforeSwap=r}function g(){X(),requestAnimationFrame(()=>{d()})}function X(){i.forEach(r=>r.destroy()),l.forEach(r=>r.destroy()),o.destroy(),i=[],l=[]}return{enable:c,slotItemMap:()=>o.slotItemMap(),onSwapStart:s,onSwap:f,onSwapEnd:m,onBeforeSwap:v,update:g,destroy:X}}function Pt({slots:t,items:e,config:n}){const o={slots:t,items:e,config:n,slotItemMap:{asObject:{},asMap:new Map,asArray:[]},zIndexCount:1,eventHandlers:{onSwapStart:()=>{},onSwap:()=>{},onSwapEnd:()=>{},onBeforeSwap:()=>!0},scrollOffsetWhileDragging:{x:0,y:0},scrollHandler:null};let l={...o};const i=s=>{var f;(f=l.scrollHandler)==null||f.call(l,s)};window.addEventListener("scroll",i);function d(s){return l.slots.find(f=>f.id()===s)}function u(s){return l.items.find(f=>f.id()===s)}function a(){const s={},f=new Map,m=[];l.slots.forEach(v=>{var r;const g=v.id(),X=((r=v.item())==null?void 0:r.id())||"";s[g]=X,f.set(g,X),m.push({slot:g,item:X})}),l.slotItemMap={asObject:s,asMap:f,asArray:m}}function h(s,f){var p;const m=l.slotItemMap,v=s.id(),g=((p=f.item())==null?void 0:p.id())||"",X=f.id(),r=s.slot().id();m.asObject[X]=v,m.asObject[r]=g,m.asMap.set(X,v),m.asMap.set(r,g);const I=m.asArray.findIndex(w=>w.slot===X),E=m.asArray.findIndex(w=>w.slot===r);m.asArray[I].item=v,m.asArray[E].item=g}function c(){window.removeEventListener("scroll",i),l={...o}}return{slots:()=>l.slots,items:()=>l.items,config:()=>n,setItems:s=>l.items=s,setSlots:s=>l.slots=s,slotById:d,itemById:u,zIndex:(s=!1)=>s?++l.zIndexCount:l.zIndexCount,resetZIndex:()=>{l.zIndexCount=1},eventHandlers:()=>l.eventHandlers,syncSlotItemMap:a,slotItemMap:(s=!1)=>s?structuredClone(l.slotItemMap):l.slotItemMap,onScroll:s=>{l.scrollHandler=s},swapItems:h,destroy:c}}function Nt(t,e){const n=dt(t);function o(){return n.el().dataset.swapySlot}function l(){const c=n.el().children[0];return(c==null?void 0:c.dataset.swapyItem)||null}function i(){return G(n.el().getBoundingClientRect())}function d(){const c=n.el().children[0];if(c)return e.itemById(c.dataset.swapyItem)}function u(){e.slots().forEach(c=>{c.view().el().removeAttribute("data-swapy-highlighted")})}function a(){u(),n.el().setAttribute("data-swapy-highlighted","")}function h(){}return{id:o,view:()=>n,itemId:l,rect:i,item:d,highlight:a,unhighlightAllSlots:u,isHighlighted:()=>n.el().hasAttribute("data-swapy-highlighted"),destroy:h}}function qt(t,e){const n=dt(t),o={};let l=null,i=null,d=!1,u=!0,a;const h=Ft();let c=()=>{},s=()=>{},f=()=>{},m=()=>{};const{onDrag:v,onDrop:g,onHold:X,onRelease:r}=n.usePlugin(Mt,{startDelay:e.config().dragOnHold?400:0,targetEl:P()}),I=R(0,0),E=R(0,0),p=R(0,0),w=R(0,0);let A=null,x=null;X(S=>{e.config().enabled&&(q()&&!$(S.el)||C()&&B(S.el)||f==null||f(S))}),r(S=>{e.config().enabled&&(q()&&!$(S.el)||C()&&B(S.el)||m==null||m(S))});function T(S){var F;V(),ot().highlight(),(F=o.drop)==null||F.call(o);const Y=e.slots().map(O=>O.view().boundingRect());e.slots().forEach((O,z)=>{const U=Y[z];O.view().el().style.width=`${U.width}px`,O.view().el().style.maxWidth=`${U.width}px`,O.view().el().style.flexShrink="0",O.view().el().style.height=`${U.height}px`});const D=e.slotItemMap(!0);e.eventHandlers().onSwapStart({draggingItem:mt(),fromSlot:wt(),slotItemMap:D}),i=D,n.el().style.position="relative",n.el().style.zIndex=`${e.zIndex(!0)}`,A=J(S.el),e.config().autoScrollOnDrag&&(l=kt(A,e.config().dragAxis),l.updatePointer({x:S.pointerX,y:S.pointerY})),I.x=window.scrollX,I.y=window.scrollY,p.x=0,p.y=0,A instanceof HTMLElement&&(E.x=A.scrollLeft,E.y=A.scrollTop,x=()=>{w.x=A.scrollLeft-E.x,w.y=A.scrollTop-E.y,n.setTransform({dragX:((a==null?void 0:a.width)||0)+p.x+w.x,dragY:((a==null?void 0:a.height)||0)+p.y+w.y})},A.addEventListener("scroll",x)),e.onScroll(()=>{p.x=window.scrollX-I.x,p.y=window.scrollY-I.y;const O=w.x||0,z=w.y||0;n.setTransform({dragX:((a==null?void 0:a.width)||0)+p.x+O,dragY:((a==null?void 0:a.height)||0)+p.y+z})})}v(S=>{var Y;if(e.config().enabled){if(!d){if(q()&&!$(S.el)||C()&&B(S.el))return;T(S)}d=!0,l&&l.updatePointer({x:S.pointerX,y:S.pointerY}),a=S,(Y=o.drop)==null||Y.call(o),h(()=>{n.el().style.position="relative";const D=S.width+p.x+w.x,F=S.height+p.y+w.y;e.config().dragAxis==="y"?n.setTransform({dragY:F}):e.config().dragAxis==="x"?n.setTransform({dragX:D}):n.setTransform({dragX:D,dragY:F}),c==null||c(S)})}}),g(S=>{if(!d)return;nt(),d=!1,u=!1,a=null,A&&(A.removeEventListener("scroll",x),x=null),A=null,w.x=0,w.y=0,p.x=0,p.y=0,l&&(l.destroy(),l=null),ot().unhighlightAllSlots(),s==null||s(S),e.eventHandlers().onSwapEnd({slotItemMap:e.slotItemMap(),hasChanged:i!=null&&i.asMap?!Wt(i==null?void 0:i.asMap,e.slotItemMap().asMap):!1}),i=null,e.onScroll(null),e.slots().forEach(D=>{D.view().el().style.width="",D.view().el().style.maxWidth="",D.view().el().style.flexShrink="",D.view().el().style.height=""}),e.config().manualSwap&&e.config().swapMode==="drop"?requestAnimationFrame(Y):Y();function Y(){const D=n.currentTransform(),F=D.dragX+D.translateX,O=D.dragY+D.translateY;o.drop=ct({translate:R(F,O)},{translate:R(0,0)},({translate:z},U)=>{U?d||(n.clearTransform(),n.el().style.transformOrigin=""):n.setTransform({dragX:0,dragY:0,translateX:z.x,translateY:z.y}),U&&(e.items().forEach(St=>{St.isDragging()||(St.view().el().style.zIndex="")}),e.resetZIndex(),n.el().style.position="",u=!0)},gt(e.config().animation))}});function M(S){c=S}function b(S){s=S}function H(S){f=S}function _(S){m=S}function P(){return n.el().querySelector("[data-swapy-handle]")}function $(S){const Y=P();return Y?Y===S||Y.contains(S):!1}function q(){return P()!==null}function y(){return Array.from(n.el().querySelectorAll("[data-swapy-no-drag]"))}function B(S){const Y=y();return!Y||Y.length===0?!1:Y.includes(S)||Y.some(D=>D.contains(S))}function C(){return y().length>0}function V(){n.el().setAttribute("data-swapy-dragging","")}function nt(){n.el().removeAttribute("data-swapy-dragging")}function Vt(){c=null,s=null,f=null,m=null,a=null,i=null,l&&(l.destroy(),l=null),A&&x&&A.removeEventListener("scroll",x),n.destroy()}function mt(){return n.el().dataset.swapyItem}function ot(){return e.slotById(n.el().parentElement.dataset.swapySlot)}function wt(){return n.el().parentElement.dataset.swapySlot}return{id:mt,view:()=>n,slot:ot,slotId:wt,onDrag:M,onDrop:b,onHold:H,onRelease:_,destroy:Vt,isDragging:()=>d,cancelAnimation:()=>o,dragEvent:()=>a,store:()=>e,continuousDrag:()=>u,setContinuousDrag:S=>u=S}}function ht(t,e,n=!1){if(n){const l=e.item();l&&(e.view().el().style.position="relative",l.view().el().style.position="absolute")}else{const l=t.slot();l.view().el().style.position="",t.view().el().style.position=""}if(!t)return;const o=tt(t.view());o.readInitial(),e.view().el().appendChild(t.view().el()),o.readFinalAndReverse(),et(t,o)}function Ft(){let t=!1;return e=>{t||(t=!0,requestAnimationFrame(()=>{e(),t=!1}))}}function et(t,e){var u,a,h,c;(a=(u=t.cancelAnimation()).moveToSlot)==null||a.call(u),(c=(h=t.cancelAnimation()).drop)==null||c.call(h);const n=gt(t.store().config().animation),o=e.transitionValues();let l=t.view().currentTransform(),i=0,d=!1;t.cancelAnimation().moveToSlot=ct({translate:o.from.translate,scale:o.from.scale,borderRadius:o.from.borderRadius},{translate:o.to.translate,scale:o.to.scale,borderRadius:o.to.borderRadius},({translate:s,scale:f,borderRadius:m},v,g)=>{if(t.isDragging()){i!==0&&(d=!0);const r=t.dragEvent().relativeX,I=t.dragEvent().relativeY;t.continuousDrag()?t.view().setTransform({translateX:L(l.translateX,l.translateX+(o.from.width-o.to.width)*r,n.easing(g-i)),translateY:L(l.translateY,l.translateY+(o.from.height-o.to.height)*I,n.easing(g-i)),scaleX:f.x,scaleY:f.y}):t.view().setTransform({scaleX:f.x,scaleY:f.y})}else l=t.view().currentTransform(),i=g,d?t.view().setTransform({scaleX:f.x,scaleY:f.y}):t.view().setTransform({dragX:0,dragY:0,translateX:s.x,translateY:s.y,scaleX:f.x,scaleY:f.y});const X=e.childrenTransitionData();X.forEach(({el:r,fromTranslate:I,fromScale:E,fromBorderRadius:p,toBorderRadius:w,parentScale:A})=>{const x=L(A.x,1,n.easing(g)),T=L(A.y,1,n.easing(g));r.style.transform=`translate(${I.x+(0-I.x/x)*n.easing(g)}px, ${I.y+(0-I.y/T)*n.easing(g)}px) scale(${L(E.x/x,1/x,n.easing(g))}, ${L(E.y/T,1/T,n.easing(g))})`,it(p)||(r.style.borderRadius=Z(st(p,w,n.easing(g))))}),it(m)||(t.view().el().style.borderRadius=Z(m)),v&&(t.isDragging()||(t.view().el().style.transformOrigin="",t.view().clearTransform()),t.view().el().style.borderRadius="",X.forEach(({el:r})=>{r.style.transform="",r.style.transformOrigin="",r.style.borderRadius=""}))},n)}function k(...t){console.error("Swapy Error:",...t)}function jt(t){const e=t;let n=!0;const o=e.querySelectorAll("[data-swapy-slot]");e||(k("container passed to createSwapy() is undefined or null"),n=!1),o.forEach(u=>{const a=u,h=a.dataset.swapySlot,c=a.children,s=c[0];(!h||h.length===0)&&(k(a,"does not contain a slotId using data-swapy-slot"),n=!1),c.length>1&&(k("slot:",`"${h}"`,"cannot contain more than one element"),n=!1),s&&(!s.dataset.swapyItem||s.dataset.swapyItem.length===0)&&(k("slot",`"${h}"`,"does not contain an element with an item id using data-swapy-item"),n=!1)});const l=Array.from(o).map(u=>u.dataset.swapySlot),i=e.querySelectorAll("[data-swapy-item]"),d=Array.from(i).map(u=>u.dataset.swapyItem);if(pt(l)){const u=yt(l);k("your container has duplicate slot ids",`(${u.join(", ")})`),n=!1}if(pt(d)){const u=yt(d);k("your container has duplicate item ids",`(${u.join(", ")})`),n=!1}return n}function pt(t){return new Set(t).size!==t.length}function yt(t){const e=new Set,n=new Set;for(const o of t)e.has(o)?n.add(o):e.add(o);return Array.from(n)}function Wt(t,e){if(t.size!==e.size)return!1;for(const[n,o]of t)if(e.get(n)!==o)return!1;return!0}function J(t){let e=t;for(;e;){const n=window.getComputedStyle(e),o=n.overflowY,l=n.overflowX;if((o==="auto"||o==="scroll")&&e.scrollHeight>e.clientHeight||(l==="auto"||l==="scroll")&&e.scrollWidth>e.clientWidth)return e;e=e.parentElement}return window}function kt(t,e){let l=!1,i,d=0,u=0,a=0,h=0,c=0,s=0,f=null;t instanceof HTMLElement?(i=G(t.getBoundingClientRect()),d=t.scrollHeight-i.height,u=t.scrollWidth-i.width):(i={x:0,y:0,width:window.innerWidth,height:window.innerHeight},d=document.documentElement.scrollHeight-window.innerHeight,u=document.documentElement.scrollWidth-window.innerWidth);function m(){t instanceof HTMLElement?(a=t.scrollTop,h=t.scrollLeft):(a=window.scrollY,h=window.scrollX)}function v(r){l=!1;const I=i.y,E=i.y+i.height,p=i.x,w=i.x+i.width,A=Math.abs(I-r.y)<Math.abs(E-r.y),x=Math.abs(p-r.x)<Math.abs(w-r.x);if(m(),e!=="x")if(A){const T=I-r.y;if(T>=-100){const M=W(T,-100,0);c=-K(-100,0,0,5,M),l=!0}}else{const T=E-r.y;if(T<=100){const M=W(T,0,100);c=K(100,0,0,5,M),l=!0}}if(e!=="y")if(x){const T=p-r.x;if(T>=-100){const M=W(T,-100,0);s=-K(-100,0,0,5,M),l=!0}}else{const T=w-r.x;if(T<=100){const M=W(T,0,100);s=K(100,0,0,5,M),l=!0}}l&&(f&&cancelAnimationFrame(f),g())}function g(){m(),e!=="x"&&(c=a+c>=d?0:c),e!=="y"&&(s=h+s>=u?0:s),t.scrollBy({top:c,left:s}),l&&(f=requestAnimationFrame(g))}function X(){l=!1}return{updatePointer:v,destroy:X}}N.createSwapy=_t,N.getClosestScrollableContainer=J,N.utils=Bt,Object.defineProperty(N,Symbol.toStringTag,{value:"Module"})});


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/dist/js/app": 0,
/******/ 			"dist/css/main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkirving_frias_github_io"] = self["webpackChunkirving_frias_github_io"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["dist/css/main"], () => (__webpack_require__("./node_modules/swapy/dist/swapy.min.js")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/main"], () => (__webpack_require__("./src/js/project.js")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/main"], () => (__webpack_require__("./src/js/transform-urls.js")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/main"], () => (__webpack_require__("./src/js/main.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["dist/css/main"], () => (__webpack_require__("./src/scss/main.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;