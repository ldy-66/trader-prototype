const features = [
 {id:1,name:"首页当日盈亏",sides:["custom"]},
 {id:2,name:"委托属性筛选",sides:["trader"]},
 {id:3,name:"持仓板块多选",sides:["custom","trader"]},
 {id:4,name:"常用金额快捷下单",sides:["custom","trader"]},
 {id:5,name:"下单面板滚轮保护",sides:["custom"]},
 {id:6,name:"订单明细零值显示",sides:["custom","trader"]},
 {id:7,name:"下单面板资金账户号",sides:["custom","trader"]},
 {id:8,name:"柜台账号映射下拉选择",sides:["trader"]},
 {id:9,name:"购买力账号名称兼容",sides:["trader"]},
 {id:10,name:"客户配置筛选与批量维护",sides:["bct"]},
];
const labels = {custom:"Custom",trader:"Trader",bct:"BCT"};
const byId=id=>document.getElementById(id);
const nav=byId("features");
const frame=byId("prototype");
nav.innerHTML=features.map(feature=>`<button class="feature" data-feature="${feature.id}">${feature.id}　${feature.name}</button>`).join("");
let current=features[0], side="custom";
function select(featureId, selectedSide) {
 current=features.find(feature=>feature.id===Number(featureId)) || features[0];
 side=current.sides.includes(selectedSide) ? selectedSide : current.sides[0];
 nav.querySelectorAll("button").forEach(button=>{
   const active=Number(button.dataset.feature)===current.id;
   button.classList.toggle("active",active);
   button.setAttribute("aria-current",active?"page":"false");
 });
 byId("title").textContent=current.name;
 byId("clients").innerHTML=current.sides.map(client=>`<button class="client ${client===side?"active":""}" data-side="${client}" aria-pressed="${client===side}">${labels[client]}</button>`).join("");
 const url=`${side}/index.html?feature=${current.id}`;
 byId("loadStatus").textContent="正在打开";
 byId("openPage").href=url;
 frame.src=url;
 const hash=`#feature=${current.id}&side=${side}`;
 if(location.hash!==hash) history.replaceState(null,"",hash);
}
nav.addEventListener("click",event=>{if(event.target.dataset.feature)select(event.target.dataset.feature,side)});
byId("clients").addEventListener("click",event=>{if(event.target.dataset.side)select(current.id,event.target.dataset.side)});
frame.addEventListener("load",()=>byId("loadStatus").textContent="");
const hash=new URLSearchParams(location.hash.slice(1));
select(hash.get("feature")||1,hash.get("side"));
