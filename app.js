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
  ["买入", "待确认", "普通交易", "DEMO-1001", "QFII-A", "000001.SZ", "HighTouch", "10.80", "2,000", "手工委托"],
  ["卖出", "已成", "空头交易", "DEMO-1002", "QFII-B", "600000.SH", "LowTouch", "9.52", "5,000", ""],
  ["买入", "待撤", "普通交易", "DEMO-1003", "CNY-DEMO", "000001.SZ", "ALL", "10.79", "1,000", ""],
  ["卖出", "已撤", "空头交易", "DEMO-1004", "QFII-C", "300212.SZ", "LowTouch", "9.31", "10,000", ""],
  ["卖出", "待撤", "空头交易", "DEMO-1005", "QFII-D", "300264.SZ", "HighTouch", "8.85", "100", ""],
];

const riskRules = [
  { id: 858, enabled: false, category: "交易事前", type: "禁止交易", account: "", note: "自动限制期货平仓", scope: "个人", start: "" },
  { id: 857, enabled: false, category: "交易事前", type: "禁止交易", account: "", note: "自动限制期货开仓", scope: "个人", start: "" },
  { id: 856, enabled: false, category: "交易事前", type: "黑名单", account: "", note: "限制指定证券范围", scope: "个人", start: "" },
  { id: 855, enabled: false, category: "交易事前", type: "白名单", account: "", note: "仅允许指定证券范围", scope: "个人", start: "2026-09-23" },
  { id: 854, enabled: false, category: "交易事前", type: "单笔委托数量", account: "", note: "", scope: "全局", start: "2026-09-23" },
  { id: 853, enabled: false, category: "交易事前", type: "价格偏离度", account: "", note: "", scope: "全局", start: "2026-09-23" },
  { id: 852, enabled: false, category: "交易事前", type: "下单频率", account: "", note: "", scope: "个人", start: "2026-09-23" },
  { id: 851, enabled: true, category: "交易事前", type: "可用名本集中度", account: "", note: "", scope: "个人", start: "2026-09-23" },
  { id: 850, enabled: false, category: "交易事前", type: "持仓限制", account: "", note: "", scope: "全局", start: "2026-09-23" },
  { id: 849, enabled: false, category: "交易事中", type: "净卖出金额", account: "", note: "", scope: "全局", start: "2026-09-23" },
  { id: 848, enabled: false, category: "交易事中", type: "净风险敞口", account: "", note: "", scope: "全局", start: "2026-09-23" },
  { id: 847, enabled: false, category: "交易事中", type: "集中度控制", account: "", note: "", scope: "个人", start: "2026-09-23" },
  { id: 846, enabled: false, category: "交易事中", type: "标的市值", account: "", note: "", scope: "个人", start: "2026-09-23" },
  { id: 845, enabled: false, category: "资管事前", type: "对敲交易", account: "QFII-DEMO", note: "控制层级：Slice", scope: "--", start: "2026-09-23" },
  { id: 844, enabled: false, category: "资管事前", type: "反向交易", account: "QFII-DEMO", note: "控制渠道：QFII", scope: "--", start: "2026-09-23" },
  { id: 843, enabled: false, category: "资管事前", type: "NAV集中度", account: "QFII-DEMO", note: "", scope: "--", start: "2026-09-23" },
  { id: 842, enabled: false, category: "资管事前", type: "NAV单笔订单市值", account: "QFII-DEMO", note: "", scope: "--", start: "2026-09-23" },
  { id: 841, enabled: false, category: "资管事前", type: "委托量占比", account: "QFII-DEMO", note: "", scope: "--", start: "2026-09-23" },
];

const childOrders = {};
const tradeExecutions = {};
const approvalRows = [
  ["AP-20261010-001", "ORD-DEMO-01", "2026-10-10", "10:16:28", "委托（Slice）", "待审批", "否", "000001.SZ", "限价单", "2,000", "10.80", "买入"],
  ["AP-20261010-002", "ORD-DEMO-02", "2026-10-10", "10:21:06", "委托（Slice）", "待审批", "是", "600000.SH", "限价单", "5,000", "9.52", "卖出"],
];

let state = {
  view: "market",
  direction: "buy",
  selectedSymbol: 1,
  price: 10.80,
  quantity: 0,
  orderMode: "HighTouch",
  tradeType: "普通交易",
  noApproval: false,
  manualOrder: false,
  selectedOrder: 0,
  orderAttributeDraft: "",
  orderAttributeFilter: "",
  modal: null,
  approvalTab: "待审批事项",
  selectedApproval: 0,
  dataTab: "资金管理",
  dataParty: "对客方",
  positionMode: "明细",
  positionMarket: "证券",
  dataRange: "今天",
  riskCategory: "全部规则",
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
  if (["strategy", "system"].includes(view)) {
    notify(`${view === "strategy" ? "策略" : "系统"}模块待补充截图后继续复刻`);
    return;
  }
  state.view = view;
  render();
}

function render() {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === state.view));
  const views = { market: marketView, orders: ordersView, lending: lendingView, data: dataView, risk: riskView, config: configView, approval: approvalView };
  workspace.innerHTML = views[state.view]() + modalView();
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
  const isShort = state.tradeType === "空头交易";
  const isExposure = state.tradeType === "敞口控制交易";
  const isArbitrage = ["自设套利", "标准套利"].includes(state.tradeType);
  const directionLabels = isShort ? ["卖开", "买平"] : ["买入", "卖出"];
  return `<section class="panel order-panel">
    <h2>交易下单</h2>
    <div class="trade-tabs">${["普通交易", "空头交易", "敞口控制交易"].map(x=>`<button data-trade-type="${x}" class="${state.tradeType===x?"active":""}">${x}</button>`).join("")}</div>
    <div class="mini-tabs">${["自设套利", "标准套利"].map(x=>`<button data-trade-type="${x}" class="${state.tradeType===x?"active":""}">${x}</button>`).join("")}</div>
    ${!isExposure ? `<label class="form-row"><span class="form-label">资金账号</span><select class="form-control"><option>DEMO-1001</option></select></label>` : ""}
    ${isExposure ? `<label class="form-row"><span class="form-label required">对冲渠道</span><select class="form-control"><option>QFII-DEMO</option></select></label><label class="form-row"><span class="form-label required">对冲账号</span><select class="form-control"><option>HEDGE-DEMO01</option></select></label>` : `<label class="form-row"><span class="form-label">对冲渠道</span><select class="form-control"><option>自动路由</option><option>QFII-DEMO</option></select></label>`}
    <label class="form-row"><span class="form-label">框架名称</span><select class="form-control"><option>DEMO-FRAME</option></select></label>
    ${isShort ? `<label class="form-row"><span class="form-label">券源编号</span><input class="form-control" placeholder="未填写时自动匹配"></label>` : ""}
    ${isArbitrage ? `<label class="form-row"><span class="form-label">组合${state.tradeType==="自设套利"?"名称":"代码"}</span><select class="form-control"><option>DEMO-SPREAD-01</option></select></label>` : ""}
    <label class="form-row"><span class="form-label">订单类型</span><select class="form-control"><option>限价单</option></select></label>
    ${!isArbitrage ? `<label class="form-row"><span class="form-label">标的代码</span><select class="form-control"><option>000001.SZ 平安银行</option></select></label>` : ""}
    <div class="form-row"><span class="form-label">订单方向</span><div class="direction-toggle"><button data-direction="buy" class="buy ${isBuy ? "active" : ""}">${directionLabels[0]}</button><button data-direction="sell" class="sell ${!isBuy ? "active" : ""}">${directionLabels[1]}</button></div></div>
    <div class="form-row"><span class="form-label">订单价格</span><div class="stepper"><button data-step="price" data-delta="-0.01">−</button><input id="priceInput" value="${state.price.toFixed(2)}" /><button data-step="price" data-delta="0.01">＋</button></div></div>
    <div class="form-row"><span class="form-label">委托数量</span><div class="stepper"><button data-step="quantity" data-delta="-100">−</button><input id="qtyInput" value="${state.quantity}" /><button data-step="quantity" data-delta="100">＋</button></div></div>
    <div class="qty-hint">可买数量 <b>${isBuy ? "25,000" : "0"}</b></div>
    <div class="fractions"><button data-fraction=".25">1/4</button><button data-fraction=".3333">1/3</button><button data-fraction=".5">1/2</button><button data-fraction="1">全仓</button></div>
    <label class="form-row"><span class="form-label">订单模式</span><select class="form-control" id="orderModeSelect">${["ALL", "HighTouch", "LowTouch"].map(x => `<option ${x === state.orderMode ? "selected" : ""}>${x}</option>`).join("")}</select></label>
    <div class="mode-hint">${state.orderMode === "HighTouch" ? "需交易员接收确认，可直接下单或拆单" : state.orderMode === "LowTouch" ? "校验通过后自动进入报单流程" : "按系统已配置的适用规则处理"}</div>
    ${state.orderMode === "HighTouch" ? `<label class="check-row"><input id="noApproval" type="checkbox" ${state.noApproval?"checked":""}> 无需审批 <span>仍执行风控及验资验券</span></label>` : ""}
    <label class="check-row"><input id="manualOrder" type="checkbox" ${state.manualOrder?"checked":""}> 手工单 ${state.manualOrder?`<input class="inline-time" type="time" value="10:18">`:""}</label>
    <div class="order-actions"><button class="icon-action" title="设置">⚙</button><button class="icon-action" title="重置" id="resetOrder">⟳</button><button class="submit-order ${isBuy ? "" : "sell"}" id="submitOrder">${isBuy ? "买入" : "卖出"}</button></div>
  </section>`;
}

function tradeSidePanel() {
  return `<aside class="side-column">${quotePanel()}${orderForm()}</aside>`;
}

function ordersView() {
  const visibleRows = orderRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => !state.orderAttributeFilter || row[9] === state.orderAttributeFilter);
  return `<section class="view with-trade-panel orders-view">
    <div class="main-column">
      <section class="panel orders-panel">
        <div class="panel-title">委托列表</div>
        <div class="toolbar orders-toolbar">
          <select class="select-field"><option>交易对手名称</option></select><select class="select-field"><option>资金账号名称</option></select><select class="select-field"><option>标的代码</option></select><select class="select-field"><option>订单模式</option><option>ALL</option><option>HighTouch</option><option>LowTouch</option></select>
          <select class="select-field"><option>订单状态</option></select><select class="select-field order-attribute-filter" id="orderAttributeFilter" aria-label="委托属性"><option value="" ${state.orderAttributeDraft === "" ? "selected" : ""}>委托属性</option><option value="手工委托" ${state.orderAttributeDraft === "手工委托" ? "selected" : ""}>手工委托</option></select><button class="btn ghost">展开⌄</button><span class="tiny-icon">♟</span><span class="tiny-icon">▣</span><button class="btn primary" data-order-filter>筛选</button>
          <div class="orders-actions"><button class="btn muted">撤单</button><button class="btn danger">全撤</button><button class="btn primary">批量下单</button></div>
        </div>
        <div class="table-wrap"><table class="data-table"><colgroup><col style="width:45px"><col style="width:75px"><col style="width:90px"><col style="width:80px"><col style="width:80px"><col style="width:95px"><col style="width:145px"><col style="width:155px"><col style="width:110px"><col style="width:95px"><col style="width:85px"><col style="width:90px"><col style="width:110px"></colgroup>
          <thead><tr><th>序列</th><th>☐</th><th>操作</th><th>订单方向</th><th>订单状态</th><th>业务类型</th><th>资金账号名称</th><th>框架名称</th><th>标的代码</th><th>订单模式</th><th>价格</th><th>数量</th><th>委托属性</th></tr></thead>
          <tbody>${visibleRows.length ? visibleRows.map(({ row: r, index }, i) => `<tr data-order-row="${index}" class="${index===state.selectedOrder?"selected":""}"><td>${i + 1}</td><td class="center">□</td><td class="center">${orderActionButtons(r,index)}</td><td class="${r[0] === "买入" ? "buy" : "sell"}">${r[0]}</td><td class="${r[1] === "待撤" ? "warning-cell" : r[1] === "待确认" ? "pending-cell" : ""}">${r[1]}</td>${r.slice(2).map(v => `<td>${v || "--"}</td>`).join("")}</tr>`).join("") : `<tr><td class="empty-order-result" colspan="13">暂无符合条件的委托</td></tr>`}</tbody></table></div>
        <div class="table-footer">第 1 / 1 页, 共 ${visibleRows.length} 条 <select class="select-field" style="min-width:80px"><option>20条/页</option></select><span class="pager">|‹ ‹ › ›|</span></div>
      </section>
      <div class="split-panels">${executionPanel(state.selectedOrder)}${childOrderPanel(state.selectedOrder)}</div>
    </div>
    ${tradeSidePanel()}
  </section>`;
}

function orderActionButtons(row, index) {
  if (row[1] === "待确认") return `<button class="table-action" data-approve-order="${index}">确认</button>`;
  if (row[1] === "已确认") return `<button class="table-action compact-action" data-direct-order="${index}">直接下单</button><button class="table-action compact-action ghost-action" data-split-order="${index}">拆单</button>`;
  return "";
}

function childOrderPanel(index) {
  const rows = childOrders[index] || [];
  return `<section class="panel empty-table-panel"><div class="panel-title">对冲委托订单 <span class="panel-note">联动母单：${orderRows[index]?.[3] || "--"}</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>序列</th><th>操作</th><th>子单编号</th><th>标的代码</th><th>订单模式</th><th>价格</th><th>数量</th><th>状态</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td><td><button class="link-button" data-manual-fill="${index}:${i}">${r.manual?"成交":"撤单"}</button></td>${r.values.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table>${rows.length?"":`<div class="empty-hint">确认母单后，使用“直接下单”或“拆单”生成子单</div>`}</div></section>`;
}

function executionPanel(index) {
  const rows = tradeExecutions[index] || [];
  return `<section class="panel empty-table-panel"><div class="panel-title">对冲成交列表</div><div class="table-wrap"><table class="data-table"><thead><tr><th>序列</th><th>标的代码</th><th>成交编号</th><th>成交价格</th><th>成交数量</th><th>成交类型</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table>${rows.length?"":`<div class="empty-hint">选择母单后联动展示成交明细</div>`}</div></section>`;
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

const dataTabs = ["资金管理", "持仓信息", "汇率管理", "保证金比例", "成交查询", "对冲持仓", "交易日", "操作日志", "历史成交", "订单查询", "券池持仓", "额度明细", "融券申请查询"];
const implementedDataTabs = ["资金管理", "持仓信息", "汇率管理", "保证金比例", "成交查询", "对冲持仓", "交易日", "订单查询"];

function dataView() {
  const pages = {
    "资金管理": fundManagementPage,
    "持仓信息": positionDetailPage,
    "汇率管理": exchangeRatePage,
    "保证金比例": marginRatePage,
    "成交查询": executionQueryPage,
    "对冲持仓": hedgePositionPage,
    "交易日": tradingDayPage,
    "订单查询": historyOrderPage,
  };
  return `<section class="view panel data-view">
    <div class="top-tabs data-tabs">${dataTabs.map(x=>`<button class="top-tab ${x===state.dataTab?"active":""}" data-data-tab="${x}">${x}</button>`).join("")}</div>
    ${pages[state.dataTab]()}
  </section>`;
}

function fundManagementPage() {
  const nodes = ["机构 DEMO-01", "客户组 A", "客户 DEMO-C01", "客户 DEMO-C02", "资金账号组 CNY", "资金账号组 HKD", "客户 DEMO-C03", "召回专用", "测试组合组"];
  const fundRows = [["DEMO-C01", "DEMO-TR01", "DEMO-1001", "演示资金账号01", "CNY", "1.000000", "8,500,000.00", "6,328,640.00", "1,250,000.00", "480,000.00", "42,600.00", "-12,400.00"], ["DEMO-C02", "DEMO-TR02", "DEMO-1002", "演示资金账号02", "HKD", "0.923500", "4,200,000.00", "3,816,000.00", "320,000.00", "64,000.00", "18,200.00", "3,600.00"]];
  return `<div class="toolbar compact"><span>交易节点</span><select class="select-field"><option>全部</option></select><select class="select-field"><option>框架名称</option></select><select class="select-field"><option>标的代码</option></select><button class="btn primary" data-data-query>查询</button><button class="btn primary" data-data-export>导出</button><span class="toolbar-spacer"></span><span>币种显示为</span><select class="select-field short-select"><option>CNY</option><option>HKD</option><option>USD</option></select></div>
    <div class="data-content"><aside class="tree-panel"><div class="tree-tabs">${["对客方","对冲方"].map(x=>`<button data-data-party="${x}" class="${state.dataParty===x?"active":""}">${x}</button>`).join("")}</div><span class="search-wrap"><input class="field" style="width:100%" placeholder="机构号/客户账号/资金账号查询"></span><div class="tree-list">${nodes.map((n,i)=>`<div class="tree-node ${i===2?"selected-node":""}">${n}</div>`).join("")}</div></aside>
      <div class="fund-workspace"><div class="table-wrap fund-table"><table class="data-table"><thead><tr><th>客户号</th><th>交易账户</th><th>资金账号</th><th>资金账号名称</th><th>币种</th><th>汇率</th><th>期初金额</th><th>可用金额</th><th>保证金占用</th><th>保证金冻结</th><th>平仓盈亏</th><th>浮动盈亏</th></tr></thead><tbody>${fundRows.map((r,i)=>`<tr class="${i===0?"selected":""}">${r.map((v,j)=>`<td>${j===0?"⊞ ":""}${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      </div>
    </div>`;
}

function positionDetailPage() {
  const columnsByMode = {
    "对客": ["客户名称", "客户名", "交易账户", "交易对手号", "交易对手名称", "交易对手简称", "资金账户号", "资金账号", "资金账号名称", "框架名称", "证券代码", "证券名称", "合约代码", "合约名称", "上市状态", "可用数量", "持仓数量", "成本价", "持仓均价", "最新价", "持仓盈亏", "持仓盈亏率", "持仓市值", "期初数量", "交易冻结数量", "日内开仓成交数量", "日内平仓成交数量", "持仓类型", "业务类型"],
    "对冲": ["交易对手号", "交易对手名称", "客户名称", "客户名", "交易账户", "交易对手简称", "资金账户号", "资金账号", "资金账号名称", "框架名称", "证券代码", "证券名称", "合约代码", "合约名称", "上市状态", "对冲渠道", "对冲方资金账号", "可用数量", "持仓数量", "持仓均价", "最新价", "持仓市值", "期初数量", "日间开仓数量", "日间平仓数量", "交易冻结数量", "持仓类型", "业务类型"],
    "明细": ["客户名称", "客户名", "交易账户", "交易对手号", "交易对手名称", "交易对手简称", "资金账户号", "资金账号", "资金账号名称", "框架名称", "证券代码", "证券名称", "合约代码", "合约名称", "上市状态", "开仓日期", "开仓均价", "期初数量", "持仓数量", "初保比例", "期初汇率", "平仓盈亏", "开仓费率", "平仓费率", "单位待实现利率收益", "持仓类型", "业务类型"],
  };
  function samplePosition(marketType, securityCode, securityName, contractCode, contractName, quantity, available, freeze, value, pnl) {
    const common = {
      "客户名称": "演示客户01", "客户名": "演示客户01", "交易账户": "DEMO-TR01", "交易对手号": "DEMO-PTY01",
      "交易对手名称": "演示交易对手", "交易对手简称": "演示对手", "资金账户号": "DEMO-PA01", "资金账号": "DEMO-1001",
      "资金账号名称": "演示资金账号01", "框架名称": "DEMO-FRAME", "证券代码": securityCode, "证券名称": securityName,
      "合约代码": contractCode, "合约名称": contractName, "上市状态": "已上市", "可用数量": available, "持仓数量": quantity,
      "持仓均价": "10.20", "最新价": "10.80", "持仓市值": value, "期初数量": "100,000", "交易冻结数量": freeze,
      "持仓类型": "多头", "业务类型": marketType === "期货" ? "期货交易" : marketType === "债券" ? "债券交易" : "普通交易",
    };
    return {
      marketType,
      client: { ...common, "成本价": "10.10", "持仓盈亏": pnl, "持仓盈亏率": "5.94%", "日内开仓成交数量": "20,000", "日内平仓成交数量": "0" },
      hedge: { ...common, "对冲渠道": "DEMO-CHANNEL", "对冲方资金账号": "DEMO-HEDGE-01", "日间开仓数量": "20,000", "日间平仓数量": "0" },
      detail: { ...common, "开仓日期": "2026-10-22", "开仓均价": "10.20", "初保比例": "25.00%", "期初汇率": "1.000000", "平仓盈亏": "0.00", "开仓费率": "0.03%", "平仓费率": "0.03%", "单位待实现利率收益": "0.00" },
    };
  }
  const positionRows = [
    samplePosition("证券", "000001.SZ", "演示证券A", "—", "—", "120,000", "110,000", "2,000", "1,296,000.00", "72,000.00"),
    samplePosition("期货", "—", "—", "IF2612.CFE", "演示期货合约", "12", "10", "1", "1,296,000.00", "72,000.00"),
    samplePosition("债券", "110001.SH", "演示债券A", "—", "—", "6,000", "5,500", "100", "1,296,000.00", "72,000.00"),
  ];
  const selectedColumns = columnsByMode[state.positionMode] || columnsByMode["明细"];
  const modeKey = state.positionMode === "对客" ? "client" : state.positionMode === "对冲" ? "hedge" : "detail";
  const selectedRows = positionRows.filter(row => row.marketType === state.positionMarket).map(row => selectedColumns.map(column => row[modeKey][column] ?? "—"));
  return `<div class="position-query-page">
    <div class="position-filters">
      <div class="toolbar compact data-filter"><input class="field" placeholder="客户名称"><input class="field" placeholder="客户名"><input class="field" placeholder="交易账户"><input class="field" placeholder="交易对手名称"><input class="field" placeholder="交易对手简称"></div>
      <div class="toolbar compact data-filter"><input class="field" placeholder="资金账号"><input class="field" placeholder="资金账号名称"><input class="field" placeholder="证券代码 / 合约代码"><button class="btn primary" data-data-query>查询</button><button class="btn ghost" data-data-export>导出</button></div>
    </div>
    <div class="position-controls"><div class="position-market-tabs" role="group" aria-label="市场类别">${["证券", "期货", "债券"].map(x=>`<button class="${state.positionMarket===x?"active":""}" type="button" data-position-market="${x}" aria-pressed="${state.positionMarket===x}">${x}</button>`).join("")}</div><div class="position-mode-switch" role="radiogroup" aria-label="持仓类型">${["对客", "对冲", "明细"].map(x=>`<button type="button" role="radio" aria-checked="${state.positionMode===x}" data-position-mode="${x}" class="position-mode ${state.positionMode===x?"active":""}"><span class="radio-dot"></span>${x}</button>`).join("")}</div></div>
    ${tablePage(selectedColumns, selectedRows)}
  </div>`;
}

function exchangeRatePage() {
  const rows = [["USD", "CNY", "7.118600", "中间价", "BCT市场数据"], ["HKD", "CNY", "0.915400", "中间价", "BCT市场数据"], ["CNY", "CNY", "1.000000", "中间价", "BCT市场数据"], ["SGD", "CNY", "5.482100", "中间价", "BCT市场数据"]];
  return `<div class="toolbar compact"><input class="field" placeholder="交易货币"><input class="field" placeholder="结算货币"><button class="btn primary" data-data-query>查询</button></div>${tablePage(["交易货币","结算货币","参考汇率","汇率类型","汇率源"], rows)}`;
}

function marginRatePage() {
  const rows = [["交易对手", "演示客户01", "--", "--", "20.00%"], ["交易对手+标的代码+方向", "演示客户01", "000001.SZ", "平安银行", "25.00%"], ["交易对手+标的代码+方向", "演示客户02", "600000.SH", "浦发银行", "30.00%"]];
  return `<div class="toolbar compact"><input class="field" placeholder="交易对手"><input class="field" placeholder="标的代码"><button class="btn primary" data-data-query>查询</button></div>${tablePage(["配置类型","交易对手","标的代码","标的名称","初始保证金比例"], rows)}`;
}

function executionQueryPage() {
  const rows = [["2026-10-10", "EXEC-DEMO-001", "DEMO-1001", "演示资金账号01", "DEMO-FRAME", "000001.SZ", "平安银行", "买入", "开仓", "10.78", "2,000", "21,560.00", "深交所", "10:18:32", "QFII-DEMO"], ["2026-10-09", "EXEC-DEMO-002", "DEMO-1002", "演示资金账号02", "DEMO-FRAME", "600000.SH", "浦发银行", "卖出", "平仓", "9.52", "5,000", "47,600.00", "上交所", "14:31:08", "CHANNEL-B"]];
  return `${historyToolbar(["资金账号", "标的代码", "委托方向", "交易所", "对冲渠道"])}<div class="dimension-bar"><span>查询维度</span>${["成交单笔","证券代码+委托方向","证券代码+委托方向+日期","自定义维度"].map((x,i)=>`<button class="dimension-btn ${i===0?"active":""}">${x}</button>`).join("")}</div>${tablePage(["日期","成交编号","资金账号","资金账号名称","框架名称","证券代码","证券名称","委托方向","开平标识","成交价格","成交数量","成交金额","交易所","成交时间","对冲渠道"], rows, "合计　成交数量 7,000　成交金额 69,160.00")}`;
}

function hedgePositionPage() {
  const cards = [["可用资金","8,126,400.00"],["冻结资金","480,000.00"],["期初资金","8,500,000.00"],["持仓市值","2,057,600.00"]];
  const rows = [["QFII-DEMO", "HEDGE-DEMO01", "000001.SZ", "平安银行", "已上市", "多头", "8,000", "120,000", "10,000", "5,000", "10.62", "117,000", "125,000", "1,350,000.00"], ["CHANNEL-B", "HEDGE-DEMO02", "600000.SH", "浦发银行", "已上市", "多头", "3,000", "80,000", "0", "2,000", "9.38", "75,000", "77,000", "733,040.00"]];
  return `<div class="toolbar compact"><input class="field" placeholder="对冲账号"><input class="field" placeholder="标的代码"><button class="btn primary" data-data-query>查询</button><button class="btn ghost" data-data-export>导出</button></div><div class="summary-cards">${cards.map(c=>`<div><span>${c[0]}</span><b>${c[1]}</b></div>`).join("")}</div>${tablePage(["对冲渠道","对冲账号","标的代码","标的名称","标的状态","持仓类型","冻结数量","期初数量","日内开仓成交数量","日内平仓成交数量","持仓均价","可用数量","持仓数量","持仓市值"], rows)}`;
}

function tradingDayPage() {
  const rows = [["CN-EQUITY", "沪深", "2026-10-10", "CN_STOCK"], ["HK-EQUITY", "港股", "2026-10-10", "HKEX"], ["US-EQUITY", "美股", "2026-10-09", "NYSE_NASDAQ"], ["CN-FUTURE", "期货", "2026-10-10", "CN_FUTURE"]];
  return `<div class="toolbar compact"><input class="field" placeholder="业务单元"><select class="select-field"><option>全部市场</option><option>沪深</option><option>港股</option><option>美股</option></select><button class="btn primary" data-data-query>查询</button></div>${tablePage(["业务单元","市场","当前交易日","交易日历"], rows)}`;
}

function historyOrderPage() {
  const rows = [["2026-10-10", "ORD-DEMO-001", "DEMO-TR01", "演示客户01", "DEMO-1001", "HighTouch", "000001.SZ", "平安银行", "买入", "10.80", "2,000", "限价单", "10.78", "2,000", "21,560.00", "已成", "QFII-DEMO"], ["2026-10-09", "ORD-DEMO-002", "DEMO-TR02", "演示客户02", "DEMO-1002", "LowTouch", "600000.SH", "浦发银行", "卖出", "9.52", "5,000", "限价单", "9.52", "5,000", "47,600.00", "已成", "CHANNEL-B"]];
  return `${historyToolbar(["标的代码", "交易账户", "业务标识", "订单状态"])}<div class="dimension-bar"><span>汇总维度</span>${["委托单笔","标的代码+订单方向","标的代码+订单方向+日期","标的代码+订单方向+业务类型"].map((x,i)=>`<button class="dimension-btn ${i===0?"active":""}">${x}</button>`).join("")}</div>${tablePage(["日期","委托编号","交易账户","客户名","资金账户号","订单模式","标的代码","标的名称","订单方向","委托价格","委托数量","订单类型","成交均价","成交数量","成交金额","订单状态","对冲渠道"], rows, "合计　成交数量 7,000　成交金额 69,160.00")}`;
}

function filterToolbar(labels, exportable=false) {
  return `<div class="toolbar compact data-filter">${labels.map(x=>`<input class="field" placeholder="${x}">`).join("")}<button class="btn primary" data-data-query>查询</button>${exportable?`<button class="btn ghost" data-data-export>导出</button>`:""}</div>`;
}

function historyToolbar(labels) {
  return `<div class="history-tools"><div class="range-buttons">${["今天","昨天","最近7天","最近1个月","最近3个月"].map(x=>`<button class="${x===state.dataRange?"active":""}" data-date-range="${x}">${x}</button>`).join("")}<input type="date" value="2026-10-10"><span>至</span><input type="date" value="2026-10-10"></div>${filterToolbar(labels, true)}</div>`;
}

function tablePage(columns, rows, summary="") {
  return `<div class="table-wrap standalone-data-table"><table class="data-table"><thead><tr><th style="width:46px">序号</th>${columns.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i===0?"selected":""}"><td>${i+1}</td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${summary?`<div class="data-summary">${summary}</div>`:""}`;
}

function riskView() {
  const tabs = ["风控设置", "自定义风控设置", "风控消息", "强平执行", "强平监控"];
  if (state.riskTab === "风控消息") return riskMessageView(tabs);
  const visibleRules = state.riskCategory === "全部规则" ? riskRules : riskRules.filter(r=>r.category===state.riskCategory);
  return `<section class="view panel risk-view"><div class="top-tabs">${tabs.map(x=>`<button class="top-tab ${x===state.riskTab?"active":""}" data-risk-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><select class="select-field" id="riskCategory">${["全部规则","交易事前","交易事中","资管事前"].map(x=>`<option ${x===state.riskCategory?"selected":""}>${x}</option>`).join("")}</select><span class="clearable"><input class="field" placeholder="规则编号 / 风控类型"></span><button class="btn primary">查询</button><span class="toolbar-note">规则不提供编辑；变更时关闭旧规则并新增</span><span class="toolbar-spacer"></span><button class="btn primary" id="addRiskRule">新增规则</button></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th style="width:50px">序列</th><th style="width:130px">操作</th><th style="width:100px">规则编号</th><th style="width:80px">启用状态</th><th style="width:90px">规则分类</th><th>风控类型</th><th style="width:110px">交易账号</th><th>备注</th><th style="width:120px">应用客户范围</th><th style="width:100px">作用起始日</th></tr></thead><tbody>${visibleRules.map((r,i)=>`<tr class="${r.enabled?"selected":""}"><td>${i+1}</td><td class="center"><span class="toggle ${r.enabled?"on":""}" data-risk-toggle="${r.id}"></span><button class="icon-button" data-risk-delete="${r.id}" title="删除">⌫</button><button class="icon-button" data-risk-export="${r.id}" title="导出">↗</button></td><td>${r.id}</td><td>${r.enabled?"True":"False"}</td><td>${r.category}</td><td>${r.type}</td><td>${r.account}</td><td>${r.note}</td><td>${r.scope}</td><td class="date-orange">${r.start}</td></tr>`).join("")}</tbody></table></div>
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
  if (state.configTab === "柜台账号映射") return counterMappingView(tabs);
  const rows = [["99990109","演示客户01","P99990109","CNY"],["111111","演示客户02","P111111","CNY"],["778899","demo_test","P778899","CNY"],["2262403045","客户A","P2262403045","CNY"],["1069991","客户B","P1069991","CNY"],["11111","客户C（空头）","P11111","CNY"],["112233","lcw_test","P112233","CNY"],["20251208","20251208","P20251208","CNY"],["10000037","ccf2","P10000037","CNY"],["122901","客户D（空头）2","P122901","CNY"],["494657","test_party_494657","P494657","CNY"],["666","marsT","P666","CNY"],["1100274","演示客户03","P1100274","USD"],["1100374","演示客户04","P1100374","CNY"],["1112423","YYQ1","P1112423","CNY"],["80888192","80888192","P80888192","CNY"]];
  return `<section class="view panel config-view"><div class="top-tabs">${tabs.map(x=>`<button class="top-tab ${x===state.configTab?"active":""}" data-config-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><span class="clearable"><input class="field"></span><button class="btn primary">查询</button><button class="btn primary">新增</button></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th style="width:120px">操作</th><th style="width:200px">客户账号</th><th style="width:200px">客户名称</th><th style="width:200px">购买力资金账号</th><th>购买力货币</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i===9?"selected":""}"><td class="center"><span class="icon-pair">● ▣</span></td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
}

function counterMappingView(tabs) {
  const rows = [
    ["演示客户01", "DEMO-1001", "深交所", "QFII-DEMO", "HEDGE-DEMO01", "是", "SZ:{code}"],
    ["演示客户02", "DEMO-1002", "上交所", "CHANNEL-B", "HEDGE-DEMO02", "否", "SH:{code}"],
    ["演示客户03", "DEMO-1003", "港交所", "CHANNEL-C", "HEDGE-DEMO03", "否", "HK:{code}"],
  ];
  return `<section class="view panel config-view"><div class="top-tabs">${tabs.map(x=>`<button class="top-tab ${x===state.configTab?"active":""}" data-config-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><input class="field" placeholder="客户账号 / 资金账号"><button class="btn primary">查询</button><button class="btn primary">新增</button><button class="btn ghost">导入</button><button class="btn ghost">导出</button><span class="toolbar-note">双击记录进入编辑</span></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th style="width:90px">操作</th><th>客户名称</th><th>资金账号</th><th>交易所</th><th>对冲渠道</th><th>交易账号</th><th>默认渠道</th><th>标的物代码规则</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i===0?"selected":""}" data-mapping-row><td class="center"><button class="icon-button" title="删除">⌫</button></td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <div class="config-footnote">智能路由仅使用同时存在于柜台账号映射和报单排序模板中的渠道；存在默认渠道时优先按默认渠道处理。</div>
  </section>`;
}

function orderModeConfigView(tabs) {
  const rows = [["DEMO-C01", "演示客户01", "DEMO-1001", "SZ", "HighTouch"], ["DEMO-C02", "演示客户02", "DEMO-1002", "SH", "LowTouch"], ["DEMO-C03", "演示客户03", "DEMO-1003", "ALL", "ALL"]];
  return `<section class="view panel config-view"><div class="top-tabs">${tabs.map(x=>`<button class="top-tab ${x===state.configTab?"active":""}" data-config-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><span class="clearable"><input class="field" placeholder="客户名称"></span><button class="btn primary">查询</button><button class="btn primary">新增</button></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th style="width:120px">操作</th><th>客户账号</th><th>客户名称</th><th>资金账号</th><th>交易所</th><th>订单模式</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i===0?"selected":""}"><td class="center"><span class="icon-pair">✎ ▣</span></td>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
}

function approvalView() {
  const pending = state.approvalTab === "待审批事项";
  const rows = pending ? approvalRows.filter(r=>r[5]==="待审批") : approvalRows.filter(r=>r[5]!=="待审批");
  const selected = approvalRows[state.selectedApproval] || approvalRows[0];
  const details = selected ? [["资管初审", selected[5], pending?"--":"审批员A", pending?"--":"2026-10-10 10:25:18", pending?"当前节点":"已完成", "订单数据未修改"], ["资管复核", "待处理", "--", "--", "后续节点", "--"]] : [];
  return `<section class="view panel approval-view">
    <div class="top-tabs">${["待审批事项","已审批事项"].map(x=>`<button class="top-tab ${x===state.approvalTab?"active":""}" data-approval-tab="${x}">${x}</button>`).join("")}</div>
    <div class="toolbar"><input class="field" placeholder="委托编号"><button class="btn primary">查询</button><span class="toolbar-spacer"></span>${pending?`<button class="btn ghost" id="approvalDetail">查看详情</button><button class="btn danger" id="rejectApproval">审批拒绝</button><button class="btn primary" id="passApproval">审批通过</button>`:""}</div>
    <section class="approval-list"><div class="panel-title">${state.approvalTab}</div><div class="table-wrap"><table class="data-table"><thead><tr><th>审批序号</th><th>委托编号</th><th>发起日期</th><th>发起时间</th><th>审批类别</th><th>审批状态</th><th>是否改单</th><th>标的</th><th>订单类型</th><th>数量</th><th>价格</th><th>方向</th></tr></thead><tbody>${rows.map(r=>{const idx=approvalRows.indexOf(r);return `<tr data-approval-row="${idx}" class="${idx===state.selectedApproval?"selected":""}">${r.map(v=>`<td>${v}</td>`).join("")}</tr>`}).join("")}</tbody></table>${rows.length?"":`<div class="empty-hint">暂无${state.approvalTab}</div>`}</div></section>
    <section class="approval-detail"><div class="panel-title">审批明细 <span class="panel-note">${selected?.[1]||"--"}</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>审批节点</th><th>审批结果</th><th>审批人</th><th>审批时间</th><th>当前节点</th><th>审批前后数据</th></tr></thead><tbody>${details.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>
  </section>`;
}

function modalView() {
  if (!state.modal) return "";
  const close = `<button class="modal-close" data-close-modal aria-label="关闭">×</button>`;
  if (state.modal.type === "risk-rule") return `<div class="modal-mask"><section class="dialog wide-dialog"><header><h3>新增风控规则</h3>${close}</header><div class="dialog-body form-grid">
    <label><span>规则分类</span><select id="newRiskCategory"><option>交易事前</option><option>交易事中</option><option>资管事前</option></select></label>
    <label><span>风控类型</span><select id="newRiskType"><option>禁止交易</option><option>黑名单</option><option>白名单</option><option>单笔委托数量</option><option>价格偏离度</option><option>下单频率</option><option>可用名本集中度</option><option>NAV集中度</option><option>NAV单笔订单市值</option><option>对敲交易</option><option>反向交易</option><option>委托量占比</option></select></label>
    <label><span>应用客户范围</span><select><option>个人</option><option>全局</option></select></label>
    <label><span>客户列表</span><input placeholder="请选择客户"></label>
    <label><span>资金账号名称</span><input placeholder="请选择资金账号"></label>
    <label><span>框架名称</span><input placeholder="请选择框架"></label>
    <label><span>证券范围类型/列表</span><input placeholder="全部 / 标的 / 证券池 / 市场"></label>
    <label><span>交易账号</span><input id="newRiskAccount" placeholder="可选"></label>
    <label><span>控制渠道</span><select><option>全部</option><option>QFII</option></select></label>
    <label><span>作用起止日</span><input type="date" value="2026-10-10"></label>
    <label><span>订单方向</span><select><option>全部</option><option>买入</option><option>卖出</option></select></label>
    <label><span>开平标识</span><select><option>全部</option><option>开仓</option><option>平仓</option></select></label>
    <label><span>时间区间</span><input placeholder="09:30:00 - 15:00:00"></label>
    <label><span>备注</span><input id="newRiskNote" placeholder="规则说明"></label>
    <div class="field-help span-2">页面未提供编辑入口。规则变更时，请先关闭旧规则，再新增并验证新规则。</div>
  </div><footer><button class="btn ghost" data-close-modal>取消</button><button class="btn primary" id="saveRiskRule">确定</button></footer></section></div>`;
  if (state.modal.type === "order-confirm") {
    const direction = state.tradeType === "空头交易" ? (state.direction === "buy" ? "卖开" : "买平") : (state.direction === "buy" ? "买入" : "卖出");
    return `<div class="modal-mask"><section class="dialog"><header><h3>订单二次确认</h3>${close}</header><div class="dialog-body confirm-grid">
      <span>交易类型</span><b>${state.tradeType}</b><span>资金/对冲账号</span><b>${state.tradeType==="敞口控制交易"?"HEDGE-DEMO01":"DEMO-1001"}</b>
      <span>标的代码</span><b>000001.SZ</b><span>订单方向</span><b>${direction}</b>
      <span>订单类型</span><b>限价单</b><span>订单模式</span><b>${state.orderMode}</b>
      <span>订单价格</span><b>${state.price.toFixed(2)}</b><span>订单数量</span><b>${state.quantity.toLocaleString()}</b>
      <span>预估下单金额</span><b>${(state.price*state.quantity).toLocaleString(undefined,{minimumFractionDigits:2})}</b><span>订单控制</span><b>${[state.noApproval?"无需审批":"",state.manualOrder?"手工单":""].filter(Boolean).join("、")||"--"}</b>
    </div><footer><button class="btn ghost" data-close-modal>返回修改</button><button class="btn primary" id="confirmSubmitOrder">确认发送</button></footer></section></div>`;
  }
  if (["direct-order","split-order"].includes(state.modal.type)) {
    const split = state.modal.type === "split-order";
    const rows = split ? 2 : 1;
    return `<div class="modal-mask"><section class="dialog wide-dialog"><header><h3>${split?"拆单":"直接下单"}</h3>${close}</header><div class="dialog-body"><div class="source-order">母单 ${orderRows[state.modal.index][3]} · 待处理数量 ${orderRows[state.modal.index][8]} · 母单模式 ${orderRows[state.modal.index][6]}</div>
      <table class="data-table edit-table"><thead><tr><th>子单</th><th>订单价格</th><th>订单数量</th><th>订单模式</th><th>算法类型</th><th>手工单</th><th>备注</th></tr></thead><tbody>${Array.from({length:rows},(_,i)=>`<tr><td>${i+1}</td><td><input class="child-price" value="${orderRows[state.modal.index][7]}"></td><td><input class="child-qty" value="${split?i===0?"1200":"800":orderRows[state.modal.index][8].replaceAll(",","")}"></td><td><select class="child-mode"><option>LowTouch</option><option>HighTouch</option></select></td><td><select><option>不使用</option><option>TWAP</option></select></td><td><input class="child-manual" type="checkbox"></td><td><input placeholder="可选"></td></tr>`).join("")}</tbody></table>
      <div class="field-help">母单与子单模式可以不同；子单数量合计不得超过母单当前可处理数量。</div></div><footer><button class="btn ghost" data-close-modal>取消</button><button class="btn primary" id="saveChildOrders" data-parent-index="${state.modal.index}">提交</button></footer></section></div>`;
  }
  if (state.modal.type === "manual-fill") return `<div class="modal-mask"><section class="dialog"><header><h3>成交信息录入</h3>${close}</header><div class="dialog-body form-grid"><label><span>成交价格</span><input id="executionPrice" value="${state.price.toFixed(2)}"></label><label><span>成交数量</span><input id="executionQty" value="1000"></label><label><span>成交时间</span><input id="executionTime" type="datetime-local" value="2026-10-10T10:20"></label><div class="field-help span-2">成交时间不得早于委托时间；同一子单可录入一笔或多笔成交。</div></div><footer><button class="btn ghost" data-close-modal>取消</button><button class="btn primary" id="saveExecution">保存</button></footer></section></div>`;
  return "";
}

function bindInteractions() {
  document.querySelectorAll("[data-symbol-index]").forEach(row => row.addEventListener("click", () => { state.selectedSymbol = Number(row.dataset.symbolIndex); render(); }));
  document.querySelectorAll("[data-data-tab]").forEach(btn => btn.addEventListener("click", () => { if(!implementedDataTabs.includes(btn.dataset.dataTab)) return notify(`${btn.dataset.dataTab}在当前知识库中缺少完整 PC 页面资料`); state.dataTab=btn.dataset.dataTab; render(); }));
  document.querySelectorAll("[data-data-party]").forEach(btn => btn.addEventListener("click", () => { state.dataParty=btn.dataset.dataParty; render(); }));
  document.querySelectorAll("[data-position-mode]").forEach(btn => btn.addEventListener("click", () => { state.positionMode=btn.dataset.positionMode; render(); }));
  document.querySelectorAll("[data-position-market]").forEach(btn => btn.addEventListener("click", () => { state.positionMarket=btn.dataset.positionMarket; render(); }));
  document.querySelectorAll("[data-date-range]").forEach(btn => btn.addEventListener("click", () => { state.dataRange=btn.dataset.dateRange; render(); }));
  document.querySelectorAll("[data-data-query]").forEach(btn => btn.addEventListener("click", () => notify(`${state.dataTab}查询条件已应用（原型）`)));
  document.querySelectorAll("[data-data-export]").forEach(btn => btn.addEventListener("click", () => notify(`${state.dataTab}当前结果已生成演示导出`)));
  document.querySelectorAll("[data-trade-type]").forEach(btn => btn.addEventListener("click", () => { state.tradeType = btn.dataset.tradeType; render(); }));
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
  document.querySelectorAll("[data-risk-toggle]").forEach(toggle => toggle.addEventListener("click", () => { const rule=riskRules.find(r=>r.id===Number(toggle.dataset.riskToggle)); rule.enabled=!rule.enabled; render(); notify(rule.enabled?"规则已开启":"规则已关闭"); }));
  document.querySelectorAll("[data-risk-delete]").forEach(btn => btn.addEventListener("click", () => notify(`规则 ${btn.dataset.riskDelete} 删除操作仅作演示，未实际移除`)));
  document.querySelectorAll("[data-risk-export]").forEach(btn => btn.addEventListener("click", () => notify(`规则 ${btn.dataset.riskExport} 已生成演示导出`)));
  document.querySelectorAll("[data-risk-tab]").forEach(btn => btn.addEventListener("click", () => {
    if (!["风控设置", "风控消息"].includes(btn.dataset.riskTab)) return notify(`${btn.dataset.riskTab}待补充截图后继续复刻`);
    state.riskTab = btn.dataset.riskTab;
    render();
  }));
  document.querySelectorAll("[data-config-tab]").forEach(btn => btn.addEventListener("click", () => {
    if (!["购买力账号", "订单模式", "柜台账号映射"].includes(btn.dataset.configTab)) return notify(`${btn.dataset.configTab}待补充截图后继续复刻`);
    state.configTab = btn.dataset.configTab;
    render();
  }));
  document.querySelectorAll("[data-approval-tab]").forEach(btn => btn.addEventListener("click", () => { state.approvalTab=btn.dataset.approvalTab; const first=approvalRows.findIndex(r=>state.approvalTab==="待审批事项"?r[5]==="待审批":r[5]!=="待审批"); if(first>=0) state.selectedApproval=first; render(); }));
  document.querySelectorAll("[data-approval-row]").forEach(row => row.addEventListener("click", () => { state.selectedApproval=Number(row.dataset.approvalRow); render(); }));
  document.querySelector("#passApproval")?.addEventListener("click", () => { approvalRows[state.selectedApproval][5]="审批通过"; state.approvalTab="已审批事项"; render(); notify("审批已通过，委托进入后续执行流程"); });
  document.querySelector("#rejectApproval")?.addEventListener("click", () => { approvalRows[state.selectedApproval][5]="审批拒绝"; state.approvalTab="已审批事项"; render(); notify("审批已拒绝并保留审批记录"); });
  document.querySelector("#approvalDetail")?.addEventListener("click", () => notify("已展示委托详情、审批节点及审批前后数据（原型）"));
  document.querySelectorAll("[data-order-row]").forEach(row => row.addEventListener("click", () => { state.selectedOrder=Number(row.dataset.orderRow); render(); }));
  document.querySelector("#orderAttributeFilter")?.addEventListener("change", event => { state.orderAttributeDraft=event.target.value; });
  document.querySelector("[data-order-filter]")?.addEventListener("click", () => {
    state.orderAttributeFilter=state.orderAttributeDraft;
    const matchingIndexes=orderRows.map((row,index)=>({row,index})).filter(({row})=>!state.orderAttributeFilter||row[9]===state.orderAttributeFilter).map(({index})=>index);
    if (!matchingIndexes.includes(state.selectedOrder)) state.selectedOrder=matchingIndexes[0] ?? -1;
    render();
    notify(`筛选完成，共 ${matchingIndexes.length} 条委托`);
  });
  document.querySelectorAll("[data-approve-order]").forEach(btn => btn.addEventListener("click", (event) => { event.stopPropagation(); const index=Number(btn.dataset.approveOrder); orderRows[index][1] = "已确认"; state.selectedOrder=index; render(); notify("订单已确认，可选择直接下单或拆单"); }));
  document.querySelectorAll("[data-direct-order]").forEach(btn => btn.addEventListener("click", (event) => { event.stopPropagation(); state.modal={type:"direct-order",index:Number(btn.dataset.directOrder)}; render(); }));
  document.querySelectorAll("[data-split-order]").forEach(btn => btn.addEventListener("click", (event) => { event.stopPropagation(); state.modal={type:"split-order",index:Number(btn.dataset.splitOrder)}; render(); }));
  document.querySelectorAll("[data-manual-fill]").forEach(btn => btn.addEventListener("click", () => { const [parent,child]=btn.dataset.manualFill.split(":").map(Number); const row=childOrders[parent]?.[child]; if(!row?.manual) return notify("电子子单已发起撤单演示"); state.modal={type:"manual-fill",index:parent,child}; render(); }));
  document.querySelector("#orderModeSelect")?.addEventListener("change", (event) => { state.orderMode = event.target.value; render(); });
  document.querySelector("#noApproval")?.addEventListener("change", event => { state.noApproval=event.target.checked; });
  document.querySelector("#manualOrder")?.addEventListener("change", event => { state.manualOrder=event.target.checked; render(); });
  document.querySelector("#riskCategory")?.addEventListener("change", event => { state.riskCategory=event.target.value; render(); });
  document.querySelector("#addRiskRule")?.addEventListener("click", () => { state.modal={type:"risk-rule"}; render(); });
  document.querySelectorAll("[data-mapping-row]").forEach(row => row.addEventListener("dblclick", () => notify("已进入柜台账号映射编辑状态（原型）")));
  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => { state.modal=null; render(); }));
  document.querySelector("#saveRiskRule")?.addEventListener("click", () => { riskRules.unshift({id:Math.max(...riskRules.map(r=>r.id))+1,enabled:false,category:document.querySelector("#newRiskCategory").value,type:document.querySelector("#newRiskType").value,account:document.querySelector("#newRiskAccount").value,note:document.querySelector("#newRiskNote").value,scope:"个人",start:"2026-10-10"}); state.modal=null; state.riskCategory="全部规则"; render(); notify("新规则已保存，默认处于关闭状态"); });
  document.querySelector("#saveChildOrders")?.addEventListener("click", () => { const index=Number(document.querySelector("#saveChildOrders").dataset.parentIndex); const prices=[...document.querySelectorAll(".child-price")]; const qtys=[...document.querySelectorAll(".child-qty")]; const modes=[...document.querySelectorAll(".child-mode")]; const manuals=[...document.querySelectorAll(".child-manual")]; childOrders[index]=prices.map((p,i)=>({manual:manuals[i].checked,values:[`SUB-${index+1}${i+1}`,orderRows[index][5],modes[i].value,p.value,Number(qtys[i].value).toLocaleString(),manuals[i].checked?"待补录":"已报"]})); state.modal=null; state.selectedOrder=index; render(); notify(`${childOrders[index].length} 笔子单已生成并联动展示`); });
  document.querySelector("#saveExecution")?.addEventListener("click", () => { const index=state.modal.index; tradeExecutions[index] ||= []; tradeExecutions[index].push([orderRows[index][5],`EXEC-${index+1}${tradeExecutions[index].length+1}`,document.querySelector("#executionPrice").value,Number(document.querySelector("#executionQty").value).toLocaleString(),"手工成交"]); state.modal=null; render(); notify("手工成交已保存并汇总至母单（原型）"); });
  document.querySelector("#resetOrder")?.addEventListener("click", () => { state.price = 10.80; state.quantity = 0; state.noApproval=false; state.manualOrder=false; render(); notify("下单信息已重置"); });
  document.querySelector("#submitOrder")?.addEventListener("click", () => { state.modal={type:"order-confirm"}; render(); });
  document.querySelector("#confirmSubmitOrder")?.addEventListener("click", () => { const direction=state.tradeType==="空头交易"?(state.direction==="buy"?"卖开":"买平"):(state.direction==="buy"?"买入":"卖出"); orderRows.unshift([direction,state.orderMode==="HighTouch"?"待确认":"已报",state.tradeType,"DEMO-NEW",state.tradeType==="敞口控制交易"?"敞口订单":"DEMO-FRAME","000001.SZ",state.orderMode,state.price.toFixed(2),state.quantity.toLocaleString(),""]); state.modal=null; state.view="orders"; state.selectedOrder=0; render(); notify(state.orderMode==="HighTouch"?"HighTouch 母单已生成，等待交易员确认":"LowTouch 订单已进入自动报单流程"); });
}

let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

render();

