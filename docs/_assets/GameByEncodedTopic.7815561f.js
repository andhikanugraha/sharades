let e=document.createElement("style");e.innerHTML="",document.head.appendChild(e);import{d as o,r as t,w as i,u as d,a,o as r,c as s}from"./index.17b11773.js";import{findTopicId as n,saveTopic as c}from"./TopicStore.7d285d8b.js";import"./VIcon.0db901b6.js";import{s as m}from"./TheGame.93793838.js";import{decodeTopic as p}from"./TopicEncoding.de7adf33.js";var l=o({name:"Game",components:{TheGame:m},props:{id:String,encodedTopic:String,storedTopics:Array},setup(e,{emit:o}){const a=d(),r=t((e.storedTopics&&e.id?null==(s=e.storedTopics.find(o=>o.id===e.id))?void 0:s.title:"")||" ");var s;const m=t([]),l=t(!0),u=t(e.id),f=()=>{a.replace({name:"home"})};return i(async()=>{if(!e.encodedTopic)return f();try{const t=await p(e.encodedTopic);if(!t)return f();if(r.value=t.title,m.value=t.words,!e.id){let e=await n(t);e||(e=await c(t),o("load-stored-topics")),u.value=e}}catch(e){return f()}}),{title:r,words:m,isEditable:l,goHome:()=>{a.push({name:"home"})},goEdit:()=>{a.push({name:"edit",params:{id:u.value||""}})}}}});l.render=function(e,o,t,i,d,n){const c=a("the-game");return r(),s(c,{title:e.title,words:e.words,"is-editable":e.isEditable,"onEdit-topic":e.goEdit,"onGo-home":e.goHome},null,8,["title","words","is-editable","onEdit-topic","onGo-home"])},l.__file="src/views/GameByEncodedTopic.vue";export default l;
