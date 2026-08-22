function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,_=g?g.emptyScript:"",f=m.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},w=(t,e)=>!c(t,e),v={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??w)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[y("elementProperties")]=new Map,$[y("finalized")]=new Map,f?.({ReactiveElement:$}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k=globalThis,x=t=>t,C=k.trustedTypes,A=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,P="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+S,j=`<${E}>`,M=document,z=()=>M.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,O="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,I=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,B=/"/g,V=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),F=new WeakMap,K=M.createTreeWalker(M,129);function G(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===R?"!--"===c[1]?r=U:void 0!==c[1]?r=H:void 0!==c[2]?(V.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=I):void 0!==c[3]&&(r=I):r===I?">"===c[0]?(r=o??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?I:'"'===c[3]?B:N):r===B||r===N?r=I:r===U||r===H?r=R:(r=I,o=void 0);const d=r===I&&t[e+1].startsWith("/>")?" ":"";n+=r===R?i+j:l>=0?(s.push(a),i.slice(0,l)+P+i.slice(l)+S+d):i+S+(-2===l?e:d)}return[G(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[c,l]=J(t,e);if(this.el=Z.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(P)){const e=l[n++],i=s.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(V.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],z()),K.nextNode(),a.push({type:2,index:++o});s.append(t[e],z())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:o}),t+=S.length-1}o++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=D(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);K.currentNode=s;let o=K.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Y(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=K.nextNode(),n++)}return K.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),D(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==L&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Z(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Y(this.O(z()),this.O(z()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=L}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=Q(this,t,e,0),n=!D(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Q(this,s[i+r],e,r),a===q&&(a=this._$AH[r]),n||=!D(a)||a!==this._$AH[r],a===L?t=L:t!==L&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==L)}}class st extends tt{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??L)===q)return;const i=this._$AH,s=t===L&&i!==L||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==L&&(i===L||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=k.litHtmlPolyfillSupport;nt?.(Z,Y),(k.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Y(e.insertBefore(z(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:w},dt=(t=ht,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return pt({...t,state:!0,attribute:!1})}class mt extends at{}t([pt({attribute:!1})],mt.prototype,"hass",void 0);const gt="chores-manager-daily-card",_t="chores-manager-overview-card",ft="chores-manager-correction-card",yt=new Set(["unknown","unavailable"]);function bt(t,e){return t.attributes[e]}function wt(t,e){const i=Number(bt(t,e));return Number.isFinite(i)?i:0}function vt(t){const e=new Map;for(const i of Object.values(t.states)){const t=bt(i,"child_id");if(!t)continue;const s=bt(i,"kid_name")??bt(i,"child_name");s?.trim()?e.set(t,s):e.has(t)||e.set(t,t)}return[...e.entries()].map(([t,e])=>({id:t,name:e})).sort((t,e)=>t.name.localeCompare(e.name))}function $t(t,e){const i=e.child_entity?t.states[e.child_entity]:void 0;return e.child_id??(i?bt(i,"child_id"):void 0)}function kt(t,e){return vt(t).find(t=>t.id===e)?.name}function xt(t,e){return Object.entries(t.states).filter(([t,i])=>t.startsWith("switch.")&&!yt.has(i.state)&&bt(i,"child_id")===e&&"string"==typeof bt(i,"assignment_id")).map(([t,i])=>({assignmentId:bt(i,"assignment_id")??t,entityId:t,childId:e,title:bt(i,"title")??bt(i,"friendly_name")??t,category:bt(i,"category")??"Other",points:wt(i,"points"),icon:bt(i,"icon")??"mdi:checkbox-marked-circle-outline",sortOrder:wt(i,"sort_order"),completed:"on"===i.state})).sort((t,e)=>t.category.localeCompare(e.category)||t.sortOrder-e.sortOrder||t.title.localeCompare(e.title))}function Ct(t,e,i){const s=(i?t.states[i]:void 0)??Object.entries(t.states).find(([t,i])=>t.startsWith("sensor.")&&bt(i,"child_id")===e)?.[1];if(!s||yt.has(s.state))return;const o=Number(s.state);return Number.isFinite(o)?o:void 0}function At(t,e,i){const s=(i?t.states[i]:void 0)??Object.entries(t.states).find(([t,i])=>t.startsWith("sensor.")&&bt(i,"child_id")===e)?.[1],o=s?bt(s,"week_start"):void 0;return"string"==typeof o?o:void 0}function Pt(t,e){const i=e?t.states[e]:void 0;return i?bt(i,"entity_picture"):void 0}const St={en:{chores:"Chores",completed:"Goal reached",no_chores:"No available chores.",points:"points",remaining:"remaining for",rewards:"Points & rewards",how_points_work:"How points work",reward_levels:"Rewards",daily:"Chores",history:"History",correction:"Correction",previous_week:"Previous week",adjust_points:"Adjust points",adjustment_amount:"Amount",adjustment_reason:"Reason (optional)",add_points:"Add points",subtract_points:"Subtract points",adjustment_error:"The point adjustment could not be saved.",weekly_points_error:"Weekly totals could not be loaded.",correction_error:"Correction data could not be loaded.",correction_child_not_found:"This child no longer exists. Select an available child in the card editor.",previous_date:"Previous date",next_date:"Next date",choose_date:"Choose date",close:"Close",back:"Back",correct_chores:"Correct chores",adjust:"Adjust",show:"View",add_completion:"Add completion",remove_completion:"Remove completion"},sv:{chores:"Sysslor",completed:"Målet är uppnått",no_chores:"Inga tillgängliga sysslor.",points:"poäng",remaining:"kvar till",rewards:"Poäng & belöningar",how_points_work:"Så fungerar poängen",reward_levels:"Belöningar",daily:"Sysslor",history:"Historik",correction:"Korrigering",previous_week:"Förra veckan",adjust_points:"Justera poäng",adjustment_amount:"Antal",adjustment_reason:"Orsak (valfri)",add_points:"Lägg till poäng",subtract_points:"Dra av poäng",adjustment_error:"Poängjusteringen kunde inte sparas.",weekly_points_error:"Veckopoängen kunde inte hämtas.",correction_error:"Korrigeringsdata kunde inte hämtas.",correction_child_not_found:"Barnet finns inte längre. Välj ett tillgängligt barn i kortets redigerare.",previous_date:"Föregående datum",next_date:"Nästa datum",choose_date:"Välj datum",close:"Stäng",back:"Tillbaka",correct_chores:"Korrigera sysslor",adjust:"Justera",show:"Visa",add_completion:"Lägg till genomförd syssla",remove_completion:"Ta bort genomförd syssla"}};function Et(t,e){return"en"===t||"sv"===t?t:e?.language?.toLowerCase().startsWith("sv")?"sv":"en"}function jt(t,e,i){return St[Et(e,i)][t]}let Mt=class extends mt{constructor(){super(...arguments),this.pendingCompletions=new Map}static getConfigElement(){return document.createElement("chores-manager-daily-card-editor")}static getStubConfig(){return{child_id:"kid_1",locale:"auto"}}setConfig(t){if(!t?.child_id?.trim()&&!t?.child_entity?.trim())throw new Error("child_id or child_entity is required");this.config={locale:"auto",show_border:!0,show_header:!0,show_person:!0,show_points:!0,...t},this.requestUpdate()}getCardSize(){return 4}render(){if(!this.hass||!this.config)return L;const t=$t(this.hass,this.config);if(!t)return L;const e=xt(this.hass,t),i=function(t){return t.reduce((t,e)=>{const i=t.get(e.category)??[];return i.push(e),t.set(e.category,i),t},new Map)}(e.map(t=>({...t,completed:this.pendingCompletions.get(t.entityId)??t.completed}))),s=Ct(this.hass,t,this.config.weekly_points_entity??this.config.child_entity),o=void 0===s?void 0:s+e.reduce((t,e)=>{const i=this.pendingCompletions.get(e.entityId)??e.completed;return i===e.completed?t:t+(i?e.points:-e.points)},0),n=Pt(this.hass,this.config.person_entity),r=this.config.name??this.config.title??kt(this.hass,t)??jt("chores",this.config.locale,this.hass);return W`
      <ha-card class=${!1===this.config.show_border?"borderless":""}>
        ${!1!==this.config.show_header?W`
              <header>
                ${!1!==this.config.show_person?n?W`<img class="portrait" src=${n} alt="" />`:W`<ha-icon class="portrait-icon" icon="mdi:account-circle"></ha-icon>`:L}
                <div>
                  <h1>${r}</h1>
                  ${!1!==this.config.show_points&&void 0!==o?W`<p data-weekly-points>${o} ${jt("points",this.config.locale,this.hass)}</p>`:L}
                </div>
              </header>
            `:L}
        ${this.error?W`<p class="error" role="alert">${this.error}</p>`:L}
        ${0===i.size?W`<p class="empty">${jt("no_chores",this.config.locale,this.hass)}</p>`:[...i.entries()].map(([t,e])=>this.renderGroup(t,e))}
      </ha-card>
    `}willUpdate(t){t.has("hass")&&this.reconcilePendingCompletions()}renderGroup(t,e){return W`
      <section>
        <h2>${t}</h2>
        ${e.map(t=>W`
            <button
              class="chore ${t.completed?"completed":""}"
              data-entity-id=${t.entityId}
              ?disabled=${this.pendingCompletions.has(t.entityId)}
              @click=${()=>this.toggleAssignment(t)}
            >
              <ha-icon icon=${t.icon}></ha-icon>
              <span class="title">${t.title}</span>
              ${!1!==this.config?.show_points?W`<span class="points">${t.points}p</span>`:L}
              <ha-icon
                class="check"
                icon=${t.completed?"mdi:check-circle":"mdi:circle-outline"}
              ></ha-icon>
            </button>
          `)}
      </section>
    `}async toggleAssignment(t){if(!this.hass||this.pendingCompletions.has(t.entityId))return;const e=!t.completed;this.pendingCompletions=new Map(this.pendingCompletions).set(t.entityId,e),this.error=void 0;try{await this.hass.callService("switch",e?"turn_on":"turn_off",{entity_id:t.entityId}),this.reconcilePendingCompletions()}catch(e){const i=new Map(this.pendingCompletions);i.delete(t.entityId),this.pendingCompletions=i,this.error=e instanceof Error?e.message:"Unable to update chore"}}reconcilePendingCompletions(){if(!this.hass||!this.pendingCompletions.size)return;const t=new Map(this.pendingCompletions);for(const[e,i]of t){const s=this.hass.states[e]?.state;(i&&"on"===s||!i&&"off"===s)&&t.delete(e)}t.size!==this.pendingCompletions.size&&(this.pendingCompletions=t)}static{this.styles=r`
    :host { display: block; }
    ha-card.borderless { border: 0; }
    ha-card { padding: 20px; }
    header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .portrait { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
    .portrait-icon { --mdc-icon-size: 52px; color: var(--state-icon-color); }
    h1, h2, p { margin: 0; }
    h1 { font-size: 20px; font-weight: 600; }
    header p, .points { color: var(--secondary-text-color); }
    section + section { margin-top: 18px; }
    h2 { font-size: 15px; margin-bottom: 6px; color: var(--secondary-text-color); }
    .chore { width: 100%; min-height: 48px; display: grid; grid-template-columns: 28px minmax(0, 1fr) auto 28px; align-items: center; gap: 8px; text-align: left; border: 0; background: transparent; color: var(--primary-text-color); cursor: pointer; font: inherit; }
    .chore:not(:disabled):hover { background: var(--secondary-background-color); }
    .chore:disabled { opacity: 0.55; cursor: progress; }
    .chore > ha-icon { color: var(--state-icon-color); }
    .title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .points { font-size: 13px; }
    .completed .title { text-decoration: line-through; color: var(--secondary-text-color); }
    .completed .check { color: var(--success-color, #34c759); }
    .error { color: var(--error-color); margin-bottom: 12px; }
    .empty { color: var(--secondary-text-color); }
  `}};t([ut()],Mt.prototype,"error",void 0),t([ut()],Mt.prototype,"pendingCompletions",void 0),Mt=t([lt(gt)],Mt);let zt=class extends mt{constructor(){super(...arguments),this.dateInputReady=Boolean(customElements.get("ha-date-input")),this.goBack=()=>history.back(),this.close=()=>{location.hash?location.hash="":history.back()}}static getConfigElement(){return document.createElement("chores-manager-correction-card-editor")}static getStubConfig(t){return{child_id:t?vt(t)[0]?.id??"kid_1":"kid_1",locale:"auto",show_border:!0,show_header:!0}}connectedCallback(){super.connectedCallback(),this.loadDateInput()}setConfig(t){if(!t?.child_id?.trim())throw new Error("child_id is required");this.config={locale:"auto",show_border:!0,show_header:!0,...t},this.load(),this.requestUpdate()}willUpdate(){this.load()}getCardSize(){return 9}render(){if(!this.hass||!this.config)return L;const t=this.inventory?.children.find(t=>t.child_id===this.config?.child_id),e=this.config.name??t?.name??this.config.child_id,i=Pt(this.hass,this.config.person_entity);return W`
      <ha-card class=${!1===this.config.show_border?"borderless":""}>
        ${!1!==this.config.show_header?W`
              <header>
                ${i?W`<img class="portrait" src=${i} alt="" />`:W`<ha-icon class="portrait-icon" icon="mdi:account-circle"></ha-icon>`}
                <strong class="title">${jt("correct_chores",this.config.locale,this.hass)} - ${e}</strong>
                <span class="header-points">${this.weeklyPoints?.current_week.points??0}p</span>
                <button class="header-button" aria-label=${jt("back",this.config.locale,this.hass)} @click=${this.goBack}>
                  <ha-icon icon="mdi:arrow-left"></ha-icon>
                </button>
                <button class="header-button" aria-label=${jt("close",this.config.locale,this.hass)} @click=${this.close}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </header>
            `:L}
        ${this.error?W`<p class="error" role="alert">${jt("child_not_found"===this.error?"correction_child_not_found":"correction_error",this.config.locale,this.hass)}</p>`:this.history&&this.inventory&&this.selectedDate?W`
                ${this.renderDateNavigation()}
                <div class="groups">${this.renderGroups()}</div>
              `:L}
      </ha-card>
    `}renderDateNavigation(){const t=Et(this.config?.locale,this.hass),e=new Date(`${this.selectedDate}T12:00:00`),i=new Intl.DateTimeFormat("sv"===t?"sv-SE":"en-US",{weekday:"short",day:"numeric",month:"short"}).format(e),s=this.selectedDate===this.history?.window.start,o=this.selectedDate===this.history?.window.end;return W`
      <section class="date-navigation">
        <h1>${i}</h1>
        <div class="date-actions">
          <button ?disabled=${s} aria-label=${jt("previous_date",this.config?.locale,this.hass)} @click=${()=>this.shiftDate(-1)}>
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button ?disabled=${o} aria-label=${jt("next_date",this.config?.locale,this.hass)} @click=${()=>this.shiftDate(1)}>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <div
            class=${this.dateInputReady?"date-picker":"date-picker loading"}
            aria-busy=${this.dateInputReady?"false":"true"}
          >
            <ha-icon icon="mdi:calendar"></ha-icon>
            <ha-date-input
              .label=${jt("choose_date",this.config?.locale,this.hass)}
              .locale=${this.dateInputLocale()}
              .min=${this.history?.window.start??""}
              .max=${this.history?.window.end??""}
              .value=${this.selectedDate??""}
              @change=${this.chooseDate}
            ></ha-date-input>
          </div>
        </div>
      </section>
    `}renderGroups(){const t=new Map;for(const e of this.rows()){const i=t.get(e.chore.category)??[];i.push(e),t.set(e.chore.category,i)}return[...t].map(([t,e])=>W`
        <section class="group">
          <h2>${t}</h2>
          ${e.map(t=>this.renderRow(t))}
        </section>
      `)}renderRow(t){const e=this.pendingAssignment===t.assignment.assignment_id,i=t.completed?jt("remove_completion",this.config?.locale,this.hass):jt("add_completion",this.config?.locale,this.hass);return W`
      <div class="chore-row">
        <ha-icon class="chore-icon" icon=${t.chore.icon}></ha-icon>
        <div class="chore-copy">
          <strong>${t.chore.title}</strong>
          <span>${t.chore.points}p</span>
        </div>
        <button class=${t.completed?"remove":"add"} ?disabled=${e} aria-label=${`${i}: ${t.chore.title}`} @click=${()=>this.setCompletion(t,!t.completed)}>
          <ha-icon icon=${t.completed?"mdi:minus":"mdi:plus"}></ha-icon>
        </button>
      </div>
    `}rows(){if(!(this.inventory&&this.history&&this.config&&this.selectedDate))return[];const t=new Map(this.inventory.chores.map(t=>[t.chore_id,t])),e=new Set(this.history.completions.filter(t=>t.child_id===this.config?.child_id&&t.local_date===this.selectedDate).map(t=>t.assignment_id));return this.inventory.assignments.filter(t=>t.child_id===this.config?.child_id).flatMap(i=>{const s=t.get(i.chore_id);return s?[{assignment:i,chore:s,completed:e.has(i.assignment_id)}]:[]}).sort((t,e)=>t.chore.sort_order-e.chore.sort_order||t.chore.title.localeCompare(e.chore.title))}load(){const t=this.hass?.connection,e=this.config?.child_id;if(!t||!e)return;const i=At(this.hass,e);e===this.requestChildId&&t===this.requestConnection&&i===this.requestWeekStart||(this.requestChildId=e,this.requestConnection=t,this.requestWeekStart=i,this.error=void 0,Promise.all([t.sendMessagePromise({type:"chores_manager/inventory"}),t.sendMessagePromise({type:"chores_manager/current_week_completions"})]).then(async([s,o])=>{if(this.requestChildId!==e||this.requestConnection!==t||this.requestWeekStart!==i)return;if(this.inventory=s,this.history=o,!s.children.some(t=>t.child_id===e))return void(this.error="child_not_found");const n=await t.sendMessagePromise({type:"chores_manager/weekly_points",child_id:e});this.requestChildId===e&&this.requestConnection===t&&this.requestWeekStart===i&&(this.weeklyPoints=n,this.selectedDate=this.selectedDate&&this.selectedDate>=o.window.start&&this.selectedDate<=o.window.end?this.selectedDate:o.window.end)}).catch(()=>{this.requestChildId===e&&this.requestConnection===t&&this.requestWeekStart===i&&(this.error="load_failed")}))}async setCompletion(t,e){const i=this.hass?.connection;if(i&&this.selectedDate&&!this.pendingAssignment){this.pendingAssignment=t.assignment.assignment_id;try{const s=await i.sendMessagePromise({type:"chores_manager/set_current_week_completion",assignment_id:t.assignment.assignment_id,local_date:this.selectedDate,completed:e});this.updateHistory(t,e,s.completion_id),this.weeklyPoints=await i.sendMessagePromise({type:"chores_manager/weekly_points",child_id:this.config?.child_id})}catch{this.error="load_failed"}finally{this.pendingAssignment=void 0}}}updateHistory(t,e,i){if(!this.history||!this.config||!this.selectedDate)return;const s=this.history.completions.filter(e=>e.assignment_id!==t.assignment.assignment_id||e.local_date!==this.selectedDate);if(e&&i){const e={completion_id:i,assignment_id:t.assignment.assignment_id,assignment_exists:!0,child_id:this.config.child_id,chore_id:t.chore.chore_id,local_date:this.selectedDate,completed_at:(new Date).toISOString(),child_name:this.weeklyPoints?.child_name??this.config.child_id,chore_title:t.chore.title,category:t.chore.category,points:t.chore.points};s.push(e)}this.history={...this.history,completions:s}}shiftDate(t){if(!this.selectedDate||!this.history)return;const e=new Date(`${this.selectedDate}T12:00:00`);e.setDate(e.getDate()+t);const i=e.toISOString().slice(0,10);i>=this.history.window.start&&i<=this.history.window.end&&(this.selectedDate=i)}chooseDate(t){const e=t.currentTarget.value;e&&(this.selectedDate=e)}dateInputLocale(){return this.hass?.locale??{language:Et(this.config?.locale,this.hass),number_format:"language",time_format:"language",date_format:"language",first_weekday:"language",time_zone:"local"}}loadDateInput(){if(this.dateInputReady||customElements.get("ha-date-input"))return void(this.dateInputReady=!0);const t=window.loadCardHelpers;t&&t().then(t=>(t.importMoreInfoControl("input_datetime"),customElements.whenDefined("ha-date-input"))).then(()=>{this.dateInputReady=!0}).catch(()=>{this.dateInputReady=!1})}static{this.styles=r`
    :host { display:block; }
    ha-card.borderless { border:0; }
    ha-card { padding:16px 20px 28px; overflow:hidden; }
    header { display:grid; grid-template-columns:56px minmax(0,1fr) auto 56px 56px; align-items:center; gap:10px; }
    .portrait, .portrait-icon { width:56px; height:56px; border-radius:50%; object-fit:cover; }
    .portrait-icon { --mdc-icon-size:56px; color:var(--state-icon-color); }
    .title { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:14px; }
    .header-points { font-size:12px; }
    button { border:1px solid var(--divider-color); background:transparent; color:var(--primary-text-color); cursor:pointer; }
    button:disabled { cursor:default; opacity:.35; }
    .header-button { width:56px; height:56px; border:0; border-radius:50%; background:var(--secondary-background-color); }
    .header-button ha-icon { --mdc-icon-size:28px; }
    .date-navigation { display:flex; align-items:center; justify-content:space-between; gap:16px; margin:26px 0 30px; }
    .date-navigation h1 { margin:0; font-size:23px; text-transform:capitalize; }
    .date-actions { display:flex; align-items:center; gap:8px; }
    .date-actions button, .date-picker { position:relative; display:grid; place-items:center; width:40px; height:40px; border:0; color:var(--state-icon-color); }
    .date-picker ha-date-input { position:absolute; inset:0; width:100%; opacity:0; cursor:pointer; }
    .date-picker.loading { opacity:.35; pointer-events:none; }
    .groups { display:grid; gap:24px; }
    .group h2 { margin:0 0 10px; font-size:17px; font-weight:500; }
    .chore-row { display:grid; grid-template-columns:34px minmax(0,1fr) 40px; align-items:center; gap:8px; min-height:44px; padding-left:28px; }
    .chore-icon { color:var(--state-icon-color); }
    .chore-copy { display:grid; min-width:0; }
    .chore-copy strong { overflow:hidden; text-overflow:ellipsis; font-size:14px; }
    .chore-copy span { color:var(--secondary-text-color); font-size:12px; }
    .chore-row button { width:36px; height:36px; border-radius:50%; }
    .chore-row .add ha-icon { color:var(--success-color,#43a047); }
    .chore-row .remove ha-icon { color:var(--error-color,#ef5350); }
    .error { color:var(--error-color,#ef5350); }
    @media (max-width:480px) {
      ha-card { padding:10px 8px 24px; }
      header { grid-template-columns:56px minmax(0,1fr) auto 56px 56px; gap:6px; }
      .date-navigation { margin:28px 0 30px; }
      .chore-row { padding-left:38px; }
    }
  `}};t([ut()],zt.prototype,"inventory",void 0),t([ut()],zt.prototype,"history",void 0),t([ut()],zt.prototype,"weeklyPoints",void 0),t([ut()],zt.prototype,"selectedDate",void 0),t([ut()],zt.prototype,"pendingAssignment",void 0),t([ut()],zt.prototype,"error",void 0),t([ut()],zt.prototype,"dateInputReady",void 0),zt=t([lt(ft)],zt);const Dt={entity:{filter:[{domain:"sensor",integration:"chores_manager"}]}},Tt={ui_action:{actions:["more-info","navigate","url","toggle","perform-action","call-service","assist","none"],default_action:"none"}},Ot=[{label:"Chores",icon:"mdi:format-list-checks",color:"#00bcd4"},{label:"History",icon:"mdi:trophy-outline",color:"#ffc107"},{label:"Correction",icon:"mdi:wrench-cog",color:"#9c27b0"}];function Rt(t){const{visibility:e,...i}=t;return{...i,visibility_mode:e?.mode??"all",visibility_users:e?.users??[]}}function Ut(t){const e=[t.daily_action,t.history_action,t.correction_action];return Ot.flatMap((t,i)=>{const s=e[i];return s&&"none"!==s.action?[{...t,tap_action:s}]:[]})}function Ht(t,e){if("correction"===e)return{locale:"auto",show_border:!0,show_header:!0,...t};const i={locale:"auto",show_header:!0,show_name:!0,show_person:!0,show_points:!0,show_border:!0,person_position:"center",person_size:"medium"};if("overview"===e){const e=t;return{...i,show_previous_week:!0,show_adjustments:!0,...t,...void 0===e.buttons?{buttons:Ut(e).length?Ut(e):Ot}:{}}}return{...i,...t}}class It extends at{constructor(){super(...arguments),this.users=[],this.addButton=()=>{const t=this.config,e=[...t.buttons??[]],i=Ot[e.length];i&&(this.config={...t,buttons:[...e,i]},this.emitConfigChanged())},this.computeLabel=t=>this.label(t.name)}setConfig(t){this.config=Ht(t,this.kind)}willUpdate(t){"overview"===this.kind&&t.has("hass")&&this.loadUsers()}loadUsers(){const t=this.hass?.connection;t&&t!==this.usersConnection&&(this.usersConnection=t,t.sendMessagePromise({type:"config/auth/list"}).then(t=>{this.users=t.filter(t=>t.is_active&&!t.system_generated).sort((t,e)=>t.name.localeCompare(e.name))}).catch(()=>{this.users=[]}))}render(){return this.config?W`
      <ha-form
        .hass=${this.hass}
        .data=${this.formData()}
        .schema=${this.schema()}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.onFormValueChanged}
      ></ha-form>
      ${"overview"===this.kind?this.renderButtonEditors():L}
    `:L}formData(){if(!this.hass||!this.config)return this.config??{};if("correction"===this.kind)return this.config;const t=this.config,e=t.child_id??(t.child_entity?this.hass.states[t.child_entity]?.attributes.child_id:void 0);return"string"==typeof e?{...this.config,child_id:e,weekly_points_entity:t.weekly_points_entity??this.matchingWeeklyPointsEntity(e)}:this.config}schema(){const t=[{name:"child_id",required:!0,selector:{select:{mode:"dropdown",options:(this.hass?vt(this.hass):[]).map(t=>({label:t.name,value:t.id}))}}},{name:"weekly_points_entity",selector:Dt},{name:"name",selector:{text:{}}},{name:"person_entity",selector:{entity:{filter:[{domain:"person"}]}}},{name:"locale",selector:{select:{mode:"dropdown",options:[{label:"Automatic",value:"auto"},{label:"English",value:"en"},{label:"Svenska",value:"sv"}]}}}];return"correction"===this.kind?[t[0],...t.slice(2),{type:"grid",name:"display",flatten:!0,schema:[{name:"show_header",selector:{boolean:{}}},{name:"show_border",selector:{boolean:{}}}]}]:"daily"===this.kind?[...t,{type:"grid",name:"display",flatten:!0,schema:[{name:"show_header",selector:{boolean:{}}},{name:"show_border",selector:{boolean:{}}},{name:"show_person",selector:{boolean:{}}},{name:"show_points",selector:{boolean:{}}}]}]:[...t,{type:"grid",name:"display",flatten:!0,schema:[{name:"show_name",selector:{boolean:{}}},{name:"show_border",selector:{boolean:{}}},{name:"show_person",selector:{boolean:{}}},{name:"show_points",selector:{boolean:{}}},{name:"show_previous_week",selector:{boolean:{}}},{name:"show_adjustments",selector:{boolean:{}}},{name:"person_position",selector:{select:{mode:"dropdown",options:[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"}]}}},{name:"person_size",selector:{select:{mode:"dropdown",options:[{label:"Small",value:"small"},{label:"Medium",value:"medium"},{label:"Large",value:"large"}]}}},{name:"goal_points",selector:{number:{min:1,mode:"box"}}},{name:"progress_color",selector:{text:{type:"color"}}}]},{name:"rewards",selector:{object:{multiple:!0,label_field:"label",fields:{points:{required:!0,selector:{number:{min:1,mode:"box"}}},label:{required:!0,selector:{text:{}}},description:{selector:{text:{}}},color:{selector:{text:{type:"color"}}}}}}}]}renderButtonEditors(){const t=this.config.buttons??[];return W`
      <section class="button-editors">
        <h2>${this.label("buttons")}</h2>
        ${t.map((t,e)=>W`
            <section class="button-editor">
              <div class="button-editor-heading">
                <h3>${t.label||`${this.label("button")} ${e+1}`}</h3>
                <ha-icon-button
                  .label=${this.label("remove_button")}
                  title=${this.label("remove_button")}
                  path="M19,13H5V11H19V13Z"
                  @click=${()=>this.removeButton(e)}
                ></ha-icon-button>
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${Rt(t)}
                .schema=${this.buttonSchema(Rt(t))}
                .computeLabel=${this.computeLabel}
                @value-changed=${t=>this.onButtonValueChanged(e,t)}
              ></ha-form>
            </section>
          `)}
        ${t.length<3?W`
              <button class="add-button" @click=${this.addButton}>
                <ha-icon icon="mdi:plus"></ha-icon>${this.label("add_button")}
              </button>
            `:L}
      </section>
    `}buttonSchema(t){const e=[{name:"label",required:!0,selector:{text:{}}},{name:"icon",required:!0,selector:{icon:{}}},{name:"color",required:!0,selector:{text:{type:"color"}}},{name:"tap_action",selector:Tt},{name:"hold_action",selector:Tt},{name:"double_tap_action",selector:Tt},{name:"visibility_mode",selector:{select:{mode:"dropdown",options:[{label:"All users",value:"all"},{label:"Administrators",value:"administrators"},{label:"Allow selected users",value:"allow-list"},{label:"Hide from selected users",value:"deny-list"}]}}}],i=new Map(this.users.map(t=>[t.id,t.name]));for(const e of t.visibility_users??[])i.set(e,i.get(e)??e);return e.push({name:"visibility_users",selector:{select:{multiple:!0,mode:"dropdown",options:[...i].map(([t,e])=>({value:t,label:e}))}}}),e}onFormValueChanged(t){t.stopPropagation();const e=t.detail.value;if("correction"===this.kind)return this.config=Ht({...this.config,...e},this.kind),void this.emitConfigChanged();const i=e,s=this.config,o=i.child_id!==s.child_id;this.config=Ht({...this.config,...e,weekly_points_entity:o&&this.hass?this.matchingWeeklyPointsEntity(i.child_id):i.weekly_points_entity},this.kind),this.emitConfigChanged()}onButtonValueChanged(t,e){e.stopPropagation();const i=this.config,s=[...i.buttons??[]],o=Rt(s[t]);s[t]=function(t){const{visibility_mode:e,visibility_users:i,...s}=t;return{...s,visibility:{mode:e??"all",users:i??[]}}}({...o,...e.detail.value,visibility_users:e.detail.value.visibility_users??o.visibility_users}),this.config={...i,buttons:s},this.emitConfigChanged()}removeButton(t){const e=this.config,i=[...e.buttons??[]];i.splice(t,1),this.config={...e,buttons:i},this.emitConfigChanged()}emitConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}matchingWeeklyPointsEntity(t){if(t&&this.hass)return Object.entries(this.hass.states).find(([e,i])=>e.startsWith("sensor.")&&i.attributes.child_id===t)?.[0]}label(t){return(this.hass?.language?.toLowerCase().startsWith("sv")?{add_button:"Lägg till knapp",button:"Knapp",buttons:"Knappar",child_id:"Barn",color:"Färg",description:"Beskrivning",double_tap_action:"Dubbeltryck",goal_points:"Reservmålpoäng",hold_action:"Håll inne",icon:"Ikon",label:"Etikett",locale:"Språk",name:"Visningsnamn",person_entity:"Person",person_position:"Bildposition",person_size:"Bildstorlek",points:"Poäng",progress_color:"Förloppsfärg",remove_button:"Ta bort knapp",rewards:"Belöningsnivåer",show_header:"Visa sidhuvud",show_name:"Visa namn",show_person:"Visa bild",show_border:"Visa kortkant",show_points:"daily"===this.kind?"Visa poäng":"Visa poäng och belöningsmeddelande",show_previous_week:"Visa förra veckans poäng",show_adjustments:"Visa poängjustering",tap_action:"Tryck",visibility_mode:"Synlig för",visibility_users:"Användare",weekly_points_entity:"Veckopoäng"}:{add_button:"Add button",button:"Button",buttons:"Buttons",child_id:"Child",color:"Color",description:"Description",double_tap_action:"Double-tap behavior",goal_points:"Fallback goal points",hold_action:"Hold behavior",icon:"Icon",label:"Label",locale:"Language",name:"Display name",person_entity:"Person",person_position:"Picture position",person_size:"Picture size",points:"Points",progress_color:"Progress color",remove_button:"Remove button",rewards:"Reward levels",show_header:"Show header",show_name:"Show name",show_person:"Show picture",show_border:"Show card border",show_points:"daily"===this.kind?"Show points":"Show points and reward message",show_previous_week:"Show previous-week points",show_adjustments:"Show point adjustment",tap_action:"Tap behavior",visibility_mode:"Visible to",visibility_users:"Users",weekly_points_entity:"Weekly points"})[t]}static{this.styles=r`
    :host { display: block; }
    .button-editors { display: grid; gap: 12px; margin-top: 24px; }
    .button-editors h2, .button-editor h3 { margin: 0; font-size: 16px; }
    .button-editor { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; }
    .button-editor-heading { align-items: center; display: flex; justify-content: space-between; margin-bottom: 8px; }
    .add-button { align-items: center; background: transparent; border: 1px solid var(--divider-color); border-radius: 8px; color: var(--primary-text-color); cursor: pointer; display: inline-flex; font: inherit; gap: 8px; justify-content: center; min-height: 40px; padding: 0 12px; }
  `}}t([pt({attribute:!1})],It.prototype,"hass",void 0),t([ut()],It.prototype,"config",void 0),t([ut()],It.prototype,"users",void 0);let Nt=class extends It{constructor(){super(...arguments),this.kind="daily"}};Nt=t([lt("chores-manager-daily-card-editor")],Nt);let Bt=class extends It{constructor(){super(...arguments),this.kind="overview"}};Bt=t([lt("chores-manager-overview-card-editor")],Bt);let Vt=class extends It{constructor(){super(...arguments),this.kind="correction"}};var Wt,qt;Vt=t([lt("chores-manager-correction-card-editor")],Vt),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Wt||(Wt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(qt||(qt={}));const Lt=["closed","locked","off"],Ft=(t,e,i,s)=>{s=s||{},i=null==i?{}:i;const o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,t.dispatchEvent(o),o},Kt=t=>{Ft(window,"haptic",t)},Gt=(t,e,i,s,o)=>{let n;if(o&&i.double_tap_action?n=i.double_tap_action:s&&i.hold_action?n=i.hold_action:!s&&i.tap_action&&(n=i.tap_action),n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some(t=>t.user===e.user.id)||confirm(n.confirmation.text||`Are you sure you want to ${n.action}?`))switch(n.action){case"more-info":(n.entity||i.entity||i.camera_image)&&(Ft(t,"hass-more-info",{entityId:n.entity?n.entity:i.entity?i.entity:i.camera_image}),n.haptic&&Kt(n.haptic));break;case"navigate":n.navigation_path&&(((t,e,i=!1)=>{i?history.replaceState(null,"",e):history.pushState(null,"",e),Ft(window,"location-changed",{replace:i})})(0,n.navigation_path),n.haptic&&Kt(n.haptic));break;case"url":n.url_path&&window.open(n.url_path),n.haptic&&Kt(n.haptic);break;case"toggle":i.entity&&(((t,e)=>{((t,e,i=!0)=>{const s=function(t){return t.substr(0,t.indexOf("."))}(e),o="group"===s?"homeassistant":s;let n;switch(s){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}t.callService(o,n,{entity_id:e})})(t,e,Lt.includes(t.states[e].state))})(e,i.entity),n.haptic&&Kt(n.haptic));break;case"call-service":{if(!n.service)return;const[t,s]=n.service.split(".",2),o=Object.assign({},n.service_data);"entity"===o.entity_id&&(o.entity_id=i.entity),e.callService(t,s,o,n.target),n.haptic&&Kt(n.haptic);break}case"fire-dom-event":Ft(t,"ll-custom",n),n.haptic&&Kt(n.haptic)}},Jt={amber:"#ffc107",blue:"#2196f3",cyan:"#00bcd4",green:"#4caf50",orange:"#ff9800",purple:"#9c27b0",red:"#f44336",teal:"#009688",yellow:"#ffeb3b"},Zt=/^#[0-9a-f]{6}$/iu,Qt=[{label:"Chores",icon:"mdi:format-list-checks",color:"#00bcd4"},{label:"History",icon:"mdi:trophy-outline",color:"#ffc107"},{label:"Correction",icon:"mdi:wrench-cog",color:"#9c27b0"}];let Xt=class extends mt{constructor(){super(...arguments),this.weeklyPointsError=!1,this.adjustmentPending=!1,this.adjustmentError=!1,this.heldButtons=new WeakSet,this.holdTimers=new WeakMap,this.clickTimers=new WeakMap}static getConfigElement(){return document.createElement("chores-manager-overview-card-editor")}static getStubConfig(){return{child_id:"kid_1",goal_points:20,progress_color:"#00a6d6",person_position:"center",locale:"auto",rewards:[{points:20,label:"Weekly reward",color:"#34c759"},{points:30,label:"Weekly reward and allowance",color:"#ff9f0a"}]}}setConfig(t){if(!t?.child_id?.trim()&&!t?.child_entity?.trim())throw new Error("child_id or child_entity is required");if(void 0!==t.goal_points&&t.goal_points<=0)throw new Error("goal_points must be above zero");if(this.config={locale:"auto",person_position:"center",person_size:"medium",show_name:!0,show_person:!0,show_points:!0,show_previous_week:!0,show_adjustments:!0,show_border:!0,rewards:[],...t},this.hass){const t=$t(this.hass,this.config);t&&this.loadWeeklyPoints(t)}this.requestUpdate()}willUpdate(t){if(!t.has("hass"))return;const e=this.hass&&this.config?$t(this.hass,this.config):void 0;if(e){Ct(this.hass,e,this.config?.weekly_points_entity??this.config?.child_entity)===this.confirmedPoints&&(this.confirmedPoints=void 0),this.loadWeeklyPoints(e)}}getCardSize(){return 5}render(){if(!this.hass||!this.config)return L;const t=$t(this.hass,this.config);if(!t)return L;const e=Ct(this.hass,t,this.config.weekly_points_entity??this.config.child_entity)??0,i=this.confirmedPoints??e,s=xt(this.hass,t),o=[...this.config.rewards??[]].sort((t,e)=>t.points-e.points),n=this.nextReward(i,o),r=n?.points??o.at(-1)?.points??this.config.goal_points??20,a=Pt(this.hass,this.config.person_entity),c=this.config.name??kt(this.hass,t)??t,l=this.config.person_position??"left",h=this.config.person_size??"medium",d=Math.min(100,Math.round(i/r*100)),p=this.progressColor(i,o),u=this.buttons().filter(t=>this.isVisible(t));return W`
      <ha-card class=${!1===this.config.show_border?"borderless":""}>
        ${!1!==this.config.show_person||!1!==this.config.show_name||!1!==this.config.show_previous_week?W`
              <header>
                <div class="overview-heading">
                  ${!1!==this.config.show_name?W`<h1>${c}</h1>`:W`<span></span>`}
                  ${!1!==this.config.show_previous_week&&this.weeklyPoints?W`<span class="previous-week">
                        ${jt("previous_week",this.config.locale,this.hass)} ·
                        ${this.weeklyPoints.previous_week.points}
                      </span>`:L}
                </div>
                ${!1!==this.config.show_person?W`<div class="portrait-row position-${l}">
                      ${a?W`<img class="portrait size-${h}" src=${a} alt="" />`:W`<ha-icon class="portrait-icon size-${h}" icon="mdi:account-circle"></ha-icon>`}
                    </div>`:L}
              </header>
            `:L}
        <div class="points-row" ?hidden=${!1===this.config.show_points}>
          <ha-icon icon="mdi:progress-star"></ha-icon>
          <div>
            <strong>${i} / ${r} ${jt("points",this.config.locale,this.hass)}</strong>
            ${n?W`<p>${this.rewardMessage(i,n)}</p>`:W`<p>${this.finalRewardMessage(o)}</p>`}
          </div>
        </div>
        <div class="progress" style=${"background: "+this.progressTrackColor(p)} role="progressbar" aria-valuemin="0" aria-valuemax=${r} aria-valuenow=${i}>
          <span style=${`width: ${d}%; background: ${p}`}></span>
        </div>
        ${this.renderCompactAdjustment(t)}
        ${u.length?W`
              <div class="button-divider"></div>
              <div class="actions">
                ${u.map(t=>this.renderButton(t))}
              </div>
            `:L}
        ${s.length||o.length?this.renderPointsAndRewards(s,o):L}
      </ha-card>
    `}renderCompactAdjustment(t){const e=!1!==this.config?.show_adjustments;if(this.weeklyPointsError)return W`
        <p class="api-error" role="alert">
          ${jt("weekly_points_error",this.config?.locale,this.hass)}
        </p>
      `;if(!e||!this.weeklyPoints||this.weeklyPoints.child_id!==t||!this.weeklyPoints.can_adjust)return L;const i=this.confirmedPoints??this.weeklyPoints.current_week.points;return W`
      <section class="compact-adjustment">
        <span class="adjustment-label">
          <ha-icon icon="mdi:tune-variant"></ha-icon>
          ${jt("adjust",this.config?.locale,this.hass)}
        </span>
        <div class="adjustment-actions">
          <button
            class="subtract"
            ?disabled=${this.adjustmentPending||i<=0}
            aria-label=${jt("subtract_points",this.config?.locale,this.hass)}
            @click=${()=>this.adjustPoints(t,-1)}
          ><ha-icon icon="mdi:minus"></ha-icon><span>1</span></button>
          <button
            class="add"
            ?disabled=${this.adjustmentPending}
            aria-label=${jt("add_points",this.config?.locale,this.hass)}
            @click=${()=>this.adjustPoints(t,1)}
          ><ha-icon icon="mdi:plus"></ha-icon><span>1</span></button>
        </div>
        ${this.adjustmentError?W`<p class="api-error" role="alert">
              ${jt("adjustment_error",this.config?.locale,this.hass)}
            </p>`:L}
      </section>
    `}loadWeeklyPoints(t){const e=this.hass?.connection;if(!e)return;const i=At(this.hass,t,this.config?.weekly_points_entity??this.config?.child_entity);t===this.weeklyPointsChildId&&e===this.weeklyPointsConnection&&i===this.weeklyPointsWeekStart||(this.weeklyPointsChildId=t,this.weeklyPointsConnection=e,this.weeklyPointsWeekStart=i,this.weeklyPoints=void 0,this.weeklyPointsError=!1,e.sendMessagePromise({type:"chores_manager/weekly_points",child_id:t}).then(s=>{this.weeklyPointsChildId===t&&this.weeklyPointsConnection===e&&this.weeklyPointsWeekStart===i&&(this.weeklyPoints=s)}).catch(()=>{this.weeklyPointsChildId===t&&this.weeklyPointsConnection===e&&this.weeklyPointsWeekStart===i&&(this.weeklyPointsError=!0)}))}async adjustPoints(t,e){const i=this.hass?.connection;if(i&&!this.adjustmentPending){this.adjustmentPending=!0,this.adjustmentError=!1;try{const s=await i.sendMessagePromise({type:"chores_manager/adjust_weekly_points",child_id:t,amount:e});this.confirmedPoints=s.current_points,this.weeklyPoints?.child_id===t&&(this.weeklyPoints={...this.weeklyPoints,current_week:{...this.weeklyPoints.current_week,points:s.current_points}})}catch{this.adjustmentError=!0}finally{this.adjustmentPending=!1}}}renderPointsAndRewards(t,e){const i=new Map;for(const e of t){const t=i.get(e.points)??[];t.push(e),i.set(e.points,t)}return W`
      <details class="points-rewards">
        <summary>
          <span>${jt("rewards",this.config?.locale,this.hass)}</span>
          <p>${jt("how_points_work",this.config?.locale,this.hass)}</p>
        </summary>
        <div class="rewards-content">
          ${i.size?W`
                <section>
                  <h2>${jt("chores",this.config?.locale,this.hass)}</h2>
                  ${[...i.entries()].sort(([t],[e])=>e-t).map(([t,e])=>W`
                        <h3>${t} ${jt("points",this.config?.locale,this.hass)}</h3>
                        <ul>${e.map(t=>W`<li>${t.title}</li>`)}</ul>
                      `)}
                </section>
              `:L}
          ${e.length?W`
                <section>
                  <h2>${jt("reward_levels",this.config?.locale,this.hass)}</h2>
                  <ul class="reward-list">
                    ${e.map(t=>W`
                        <li><strong>${t.points}p:</strong> ${t.label}${t.description?W` - ${t.description}`:L}</li>
                      `)}
                  </ul>
                </section>
              `:L}
        </div>
      </details>
    `}renderButton(t){const e=this.actions(t);return W`
      <button
        style=${`--button-icon-color: ${this.buttonColor(t.color)}`}
        @pointerdown=${t=>this.startHold(t,e)}
        @pointerup=${t=>this.stopHold(t)}
        @pointercancel=${t=>this.stopHold(t)}
        @click=${t=>this.handleClick(t,e)}
        @dblclick=${t=>this.handleDoubleClick(t,e)}
      >
        <ha-icon icon=${t.icon}></ha-icon><span>${t.label}</span>
        <small>${jt("show",this.config?.locale,this.hass)}</small>
      </button>
    `}buttons(){if(void 0!==this.config?.buttons)return this.config.buttons.slice(0,3);const t=[this.config?.daily_action,this.config?.history_action,this.config?.correction_action];return Qt.flatMap((e,i)=>{const s=t[i];return s&&"none"!==s.action?[{...e,tap_action:s}]:[]})}isVisible(t){const e=t.visibility,i=e?.mode??"all",s=e?.users??[],o=this.hass?.user;return"all"===i||("administrators"===i?!0===o?.is_admin:o?"allow-list"===i?s.includes(o.id):!s.includes(o.id):"deny-list"===i)}actions(t){return{tap_action:t.tap_action,hold_action:t.hold_action,double_tap_action:t.double_tap_action}}startHold(t,e){if(!e.hold_action||"none"===e.hold_action.action)return;const i=t.currentTarget,s=window.setTimeout(()=>{this.heldButtons.add(i),this.holdTimers.delete(i),this.dispatchAction(i,e,!0,!1)},500);this.holdTimers.set(i,s)}stopHold(t){const e=t.currentTarget,i=this.holdTimers.get(e);void 0!==i&&(window.clearTimeout(i),this.holdTimers.delete(e))}handleClick(t,e){const i=t.currentTarget;this.heldButtons.delete(i)||(e.double_tap_action&&"none"!==e.double_tap_action.action?this.clickTimers.set(i,window.setTimeout(()=>this.dispatchAction(i,e,!1,!1),250)):this.dispatchAction(i,e,!1,!1))}handleDoubleClick(t,e){const i=t.currentTarget,s=this.clickTimers.get(i);void 0!==s&&(window.clearTimeout(s),this.clickTimers.delete(i)),this.dispatchAction(i,e,!1,!0)}dispatchAction(t,e,i,s){this.hass&&Gt(t,this.hass,e,i,s)}buttonColor(t){return this.colorValue(t)??"var(--state-icon-color)"}progressTrackColor(t){return"color-mix(in srgb, "+t+" 22%, var(--card-background-color))"}nextReward(t,e){return e.find(e=>e.points>t)}progressColor(t,e){const i=[...e].reverse().find(e=>e.points<=t&&this.colorValue(e.color));return this.colorValue(i?.color)??this.colorValue(this.config?.progress_color)??"var(--primary-color)"}colorValue(t){if(!t)return;const e=t.trim().toLowerCase();return Zt.test(e)?e:Jt[e]}finalRewardMessage(t){const e=t.at(-1)?.label.trim();return e||jt("completed",this.config?.locale,this.hass)}rewardMessage(t,e){return this.config&&this.hass?`${e.points-t} ${jt("points",this.config.locale,this.hass)} ${jt("remaining",this.config.locale,this.hass)} ${e.label}`:""}static{this.styles=r`
    :host { display: block; }
    ha-card.borderless { border: 0; }
    ha-card { padding: 20px; }
    header { display:grid; gap:18px; }
    .overview-heading { display:flex; align-items:center; justify-content:space-between; gap:16px; }
    .previous-week { color:var(--secondary-text-color); font-size:14px; white-space:nowrap; }
    .portrait-row { display:flex; }
    .portrait-row.position-left { justify-content:flex-start; }
    .portrait-row.position-center { justify-content:center; }
    .portrait-row.position-right { justify-content:flex-end; }
    .portrait { border-radius: 50%; object-fit: cover; }
    .portrait-icon { color: var(--state-icon-color); }
    .size-small { width: 40px; height: 40px; }
    .size-medium { width: 64px; height: 64px; }
    .size-large { width: 96px; height: 96px; }
    ha-icon.size-small { --mdc-icon-size: 40px; }
    ha-icon.size-medium { --mdc-icon-size: 64px; }
    ha-icon.size-large { --mdc-icon-size: 96px; }
    h1 { margin: 0; font-size: 20px; font-weight: 600; }
    h2, h3 { margin: 0; }
    h2 { font-size: 16px; }
    h3 { font-size: 14px; margin-top: 16px; }
    .points-row { display: flex; gap: 12px; align-items: center; margin: 18px 0 12px; }
    .points-row > ha-icon { color: var(--state-icon-color); }
    p { margin: 3px 0 0; color: var(--secondary-text-color); font-size: 14px; }
    .progress { height: 6px; background: var(--secondary-background-color); overflow: hidden; }
    .progress span { display: block; height: 100%; transition: width 180ms ease-out, background 180ms ease-out; }
    .compact-adjustment { display:flex; align-items:center; justify-content:flex-end; gap:14px; margin-top:24px; }
    .adjustment-label { display:flex; align-items:center; gap:7px; font-size:13px; font-weight:600; }
    .adjustment-label ha-icon { --mdc-icon-size:20px; }
    .adjustment-actions { display:flex; gap:8px; }
    .adjustment-actions button { min-width:54px; min-height:40px; padding:6px 10px; display:flex; grid-auto-flow:column; border-radius:22px; }
    .adjustment-actions button span { font-size:13px; }
    .adjustment-actions .subtract ha-icon { color: var(--error-color, #db4437); }
    .adjustment-actions .add ha-icon { color: var(--success-color, #43a047); }
    .compact-adjustment button:disabled { cursor:default; opacity:.45; }
    .api-error { color: var(--error-color, #db4437); }
    .button-divider { height: 6px; margin: 26px 0 20px; background: var(--secondary-background-color); border-radius: 3px; }
    .actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
    button { min-height: 72px; padding: 8px; display: grid; place-items: center; gap: 5px; border: 1px solid var(--divider-color); border-radius: 8px; background: transparent; color: var(--primary-text-color); font: inherit; cursor: pointer; }
    button:hover { background: var(--secondary-background-color); }
    button ha-icon { color: var(--button-icon-color, var(--state-icon-color)); }
    button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
    button small { color:var(--secondary-text-color); font-size:12px; }
    .points-rewards { margin-top: 20px; }
    summary { cursor: pointer; }
    summary span { font-size: 20px; font-weight: 600; }
    .rewards-content { margin-top: 16px; padding: 16px; border: 1px solid var(--divider-color); border-radius: 8px; }
    ul { margin: 8px 0 0; padding-left: 24px; }
    li + li { margin-top: 4px; }
    .reward-list { margin-bottom: 0; }
    .rewards-content section + section { margin-top: 20px; }
    @media (max-width: 480px) {
      ha-card { padding: 16px; }
      .compact-adjustment { gap:10px; }
    }
  `}};t([ut()],Xt.prototype,"weeklyPoints",void 0),t([ut()],Xt.prototype,"weeklyPointsError",void 0),t([ut()],Xt.prototype,"adjustmentPending",void 0),t([ut()],Xt.prototype,"adjustmentError",void 0),t([ut()],Xt.prototype,"confirmedPoints",void 0),Xt=t([lt(_t)],Xt),console.info("%c CHORES MANAGER CARDS %c 0.2.0 ","color: white; background: #1677b8; font-weight: 600;","color: white; background: #444;"),window.customCards=window.customCards??[],window.customCards.push({type:ft,name:"Chores Manager Correction",description:"Admin correction by child and date.",preview:!1},{type:gt,name:"Chores Manager Daily",description:"Child-facing daily chore checklist.",preview:!1},{type:_t,name:"Chores Manager Overview",description:"Child points and reward overview.",preview:!1});
