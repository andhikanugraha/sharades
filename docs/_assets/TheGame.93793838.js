import{d as e,g as t,o as n,c as o,t as r,r as l,f as i,h as a,a as c,b as u,F as s,e as f,i as d,j as v}from"./index.17b11773.js";import{s as p,b,c as h,d as y,e as m,g as j,h as g,i as w,j as k}from"./VIcon.0db901b6.js";var S="object"==typeof global&&global&&global.Object===Object&&global,x="object"==typeof self&&self&&self.Object===Object&&self,C=S||x||Function("return this")(),A=C.Symbol,T=Object.prototype,O=T.hasOwnProperty,F=T.toString,W=A?A.toStringTag:void 0;var P=Object.prototype.toString;var E=A?A.toStringTag:void 0;function H(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":E&&E in Object(e)?function(e){var t=O.call(e,W),n=e[W];try{e[W]=void 0;var o=!0}catch(e){}var r=F.call(e);return o&&(t?e[W]=n:delete e[W]),r}(e):function(e){return P.call(e)}(e)}function M(e){return null!=e&&"object"==typeof e}var U=Array.isArray;var I=/^(?:0|[1-9]\d*)$/;function V(e,t){var n=typeof e;return!!(t=null==t?9007199254740991:t)&&("number"==n||"symbol"!=n&&I.test(e))&&e>-1&&e%1==0&&e<t}function z(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=9007199254740991}function B(e){return null!=e&&z(e.length)&&!function(e){if(!function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}(e))return!1;var t=H(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t}(e)}var L=Object.prototype;function _(e){return M(e)&&"[object Arguments]"==H(e)}var D=Object.prototype,G=D.hasOwnProperty,N=D.propertyIsEnumerable,q=_(function(){return arguments}())?_:function(e){return M(e)&&G.call(e,"callee")&&!N.call(e,"callee")};var R="object"==typeof exports&&exports&&!exports.nodeType&&exports,$=R&&"object"==typeof module&&module&&!module.nodeType&&module,J=$&&$.exports===R?C.Buffer:void 0,K=(J?J.isBuffer:void 0)||function(){return!1},Q={};Q["[object Float32Array]"]=Q["[object Float64Array]"]=Q["[object Int8Array]"]=Q["[object Int16Array]"]=Q["[object Int32Array]"]=Q["[object Uint8Array]"]=Q["[object Uint8ClampedArray]"]=Q["[object Uint16Array]"]=Q["[object Uint32Array]"]=!0,Q["[object Arguments]"]=Q["[object Array]"]=Q["[object ArrayBuffer]"]=Q["[object Boolean]"]=Q["[object DataView]"]=Q["[object Date]"]=Q["[object Error]"]=Q["[object Function]"]=Q["[object Map]"]=Q["[object Number]"]=Q["[object Object]"]=Q["[object RegExp]"]=Q["[object Set]"]=Q["[object String]"]=Q["[object WeakMap]"]=!1;var X,Y="object"==typeof exports&&exports&&!exports.nodeType&&exports,Z=Y&&"object"==typeof module&&module&&!module.nodeType&&module,ee=Z&&Z.exports===Y&&S.process,te=function(){try{var e=Z&&Z.require&&Z.require("util").types;return e||ee&&ee.binding&&ee.binding("util")}catch(e){}}(),ne=te&&te.isTypedArray,oe=ne?(X=ne,function(e){return X(e)}):function(e){return M(e)&&z(e.length)&&!!Q[H(e)]},re=Object.prototype.hasOwnProperty;function le(e,t){var n=U(e),o=!n&&q(e),r=!n&&!o&&K(e),l=!n&&!o&&!r&&oe(e),i=n||o||r||l,a=i?function(e,t){for(var n=-1,o=Array(e);++n<e;)o[n]=t(n);return o}(e.length,String):[],c=a.length;for(var u in e)!t&&!re.call(e,u)||i&&("length"==u||r&&("offset"==u||"parent"==u)||l&&("buffer"==u||"byteLength"==u||"byteOffset"==u)||V(u,c))||a.push(u);return a}var ie=function(e,t){return function(n){return e(t(n))}}(Object.keys,Object),ae=Object.prototype.hasOwnProperty;function ce(e){if(n=(t=e)&&t.constructor,t!==("function"==typeof n&&n.prototype||L))return ie(e);var t,n,o=[];for(var r in Object(e))ae.call(e,r)&&"constructor"!=r&&o.push(r);return o}function ue(e,t){return function(e,t){for(var n=-1,o=null==e?0:e.length,r=Array(o);++n<o;)r[n]=t(e[n],n,e);return r}(t,(function(t){return e[t]}))}function se(e){return null==e?[]:ue(e,function(e){return B(e)?le(e):ce(e)}(e))}var fe=Math.floor,de=Math.random;function ve(e,t){var n,o,r=-1,l=e.length,i=l-1;for(t=void 0===t?l:t;++r<t;){var a=(o=i,(n=r)+fe(de()*(o-n+1))),c=e[a];e[a]=e[r],e[r]=c}return e.length=t,e}function pe(e){return ve(function(e,t){var n=-1,o=e.length;for(t||(t=Array(o));++n<o;)t[n]=e[n];return t}(e))}function be(e){return ve(se(e))}function he(e){return(U(e)?pe:be)(e)}var ye=e({name:"VFit",props:{text:String,width:Number},setup:e=>({fontSize:t(()=>{var t;const n=1.3*(e.width||100),o=(null==(t=e.text)?void 0:t.length)||1;return Math.min(Math.max(n/o,8),22)+"vw"})})});function me(){return Math.floor(Date.now()/1e3)}ye.render=function(e,t,l,i,a,c){return n(),o("h1",{style:{fontSize:e.fontSize}},r(e.text),5)},ye.__file="src/components/VFit.vue";var je=e({name:"TheGame",components:{VFit:ye,VIcon:p},props:{isEditable:Boolean,words:Array,title:String},setup(e,{emit:n}){const o=l(e.title),r=i(e.words||[]),c=l(!1),u=l(me()),s=i([]),f=i(new Set),d=i(new Set),v=l(0),p=l(0),S=l(0),x=l(!1),C=l(60),A=l(),T=()=>{x.value=!0,u.value=me(),A.value&&(clearTimeout(A.value),A.value=void 0)},O=()=>{f.add(p.value);const e=new Set(d);let t;t=p.value+1>=s.length?0:p.value+1;let n=-1;for(;t!==p.value&&-1===n;)e.has(t)?t+1>=s.length?t=0:t+=1:n=t;-1===n?T():n<s.length&&(p.value=n),n>v.value&&(v.value=n)},F=()=>{const e=r;if(!e||0===e.length)return;const t=[];if(f.size<e.length)for(let n=0;n<e.length;n+=1)f.has(n)||t.push(n);else{for(let n=0;n<e.length;n+=1)t.push(n);f.clear()}const n=he(t),o=he(Array.from(f.values()));s.splice(0),s.splice(0,0,...n,...o)},W=()=>{S.value=u.value-me(),S.value>0?A.value=setTimeout(()=>W(),1e3):x.value=!0};a(e,()=>{r.splice(0),e.words&&r.splice(0,0,...e.words),F(),o.value=e.title});const P=t(()=>e.words?e.words[s[p.value]]:""),E=t(()=>{const t=[];if(!e.words)return t;for(let n=0;n<=v.value;n+=1)t.push({word:e.words[s[n]],isCorrect:!1});return d.forEach(e=>{t[e]&&(t[e].isCorrect=!0)}),t}),H=t(()=>d.size);return{viewTitle:o,share:()=>{try{navigator.share({title:"Sharades: "+o.value,url:window.location.toString()})}finally{}},currentWord:P,results:E,score:H,timeLimit:C,setTimeLimit:e=>{C.value=e},nextWord:O,finish:T,reset:()=>{c.value=!1,x.value=!1,p.value=0,d.clear(),v.value=0,A.value&&(clearTimeout(A.value),A.value=void 0),F()},start:()=>{c.value=!0,u.value=me()+C.value,W()},edit:()=>{n("edit-topic")},goHome:()=>{n("go-home")},correctWord:()=>{d.add(p.value),O()},shuffledWords:s,remainingSeconds:S,isStarted:c,isFinished:x,faHome:b,faPlay:h,faStepForward:y,faCheck:m,faUndo:j,faEdit:g,faTimes:w,faShare:k}}});const ge={key:0,class:"root",id:"finished"},we=v("Home "),ke=v("Play again "),Se={key:1,class:"root",id:"active"},xe={id:"timer"},Ce={class:"overlay"},Ae={id:"correct"},Te=v("Correct "),Oe={id:"skip"},Fe=v("Skip "),We={key:2,class:"root",id:"initial"},Pe={class:"pull-right"},Ee=u("h3",null,"Sharades",-1),He={class:"info"},Me=u("div",{class:"label"},"Topic:",-1),Ue={class:"value"},Ie={class:"info"},Ve=u("div",{class:"label"},"Time limit:",-1),ze={class:"value"},Be=v("Play ");je.render=function(e,t,l,i,a,p){const b=c("v-icon"),h=c("v-fit");return e.isFinished?(n(),o("div",ge,[u("header",null,[u("div",{class:"close-button",onClick:t[1]||(t[1]=(...t)=>e.reset(...t))},[u(b,{icon:e.faTimes,"fixed-width":""},null,8,["icon"])]),u("h3",null,"Score: "+r(e.score),1)]),u("main",null,[u("div",null,[u("ol",null,[(n(!0),o(s,null,f(e.results,(t,l)=>(n(),o("li",{key:l,class:{correct:t.isCorrect}},[u(b,{icon:t.isCorrect?e.faCheck:e.faTimes},null,8,["icon"]),v(" "+r(t.word),1)],2))),128))])])]),u("nav",null,[u("p",null,[u("button",{onClick:t[2]||(t[2]=(...t)=>e.goHome(...t))},[u(b,{icon:e.faHome},null,8,["icon"]),we])]),u("p",null,[u("button",{id:"reset",onClick:t[3]||(t[3]=(...t)=>e.reset(...t))},[u(b,{icon:e.faUndo},null,8,["icon"]),ke])])])])):e.isStarted?(n(),o("div",Se,[u("header",null,[u("div",{class:"close-button",onClick:t[4]||(t[4]=(...t)=>e.reset(...t))},[u(b,{icon:e.faTimes,"fixed-width":""},null,8,["icon"])]),u("h3",xe,r(e.remainingSeconds),1)]),u("main",null,[u("div",Ce,[u("div",{class:"half",onClick:t[5]||(t[5]=(...t)=>e.correctWord(...t))}),u("div",{class:"half",onClick:t[6]||(t[6]=(...t)=>e.nextWord(...t))})]),u(h,{text:e.currentWord},null,8,["text"])]),u("nav",null,[u("p",{onClick:t[7]||(t[7]=(...t)=>e.correctWord(...t))},[u("button",Ae,[u(b,{icon:e.faCheck},null,8,["icon"]),Te])]),u("p",{onClick:t[8]||(t[8]=(...t)=>e.nextWord(...t))},[u("button",Oe,[u(b,{icon:e.faStepForward},null,8,["icon"]),Fe])])])])):(n(),o("div",We,[u("header",null,[u("div",{class:"close-button",onClick:t[9]||(t[9]=(...t)=>e.goHome(...t))},[u(b,{icon:e.faHome},null,8,["icon"])]),u("div",Pe,[e.isEditable?u(b,{key:0,onClick:e.edit,icon:e.faEdit},null,8,["onClick","icon"]):d("v-if",!0),u(b,{onClick:e.share,icon:e.faShare},null,8,["onClick","icon"])]),Ee]),u("main",null,[u("div",null,[u("div",He,[Me,u("div",Ue,r(e.viewTitle),1)]),u("div",Ie,[Ve,u("div",ze,[(n(),o(s,null,f([30,60,90,120],t=>u("span",{key:t,class:{option:!0,selected:e.timeLimit===t},onClick:n=>e.setTimeLimit(t)},r(t),11,["onClick"])),64))])])])]),u("nav",null,[u("p",null,[u("button",{id:"start",onClick:t[10]||(t[10]=(...t)=>e.start(...t))},[u(b,{icon:e.faPlay},null,8,["icon"]),Be])])])]))},je.__file="src/components/TheGame.vue";export{je as s};
