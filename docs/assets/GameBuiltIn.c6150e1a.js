let e=document.createElement("style");e.innerHTML="",document.head.appendChild(e);import{d as t,r as o,w as i,u as n,a,o as s,c as r}from"./index.5d65c02c.js";import{getBuiltInTopicByTitle as c}from"./topic.7da3fbee.js";import"./VIcon.e6fc1bfa.js";import{s as m}from"./TheGame.5c7ccb2c.js";var l=t({name:"Game",components:{TheGame:m},props:{builtInTopicTitle:String},setup(e){const t=n(),a=o(e.builtInTopicTitle||" "),s=o([]),r=()=>{t.replace({name:"home"})};return i(async()=>{const{builtInTopicTitle:t}=e;if(!t)return void r();const o=await c(t);o?(a.value=o.title,s.value=o.words):r()}),{title:a,words:s,goHome:()=>{t.push({name:"home"})}}}});l.render=function(e,t,o,i,n,c){const m=a("the-game");return s(),r(m,{title:e.title,words:e.words,"is-editable":!1,"onGo-home":e.goHome},null,8,["title","words","onGo-home"])},l.__file="src/views/GameBuiltIn.vue";export default l;