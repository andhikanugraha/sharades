let e=document.createElement("style");e.innerHTML="",document.head.appendChild(e);import{d as t,f as o,w as i,u as a,a as r,o as d,c as s}from"./index.7ac17bbb.js";import"./VIcon.e5d9affd.js";import{f as n,s as c}from"./TopicStore.f9b830a4.js";import{s as p}from"./TheGame.3f1baeaf.js";import{decodeTopic as l}from"./TopicEncoding.de7adf33.js";var m=t({name:"Game",components:{TheGame:p},props:{id:String,encodedTopic:String,storedTopics:Array},setup(e){const t=a(),r=o((e.storedTopics&&e.id?null==(d=e.storedTopics.find(t=>t.id===e.id))?void 0:d.title:"")||" ");var d;const s=o([]),p=o(e.id),m=()=>{t.replace({name:"home"})};return i(async()=>{if(!e.encodedTopic)return m();try{const t=await l(e.encodedTopic);if(!t)return m();if(r.value=t.title,s.value=t.words,!e.id){let e=await n(t);e||(e=await c(t)),p.value=e}}catch(e){return m()}}),{title:r,words:s,topicId:p}}});m.render=function(e,t,o,i,a,n){const c=r("the-game");return d(),s(c,{title:e.title,words:e.words,id:e.topicId},null,8,["title","words","id"])},m.__file="src/views/GameByEncodedTopic.vue";export default m;
