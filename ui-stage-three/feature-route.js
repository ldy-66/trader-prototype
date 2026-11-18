(() => {
 const feature = new URLSearchParams(location.search).get("feature");
 const custom = location.pathname.includes("/custom/");
 const click = selector => document.querySelector(selector)?.click();
 const route = () => {
   if (["1","2","4","5","7"].includes(feature)) {
     click(custom ? '[data-view="trade"]' : '[data-view="orders"]');
     if (custom) click('[data-cf-market="证券交易"]');
     else click('[data-trading-page="证券交易"]');
   }
   if (feature === "3") {
     click('[data-view="data"]');
     if (!custom) click('[data-data-tab="持仓信息"]');
   }
   if (feature === "6") {
     click('[data-view="data"]');
     if (custom) click('[data-order-detail="订单查询"]');
     else click('[data-data-tab="订单查询"]');
   }
   if (["8","9"].includes(feature)) {
     click('[data-view="config"]');
     click(feature === "8" ? '[data-config-tab="柜台账号映射"]' : '[data-config-tab="购买力账号"]');
     if (feature === "8") click("[data-new-counter-mapping]");
   }
   if (feature === "5") {
     if (custom) {
       click("#customSettingsButton");
       click('[data-settings-tab="protection"]');
     } else {
       click("#traderQuickSettings");
       click('[data-tab="protection"]');
     }
   }
 };
 route();
 const style=document.createElement("style");
 style.textContent=".pending-task-card {display:none !important;}";
 document.head.append(style);
})();



