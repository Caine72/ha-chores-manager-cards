function t(t,e,i,o){var s,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(e,i,r):s(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new n(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,_=g?g.emptyScript:"",f=m.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);s?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=o;const n=s.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,i,o=!1,s){if(void 0!==t){const n=this.constructor;if(!1===o&&(s=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??v)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==s||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[y("elementProperties")]=new Map,$[y("finalized")]=new Map,f?.({ReactiveElement:$}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,C=t=>t,k=x.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+P,D=`<${E}>`,j=document,I=()=>j.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,T="[ \t\n\f\r]",q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,O=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,N=/"/g,B=/^(?:script|style|textarea|title)$/i,L=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),F=new WeakMap,K=j.createTreeWalker(j,129);function G(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,o=[];let s,n=2===e?"<svg>":3===e?"<math>":"",r=q;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===q?"!--"===c[1]?r=U:void 0!==c[1]?r=H:void 0!==c[2]?(B.test(c[2])&&(s=RegExp("</"+c[2],"g")),r=O):void 0!==c[3]&&(r=O):r===O?">"===c[0]?(r=s??q,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?O:'"'===c[3]?N:R):r===N||r===R?r=O:r===U||r===H?r=q:(r=O,s=void 0);const d=r===O&&t[e+1].startsWith("/>")?" ":"";n+=r===q?i+D:l>=0?(o.push(a),i.slice(0,l)+S+i.slice(l)+P+d):i+P+(-2===l?e:d)}return[G(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Z{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[c,l]=J(t,e);if(this.el=Z.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=K.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(S)){const e=l[n++],i=o.getAttribute(t).split(P),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(B.test(o.tagName)){const t=o.textContent.split(P),e=t.length-1;if(e>0){o.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],I()),K.nextNode(),a.push({type:2,index:++s});o.append(t[e],I())}}}else if(8===o.nodeType)if(o.data===E)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(P,t+1));)a.push({type:7,index:s}),t+=P.length-1}s++}}static createElement(t,e){const i=j.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,o){if(e===V)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=M(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=Q(t,s._$AS(t,e.values),s,o)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??j).importNode(e,!0);K.currentNode=o;let s=K.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Y(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new st(s,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(s=K.nextNode(),n++)}return K.currentNode=j,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),M(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new X(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Z(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new Y(this.O(I()),this.O(I()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=C(t).nextSibling;C(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,o){const s=this.strings;let n=!1;if(void 0===s)t=Q(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==V,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=Q(this,o[i+r],e,r),a===V&&(a=this._$AH[r]),n||=!M(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class ot extends tt{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??W)===V)return;const i=this._$AH,o=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==W&&(i===W||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(Z,Y),(x.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new Y(e.insertBefore(I(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:v},dt=(t=ht,e,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return pt({...t,state:!0,attribute:!1})}class mt extends at{shouldUpdate(t){if(!t.has("hass")||1!==t.size)return!0;const e=t.get("hass");if(!e||!this.hass)return!0;const i=this.hassUpdateKey(e),o=this.hassUpdateKey(this.hass);return!i||!o||i.length!==o.length||i.some((t,e)=>!Object.is(t,o[e]))}}t([pt({attribute:!1})],mt.prototype,"hass",void 0);const gt="chores-manager-daily-card",_t="chores-manager-overview-card",ft="chores-manager-correction-card",yt="chores-manager-history-card",bt="chores-manager-quick-chore-card",vt=new Set(["unknown","unavailable"]),wt=new WeakMap;function $t(t,e){return t.attributes[e]}function xt(t,e){const i=Number($t(t,e));return Number.isFinite(i)?i:0}function Ct(t){const e=wt.get(t.states);if(e)return e;const i=new Map,o=new Map,s=new Map,n=new Map,r=[],a=new Map;for(const[e,c]of Object.entries(t.states)){e.startsWith("person.")&&r.push({entityId:e,name:$t(c,"friendly_name")??e.slice(7).replaceAll("_"," ")});const t=$t(c,"child_id");if(!t)continue;const l=s.get(t)??[];l.push(c),s.set(t,l);const h=$t(c,"kid_name")??$t(c,"child_name");h?.trim()?n.set(t,h):n.has(t)||n.set(t,t);const d=$t(c,"person_entity_id");if(!o.has(t)&&"string"==typeof d&&d.startsWith("person.")&&o.set(t,d),e.startsWith("sensor.")&&!a.has(t)&&a.set(t,c),e.startsWith("switch.")&&!vt.has(c.state)&&"string"==typeof $t(c,"assignment_id")){const o=i.get(t)??[];o.push({assignmentId:$t(c,"assignment_id")??e,entityId:e,childId:t,title:$t(c,"title")??$t(c,"friendly_name")??e,category:$t(c,"category")??"Other",points:xt(c,"points"),icon:$t(c,"icon")??"mdi:checkbox-marked-circle-outline",sortOrder:xt(c,"sort_order"),completed:"on"===c.state,completionMode:"shared"===$t(c,"completion_mode")?"shared":"independent",completedByChildId:$t(c,"completed_by_child_id"),completedByChildName:$t(c,"completed_by_child_name"),completedManually:!0===$t(c,"completed_manually")}),i.set(t,o)}}for(const t of i.values())t.sort((t,e)=>t.category.localeCompare(e.category)||t.sortOrder-e.sortOrder||t.title.localeCompare(e.title));r.sort((t,e)=>t.name.localeCompare(e.name));const c={assignmentsByChild:i,associatedPersonByChild:o,childEntities:s,childNames:n,children:[...n.entries()].map(([t,e])=>({id:t,name:e})).sort((t,e)=>t.name.localeCompare(e.name)),personOptions:r,weeklyPointsByChild:a};return wt.set(t.states,c),c}function kt(t,e,i){return(i?t.states[i]:void 0)??Ct(t).weeklyPointsByChild.get(e)}function At(t){return Ct(t).children}function St(t,e){const i=e.child_entity?t.states[e.child_entity]:void 0;return e.child_id??(i?$t(i,"child_id"):void 0)}function Pt(t,e){return Ct(t).childNames.get(e)}function Et(t,e,i,o,s){return[i,o,Pt(t,e)].find(t=>t?.trim())?.trim()??s}function Dt(t,e){return Ct(t).assignmentsByChild.get(e)??[]}function jt(t,e,i){const o=kt(t,e,i);if(!o||vt.has(o.state))return;const s=Number(o.state);return Number.isFinite(s)?s:void 0}function It(t,e,i){const o=kt(t,e,i),s=o?$t(o,"week_start"):void 0;return"string"==typeof s?s:void 0}function Mt(t,e){const i=e?t.states[e]:void 0;return i?$t(i,"entity_picture"):void 0}function zt(t,e){return Ct(t).associatedPersonByChild.get(e)}function Tt(t,e,i=[]){const o=Ct(t),s=new Set(o.childEntities.get(e)??[]),n=o.associatedPersonByChild.get(e);for(const e of[...i,n]){const i=e?t.states[e]:void 0;i&&s.add(i)}return[...s]}function qt(t,e,i=[]){return[t.connection,t.language,t.locale?.language,t.locale?.number_format,t.locale?.time_format,t.locale?.date_format,t.locale?.first_weekday,t.locale?.time_zone,t.user?.id,t.user?.is_admin,...Tt(t,e,i)]}const Ut={en:{chores:"Chores",completed:"Goal reached",no_chores:"No available chores.",points:"points",remaining:"remaining for",rewards:"Points & rewards",how_points_work:"How points work",reward_levels:"Rewards",daily:"Chores",history:"History",correction:"Correction",previous_week:"Previous week",adjust_points:"Adjust points",adjustment_amount:"Amount",adjustment_reason:"Reason (optional)",add_points:"Add points",subtract_points:"Subtract points",adjustment_error:"The point adjustment could not be saved.",weekly_points_error:"Weekly totals could not be loaded.",correction_error:"Correction data could not be loaded.",correction_child_not_found:"This child no longer exists. Select an available child in the card editor.",previous_date:"Previous date",next_date:"Next date",choose_date:"Choose date",close:"Close",back:"Back",correct_chores:"Correct chores",adjust:"Adjust",show:"View",add_completion:"Add completion",remove_completion:"Remove completion",weekly_chores:"Weekly chores",history_error:"Chore history could not be loaded.",history_empty:"No chores logged this week.",total:"Total",claimed_by:"Claimed by",quick_shortcut:"Shortcut",quick_manual:"Manual",quick_not_completed:"Not completed yet",quick_completed_by:"Completed by",quick_completed_manually:"Completed manually",quick_reset:"Reset",quick_reset_all:"Reset all",quick_action_error:"The action could not be saved."},sv:{chores:"Sysslor",completed:"Målet är uppnått",no_chores:"Inga tillgängliga sysslor.",points:"poäng",remaining:"kvar till",rewards:"Poäng & belöningar",how_points_work:"Så fungerar poängen",reward_levels:"Belöningar",daily:"Sysslor",history:"Historik",correction:"Korrigering",previous_week:"Förra veckan",adjust_points:"Justera poäng",adjustment_amount:"Antal",adjustment_reason:"Orsak (valfri)",add_points:"Lägg till poäng",subtract_points:"Dra av poäng",adjustment_error:"Poängjusteringen kunde inte sparas.",weekly_points_error:"Veckopoängen kunde inte hämtas.",correction_error:"Korrigeringsdata kunde inte hämtas.",correction_child_not_found:"Barnet finns inte längre. Välj ett tillgängligt barn i kortets redigerare.",previous_date:"Föregående datum",next_date:"Nästa datum",choose_date:"Välj datum",close:"Stäng",back:"Tillbaka",correct_chores:"Korrigera sysslor",adjust:"Justera",show:"Visa",add_completion:"Lägg till genomförd syssla",remove_completion:"Ta bort genomförd syssla",weekly_chores:"Veckans sysslor",history_error:"Historiken kunde inte hämtas.",history_empty:"Inga sysslor registrerade den här veckan.",total:"Totalt",claimed_by:"Tagen av",quick_shortcut:"Genväg",quick_manual:"Manuell",quick_not_completed:"Ej ännu utförd",quick_completed_by:"Utförd av",quick_completed_manually:"Utförd manuellt",quick_reset:"Återställ",quick_reset_all:"Återställ alla",quick_action_error:"Åtgärden kunde inte sparas."}};function Ht(t,e){return"en"===t||"sv"===t?t:e?.language?.toLowerCase().startsWith("sv")?"sv":"en"}function Ot(t,e,i){return Ut[Ht(e,i)][t]}let Rt=class extends mt{constructor(){super(...arguments),this.pendingCompletions=new Map}static getConfigElement(){return document.createElement("chores-manager-daily-card-editor")}static getStubConfig(){return{child_id:"kid_1",locale:"auto"}}setConfig(t){if(!t?.child_id?.trim()&&!t?.child_entity?.trim())throw new Error("child_id or child_entity is required");this.config={locale:"auto",show_border:!0,show_header:!0,show_person:!0,show_points:!0,...t},this.requestUpdate()}getCardSize(){return 4}hassUpdateKey(t){if(!this.config)return;const e=St(t,this.config);return e?qt(t,e,[this.config.child_entity,this.config.weekly_points_entity,this.config.person_entity]):void 0}render(){if(!this.hass||!this.config)return W;const t=St(this.hass,this.config);if(!t)return W;const e=Dt(this.hass,t),i=function(t){return t.reduce((t,e)=>{const i=t.get(e.category)??[];return i.push(e),t.set(e.category,i),t},new Map)}(e.map(t=>({...t,completed:this.pendingCompletions.get(t.entityId)??t.completed}))),o=jt(this.hass,t,this.config.weekly_points_entity??this.config.child_entity),s=void 0===o?void 0:o+e.reduce((t,e)=>{const i=this.pendingCompletions.get(e.entityId)??e.completed;return i===e.completed?t:t+(i?e.points:-e.points)},0),n=Mt(this.hass,this.config.person_entity??zt(this.hass,t)),r=Et(this.hass,t,this.config.name,void 0,Ot("chores",this.config.locale,this.hass));return L`
      <ha-card class=${!1===this.config.show_border?"borderless":""}>
        ${!1!==this.config.show_header?L`
              <header>
                ${!1!==this.config.show_person?n?L`<img class="portrait" src=${n} alt="" />`:L`<ha-icon class="portrait-icon" icon="mdi:account-circle"></ha-icon>`:W}
                <div>
                  <h1>${r}</h1>
                  ${!1!==this.config.show_points&&void 0!==s?L`<p data-weekly-points>${s} ${Ot("points",this.config.locale,this.hass)}</p>`:W}
                </div>
              </header>
            `:W}
        ${this.error?L`<p class="error" role="alert">${this.error}</p>`:W}
        ${0===i.size?L`<p class="empty">${Ot("no_chores",this.config.locale,this.hass)}</p>`:[...i.entries()].map(([t,e])=>this.renderGroup(t,e))}
      </ha-card>
    `}willUpdate(t){t.has("hass")&&this.reconcilePendingCompletions()}renderGroup(t,e){return L`
      <section>
        <h2>${t}</h2>
        ${e.map(t=>{const e=this.isClaimedByAnotherChild(t),i=t.completedByChildName??t.completedByChildId;return L`
            <button
              class="chore ${t.completed?"completed":""} ${e?"claimed":""}"
              data-entity-id=${t.entityId}
              ?disabled=${this.pendingCompletions.has(t.entityId)||e}
              aria-label=${e&&i?`${t.title}: ${Ot("claimed_by",this.config?.locale,this.hass)} ${i}`:t.title}
              @click=${()=>this.toggleAssignment(t)}
            >
              <ha-icon icon=${t.icon}></ha-icon>
              <span class="details">
                <span class="title">${t.title}</span>
                ${e&&i?L`<span class="claim">${Ot("claimed_by",this.config?.locale,this.hass)} ${i}</span>`:W}
              </span>
              ${!1!==this.config?.show_points?L`<span class="points">${t.points}p</span>`:W}
              <ha-icon
                class="check"
                icon=${t.completed?"mdi:check-circle":"mdi:circle-outline"}
              ></ha-icon>
            </button>
          `})}
      </section>
    `}async toggleAssignment(t){if(!this.hass||this.pendingCompletions.has(t.entityId)||this.isClaimedByAnotherChild(t))return;const e=!t.completed;this.pendingCompletions=new Map(this.pendingCompletions).set(t.entityId,e),this.error=void 0;try{await this.hass.callService("switch",e?"turn_on":"turn_off",{entity_id:t.entityId}),this.reconcilePendingCompletions()}catch(e){const i=new Map(this.pendingCompletions);i.delete(t.entityId),this.pendingCompletions=i,this.error=e instanceof Error?e.message:"Unable to update chore"}}isClaimedByAnotherChild(t){return"shared"===t.completionMode&&t.completed&&Boolean(t.completedByChildId)&&t.completedByChildId!==t.childId}reconcilePendingCompletions(){if(!this.hass||!this.pendingCompletions.size)return;const t=new Map(this.pendingCompletions);for(const[e,i]of t){const o=this.hass.states[e]?.state;(i&&"on"===o||!i&&"off"===o)&&t.delete(e)}t.size!==this.pendingCompletions.size&&(this.pendingCompletions=t)}static{this.styles=r`
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
    .chore.claimed:disabled { cursor: not-allowed; }
    .chore > ha-icon { color: var(--state-icon-color); }
    .details { min-width: 0; display: grid; gap: 2px; }
    .title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .claim { color: var(--secondary-text-color); font-size: 12px; }
    .points { font-size: 13px; }
    .completed .title { text-decoration: line-through; color: var(--secondary-text-color); }
    .completed .check { color: var(--success-color, #34c759); }
    .error { color: var(--error-color); margin-bottom: 12px; }
    .empty { color: var(--secondary-text-color); }
  `}};t([ut()],Rt.prototype,"error",void 0),t([ut()],Rt.prototype,"pendingCompletions",void 0),Rt=t([lt(gt)],Rt);const Nt=new WeakMap;function Bt(t,e){let i=Nt.get(t);i||(i=new Map,Nt.set(t,i));const o=JSON.stringify(e),s=i.get(o);if(s)return s;const n=t.sendMessagePromise(e);i.set(o,n);const r=()=>{i?.get(o)===n&&(i.delete(o),i.size||Nt.delete(t))};return n.then(r,r),n}let Lt=class extends mt{constructor(){super(...arguments),this.dateInputReady=Boolean(customElements.get("ha-date-input")),this.rowCache=[],this.goBack=()=>history.back(),this.close=()=>{location.hash?location.hash="":history.back()}}static getConfigElement(){return document.createElement("chores-manager-correction-card-editor")}static getStubConfig(t){return{child_id:t?At(t)[0]?.id??"kid_1":"kid_1",locale:"auto",show_border:!0,show_header:!0}}connectedCallback(){super.connectedCallback(),this.loadDateInput()}setConfig(t){if(!t?.child_id?.trim())throw new Error("child_id is required");this.config={locale:"auto",show_border:!0,show_header:!0,...t},this.load(),this.requestUpdate()}willUpdate(){this.load()}getCardSize(){return 9}hassUpdateKey(t){if(!this.config)return;const e=this.inventory?.children.find(t=>t.child_id===this.config?.child_id);return qt(t,this.config.child_id,[e?.points_entity_id??void 0,e?.person_entity_id,this.config.person_entity,this.weeklyPoints?.points_entity_id,this.weeklyPoints?.person_entity_id])}render(){if(!this.hass||!this.config)return W;const t=this.inventory?.children.find(t=>t.child_id===this.config?.child_id),e=Et(this.hass,this.config.child_id,this.config.name,t?.name??this.weeklyPoints?.child_name,Ot("chores",this.config.locale,this.hass)),i=Mt(this.hass,this.config.person_entity??t?.person_entity_id??this.weeklyPoints?.person_entity_id??zt(this.hass,this.config.child_id));return L`
      <ha-card class=${!1===this.config.show_border?"borderless":""}>
        ${!1!==this.config.show_header?L`
              <header>
                ${i?L`<img class="portrait" src=${i} alt="" />`:L`<ha-icon class="portrait-icon" icon="mdi:account-circle"></ha-icon>`}
                <strong class="title">${Ot("correct_chores",this.config.locale,this.hass)} - ${e}</strong>
                <span class="header-points">${this.weeklyPoints?.current_week.points??0}p</span>
                <button class="header-button" aria-label=${Ot("back",this.config.locale,this.hass)} @click=${this.goBack}>
                  <ha-icon icon="mdi:arrow-left"></ha-icon>
                </button>
                <button class="header-button" aria-label=${Ot("close",this.config.locale,this.hass)} @click=${this.close}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </header>
            `:W}
        ${this.error?L`<p class="error" role="alert">${Ot("child_not_found"===this.error?"correction_child_not_found":"correction_error",this.config.locale,this.hass)}</p>`:this.history&&this.inventory&&this.selectedDate?L`
                ${this.renderDateNavigation()}
                <div class="groups">${this.renderGroups()}</div>
              `:W}
      </ha-card>
    `}renderDateNavigation(){const t=Ht(this.config?.locale,this.hass),e=new Date(`${this.selectedDate}T12:00:00`),i=new Intl.DateTimeFormat("sv"===t?"sv-SE":"en-US",{weekday:"short",day:"numeric",month:"short"}).format(e),o=this.selectedDate===this.history?.window.start,s=this.selectedDate===this.history?.window.end;return L`
      <section class="date-navigation">
        <h1>${i}</h1>
        <div class="date-actions">
          <button ?disabled=${o} aria-label=${Ot("previous_date",this.config?.locale,this.hass)} @click=${()=>this.shiftDate(-1)}>
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button ?disabled=${s} aria-label=${Ot("next_date",this.config?.locale,this.hass)} @click=${()=>this.shiftDate(1)}>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <div
            class=${this.dateInputReady?"date-picker":"date-picker loading"}
            aria-busy=${this.dateInputReady?"false":"true"}
          >
            <ha-icon icon="mdi:calendar"></ha-icon>
            <ha-date-input
              .label=${Ot("choose_date",this.config?.locale,this.hass)}
              .locale=${this.dateInputLocale()}
              .min=${this.history?.window.start??""}
              .max=${this.history?.window.end??""}
              .value=${this.selectedDate??""}
              @change=${this.chooseDate}
            ></ha-date-input>
          </div>
        </div>
      </section>
    `}renderGroups(){const t=new Map;for(const e of this.rows()){const i=t.get(e.chore.category)??[];i.push(e),t.set(e.chore.category,i)}return[...t].map(([t,e])=>L`
        <section class="group">
          <h2>${t}</h2>
          ${e.map(t=>this.renderRow(t))}
        </section>
      `)}renderRow(t){const e=this.pendingAssignment===t.assignment.assignment_id,i=t.completed?Ot("remove_completion",this.config?.locale,this.hass):Ot("add_completion",this.config?.locale,this.hass);return L`
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
    `}rows(){if(!(this.inventory&&this.history&&this.config&&this.selectedDate))return[];if(this.rowCacheInventory===this.inventory&&this.rowCacheHistory===this.history&&this.rowCacheChildId===this.config.child_id&&this.rowCacheDate===this.selectedDate)return this.rowCache;const t=new Map(this.inventory.chores.map(t=>[t.chore_id,t])),e=new Set(this.history.completions.filter(t=>t.child_id===this.config?.child_id&&t.local_date===this.selectedDate).map(t=>t.assignment_id));return this.rowCache=this.inventory.assignments.filter(t=>t.child_id===this.config?.child_id).flatMap(i=>{const o=t.get(i.chore_id);return o?[{assignment:i,chore:o,completed:e.has(i.assignment_id)}]:[]}).sort((t,e)=>t.chore.sort_order-e.chore.sort_order||t.chore.title.localeCompare(e.chore.title)),this.rowCacheInventory=this.inventory,this.rowCacheHistory=this.history,this.rowCacheChildId=this.config.child_id,this.rowCacheDate=this.selectedDate,this.rowCache}load(){const t=this.hass?.connection,e=this.config?.child_id;if(!t||!e)return;const i=It(this.hass,e);e===this.requestChildId&&t===this.requestConnection&&i===this.requestWeekStart||(this.requestChildId=e,this.requestConnection=t,this.requestWeekStart=i,this.error=void 0,Promise.all([Bt(t,{type:"chores_manager/inventory"}),Bt(t,{type:"chores_manager/current_week_completions"})]).then(async([o,s])=>{if(this.requestChildId!==e||this.requestConnection!==t||this.requestWeekStart!==i)return;if(this.inventory=o,this.history=s,!o.children.some(t=>t.child_id===e))return void(this.error="child_not_found");const n=await Bt(t,{type:"chores_manager/weekly_points",child_id:e});this.requestChildId===e&&this.requestConnection===t&&this.requestWeekStart===i&&(this.weeklyPoints=n,this.selectedDate=this.selectedDate&&this.selectedDate>=s.window.start&&this.selectedDate<=s.window.end?this.selectedDate:s.window.end)}).catch(()=>{this.requestChildId===e&&this.requestConnection===t&&this.requestWeekStart===i&&(this.error="load_failed")}))}async setCompletion(t,e){const i=this.hass?.connection;if(i&&this.selectedDate&&!this.pendingAssignment){this.pendingAssignment=t.assignment.assignment_id;try{const o=await i.sendMessagePromise({type:"chores_manager/set_current_week_completion",assignment_id:t.assignment.assignment_id,local_date:this.selectedDate,completed:e});this.updateHistory(t,e,o.completion_id),this.weeklyPoints=await i.sendMessagePromise({type:"chores_manager/weekly_points",child_id:this.config?.child_id})}catch{this.error="load_failed"}finally{this.pendingAssignment=void 0}}}updateHistory(t,e,i){if(!this.history||!this.config||!this.selectedDate)return;const o=this.history.completions.filter(e=>e.assignment_id!==t.assignment.assignment_id||e.local_date!==this.selectedDate);if(e&&i){const e={completion_id:i,assignment_id:t.assignment.assignment_id,assignment_exists:!0,child_id:this.config.child_id,chore_id:t.chore.chore_id,local_date:this.selectedDate,completed_at:(new Date).toISOString(),child_name:this.weeklyPoints?.child_name??this.config.child_id,chore_title:t.chore.title,category:t.chore.category,points:t.chore.points};o.push(e)}this.history={...this.history,completions:o}}shiftDate(t){if(!this.selectedDate||!this.history)return;const e=new Date(`${this.selectedDate}T12:00:00`);e.setDate(e.getDate()+t);const i=e.toISOString().slice(0,10);i>=this.history.window.start&&i<=this.history.window.end&&(this.selectedDate=i)}chooseDate(t){const e=t.currentTarget.value;e&&(this.selectedDate=e)}dateInputLocale(){return this.hass?.locale??{language:Ht(this.config?.locale,this.hass),number_format:"language",time_format:"language",date_format:"language",first_weekday:"language",time_zone:"local"}}loadDateInput(){if(this.dateInputReady||customElements.get("ha-date-input"))return void(this.dateInputReady=!0);const t=window.loadCardHelpers;t&&t().then(t=>(t.importMoreInfoControl("input_datetime"),customElements.whenDefined("ha-date-input"))).then(()=>{this.dateInputReady=!0}).catch(()=>{this.dateInputReady=!1})}static{this.styles=r`
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
  `}};t([ut()],Lt.prototype,"inventory",void 0),t([ut()],Lt.prototype,"history",void 0),t([ut()],Lt.prototype,"weeklyPoints",void 0),t([ut()],Lt.prototype,"selectedDate",void 0),t([ut()],Lt.prototype,"pendingAssignment",void 0),t([ut()],Lt.prototype,"error",void 0),t([ut()],Lt.prototype,"dateInputReady",void 0),Lt=t([lt(ft)],Lt);const Vt={entity:{filter:[{domain:"sensor",integration:"chores_manager"}]}},Wt={ui_action:{actions:["more-info","navigate","url","toggle","perform-action","call-service","assist","none"],default_action:"none"}},Ft=[{label:"Chores",icon:"mdi:format-list-checks",color:"#00bcd4"},{label:"History",icon:"mdi:trophy-outline",color:"#ffc107"},{label:"Correction",icon:"mdi:wrench-cog",color:"#9c27b0"}],Kt=[{label:"All users",value:"all"},{label:"Administrators",value:"administrators"},{label:"Allow selected users",value:"allow-list"},{label:"Hide from selected users",value:"deny-list"}];function Gt(t){const{visibility:e,...i}=t;return{...i,visibility_mode:e?.mode??"all",visibility_users:e?.users??[]}}function Jt(t){const e=[t.daily_action,t.history_action,t.correction_action];return Ft.flatMap((t,i)=>{const o=e[i];return o&&"none"!==o.action?[{...t,tap_action:o}]:[]})}function Zt(t,e){if("correction"===e)return{locale:"auto",show_border:!0,show_header:!0,...t};if("history"===e)return{locale:"auto",show_border:!0,show_header:!0,show_person:!0,show_points:!0,...t};const i={locale:"auto",show_header:!0,show_name:!0,show_person:!0,show_points:!0,show_border:!0,person_position:"center",person_size:"medium"};if("overview"===e){const e=t;return{...i,show_previous_week:!0,show_adjustments:!0,...t,...void 0===e.buttons?{buttons:Jt(e).length?Jt(e):Ft}:{}}}return{...i,...t}}class Qt extends at{constructor(){super(...arguments),this.users=[],this.addButton=()=>{const t=this.config,e=[...t.buttons??[]],i=Ft[e.length];i&&(this.config={...t,buttons:[...e,i]},this.emitConfigChanged())},this.computeLabel=t=>this.label(t.name)}setConfig(t){this.config=Zt(t,this.kind)}willUpdate(t){"overview"===this.kind&&t.has("hass")&&this.loadUsers()}loadUsers(){const t=this.hass?.connection;t&&t!==this.usersConnection&&(this.usersConnection=t,t.sendMessagePromise({type:"config/auth/list"}).then(t=>{this.users=t.filter(t=>t.is_active&&!t.system_generated).sort((t,e)=>t.name.localeCompare(e.name))}).catch(()=>{this.users=[]}))}render(){return this.config?L`
      <ha-form
        .hass=${this.hass}
        .data=${this.formData()}
        .schema=${this.schema()}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.onFormValueChanged}
      ></ha-form>
      ${"overview"===this.kind?this.renderButtonEditors():W}
    `:W}formData(){if(!this.hass||!this.config)return this.config??{};if("correction"===this.kind)return this.config;const t=this.config,e=t.child_id??(t.child_entity?this.hass.states[t.child_entity]?.attributes.child_id:void 0),i="string"==typeof e?{...this.config,child_id:e,weekly_points_entity:t.weekly_points_entity??this.matchingWeeklyPointsEntity(e)}:this.config;if("overview"!==this.kind)return i;const o=this.config;return{...i,adjustment_visibility_mode:o.adjustment_visibility?.mode??"all",adjustment_visibility_users:o.adjustment_visibility?.users??[]}}schema(){const t=[{name:"child_id",required:!0,selector:{select:{mode:"dropdown",options:(this.hass?At(this.hass):[]).map(t=>({label:t.name,value:t.id}))}}},{name:"weekly_points_entity",selector:Vt},{name:"name",selector:{text:{}}},{name:"person_entity",selector:{entity:{filter:[{domain:"person"}]}}},{name:"locale",selector:{select:{mode:"dropdown",options:[{label:"Automatic",value:"auto"},{label:"English",value:"en"},{label:"Svenska",value:"sv"}]}}}];return"correction"===this.kind?[t[0],...t.slice(2),{type:"grid",name:"display",flatten:!0,schema:[{name:"show_header",selector:{boolean:{}}},{name:"show_border",selector:{boolean:{}}}]}]:"daily"===this.kind||"history"===this.kind?[...t,{type:"grid",name:"display",flatten:!0,schema:[{name:"show_header",selector:{boolean:{}}},{name:"show_border",selector:{boolean:{}}},{name:"show_person",selector:{boolean:{}}},{name:"show_points",selector:{boolean:{}}}]}]:[...t,{type:"grid",name:"display",flatten:!0,schema:[{name:"show_name",selector:{boolean:{}}},{name:"show_border",selector:{boolean:{}}},{name:"show_person",selector:{boolean:{}}},{name:"show_points",selector:{boolean:{}}},{name:"show_previous_week",selector:{boolean:{}}},{name:"show_adjustments",selector:{boolean:{}}},{name:"person_position",selector:{select:{mode:"dropdown",options:[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"}]}}},{name:"person_size",selector:{select:{mode:"dropdown",options:[{label:"Small",value:"small"},{label:"Medium",value:"medium"},{label:"Large",value:"large"}]}}},{name:"goal_points",selector:{number:{min:1,mode:"box"}}},{name:"progress_color",selector:{text:{type:"color"}}}]},{type:"expandable",name:"adjustment_visibility_settings",title:this.label("adjustment_visibility"),flatten:!0,schema:[{name:"adjustment_visibility_mode",selector:{select:{mode:"dropdown",options:Kt}}},{name:"adjustment_visibility_users",selector:this.visibilityUsersSelector(this.config.adjustment_visibility?.users)}]},{name:"rewards",selector:{object:{multiple:!0,label_field:"label",fields:{points:{required:!0,selector:{number:{min:1,mode:"box"}}},label:{required:!0,selector:{text:{}}},description:{selector:{text:{}}},color:{selector:{text:{type:"color"}}}}}}}]}renderButtonEditors(){const t=this.config.buttons??[];return L`
      <ha-expansion-panel class="buttons-panel" outlined>
        <h2 slot="header">${this.label("buttons")}</h2>
        <section class="button-editors">
          ${t.map((t,e)=>L`
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
                  .data=${Gt(t)}
                  .schema=${this.buttonSchema(Gt(t))}
                  .computeLabel=${this.computeLabel}
                  @value-changed=${t=>this.onButtonValueChanged(e,t)}
                ></ha-form>
              </section>
            `)}
          ${t.length<3?L`
                <button class="add-button" @click=${this.addButton}>
                  <ha-icon icon="mdi:plus"></ha-icon>${this.label("add_button")}
                </button>
              `:W}
        </section>
      </ha-expansion-panel>
    `}buttonSchema(t){const e=[{name:"label",required:!0,selector:{text:{}}},{name:"icon",required:!0,selector:{icon:{}}},{name:"color",required:!0,selector:{text:{type:"color"}}},{name:"tap_action",selector:Wt},{name:"hold_action",selector:Wt},{name:"double_tap_action",selector:Wt},{name:"visibility_mode",selector:{select:{mode:"dropdown",options:Kt}}}];return e.push({name:"visibility_users",selector:this.visibilityUsersSelector(t.visibility_users)}),e}visibilityUsersSelector(t=[]){const e=new Map(this.users.map(t=>[t.id,t.name]));for(const i of t)e.set(i,e.get(i)??i);return{select:{multiple:!0,mode:"dropdown",options:[...e].map(([t,e])=>({value:t,label:e}))}}}onFormValueChanged(t){t.stopPropagation();const e=t.detail.value;if("correction"===this.kind)return this.config=Zt({...this.config,...e},this.kind),void this.emitConfigChanged();let i=e;if("overview"===this.kind){const t=this.config,{adjustment_visibility_mode:o,adjustment_visibility_users:s,...n}=e;i={...n,adjustment_visibility:{mode:o??t.adjustment_visibility?.mode??"all",users:s??t.adjustment_visibility?.users??[]}}}const o=i,s=this.config,n=o.child_id!==s.child_id;this.config=Zt({...this.config,...i,weekly_points_entity:n&&this.hass?this.matchingWeeklyPointsEntity(o.child_id):o.weekly_points_entity},this.kind),this.emitConfigChanged()}onButtonValueChanged(t,e){e.stopPropagation();const i=this.config,o=[...i.buttons??[]],s=Gt(o[t]);o[t]=function(t){const{visibility_mode:e,visibility_users:i,...o}=t;return{...o,visibility:{mode:e??"all",users:i??[]}}}({...s,...e.detail.value,visibility_users:e.detail.value.visibility_users??s.visibility_users}),this.config={...i,buttons:o},this.emitConfigChanged()}removeButton(t){const e=this.config,i=[...e.buttons??[]];i.splice(t,1),this.config={...e,buttons:i},this.emitConfigChanged()}emitConfigChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}matchingWeeklyPointsEntity(t){if(t&&this.hass)return Object.entries(this.hass.states).find(([e,i])=>e.startsWith("sensor.")&&i.attributes.child_id===t)?.[0]}label(t){return(this.hass?.language?.toLowerCase().startsWith("sv")?{add_button:"Lägg till knapp",button:"Knapp",buttons:"Knappar",child_id:"Barn",color:"Färg",description:"Beskrivning",double_tap_action:"Dubbeltryck",goal_points:"Reservmålpoäng",hold_action:"Håll inne",icon:"Ikon",label:"Etikett",locale:"Språk",name:"Visningsnamn",person_entity:"Personöverskrivning",person_position:"Bildposition",person_size:"Bildstorlek",points:"Poäng",progress_color:"Förloppsfärg",remove_button:"Ta bort knapp",rewards:"Belöningsnivåer",show_header:"Visa sidhuvud",show_name:"Visa namn",show_person:"Visa bild",show_border:"Visa kortkant",show_points:"daily"===this.kind||"history"===this.kind?"Visa poäng":"Visa poäng och belöningsmeddelande",show_previous_week:"Visa förra veckans poäng",show_adjustments:"Visa poängjustering",adjustment_visibility:"Synlighet för poängjustering",adjustment_visibility_mode:"Synlig för",adjustment_visibility_users:"Användare",tap_action:"Tryck",visibility_mode:"Synlig för",visibility_users:"Användare",weekly_points_entity:"Veckopoäng"}:{add_button:"Add button",button:"Button",buttons:"Buttons",child_id:"Child",color:"Color",description:"Description",double_tap_action:"Double-tap behavior",goal_points:"Fallback goal points",hold_action:"Hold behavior",icon:"Icon",label:"Label",locale:"Language",name:"Display name",person_entity:"Person override",person_position:"Picture position",person_size:"Picture size",points:"Points",progress_color:"Progress color",remove_button:"Remove button",rewards:"Reward levels",show_header:"Show header",show_name:"Show name",show_person:"Show picture",show_border:"Show card border",show_points:"daily"===this.kind||"history"===this.kind?"Show points":"Show points and reward message",show_previous_week:"Show previous-week points",show_adjustments:"Show point adjustment",adjustment_visibility:"Point adjustment visibility",adjustment_visibility_mode:"Visible to",adjustment_visibility_users:"Users",tap_action:"Tap behavior",visibility_mode:"Visible to",visibility_users:"Users",weekly_points_entity:"Weekly points"})[t]}static{this.styles=r`
    :host { display: block; }
    .buttons-panel { display: block; margin-top: 24px; }
    .buttons-panel h2, .button-editor h3 { margin: 0; font-size: 16px; }
    .button-editors { display: grid; gap: 12px; padding: 0 16px 16px; }
    .button-editor { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; }
    .button-editor-heading { align-items: center; display: flex; justify-content: space-between; margin-bottom: 8px; }
    .add-button { align-items: center; background: transparent; border: 1px solid var(--divider-color); border-radius: 8px; color: var(--primary-text-color); cursor: pointer; display: inline-flex; font: inherit; gap: 8px; justify-content: center; min-height: 40px; padding: 0 12px; }
  `}}t([pt({attribute:!1})],Qt.prototype,"hass",void 0),t([ut()],Qt.prototype,"config",void 0),t([ut()],Qt.prototype,"users",void 0);let Xt=class extends Qt{constructor(){super(...arguments),this.kind="daily"}};Xt=t([lt("chores-manager-daily-card-editor")],Xt);let Yt=class extends Qt{constructor(){super(...arguments),this.kind="overview"}};Yt=t([lt("chores-manager-overview-card-editor")],Yt);let te=class extends Qt{constructor(){super(...arguments),this.kind="correction"}};te=t([lt("chores-manager-correction-card-editor")],te);let ee=class extends Qt{constructor(){super(...arguments),this.kind="history"}};ee=t([lt("chores-manager-history-card-editor")],ee);let ie=class extends mt{constructor(){super(...arguments),this.loadFailed=!1,this.groupedHistoryCache=new Map}static getConfigElement(){return document.createElement("chores-manager-history-card-editor")}static getStubConfig(t){return{child_id:t?At(t)[0]?.id??"kid_1":"kid_1",locale:"auto",show_border:!0,show_header:!0,show_person:!0,show_points:!0}}setConfig(t){if(!t?.child_id?.trim())throw new Error("child_id is required");this.config={locale:"auto",show_border:!0,show_header:!0,show_person:!0,show_points:!0,...t},this.load(),this.requestUpdate()}willUpdate(){this.load()}getCardSize(){return Math.max(2,1+2*this.groupedCompletions().size)}hassUpdateKey(t){return this.config?qt(t,this.config.child_id,[this.config.weekly_points_entity,this.config.person_entity,this.history?.person_entity_id]):void 0}render(){if(!this.hass||!this.config)return W;const t=Mt(this.hass,this.config.person_entity??this.history?.person_entity_id??zt(this.hass,this.config.child_id)),e=Et(this.hass,this.config.child_id,this.config.name,this.history?.child_name,Ot("weekly_chores",this.config.locale,this.hass));return L`
      <ha-card class=${!1===this.config.show_border?"borderless":""}>
        ${!1!==this.config.show_header?L`
              <header>
                ${!1!==this.config.show_person?t?L`<img class="portrait" src=${t} alt="" />`:L`<ha-icon class="portrait-icon" icon="mdi:account-circle"></ha-icon>`:W}
                <div>
                  <h1>${e}</h1>
                  <p>${Ot("weekly_chores",this.config.locale,this.hass)}</p>
                </div>
              </header>
            `:W}
        ${this.loadFailed?L`<p class="error" role="alert">${Ot("history_error",this.config.locale,this.hass)}</p>`:this.history?this.renderHistory():W}
      </ha-card>
    `}renderHistory(){const t=this.groupedCompletions();return t.size?L`
      <div class="history">
        ${[...t.entries()].map(([t,e])=>this.renderDay(t,e))}
      </div>
    `:L`<p class="empty">${Ot("history_empty",this.config?.locale,this.hass)}</p>`}renderDay(t,e){const i=e.reduce((t,e)=>t+e.points,0);return L`
      <section data-local-date=${t}>
        <h2>${this.weekday(t)}</h2>
        <ul>
          ${e.map(t=>L`
              <li>
                <span>${t.chore_title}</span>
                ${!1!==this.config?.show_points?L`<span class="points"> · ${t.points}p</span>`:W}
              </li>
            `)}
        </ul>
        ${!1!==this.config?.show_points?L`<strong class="total">${Ot("total",this.config?.locale,this.hass)}: ${i}p</strong>`:W}
      </section>
    `}groupedCompletions(){if(this.groupedHistory===this.history)return this.groupedHistoryCache;const t=new Map;for(const e of this.history?.completions??[]){const i=t.get(e.local_date)??[];i.push(e),t.set(e.local_date,i)}for(const e of t.values())e.sort((t,e)=>t.category.localeCompare(e.category)||t.chore_title.localeCompare(e.chore_title)||t.completion_id.localeCompare(e.completion_id));return this.groupedHistory=this.history,this.groupedHistoryCache=new Map([...t.entries()].sort(([t],[e])=>t.localeCompare(e))),this.groupedHistoryCache}weekday(t){const e=Ht(this.config?.locale,this.hass);return new Intl.DateTimeFormat("sv"===e?"sv-SE":"en-US",{weekday:"long"}).format(new Date(`${t}T12:00:00`))}load(){const t=this.hass?.connection,e=this.config?.child_id;if(!t||!e)return;const i=function(t,e,i){const o=kt(t,e,i);if(!o)return;const s=$t(o,"week_start");return[o.state,"string"==typeof s?s:"",o.last_updated??""].join("|")}(this.hass,e,this.config?.weekly_points_entity);e===this.requestChildId&&t===this.requestConnection&&i===this.requestUpdateKey||(this.requestChildId=e,this.requestConnection=t,this.requestUpdateKey=i,this.history=void 0,this.loadFailed=!1,Bt(t,{type:"chores_manager/current_week_history",child_id:e}).then(o=>{this.requestChildId===e&&this.requestConnection===t&&this.requestUpdateKey===i&&(this.history=o)}).catch(()=>{this.requestChildId===e&&this.requestConnection===t&&this.requestUpdateKey===i&&(this.loadFailed=!0)}))}static{this.styles=r`
    :host { display: block; }
    ha-card { padding: 22px 28px 26px; }
    ha-card.borderless { border: 0; }
    header { align-items: center; display: flex; gap: 12px; margin-bottom: 22px; }
    header h1, header p, h2, ul, .empty, .error { margin: 0; }
    header h1 { font-size: 18px; font-weight: 600; }
    header p { color: var(--secondary-text-color); font-size: 13px; margin-top: 2px; }
    .portrait { border-radius: 50%; height: 48px; object-fit: cover; width: 48px; }
    .portrait-icon { --mdc-icon-size: 48px; color: var(--state-icon-color); }
    .history { display: grid; gap: 24px; }
    h2 { font-size: 16px; font-weight: 600; margin-bottom: 12px; text-transform: capitalize; }
    ul { padding-left: 24px; }
    li { line-height: 1.45; margin-bottom: 7px; padding-left: 2px; }
    .points { white-space: nowrap; }
    .total { display: block; font-size: 14px; margin-top: 14px; }
    .empty { color: var(--secondary-text-color); font-style: italic; }
    .error { color: var(--error-color); }
  `}};var oe,se;t([ut()],ie.prototype,"history",void 0),t([ut()],ie.prototype,"loadFailed",void 0),ie=t([lt(yt)],ie),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(oe||(oe={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(se||(se={}));const ne=["closed","locked","off"],re=(t,e,i,o)=>{o=o||{},i=null==i?{}:i;const s=new Event(e,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return s.detail=i,t.dispatchEvent(s),s},ae=t=>{re(window,"haptic",t)},ce=(t,e,i,o,s)=>{let n;if(s&&i.double_tap_action?n=i.double_tap_action:o&&i.hold_action?n=i.hold_action:!o&&i.tap_action&&(n=i.tap_action),n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some(t=>t.user===e.user.id)||confirm(n.confirmation.text||`Are you sure you want to ${n.action}?`))switch(n.action){case"more-info":(n.entity||i.entity||i.camera_image)&&(re(t,"hass-more-info",{entityId:n.entity?n.entity:i.entity?i.entity:i.camera_image}),n.haptic&&ae(n.haptic));break;case"navigate":n.navigation_path&&(((t,e,i=!1)=>{i?history.replaceState(null,"",e):history.pushState(null,"",e),re(window,"location-changed",{replace:i})})(0,n.navigation_path),n.haptic&&ae(n.haptic));break;case"url":n.url_path&&window.open(n.url_path),n.haptic&&ae(n.haptic);break;case"toggle":i.entity&&(((t,e)=>{((t,e,i=!0)=>{const o=function(t){return t.substr(0,t.indexOf("."))}(e),s="group"===o?"homeassistant":o;let n;switch(o){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}t.callService(s,n,{entity_id:e})})(t,e,ne.includes(t.states[e].state))})(e,i.entity),n.haptic&&ae(n.haptic));break;case"call-service":{if(!n.service)return;const[t,o]=n.service.split(".",2),s=Object.assign({},n.service_data);"entity"===s.entity_id&&(s.entity_id=i.entity),e.callService(t,o,s,n.target),n.haptic&&ae(n.haptic);break}case"fire-dom-event":re(t,"ll-custom",n),n.haptic&&ae(n.haptic)}},le={amber:"#ffc107",blue:"#2196f3",cyan:"#00bcd4",green:"#4caf50",orange:"#ff9800",purple:"#9c27b0",red:"#f44336",teal:"#009688",yellow:"#ffeb3b"},he=/^#[0-9a-f]{6}$/iu,de=[{label:"Chores",icon:"mdi:format-list-checks",color:"#00bcd4"},{label:"History",icon:"mdi:trophy-outline",color:"#ffc107"},{label:"Correction",icon:"mdi:wrench-cog",color:"#9c27b0"}];let pe=class extends mt{constructor(){super(...arguments),this.weeklyPointsError=!1,this.adjustmentPending=!1,this.adjustmentError=!1,this.heldButtons=new WeakSet,this.holdTimers=new WeakMap,this.clickTimers=new WeakMap}static getConfigElement(){return document.createElement("chores-manager-overview-card-editor")}static getStubConfig(){return{child_id:"kid_1",goal_points:20,progress_color:"#00a6d6",person_position:"center",locale:"auto",rewards:[{points:20,label:"Weekly reward",color:"#34c759"},{points:30,label:"Weekly reward and allowance",color:"#ff9f0a"}]}}setConfig(t){if(!t?.child_id?.trim()&&!t?.child_entity?.trim())throw new Error("child_id or child_entity is required");if(void 0!==t.goal_points&&t.goal_points<=0)throw new Error("goal_points must be above zero");if(this.config={locale:"auto",person_position:"center",person_size:"medium",show_name:!0,show_person:!0,show_points:!0,show_previous_week:!0,show_adjustments:!0,show_border:!0,rewards:[],...t},this.hass){const t=St(this.hass,this.config);t&&this.loadWeeklyPoints(t)}this.requestUpdate()}willUpdate(t){if(!t.has("hass"))return;const e=this.hass&&this.config?St(this.hass,this.config):void 0;if(e){jt(this.hass,e,this.config?.weekly_points_entity??this.config?.child_entity)===this.confirmedPoints&&(this.confirmedPoints=void 0),this.loadWeeklyPoints(e)}}getCardSize(){return 5}hassUpdateKey(t){if(!this.config)return;const e=St(t,this.config);return e?qt(t,e,[this.config.child_entity,this.config.weekly_points_entity,this.config.person_entity,this.weeklyPoints?.person_entity_id]):void 0}render(){if(!this.hass||!this.config)return W;const t=St(this.hass,this.config);if(!t)return W;const e=jt(this.hass,t,this.config.weekly_points_entity??this.config.child_entity)??0,i=this.confirmedPoints??e,o=Dt(this.hass,t),s=[...this.config.rewards??[]].sort((t,e)=>t.points-e.points),n=this.nextReward(i,s),r=n?.points??s.at(-1)?.points??this.config.goal_points??20,a=Mt(this.hass,this.config.person_entity??this.weeklyPoints?.person_entity_id??zt(this.hass,t)),c=Et(this.hass,t,this.config.name,this.weeklyPoints?.child_name,Ot("chores",this.config.locale,this.hass)),l=this.config.person_position??"left",h=this.config.person_size??"medium",d=Math.min(100,Math.round(i/r*100)),p=this.progressColor(i,s),u=this.buttons().filter(t=>this.isVisible(t));return L`
      <ha-card class=${!1===this.config.show_border?"borderless":""}>
        ${!1!==this.config.show_person||!1!==this.config.show_name||!1!==this.config.show_previous_week?L`
              <header>
                <div class="overview-heading">
                  ${!1!==this.config.show_name?L`<h1>${c}</h1>`:L`<span></span>`}
                  ${!1!==this.config.show_previous_week&&this.weeklyPoints?L`<span class="previous-week">
                        ${Ot("previous_week",this.config.locale,this.hass)} ·
                        ${this.weeklyPoints.previous_week.points}
                      </span>`:W}
                </div>
                ${!1!==this.config.show_person?L`<div class="portrait-row position-${l}">
                      ${a?L`<img class="portrait size-${h}" src=${a} alt="" />`:L`<ha-icon class="portrait-icon size-${h}" icon="mdi:account-circle"></ha-icon>`}
                    </div>`:W}
              </header>
            `:W}
        <div class="points-row" ?hidden=${!1===this.config.show_points}>
          <ha-icon icon="mdi:progress-star"></ha-icon>
          <div>
            <strong>${i} / ${r} ${Ot("points",this.config.locale,this.hass)}</strong>
            ${n?L`<p>${this.rewardMessage(i,n)}</p>`:L`<p>${this.finalRewardMessage(s)}</p>`}
          </div>
        </div>
        <div class="progress" style=${"background: "+this.progressTrackColor(p)} role="progressbar" aria-valuemin="0" aria-valuemax=${r} aria-valuenow=${i}>
          <span style=${`width: ${d}%; background: ${p}`}></span>
        </div>
        ${this.renderCompactAdjustment(t,i)}
        ${u.length?L`
              <div class="button-divider"></div>
              <div class="actions">
                ${u.map(t=>this.renderButton(t))}
              </div>
            `:W}
        ${o.length||s.length?this.renderPointsAndRewards(o,s):W}
      </ha-card>
    `}renderCompactAdjustment(t,e){return!1!==this.config?.show_adjustments&&this.matchesVisibility(this.config?.adjustment_visibility)?L`
      ${this.weeklyPointsError?L`<p class="api-error" role="alert">
            ${Ot("weekly_points_error",this.config?.locale,this.hass)}
          </p>`:W}
      ${this.renderAdjustmentControls(t,e)}
    `:W}renderAdjustmentControls(t,e){return L`
      <section class="compact-adjustment">
        <span class="adjustment-label">
          <ha-icon icon="mdi:tune-variant"></ha-icon>
          ${Ot("adjust",this.config?.locale,this.hass)}
        </span>
        <div class="adjustment-actions">
          <button
            class="subtract"
            ?disabled=${this.adjustmentPending||e<=0}
            aria-label=${Ot("subtract_points",this.config?.locale,this.hass)}
            @click=${()=>this.adjustPoints(t,-1)}
          ><ha-icon icon="mdi:minus"></ha-icon><span>1</span></button>
          <button
            class="add"
            ?disabled=${this.adjustmentPending}
            aria-label=${Ot("add_points",this.config?.locale,this.hass)}
            @click=${()=>this.adjustPoints(t,1)}
          ><ha-icon icon="mdi:plus"></ha-icon><span>1</span></button>
        </div>
        ${this.adjustmentError?L`<p class="api-error" role="alert">
              ${Ot("adjustment_error",this.config?.locale,this.hass)}
            </p>`:W}
      </section>
    `}loadWeeklyPoints(t){const e=this.hass?.connection;if(!e)return;const i=It(this.hass,t,this.config?.weekly_points_entity??this.config?.child_entity);t===this.weeklyPointsChildId&&e===this.weeklyPointsConnection&&i===this.weeklyPointsWeekStart||(this.weeklyPointsChildId=t,this.weeklyPointsConnection=e,this.weeklyPointsWeekStart=i,this.weeklyPoints=void 0,this.weeklyPointsError=!1,Bt(e,{type:"chores_manager/weekly_points",child_id:t}).then(o=>{this.weeklyPointsChildId===t&&this.weeklyPointsConnection===e&&this.weeklyPointsWeekStart===i&&(this.weeklyPoints=o)}).catch(()=>{this.weeklyPointsChildId===t&&this.weeklyPointsConnection===e&&this.weeklyPointsWeekStart===i&&(this.weeklyPointsError=!0)}))}async adjustPoints(t,e){const i=this.hass?.connection;if(i&&!this.adjustmentPending){this.adjustmentPending=!0,this.adjustmentError=!1;try{const o=await i.sendMessagePromise({type:"chores_manager/adjust_weekly_points",child_id:t,amount:e});this.confirmedPoints=o.current_points,this.weeklyPoints?.child_id===t&&(this.weeklyPoints={...this.weeklyPoints,current_week:{...this.weeklyPoints.current_week,points:o.current_points}})}catch{this.adjustmentError=!0}finally{this.adjustmentPending=!1}}}renderPointsAndRewards(t,e){const i=new Map;for(const e of t){const t=i.get(e.points)??[];t.push(e),i.set(e.points,t)}return L`
      <details class="points-rewards">
        <summary>
          <span>${Ot("rewards",this.config?.locale,this.hass)}</span>
          <p>${Ot("how_points_work",this.config?.locale,this.hass)}</p>
        </summary>
        <div class=${!1===this.config?.show_border?"rewards-content borderless":"rewards-content"}>
          ${i.size?L`
                <section>
                  <h2>${Ot("chores",this.config?.locale,this.hass)}</h2>
                  ${[...i.entries()].sort(([t],[e])=>e-t).map(([t,e])=>L`
                        <h3>${t} ${Ot("points",this.config?.locale,this.hass)}</h3>
                        <ul>${e.map(t=>L`<li>${t.title}</li>`)}</ul>
                      `)}
                </section>
              `:W}
          ${e.length?L`
                <section>
                  <h2>${Ot("reward_levels",this.config?.locale,this.hass)}</h2>
                  <ul class="reward-list">
                    ${e.map(t=>L`
                        <li><strong>${t.points}p:</strong> ${t.label}${t.description?L` - ${t.description}`:W}</li>
                      `)}
                  </ul>
                </section>
              `:W}
        </div>
      </details>
    `}renderButton(t){const e=this.actions(t);return L`
      <button
        style=${`--button-icon-color: ${this.buttonColor(t.color)}`}
        @pointerdown=${t=>this.startHold(t,e)}
        @pointerup=${t=>this.stopHold(t)}
        @pointercancel=${t=>this.stopHold(t)}
        @click=${t=>this.handleClick(t,e)}
        @dblclick=${t=>this.handleDoubleClick(t,e)}
      >
        <ha-icon icon=${t.icon}></ha-icon><span>${t.label}</span>
        <small>${Ot("show",this.config?.locale,this.hass)}</small>
      </button>
    `}buttons(){if(void 0!==this.config?.buttons)return this.config.buttons.slice(0,3);const t=[this.config?.daily_action,this.config?.history_action,this.config?.correction_action];return de.flatMap((e,i)=>{const o=t[i];return o&&"none"!==o.action?[{...e,tap_action:o}]:[]})}isVisible(t){return this.matchesVisibility(t.visibility)}matchesVisibility(t){const e=t?.mode??"all",i=t?.users??[],o=this.hass?.user;return"all"===e||("administrators"===e?!0===o?.is_admin:o?"allow-list"===e?i.includes(o.id):!i.includes(o.id):"deny-list"===e)}actions(t){return{tap_action:t.tap_action,hold_action:t.hold_action,double_tap_action:t.double_tap_action}}startHold(t,e){if(!e.hold_action||"none"===e.hold_action.action)return;const i=t.currentTarget,o=window.setTimeout(()=>{this.heldButtons.add(i),this.holdTimers.delete(i),this.dispatchAction(i,e,!0,!1)},500);this.holdTimers.set(i,o)}stopHold(t){const e=t.currentTarget,i=this.holdTimers.get(e);void 0!==i&&(window.clearTimeout(i),this.holdTimers.delete(e))}handleClick(t,e){const i=t.currentTarget;this.heldButtons.delete(i)||(e.double_tap_action&&"none"!==e.double_tap_action.action?this.clickTimers.set(i,window.setTimeout(()=>this.dispatchAction(i,e,!1,!1),250)):this.dispatchAction(i,e,!1,!1))}handleDoubleClick(t,e){const i=t.currentTarget,o=this.clickTimers.get(i);void 0!==o&&(window.clearTimeout(o),this.clickTimers.delete(i)),this.dispatchAction(i,e,!1,!0)}dispatchAction(t,e,i,o){this.hass&&ce(t,this.hass,e,i,o)}buttonColor(t){return this.colorValue(t)??"var(--state-icon-color)"}progressTrackColor(t){return"color-mix(in srgb, "+t+" 22%, var(--card-background-color))"}nextReward(t,e){return e.find(e=>e.points>t)}progressColor(t,e){const i=[...e].reverse().find(e=>e.points<=t&&this.colorValue(e.color));return this.colorValue(i?.color)??this.colorValue(this.config?.progress_color)??"var(--primary-color)"}colorValue(t){if(!t)return;const e=t.trim().toLowerCase();return he.test(e)?e:le[e]}finalRewardMessage(t){const e=t.at(-1)?.label.trim();return e||Ot("completed",this.config?.locale,this.hass)}rewardMessage(t,e){return this.config&&this.hass?`${e.points-t} ${Ot("points",this.config.locale,this.hass)} ${Ot("remaining",this.config.locale,this.hass)} ${e.label}`:""}static{this.styles=r`
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
    .compact-adjustment { min-height:40px; display:flex; align-items:center; justify-content:flex-end; gap:14px; margin-top:24px; }
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
    .rewards-content.borderless { border: 0; }
    ul { margin: 8px 0 0; padding-left: 24px; }
    li + li { margin-top: 4px; }
    .reward-list { margin-bottom: 0; }
    .rewards-content section + section { margin-top: 20px; }
    @media (max-width: 480px) {
      ha-card { padding: 16px; }
      .compact-adjustment { gap:10px; }
    }
  `}};t([ut()],pe.prototype,"weeklyPoints",void 0),t([ut()],pe.prototype,"weeklyPointsError",void 0),t([ut()],pe.prototype,"adjustmentPending",void 0),t([ut()],pe.prototype,"adjustmentError",void 0),t([ut()],pe.prototype,"confirmedPoints",void 0),pe=t([lt(_t)],pe);let ue=class extends mt{constructor(){super(...arguments),this.pendingChoreIds=new Set,this.resetOpen=!1,this.resetAll=async()=>{if(this.config){for(const t of this.config.chores)this.assignmentFor(t.chore_id)?.completed&&await this.resetSlot(t.chore_id);this.resetOpen=!1}}}static getStubConfig(){return{title:"Quick chores",children:[{child_id:"kid_1"},{child_id:"kid_2"}],chores:[{chore_id:"chore_1"}]}}static getConfigElement(){return document.createElement("chores-manager-quick-chore-card-editor")}connectedCallback(){super.connectedCallback(),this.clockTimer=window.setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){void 0!==this.clockTimer&&window.clearInterval(this.clockTimer),super.disconnectedCallback()}setConfig(t){if(!t?.children?.length||!t?.chores?.length)throw new Error("children and chores are required");this.config={locale:"auto",show_border:!0,status_layout:"rows",density:"compact",shortcut_mode:"first_incomplete",shortcut_person_size:"medium",show_manual_actions:!0,show_reset_action:!1,...t}}hassUpdateKey(t){if(this.config)return this.config.children.flatMap(e=>Dt(t,e.child_id).map(e=>[e.entityId,e.completed,e.completedByChildId,e.completedManually,t.states[e.entityId]?.attributes.completed_at]))}render(){if(!this.hass||!this.config)return W;const t=this.config.chores.filter(t=>this.assignmentFor(t.chore_id)?.completed);return L`
      <ha-card class="${!1===this.config.show_border?"borderless ":""}density-${this.config.density??"compact"}">
        ${this.config.title?L`<h1>${this.config.title}</h1>`:W}
        ${this.error?L`<p class="error" role="alert">${this.error}</p>`:W}
        <div class="statuses ${"columns"===this.config.status_layout?"columns":""}">
          ${this.config.chores.map(t=>this.renderStatus(t))}
        </div>
        ${this.renderSection(this.config.shortcut_label??this.t("quick_shortcut"),L`
          <div class="shortcuts size-${this.config.shortcut_person_size??"medium"}">${this.config.children.map(t=>this.renderChildShortcut(t))}</div>
        `)}
        ${this.config.show_manual_actions?this.renderSection(this.config.manual_label??this.t("quick_manual"),L`
          <div class="manual-actions">${this.config.chores.map(t=>this.renderManualAction(t))}</div>
        `):W}
        ${this.config.show_reset_action&&t.length?L`
          <div class="reset-control">
            ${this.resetOpen?L`<div class="reset-menu" role="menu">
              ${t.map(t=>this.renderResetAction(t))}
              ${t.length>1?L`<button class="reset-all" @click=${this.resetAll}>
                <ha-icon icon="mdi:undo-variant"></ha-icon><span>${this.t("quick_reset_all")}</span>
              </button>`:W}
            </div>`:W}
            <button class="reset-toggle" aria-expanded=${this.resetOpen} aria-label=${this.t("quick_reset")}
              title=${this.t("quick_reset")} @click=${()=>{this.resetOpen=!this.resetOpen}}>
              <ha-icon icon="mdi:undo-variant"></ha-icon>
            </button>
          </div>
        `:W}
      </ha-card>
    `}renderStatus(t){const e=this.assignmentFor(t.chore_id),i=!0===e?.completed,o=!0===e?.completedManually,s=e?.completedByChildId,n=s?this.pictureFor(s):void 0,r=e?.icon??"mdi:checkbox-marked-circle-outline";let a=t.subtitle??this.t("quick_not_completed");return i&&(a=o?`${this.t("quick_completed_manually")}${this.timeFor(e)}`:`${this.t("quick_completed_by")} ${e?.completedByChildName??s??""}${this.timeFor(e)}`),L`<div class="status ${i?"done":""}">
      <div class="status-icon">${n?L`<img src=${n} alt="" />`:L`<ha-icon icon=${i?"mdi:check-circle":r}></ha-icon>`}</div>
      <div class="status-copy"><strong>${this.slotLabel(t,e)}</strong><span>${a}</span></div>
    </div>`}renderSection(t,e){return L`<section class="action-section"><div class="separator"><strong>${t}</strong><span></span></div>${e}</section>`}renderChildShortcut(t){const e=this.activeShortcutSlot(),i=e?this.assignmentFor(e.chore_id):void 0,o=!0===i?.completed,s=o&&i?.completedByChildId===t.child_id,n=!e||this.pendingChoreIds.has(e.chore_id)||o&&!s,r=this.pictureFor(t.child_id,t.person_entity),a=Et(this.hass,t.child_id,t.display_name,void 0,t.child_id);return L`<button class="shortcut ${n?"disabled":""}" title=${e?this.slotLabel(e,i):""}
      ?disabled=${n} @click=${()=>e&&this.toggleChild(t.child_id,e.chore_id,s)}>
      <span class="portrait">${r?L`<img src=${r} alt="" />`:L`<ha-icon icon="mdi:account"></ha-icon>`}</span><span>${a}</span>
    </button>`}renderManualAction(t){const e=this.assignmentFor(t.chore_id),i=!0===e?.completed,o=t.icon??t.manual_icon_override??t.icon_override??e?.icon??"mdi:checkbox-marked-circle-outline";return L`<button class="manual" ?disabled=${i||this.pendingChoreIds.has(t.chore_id)}
      @click=${()=>this.completeManual(t.chore_id)}><ha-icon icon=${o}
        style=${t.color??t.manual_icon_color?`color: ${t.color??t.manual_icon_color}`:W}></ha-icon><strong>${this.slotLabel(t,e)}</strong></button>`}renderResetAction(t){const e=this.assignmentFor(t.chore_id);return L`<button class="reset-slot" ?disabled=${this.pendingChoreIds.has(t.chore_id)} @click=${async()=>{await this.resetSlot(t.chore_id),this.resetOpen=!1}}><ha-icon icon="mdi:undo"></ha-icon><span>${this.t("quick_reset")} ${this.slotLabel(t,e)}</span></button>`}activeShortcutSlot(){if(this.config){if("time_window"===this.config.shortcut_mode){const t=new Date,e=60*t.getHours()+t.getMinutes(),i=this.config.chores.find(t=>this.inWindow(e,t.start_time,t.end_time));if(i)return i}return this.config.chores.find(t=>!this.assignmentFor(t.chore_id)?.completed)??this.config.chores[0]}}inWindow(t,e,i){const o=this.parseTime(e),s=this.parseTime(i);return void 0!==o&&void 0!==s&&(o<s?t>=o&&t<s:t>=o||t<s)}parseTime(t){const e=/^(\d{1,2}):(\d{2})$/.exec(t??"");if(!e)return;const i=Number(e[1]),o=Number(e[2]);return o>59||i>24||24===i&&0!==o?void 0:24===i?1440:60*i+o}assignmentFor(t){if(this.hass&&this.config)for(const e of this.config.children){const i=this.assignmentForChild(e.child_id,t);if(i)return i}}assignmentForChild(t,e){return Dt(this.hass,t).find(t=>this.hass?.states[t.entityId]?.attributes.chore_id===e)}slotLabel(t,e){return t.display_name?.trim()||t.label?.trim()||e?.title||t.chore_id}pictureFor(t,e){if(this.hass)return Mt(this.hass,e??zt(this.hass,t))}timeFor(t){const e=t&&this.hass?.states[t.entityId]?.attributes.completed_at;if("string"!=typeof e)return"";const i=new Date(e);if(Number.isNaN(i.valueOf()))return"";const o=this.hass?.locale?.time_format,s="24"===o?"h23":"12"===o?"h12":void 0,n=i.toLocaleTimeString(this.hass?.locale?.language??this.hass?.language,{hour:"2-digit",minute:"2-digit",...s?{hourCycle:s}:{}});return"sv"===Ht(this.config?.locale,this.hass)?` kl. ${n}`:` at ${n}`}t(t){return Ot(t,this.config?.locale,this.hass)}async toggleChild(t,e,i){const o=this.assignmentForChild(t,e);o&&await this.call(e,"switch",i?"turn_off":"turn_on",{entity_id:o.entityId})}async completeManual(t){await this.call(t,"chores_manager","complete_chore_manually",{chore_id:t})}async resetSlot(t){const e=this.assignmentFor(t);if(e?.completedManually)await this.call(t,"chores_manager","reset_manual_chore_completion",{chore_id:t});else if(e){const i=e.completedByChildId?this.assignmentForChild(e.completedByChildId,t):e;await this.call(t,"switch","turn_off",{entity_id:i?.entityId??e.entityId})}}async call(t,e,i,o){if(this.hass&&!this.pendingChoreIds.has(t)){this.pendingChoreIds=new Set(this.pendingChoreIds).add(t),this.error=void 0;try{await this.hass.callService(e,i,o)}catch{this.error=this.t("quick_action_error")}finally{const e=new Set(this.pendingChoreIds);e.delete(t),this.pendingChoreIds=e}}}static{this.styles=r`
    :host { display: block; } ha-card { padding: 22px; } h1 { margin: 2px 0 20px; font-size: 1.55rem; font-weight: 500; }
    .statuses { display: grid; gap: 14px; } .statuses.columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .status { min-height: 62px; display: flex; gap: 12px; align-items: center; box-sizing: border-box; border: 1px solid var(--divider-color); border-radius: 14px; padding: 10px 16px; }
    .status-icon { width: 38px; height: 38px; display: grid; place-items: center; flex: 0 0 38px; } .status ha-icon { color: var(--secondary-text-color); --mdc-icon-size: 25px; }
    .status.done ha-icon { color: var(--success-color, #4caf50); } .status img { width: 38px; height: 38px; object-fit: cover; border-radius: 50%; }
    .status-copy { min-width: 0; display: grid; gap: 2px; } .status-copy strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .status-copy span { color: var(--secondary-text-color); font-size: .88rem; } .action-section { margin-top: 26px; }
    .separator { display: flex; align-items: center; gap: 20px; margin: 0 16px 18px; } .separator strong { font-size: 1rem; }
    .separator span { height: 5px; flex: 1; border-radius: 5px; background: var(--divider-color); opacity: .45; }
    .shortcuts { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 22px; }
    button { border: 0; font: inherit; color: var(--primary-text-color); cursor: pointer; } button:disabled { cursor: not-allowed; }
    .shortcut { display: grid; justify-items: center; gap: 7px; background: transparent; } .portrait { width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; }
    .portrait img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; } .portrait ha-icon { --mdc-icon-size: 64px; color: var(--secondary-text-color); }
    .shortcuts.size-small .portrait { width: 40px; height: 40px; } .shortcuts.size-small .portrait ha-icon { --mdc-icon-size: 40px; }
    .shortcuts.size-medium .portrait { width: 64px; height: 64px; } .shortcuts.size-medium .portrait ha-icon { --mdc-icon-size: 64px; }
    .shortcuts.size-large .portrait { width: 96px; height: 96px; } .shortcuts.size-large .portrait ha-icon { --mdc-icon-size: 96px; }
    .shortcut.disabled { opacity: .42; }
    .manual-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
    .manual { min-height: 62px; display: flex; align-items: center; gap: 18px; border: 1px solid var(--divider-color); border-radius: 14px; padding: 12px 18px; background: transparent; text-align: left; }
    .manual ha-icon { color: var(--primary-color); } .manual:disabled { opacity: .42; }
    .reset-control { position: relative; display: flex; justify-content: flex-end; margin-top: 10px; }
    .reset-toggle { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: transparent; color: var(--secondary-text-color); }
    .reset-toggle:hover { background: var(--secondary-background-color); color: var(--primary-text-color); }
    .reset-menu { position: absolute; right: 0; bottom: 44px; z-index: 1; display: grid; min-width: 176px; padding: 6px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--card-background-color, var(--ha-card-background, #fff)); box-shadow: var(--ha-card-box-shadow, 0 3px 8px rgb(0 0 0 / .2)); }
    .reset-slot, .reset-all { min-height: 36px; display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 8px; background: transparent; color: var(--primary-text-color); text-align: left; }
    .reset-slot:hover, .reset-all:hover { background: var(--secondary-background-color); } .reset-all { border-top: 1px solid var(--divider-color); border-radius: 0 0 8px 8px; margin-top: 4px; padding-top: 10px; }
    ha-card.density-normal { padding: 28px; } ha-card.density-normal h1 { margin-bottom: 24px; }
    .density-normal .statuses { gap: 16px; } .density-normal .status { min-height: 70px; padding: 12px 18px; }
    .density-normal .action-section { margin-top: 32px; } .density-normal .separator { margin-bottom: 22px; }
    .density-normal .shortcuts { gap: 26px; } .density-normal .manual-actions { gap: 16px; } .density-normal .manual { min-height: 70px; padding: 14px 18px; }
    ha-card.density-comfortable { padding: 32px; } ha-card.density-comfortable h1 { margin-bottom: 28px; }
    .density-comfortable .statuses { gap: 18px; } .density-comfortable .status { min-height: 80px; padding: 16px 20px; }
    .density-comfortable .action-section { margin-top: 38px; } .density-comfortable .separator { margin-bottom: 26px; }
    .density-comfortable .shortcuts { gap: 30px; } .density-comfortable .manual-actions { gap: 18px; } .density-comfortable .manual { min-height: 80px; padding: 16px 20px; }
    .error { color: var(--error-color); } ha-card.borderless { border: 0; }
    @media (max-width: 520px) { ha-card { padding: 18px; } .statuses.columns { grid-template-columns: 1fr; } .separator { margin-inline: 10px; } .manual-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); } .manual { gap: 10px; padding-inline: 12px; } }
  `}};t([ut()],ue.prototype,"pendingChoreIds",void 0),t([ut()],ue.prototype,"error",void 0),t([ut()],ue.prototype,"resetOpen",void 0),ue=t([lt(bt)],ue);const me="M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C17.98,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04Z",ge="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6V19Z";let _e=class extends at{constructor(){super(...arguments),this.onValueChanged=t=>{t.stopPropagation(),this.updateConfig(t.detail.value)},this.onChildDraftChanged=t=>{t.stopPropagation(),this.editingChildDraft={...this.editingChildDraft,...t.detail.value}},this.addChild=()=>{const t=this.availableChildren()[0];t&&this.openChildDialog(this.config.children.length,{child_id:t.id})},this.onChoreDraftChanged=t=>{t.stopPropagation();const e=t.detail.value,i="custom"===e.color_mode?e.color?.trim()||"#03a9f4":void 0;this.editingChoreDraft={...this.editingChoreDraft,...e,color:i}},this.addChore=()=>{const[t]=this.availableChores()[0]??[];t&&this.openChoreDialog(this.config.chores.length,{chore_id:t})},this.cancelChildDialog=t=>{t?.preventDefault(),t?.stopPropagation(),this.editingChildIndex=void 0,this.editingChildDraft=void 0},this.cancelChoreDialog=t=>{t?.preventDefault(),t?.stopPropagation(),this.editingChoreIndex=void 0,this.editingChoreDraft=void 0},this.saveChildDialog=t=>{t?.preventDefault(),t?.stopPropagation();const e=this.editingChildIndex,i=this.editingChildDraft;if(void 0===e||!i?.child_id)return;const o=i.display_name?.trim(),s={...i};delete s.display_name;const n={...s,...o?{display_name:o}:{}},r=[...this.config.children];e<r.length?r.splice(e,1,n):r.push(n),this.updateConfig({children:r}),this.cancelChildDialog()},this.saveChoreDialog=t=>{t?.preventDefault(),t?.stopPropagation();const e=this.editingChoreIndex,i=this.editingChoreDraft;if(void 0===e||!i?.chore_id)return;const o=i.display_name?.trim(),s={...i};delete s.label,delete s.display_name,delete s.manual_icon_override,delete s.manual_icon_color,delete s.icon_override,delete s.color_mode,delete s.color;const n="custom"===i.color_mode?i.color?.trim()||"#03a9f4":void 0,r={...s,...o?{display_name:o}:{},...n?{color:n}:{}},a=[...this.config.chores];e<a.length?a.splice(e,1,r):a.push(r),this.updateConfig({chores:a}),this.cancelChoreDialog()},this.allowItemDrop=t=>{t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move")},this.computeLabel=t=>({title:"Title",locale:"Language",show_border:"Show card border",status_layout:"Status layout",density:"Density",shortcut_mode:"Portrait button behavior",shortcut_person_size:"Shortcut portrait size",shortcut_label:"Shortcut section title (optional)",show_manual_actions:"Show manual action",manual_label:"Manual section title (optional)",show_reset_action:"Show reset action",child_id:"Child",display_name:"Display name",chore_id:"Chore",subtitle:"Subtitle",start_time:"Active from (HH:MM)",end_time:"Active until (HH:MM; 24:00 allowed)",icon:"Icon",color_mode:"Icon color",color:"Color"}[t.name])}setConfig(t){this.config={locale:"auto",show_border:!0,status_layout:"rows",density:"compact",shortcut_mode:"first_incomplete",shortcut_person_size:"medium",show_manual_actions:!0,show_reset_action:!1,...t,children:t.children??[],chores:(t.chores??[]).map(t=>{const{label:e,...i}=t,o=t.display_name??(e?.trim()&&e!==t.chore_id?e:void 0),s=t.icon??t.manual_icon_override??t.icon_override,n=t.color??t.manual_icon_color;return{...i,...o?{display_name:o}:{},...s?{icon:s}:{},...n?{color:n}:{}}})}}render(){return this.config?L`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${this.schema()}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.onValueChanged}
      ></ha-form>
      <section class="config-section children-section">
        <h2>Children</h2>
        <div class="item-list">
          ${this.config.children.map((t,e)=>this.renderChildRow(t,e))}
        </div>
        <button class="add-child" ?disabled=${0===this.availableChildren().length} @click=${this.addChild}>
          <ha-icon icon="mdi:plus"></ha-icon>Add child
        </button>
      </section>
      <section class="config-section chores-section">
        <h2>Chores</h2>
        <div class="item-list">
          ${this.config.chores.map((t,e)=>this.renderChoreRow(t,e))}
        </div>
        <button class="add-chore" ?disabled=${0===this.availableChores().length} @click=${this.addChore}>
          <ha-icon icon="mdi:plus"></ha-icon>Add chore
        </button>
      </section>
      ${this.renderChildDialog()}
      ${this.renderChoreDialog()}
    `:W}schema(){return[{name:"title",selector:{text:{}}},{name:"locale",selector:{select:{mode:"dropdown",options:[{label:"Automatic",value:"auto"},{label:"English",value:"en"},{label:"Svenska",value:"sv"}]}}},{name:"show_border",selector:{boolean:{}}},{name:"status_layout",selector:{select:{mode:"dropdown",options:[{label:"One row per chore",value:"rows"},{label:"Chores side by side",value:"columns"}]}}},{name:"density",selector:{select:{mode:"dropdown",options:[{label:"Compact",value:"compact"},{label:"Normal",value:"normal"},{label:"Comfortable",value:"comfortable"}]}}},{name:"shortcut_mode",selector:{select:{mode:"dropdown",options:[{label:"First unfinished chore",value:"first_incomplete"},{label:"Choose chore by time",value:"time_window"}]}}},{name:"shortcut_person_size",selector:{select:{mode:"dropdown",options:[{label:"Small",value:"small"},{label:"Medium",value:"medium"},{label:"Large",value:"large"}]}}},{name:"shortcut_label",selector:{text:{}}},{name:"show_manual_actions",selector:{boolean:{}}},{name:"manual_label",selector:{text:{}}},{name:"show_reset_action",selector:{boolean:{}}}]}renderChildRow(t,e){const i=this.childName(t);return L`
      <section class="item-row child-row" draggable="true" @dragstart=${t=>this.startChildDrag(t,e)}
        @dragover=${this.allowItemDrop} @drop=${t=>this.dropChild(t,e)}>
        <ha-icon class="drag-handle" icon="mdi:drag-horizontal-variant" aria-label="Drag to reorder"></ha-icon>
        <span class="item-name">${i}</span>
        <ha-icon-button .label=${"Edit child"} title="Edit child" .path=${me}
          @click=${()=>this.openChildDialog(e,t)}></ha-icon-button>
        <ha-icon-button .label=${"Remove child"} title="Remove child" .path=${ge}
          ?disabled=${1===this.config.children.length} @click=${()=>this.removeConfiguredChild(e)}></ha-icon-button>
      </section>
    `}renderChildDialog(){const t=this.editingChildIndex,e=this.editingChildDraft;return void 0!==t&&e?L`
      <ha-dialog .open=${!0} header-title=${this.childName(e)} @closed=${this.cancelChildDialog}>
        <ha-form .hass=${this.hass} .data=${e} .schema=${this.childSchema()} .computeLabel=${this.computeLabel}
          @value-changed=${this.onChildDraftChanged}></ha-form>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${this.cancelChildDialog}>${this.dialogLabel("cancel")}</ha-button>
          <ha-button slot="primaryAction" @click=${this.saveChildDialog}>${this.dialogLabel("save")}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `:W}childSchema(){return[{name:"child_id",required:!0,selector:{select:{mode:"dropdown",options:(this.hass?At(this.hass):[]).map(t=>({label:t.name,value:t.id}))}}},{name:"display_name",selector:{text:{}}}]}availableChildren(){const t=new Set(this.config?.children.map(t=>t.child_id));return(this.hass?At(this.hass):[]).filter(e=>!t.has(e.id))}removeConfiguredChild(t){this.config.children.length>1&&this.updateConfig({children:this.config.children.filter((e,i)=>i!==t)})}childName(t){return t.display_name?.trim()??(this.hass?At(this.hass):[]).find(e=>e.id===t.child_id)?.name??t.child_id}renderChoreRow(t,e){return L`
      <section class="item-row chore-row" draggable="true" @dragstart=${t=>this.startChoreDrag(t,e)}
        @dragover=${this.allowItemDrop} @drop=${t=>this.dropChore(t,e)}>
        <ha-icon class="drag-handle" icon="mdi:drag-horizontal-variant" aria-label="Drag to reorder"></ha-icon>
        <span class="item-name">${this.choreName(t)}</span>
        <ha-icon-button .label=${"Edit chore"} title="Edit chore" .path=${me}
          @click=${()=>this.openChoreDialog(e,t)}></ha-icon-button>
        <ha-icon-button .label=${"Remove chore"} title="Remove chore" .path=${ge}
          ?disabled=${1===this.config.chores.length} @click=${()=>this.removeConfiguredChore(e)}></ha-icon-button>
      </section>
    `}renderChoreDialog(){const t=this.editingChoreIndex,e=this.editingChoreDraft;return void 0!==t&&e?L`
      <ha-dialog .open=${!0} header-title=${this.choreName(e)} @closed=${this.cancelChoreDialog}>
        <ha-form .hass=${this.hass} .data=${e} .schema=${this.choreSchema(e)} .computeLabel=${this.computeLabel}
          @value-changed=${this.onChoreDraftChanged}></ha-form>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${this.cancelChoreDialog}>${this.dialogLabel("cancel")}</ha-button>
          <ha-button slot="primaryAction" @click=${this.saveChoreDialog}>${this.dialogLabel("save")}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `:W}choreSchema(t){const e="custom"===t.color_mode||Boolean(t.color);return[{name:"chore_id",required:!0,selector:{select:{mode:"dropdown",options:[...this.choreTitles()].map(([t,e])=>({value:t,label:e}))}}},{name:"display_name",selector:{text:{}}},{name:"subtitle",selector:{text:{}}},..."time_window"===this.config?.shortcut_mode?[{name:"start_time",selector:{text:{}}},{name:"end_time",selector:{text:{}}}]:[],{name:"icon",selector:{icon:{}}},{name:"color_mode",selector:{select:{mode:"dropdown",options:[{label:"Automatic",value:"automatic"},{label:"Custom",value:"custom"}]}}},...e?[{name:"color",selector:{text:{type:"color"}}}]:[]]}availableChores(){const t=new Set(this.config?.chores.map(t=>t.chore_id));return[...this.choreTitles()].filter(([e])=>!t.has(e))}removeConfiguredChore(t){this.config.chores.length>1&&this.updateConfig({chores:this.config.chores.filter((e,i)=>i!==t)})}openChildDialog(t,e){this.editingChildIndex=t,this.editingChildDraft={...e}}openChoreDialog(t,e){this.editingChoreIndex=t,this.editingChoreDraft=this.toEditorChore(e)}startChildDrag(t,e){this.draggingChildIndex=e,t.dataTransfer?.setData("text/plain",String(e)),t.dataTransfer&&(t.dataTransfer.effectAllowed="move")}dropChild(t,e){t.preventDefault();const i=this.draggingChildIndex??Number(t.dataTransfer?.getData("text/plain"));if(this.draggingChildIndex=void 0,!Number.isInteger(i)||i<0||i===e)return;const o=[...this.config.children],[s]=o.splice(i,1);o.splice(e,0,s),this.updateConfig({children:o})}startChoreDrag(t,e){this.draggingChoreIndex=e,t.dataTransfer?.setData("text/plain",String(e)),t.dataTransfer&&(t.dataTransfer.effectAllowed="move")}dropChore(t,e){t.preventDefault();const i=this.draggingChoreIndex??Number(t.dataTransfer?.getData("text/plain"));if(this.draggingChoreIndex=void 0,!Number.isInteger(i)||i<0||i===e)return;const o=[...this.config.chores],[s]=o.splice(i,1);o.splice(e,0,s),this.updateConfig({chores:o})}choreName(t){return t.display_name?.trim()??this.choreTitles().get(t.chore_id)??t.chore_id}toEditorChore(t){return{...t,color_mode:t.color?"custom":"automatic"}}dialogLabel(t){const e=this.hass?.language?.toLowerCase().startsWith("sv");return"cancel"===t?e?"Avbryt":"Cancel":e?"Spara":"Save"}updateConfig(t){this.config={...this.config,...t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}choreTitles(){const t=new Map;for(const e of Object.values(this.hass?.states??{})){const i=e.attributes.chore_id;if("string"==typeof i){const o=e.attributes.title;t.set(i,"string"==typeof o?o:i)}}return t}static{this.styles=r`
    .config-section { display: grid; gap: 12px; margin: 24px 16px 0; }
    h2 { margin: 0; font-size: 16px; }
    .item-list { display: grid; gap: 8px; }
    .item-row { align-items: center; border: 1px solid var(--divider-color); border-radius: 8px; cursor: grab; display: grid; gap: 8px; grid-template-columns: auto 1fr auto auto; min-height: 48px; padding: 0 8px 0 12px; }
    .item-row:active { cursor: grabbing; }
    .item-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .drag-handle { color: var(--secondary-text-color); }
    .add-child, .add-chore { align-items: center; background: transparent; border: 1px solid var(--divider-color); border-radius: 8px; color: var(--primary-text-color); cursor: pointer; display: inline-flex; font: inherit; gap: 8px; justify-content: center; min-height: 40px; padding: 0 12px; }
    .add-child:disabled, .add-chore:disabled { cursor: not-allowed; opacity: .5; }
  `}};t([pt({attribute:!1})],_e.prototype,"hass",void 0),t([ut()],_e.prototype,"config",void 0),t([ut()],_e.prototype,"editingChildIndex",void 0),t([ut()],_e.prototype,"editingChildDraft",void 0),t([ut()],_e.prototype,"editingChoreIndex",void 0),t([ut()],_e.prototype,"editingChoreDraft",void 0),_e=t([lt("chores-manager-quick-chore-card-editor")],_e),console.info("%c CHORES MANAGER CARDS %c 0.6.0 ","color: white; background: #1677b8; font-weight: 600;","color: white; background: #444;"),window.customCards=window.customCards??[],window.customCards.push({type:yt,name:"Chores Manager History",description:"Current-week completed chores by child and date.",preview:!1},{type:ft,name:"Chores Manager Correction",description:"Admin correction by child and date.",preview:!1},{type:gt,name:"Chores Manager Daily",description:"Child-facing daily chore checklist.",preview:!1},{type:_t,name:"Chores Manager Overview",description:"Child points and reward overview.",preview:!1},{type:bt,name:"Chores Manager Quick Chore",description:"Compact shared-chore status and claim controls.",preview:!1});
