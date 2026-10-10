const navItems = [
  ["market", "行情", "i-market"],
  ["orders", "交易", "i-trade"],
  ["lending", "融券", "i-lend"],
  ["data", "数据", "i-data"],
  ["risk", "风控", "i-risk"],
  ["strategy", "策略", "i-strategy"],
  ["config", "配置", "i-config"],
  ["approval", "审批", "i-approve"],
];

const sampleSymbols = [
  ["IC2303.CFE", "中证500股指", "0.00", "0.00", "0.00", "0.00"],
  ["000001.SZ", "平安银行", "337,335,870.29", "10.79", "10.76", "9.71"],
  ["688001.SH", "华兴源创", "491,972,322.00", "80.68", "79.15", "64.54"],
  ["au2702.SHF", "沪黄金2702", "0.00", "1,200.00", "0.00", "1,221.20"],
  ["000981.SZC", "山子高科", "527,890,702.91", "3.88", "3.81", "3.49"],
  ["000981.SZ", "山子高科", "527,890,702.91", "3.88", "3.81", "3.49"],
  ["000002.SZC", "万科A", "219,654,180.39", "3.39", "3.38", "3.05"],
  ["000002.SZ", "万科A", "217,024,957.39", "3.39", "3.38", "3.05"],
  ["600000.SH", "浦发银行", "186,204,612.38", "9.54", "9.49", "8.73"],
];

const orderRows = [
  ["买入", "待确认", "普通交易", "DEMO-1001", "QFII-A", "000001.SZ", "HighTouch", "10.80", "2,000"],
  ["卖出", "已成", "空头交易", "DEMO-1002", "QFII-B", "600000.SH", "LowTouch", "9.52", "5,000"],
  ["买入", "待撤", "普通交易", "DEMO-1003", "CNY-DEMO", "000001.SZ", "ALL", "10.79", "1,000"],
  ["卖出", "已撤", "空头交易", "DEMO-1004", "QFII-C", "300212.SZ", "LowTouch", "9.31", "10,000"],
  ["卖出", "待撤", "空头交易", "DEMO-1005", "QFII-D", "300264.SZ", "HighTouch", "8.85", "100"],
];

let state = {
  view: "market",
  direction: "buy",
  selectedSymbol: 1,
  price: 10.80,
  quantity: 0,
  orderMode: "HighTouch",
  riskTab: "风控设置",
  configTab: "购买力账号",
};

const mainNav = document.querySelector("#mainNav");
const workspace = document.querySelector("#workspace");
const toast = document.querySelector("#toast");

mainNav.innerHTML = navItems.map(([id, label, icon]) => `
  <button class="nav-item" data-view="${id}" type="button" title="${label}">
    <svg><use href="#${icon}"></use></svg><span>${label}</span>
  </button>`).join("");

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => navigate(item.dataset.view));
});

function navigate(view) {
  if (["strategy", "approval", "system"].includes(view)) {
    notify(`${view === "strategy" ? "策略" : view === "approval" ? "审批" : "系统"}模块待补充截图后继续复刻`);
    return;
  }
  state.view = view;
  render();
}

function render() {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === state.view));
  const views = { market: marketView, orders: ordersView, lending: lendingView, data: dataView, risk: riskView, config: configView };
  workspace.innerHTML = views[state.view]();
  bindInteractions();
}

function marketView() {
  return `<section class="view with-trade-panel market-view">
    <div class="main-column">
      <div class="panel market-main">
        <div class="market-toolbar">
          <div class="market-row market-tabs">
            ${["自选", "沪深", "港股", "美股", "期货", "持仓"].map((x, i) => `<button class="${i === 0 ? "active" : ""}">${x}</button>`).join("")}
            <span class="search-wrap"><input class="field search" placeholder="标的代码、名称" /></span>
            <span class="toolbar-spacer"></span><span class="tiny-icon">⚙</span><span class="tiny-icon">≡</span>
          </div>
          <div class="market-row market-tabs">
            <span class="tiny-icon">☷</span>
            ${["全部", "沪深", "美股", "港股", "期货", "111 11", "sjntest1"].map((x, i) => `<button class="${i === 0 ? "active" : ""}">${x}</button>`).join("")}
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table market-table"><colgroup><col style="width:45px"><col style="width:110px"><col style="width:230px"><col style="width:120px"><col style="width:80px"><col style="width:80px"><col style="width:90px"></colgroup>
            <thead><tr><th>序列</th><th>标的代码</th><th>标的名称</th><th>成交额</th><th>昨收</th><th>今开</th><th>跌停</th></tr></thead>
            <tbody>${sampleSymbols.map((r, i) => `<tr data-symbol-index="${i}" class="${i === state.selectedSymbol ? "selected" : ""}"><td>${i + 1}</td>${r.map((v, j) => `<td class="${j > 1 ? "number" : ""}">${v}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
          <div class="blank-canvas"></div>
        </div>
      </div>
    </div>
    ${tradeSidePanel()}
  </section>`;
}

function quotePanel() {
  return `<section class="panel quote-panel">
    <h2>五档行情</h2>
    <div class="symbol-line">平安银行 <small>000001.SZ　⇄</small></div>
    <div class="price-line"><div class="last-price">10.80</div><div class="change">0.01<br>0.09%</div></div>
    <div class="quote-stats">
      <span class="label">最高</span><span class="value up">10.85</span><span class="label">最低</span><span class="value down">10.74</span>
      <span class="label">今开</span><span class="value down">10.76</span><span class="label">昨收</span><span class="value">10.79</span>
      <span class="label">涨停</span><span class="value">11.87</span><span class="label">跌停</span><span class="value">9.71</span>
      <span class="label">总手</span><span class="value">312,096</span><span class="label">总额</span><span class="value">337,335,870.29</span>
      <span class="label">换手</span><span class="value">0.16%</span><span></span><span></span>
    </div>
    <div class="order-book">
      <div class="book-side bid"><div class="book-title">买盘</div>${bookRows("bid")}</div>
      <div class="book-side ask"><div class="book-title">卖盘</div>${bookRows("ask")}</div>
    </div>
  </section>`;
}

function bookRows(side) {
  const price = side === "bid" ? ["10.79", "10.78", "10.77", "10.76", "10.75"] : ["10.80", "10.81", "10.82", "10.83", "10.84"];
  const size = side === "bid" ? ["9993", "11638", "3193", "5232", "6103"] : ["4420", "4398", "8139", "3957", "7860"];
  return price.map((p, i) => `<div class="book-row" data-book-price="${p}"><span class="book-level">${i + 1}</span><span class="book-price">${p}</span><span class="book-size">${size[i]}</span></div>`).join("");
}

function orderForm() {
  const isBuy = state.direction === "buy";
  return `<section class="panel order-panel">
    <h2>交易下单</h2>
    <div class="trade-tabs"><button class="active">普通交易</button><button>空头交易</button><button>敞口控制交易</button></div>
    <div class="mini-tabs"><button>自设套利</button><button>标准套利</button></div>
    <label class="form-row"><span class="form-label">资金账号</span><select class="form-control"><option>DEMO-1001</option></select></label>
    <label class="form-row"><span class="form-label">对冲渠道</span><select class="form-control"><option>请选择</option></select></label>
    <label class="form-row"><span class="form-label">框架名称</span><select class="form-control"><option>DEMO-FRAME</option></select></label>
    <label class="form-row"><span class="form-label">订单类型</span><select class="form-control"><option>限价单</option></select></label>
    <label class="form-row"><span class="form-label">标的代码</span><select class="form-control"><option>000001.SZ 平安银行</option></select></label>
    <div class="form-row"><span class="form-label">订单方向</span><div class="direction-toggle"><button data-direction="buy" class="buy ${isBuy ? "active" : ""}">买入</button><button data-direction="sell" class="sell ${!isBuy ? "active" : ""}">卖出</button></div></div>
    <div class="form-row"><span class="form-label">订单价格</span><div class="stepper"><button data-step="price" data-delta="-0.01">−</button><input id="priceInput" value="${state.price.toFixed(2)}" /><button data-step="price" data-delta="0.01">＋</button></div></div>
    <div class="form-row"><span class="form-label">委托数量</span><div class="stepper"><button data-step="quantity" data-delta="-100">−</button><input id="qtyInput" value="${state.quantity}" /><button data-step="quantity" data-delta="100">＋</button></div></div>
    <div class="qty-hint">可买数量 <b>${isBuy ? "25,000" : "0"}</b></div>
    <div class="fractions"><button data-fraction=".25">1/4</button><button data-fraction=".3333">1/3</button><button data-fraction=".5">1/2</button><button data-fraction="1">全仓</button></div>
    <label class="form-row"><span class="form-label">订单模式</span><select class="form-control" id="orderModeSelect">${["ALL", "HighTouch", "LowTouch"].map(x => `<option ${x === state.orderMode ? "selected" : ""}>${x}</option>`).join("")}</select></label>
    <div class="mode-hint">${state.orderMode === "HighTouch" ? "需交易员人工确认后下发" : state.orderMode === "LowTouch" ? "原型仅演示直接提交结果" : "按系统已配置的适用规则处理"}</div>
    <div class="order-actions"><button class="icon-action" title="设置">⚙</button><button class="icon-action" title="重置" id="resetOrder">⟳</button><button class="submit-order ${isBuy ? "" : "sell"}" id="submitOrder">${isBuy ? "买入" : "卖出"}</button></div>
  </section>`;
}

function tradeSidePanel() {
  return `<aside class="side-column">${quotePanel()}${orderForm()}</aside>`;
}

function ordersView() {
  return `<section class="view with-trade-panel orders-view">
    <div class="main-column">
      <section class="panel orders-panel">
        <div class="panel-title">委托列表</div>
        <div class="toolbar orders-toolbar">
          <select class="select-field"><option>交易对手名称</option></select><select class="select-field"><option>资金账号名称</option></select><select class="select-field"><option>标的代码</option></select><select class="select-field"><option>订单模式</option><option>ALL</option><option>HighTouch</option><option>LowTouch</option></select>
          <select class="select-field"><option>订单状态</option></select><button class="btn ghost">展开⌄</button><span class="tiny-icon">♟</span><span class="tiny-icon">▣</span><button class="btn primary">筛选</button>
          <div class="orders-actions"><button class="btn muted">撤单</button><button class="btn danger">全撤</button><button class="btn primary">批量下单</button></div>
        </div>
        <div class="table-wrap"><table class="data-table"><colgroup><col style="width:45px"><col style="width:75px"><col style="width:90px"><col style="width:80px"><col style="width:80px"><col style="width:95px"><col style="width:145px"><col style="width:155px"><col style="width:110px"><col style="width:95px"><col style="width:85px"><col style="width:90px"></colgroup>
          <thead><tr><th>序列</th><th>☐</th><th>操作</th><th>订单方向</th><th>订单状态</th><th>业务类型</th><th>资金账号名称</th><th>框架名称</th><th>标的代码</th><th>订单模式</th><th>价格</th><th>数量</th></tr></thead>
          <tbody>${orderRows.map((r, i) => `<tr><td>${i + 1}</td><td class="center">□</td><td class="center">${r[1] === "待确认" ? `<button class="table-action" data-approve-order="${i}">确认</button>` : ""}</td><td class="${r[0] === "买入" ? "buy" : "sell"}">${r[0]}</td><td class="${r[1] === "待撤" ? "warning-cell" : r[1] === "待确认" ? "pending-cell" : ""}">${r[1]}</td>${r.slice(2).map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        <div class="table-footer">第 1 / 9 页, 共 165 条 <select class="select-field" style="min-width:80px"><option>20条/页</option></select><span class="pager">|‹ ‹ › ›|</span></div>
      </section>
      <div class="split-panels">${emptyPanel("对冲成交列表", ["序列", "标的代码", "成交编号"])}${emptyPanel("对冲委托订单", ["序列", "操作", "子单编号", "标的代码", "标的名称"])}</div>
    </div>
    ${tradeSidePanel()}
  </section>`;
}

function emptyPanel(title, columns) {
  return `<section class="panel empty-table-panel"><div class="panel-title">${title}</div><div class="table-wrap"><table class="data-table"><thead><tr>${columns.map(x => `<th>${x}</th>`).join("")}</tr></thead></table></div></section>`;
}

function lendingView() {
  const cards = [["撮合需求量", "96000 股", "总敞口金额 108.69 万"], ["撮合成交量", "96000 股", "撮合成交金额 108.69 万"], ["未撮合成交量", "-", "总敞口金额 0.00 万"], ["未分配量", "10000 股", "总敞口金额 9.31 万"], ["券商承担量", "-", "敞口金额 0.00 万"], ["待处理委托量", "0 笔", ""]];
  return `<section class="view panel lend-view">
    <div class="top-tabs"><button class="top-tab active">融券召回撮合分配</button><button class="top-tab">融券额度申请</button></div>
    <div class="cards">${cards.map(c => `<div class="stat-card"><div class="stat-label">${c[0]}</div><div class="stat-value">${c[1]}</div><div class="stat-note">${c[2]}</div></div>`).join("")}</div>
    <div class="lend-mode"><button class="btn primary">撮合召回工作台</button><button class="btn dark">召回执行与监控</button></div>
    <section class="lend-section top"><div class="section-header">出借方内撮委托 <label class="pill"><input type="checkbox" checked>待成交</label><span class="toolbar-spacer"></span><span class="pill">已选委托　0　条</span><button class="btn primary">撮合并召回分配</button></div>${lendEmptyTable()}</section>
    <section class="lend-section bottom"><div class="section-header">撮合敞口池 <label class="pill"><input type="checkbox" checked>待分配</label><span class="toolbar-spacer"></span><span class="pill">已选券池　0　条</span><button class="btn primary">召回分配</button><button class="btn ghost">盘后分配</button></div>${lendPoolTable()}</section>
  </section>`;
}

function lendEmptyTable() {
  const cols = ["☐", "操作", "客户名称", "资金账号", "框架名称", "订单类型", "委托编号", "标的代码", "标的名称", "订单方向"];
  return `<div class="table-wrap"><table class="data-table"><thead><tr>${cols.map(x => `<th>${x}</th>`).join("")}</tr></thead></table></div>`;
}

function lendPoolTable() {
  const rows = [["CP-DEMO", "300264", "佳创视讯", "100", "885.00", "0", "100", "885.00"], ["CP-DEMO", "300212", "易华录", "10,000", "93,100.00", "0", "10,000", "93,100.00"]];
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th></th><th>券池编号</th><th>标的代码</th><th>标的名称</th><th>撮合成交数量</th><th>撮合成交金额</th><th>已分配数量</th><th>分配比例</th><th>未分配数量</th><th>未分配敞口金额</th></tr></thead><tbody>${rows.map(r => `<tr><td class="center">□</td>${r.slice(0,6).map(v => `<td>${v}</td>`).join("")}<td class="progress-cell"><div class="progress-bar">0.00%</div></td>${r.slice(6).map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function dataView() {
  const nodes = ["机构 166", "机构 167", "交易对手 1204", "客户组 0923", "资金账号组 DEMO-01", "策略组合 1208", "客户 YAO YUQIAN", "召回专用", "客户组 0919", "ddan", "yyq", "dan", "招商证券", "19990427", "20260112", "2026机构", "HTS", "ABOUT CAPITAL ASIAN", "test_cj", "gc-cmsim", "DEMO-ACCOUNT"];
  const rows = [["002223", "鱼跃医疗", "已上市", "DEMO-30399", "DEMO-30399", "35.870000", "120,000", "0"], ["002311", "海大集团", "已上市", "DEMO-30399", "DEMO-30399", "48.992300", "30,000", "0"], ["002582", "好想你", "已上市", "DEMO-30399", "DEMO-30399", "6.003500", "300,000", "0"], ["002714", "牧原股份", "已上市", "DEMO-30399", "DEMO-30399", "48.895500", "150,000", "0"], ["300274", "阳光电源", "已上市", "DEMO-30399", "DEMO-30399", "75.667700", "4,000", "0"], ["300783", "三只松鼠", "已上市", "DEMO-30399", "DEMO-30399", "24.538041", "199,100", "0"], ["600066", "宇通客车", "已上市", "DEMO-30399", "DEMO-30399", "23.647067", "300,000", "0"], ["601857", "中国石油", "已上市", "DEMO-30399", "DEMO-30399", "7.064100", "300,000", "0"]];
  return `<section class="view panel data-view">
    <div class="top-tabs">${["资金管理", "持仓信息", "汇率管理", "保证金比例", "成交查询", "对冲持仓", "交易日", "操作日志", "历史成交", "订单查询", "券池持仓", "额度明细", "融券申请查询"].map((x,i)=>`<button class="top-tab ${i===0?"active":""}">${x}</button>`).join("")}</div>
    <div class="toolbar compact"><span>交易节点</span><select class="select-field"><option>全部</option></select><select class="select-field" style="min-width:200px"><option>框架名称</option></select><select class="select-field" style="min-width:200px"><option>标的代码</option></select><button class="btn primary">查询</button><button class="btn primary">导出持仓</button><span>币种显示为:</span><select class="select-field"><option></option></select></div>
    <div class="data-content"><aside class="tree-panel"><div class="tree-tabs"><button class="active">对客方</button><button>对冲方</button></div><span class="search-wrap"><input class="field" style="width:100%" placeholder="机构号/客户账号/资金账号查询"></span><div class="tree-list">${nodes.map(n=>`<div class="tree-node">${n}</div>`).join("")}</div></aside>
      <div class="holdings"><div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>序列</th><th>标的代码</th><th>标的名称</th><th>标的状态</th><th>资金账号</th><th>资金账号名称</th><th>持仓均价</th><th>期初数量</th><th>日间开仓数量</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i===0?"selected":""}"><td>${i+1}</td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
    </div>
  </section>`;
}

function riskView() {
  const tabs = ["风控设置", "自定义风控设置", "风控消息", "强平执行", "强平监控"];
  if (state.riskTab === "风控消息") return riskMessageView(tabs);
  const types = ["禁止交易", "禁止交易", "禁止交易", "禁止交易", "NAV单笔订单市值", "NAV集中度", "可用名本集中度", "下单频率", "价格偏离度", "价格偏离度", "单笔委托数量", "白名单", "黑名单", "NAV单笔订单市值", "禁止交易", "禁止交易", "禁止交易", "禁止交易", "禁止交易", "禁止交易", "禁止交易"];
  return `<section class="view panel risk-view"><div class="top-tabs">${tabs.map(x=>`<button class="top-tab ${x===state.riskTab?"active":""}" data-risk-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><span class="clearable"><input class="field"></span><button class="btn primary">查询</button><span class="toolbar-spacer"></span><button class="btn primary">新增规则</button></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th style="width:50px">序列</th><th style="width:130px">操作</th><th style="width:100px">规则编号</th><th style="width:80px">启用状态</th><th>风控类型</th><th style="width:100px">交易账号</th><th>备注</th><th style="width:120px">应用客户范围</th><th style="width:100px">作用起始日</th></tr></thead><tbody>${types.map((t,i)=>`<tr class="${i===8?"selected":""}"><td>${i+1}</td><td class="center"><span class="toggle ${i===8?"on":""}" data-toggle></span><span class="icon-pair">▣ ↗</span></td><td>${858-i}</td><td>False</td><td>${t}</td><td>${[4,5,13].includes(i)?"TESTCMHK":""}</td><td>${i<3?(i===0?"自动限制期货平仓":i===1?"自动限制期货开仓":"手动限制期货开仓"):i>13?"手动禁用期货开仓":""}</td><td>${[4,5,13].includes(i)?"--":i===8||i===9||i===10?"全局":"个人"}</td><td class="date-orange">${i>2?"2026-09-23":""}</td></tr>`).join("")}</tbody></table></div>
  </section>`;
}

function riskMessageView(tabs) {
  const messages = [
    ["2026-10-10 10:18:32", "DEMO-C01", "演示客户01", "DEMO-1001", "演示资金账户", "QFII-A", "拒绝", "委托价格偏离触发风控规则，订单未提交"],
    ["2026-10-10 09:42:16", "DEMO-C02", "演示客户02", "DEMO-1002", "演示资金账户", "QFII-B", "警告", "单笔委托数量达到预警阈值"],
  ];
  return `<section class="view panel risk-view"><div class="top-tabs">${tabs.map(x=>`<button class="top-tab ${x===state.riskTab?"active":""}" data-risk-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><input class="field" placeholder="客户账号"><input class="field" placeholder="资金账号"><select class="select-field"><option>拒绝/警告</option><option>拒绝</option><option>警告</option></select><button class="btn primary">查询</button></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th style="width:50px">序列</th><th style="width:150px">时间</th><th>客户账号</th><th>客户名称</th><th>资金账号</th><th>资金账号名称</th><th>框架名称</th><th style="width:80px">类型</th><th style="width:320px">消息内容</th></tr></thead><tbody>${messages.map((r,i)=>`<tr><td>${i+1}</td>${r.map((v,j)=>`<td class="${j===6?(v==="拒绝"?"risk-reject":"risk-warning"):""}">${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
  </section>`;
}

function configView() {
  const tabs = ["购买力账号", "柜台账号映射", "券池映射", "标的物映射", "期货开仓", "订单模式", "证券池", "流量控制", "内部撮合", "组合配置"];
  if (state.configTab === "订单模式") return orderModeConfigView(tabs);
  const rows = [["99990109","演示客户01","P99990109","CNY"],["111111","演示客户02","P111111","CNY"],["778899","demo_test","P778899","CNY"],["2262403045","客户A","P2262403045","CNY"],["1069991","客户B","P1069991","CNY"],["11111","客户C（空头）","P11111","CNY"],["112233","lcw_test","P112233","CNY"],["20251208","20251208","P20251208","CNY"],["10000037","ccf2","P10000037","CNY"],["122901","客户D（空头）2","P122901","CNY"],["494657","test_party_494657","P494657","CNY"],["666","marsT","P666","CNY"],["1100274","演示客户03","P1100274","USD"],["1100374","演示客户04","P1100374","CNY"],["1112423","YYQ1","P1112423","CNY"],["80888192","80888192","P80888192","CNY"]];
  return `<section class="view panel config-view"><div class="top-tabs">${tabs.map(x=>`<button class="top-tab ${x===state.configTab?"active":""}" data-config-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><span class="clearable"><input class="field"></span><button class="btn primary">查询</button><button class="btn primary">新增</button></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th style="width:120px">操作</th><th style="width:200px">客户账号</th><th style="width:200px">客户名称</th><th style="width:200px">购买力资金账号</th><th>购买力货币</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i===9?"selected":""}"><td class="center"><span class="icon-pair">● ▣</span></td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
}

function orderModeConfigView(tabs) {
  const rows = [["DEMO-C01", "演示客户01", "DEMO-1001", "SZ", "HighTouch"], ["DEMO-C02", "演示客户02", "DEMO-1002", "SH", "LowTouch"], ["DEMO-C03", "演示客户03", "DEMO-1003", "ALL", "ALL"]];
  return `<section class="view panel config-view"><div class="top-tabs">${tabs.map(x=>`<button class="top-tab ${x===state.configTab?"active":""}" data-config-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><span class="clearable"><input class="field" placeholder="客户名称"></span><button class="btn primary">查询</button><button class="btn primary">新增</button></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th style="width:120px">操作</th><th>客户账号</th><th>客户名称</th><th>资金账号</th><th>交易所</th><th>订单模式</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i===0?"selected":""}"><td class="center"><span class="icon-pair">✎ ▣</span></td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
}

function bindInteractions() {
  document.querySelectorAll("[data-symbol-index]").forEach(row => row.addEventListener("click", () => { state.selectedSymbol = Number(row.dataset.symbolIndex); render(); }));
  document.querySelectorAll("[data-direction]").forEach(btn => btn.addEventListener("click", () => { state.direction = btn.dataset.direction; render(); }));
  document.querySelectorAll("[data-book-price]").forEach(row => row.addEventListener("click", () => { state.price = Number(row.dataset.bookPrice); const input = document.querySelector("#priceInput"); if (input) input.value = state.price.toFixed(2); }));
  document.querySelectorAll("[data-step]").forEach(btn => btn.addEventListener("click", () => {
    const delta = Number(btn.dataset.delta);
    if (btn.dataset.step === "price") state.price = Math.max(0, Math.round((state.price + delta) * 100) / 100);
    else state.quantity = Math.max(0, state.quantity + delta);
    const target = document.querySelector(btn.dataset.step === "price" ? "#priceInput" : "#qtyInput");
    target.value = btn.dataset.step === "price" ? state.price.toFixed(2) : state.quantity;
  }));
  document.querySelectorAll("[data-fraction]").forEach(btn => btn.addEventListener("click", () => { state.quantity = Math.floor(25000 * Number(btn.dataset.fraction) / 100) * 100; const q = document.querySelector("#qtyInput"); if(q) q.value = state.quantity; }));
  document.querySelectorAll("[data-toggle]").forEach(toggle => toggle.addEventListener("click", () => toggle.classList.toggle("on")));
  document.querySelectorAll("[data-risk-tab]").forEach(btn => btn.addEventListener("click", () => {
    if (!["风控设置", "风控消息"].includes(btn.dataset.riskTab)) return notify(`${btn.dataset.riskTab}待补充截图后继续复刻`);
    state.riskTab = btn.dataset.riskTab;
    render();
  }));
  document.querySelectorAll("[data-config-tab]").forEach(btn => btn.addEventListener("click", () => {
    if (!["购买力账号", "订单模式"].includes(btn.dataset.configTab)) return notify(`${btn.dataset.configTab}待补充截图后继续复刻`);
    state.configTab = btn.dataset.configTab;
    render();
  }));
  document.querySelectorAll("[data-approve-order]").forEach(btn => btn.addEventListener("click", () => { orderRows[Number(btn.dataset.approveOrder)][1] = "已确认"; render(); notify("HighTouch 委托已确认并进入下发流程（原型）"); }));
  document.querySelector("#orderModeSelect")?.addEventListener("change", (event) => { state.orderMode = event.target.value; render(); });
  document.querySelector("#resetOrder")?.addEventListener("click", () => { state.price = 10.80; state.quantity = 0; render(); notify("下单信息已重置"); });
  document.querySelector("#submitOrder")?.addEventListener("click", () => notify(state.orderMode === "HighTouch" ? `HighTouch 委托已生成，等待交易员确认：${state.quantity || 0} 股 @ ${state.price.toFixed(2)}` : `${state.orderMode} 委托演示已提交：${state.quantity || 0} 股 @ ${state.price.toFixed(2)}`));
}

let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

render();
