/* Synthetic data for the interactive UI draft. No trading service is connected. */
const futuresContracts = [
  { code: "rb2701.SHF", name: "螺纹钢2701", exchange: "上期所", split: true, price: 3128, tick: 1, multiplier: 10, margin: .12, fee: 4 },
  { code: "sc2701.INE", name: "原油2701", exchange: "上期能源", split: true, price: 456.6, tick: .1, multiplier: 1000, margin: .15, fee: 40 },
  { code: "a2701.DCE", name: "连豆一2701", exchange: "大商所", split: false, price: 4218, tick: 1, multiplier: 10, margin: .12, fee: 2 },
  { code: "TA2701.CZC", name: "PTA2701", exchange: "郑商所", split: false, price: 4986, tick: 2, multiplier: 5, margin: .12, fee: 3 },
  { code: "IF2612.CFE", name: "沪深2612", exchange: "中金所", split: false, price: 4216.8, tick: .2, multiplier: 300, margin: .15, fee: 30 },
  { code: "lc2701.GFE", name: "碳酸锂2701", exchange: "广期所", split: false, price: 78200, tick: 20, multiplier: 1, margin: .15, fee: 12 },
];

const futures = {
  contract: 0, direction: "sell", offset: "today", price: 3128, qty: 1,
  account: "交易账户01", customer: "演示交易对手01", fund: "DEMO-F01", channel: "渠道A", frame: "期货框架01", mode: "HighTouch",
  type: "期货交易", listTab: "委托列表",
  expanded: false, modal: null, error: "", selectedOrder: "F20261105003",
  filterDirection: "全部", filterOffset: "全部", filterContract: "全部", query: null,
  noApproval: false, manual: false,
  algorithm: "无", remark: "", orderType: "限价单", spreadDirection: "buy",
  legOffsets: ["open", "open"], spreadQty: 1, spreadPrice: 12,
};

const traderFuturesSettingsKey = "trader-futures-ticket-settings";
let traderFuturesSettings = TicketSettings.load(traderFuturesSettingsKey, {
  priority: "today", keep: ["交易账户", "合约代码", "委托价格"],
  priceWheel: false, quantityWheel: false, quantities: [1, 5, 10, null],
});

const futuresOrders = [
  { id: "F20261105003", code: "rb2701.SHF", direction: "卖出", offset: "平今", requested: "平今", price: 3129, qty: 1, filled: 0, status: "已报", mode: "LowTouch", time: "14:28:36", day: "2026-11-05", channel: "渠道A", frame: "期货框架01" },
  { id: "F20261105002", code: "rb2701.SHF", direction: "买入", offset: "开仓", requested: "开仓", price: 3126, qty: 3, filled: 3, status: "已成", mode: "HighTouch", time: "13:42:18", day: "2026-11-05", channel: "渠道A", frame: "期货框架01" },
  { id: "F20261105001", code: "a2701.DCE", direction: "卖出", offset: "平仓", requested: "平仓", price: 4220, qty: 2, filled: 2, status: "已成", mode: "LowTouch", time: "10:16:45", day: "2026-11-05", channel: "渠道B", frame: "期货框架01" },
];

const futuresReservations = new Map();
const futureCombinations = [{ name: "连豆跨期组合01", direction: "买入", legs: "A a2701　B a2703", offsets: "A 开仓　B 开仓", sides: "A 买入　B 卖出", qty: 2, status: "已终止" }];
const futureMoney = value => Number(value).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const futureEscape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const currentFuture = () => futuresContracts[futures.contract];
const futureAutoOffsetLabel = contract => contract.split && futures.mode !== "HighTouch" ? `自动（优先平${traderFuturesSettings.priority === "yesterday" ? "昨" : "今"}）` : "自动";
const futureOffsetLabel = (offset, contract = currentFuture()) => offset === "auto" ? futureAutoOffsetLabel(contract) : ({ open: "开仓", close: contract.split ? "平昨" : "平仓", today: "平今" }[offset]);
// Demo account mapping. The production ticket will read the existing account permission.
const futureIsTwoSide = () => futures.account === "交易账户02";
const futureRequestedOffsetLabel = contract => futureIsTwoSide() ? "自动开平" : futureOffsetLabel(futures.offset, contract);
const futureOrderOffsetLabel = row => {
  const contract = futuresContracts.find(item => item.code === row.code) || currentFuture();
  return row.offset === "平仓" && contract.split ? "平昨" : row.offset;
};

function futurePosition(side, context = futures, code = currentFuture().code) {
  const small = context.channel === "渠道B";
  const alternate = context.frame === "期货框架02";
  const base = side === "多头"
    ? { today: small ? 1 : 3, yesterday: small ? 2 : 5, frozenToday: small ? 0 : 1, frozenYesterday: 0 }
    : { today: small ? 0 : 2, yesterday: small ? 1 : 4, frozenToday: 0, frozenYesterday: small ? 0 : 1 };
  if (alternate) Object.assign(base, { today: 1, yesterday: 2, frozenToday: 0, frozenYesterday: 0 });

  const key = FuturesExecution.clientKey({ ...context, code, side });
  const shared = FuturesExecution.usage(key);
  const sample = futuresReservations.get(key) || { today: 0, yesterday: 0 };
  const frozenToday = base.frozenToday + shared.today + sample.today;
  const frozenYesterday = base.frozenYesterday + shared.yesterday + sample.yesterday;
  return { ...base, key, side, frozenToday, frozenYesterday,
    availableToday: base.today - frozenToday, availableYesterday: base.yesterday - frozenYesterday };
}

function futureHedge(side, context = futures, code = currentFuture().code) {
  return FuturesExecution.hedgePosition({ code, channel: context.channel, side });
}
function futureClosingSide(direction = futures.direction) {
  return direction === "buy" ? "空头" : "多头";
}
function futureRows() {
  const parents = FuturesExecution.parents().map(row => ({
    ...row, direction: row.direction === "buy" ? "买入" : "卖出",
    offset: row.requested, filled: 0, mode: "HighTouch",
  }));
  const orders = FuturesExecution.orders("trader").map(row => ({
    ...row, origin: null, direction: row.direction === "buy" ? "买入" : "卖出",
    offset: futureOffsetLabel(row.offset, futuresContracts.find(item => item.code === row.code)),
    filled: 0, mode: "LowTouch",
  }));
  return [...parents, ...orders, ...futuresOrders];
}
function futureActions(row) {
  const canSplit = row.status === "待确认" && row.remaining > 0;
  const canCancel = (!row.origin && row.status === "已报") || (canSplit && row.remaining === row.qty);
  return (canSplit ? `<button class="table-action" data-future-split="${row.id}">拆单</button> ` : "") +
    (canCancel ? `<button class="table-action" data-future-cancel="${row.id}">撤单</button>` : "") ||
    "—";
}

function futureOpenLimit(context = futures, contract = currentFuture()) {
  const funds = context.account === "交易账户02" ? 65000 : 126840;
  return Math.max(0, Math.min(25, Math.floor(funds / (Math.max(1, context.price) * contract.multiplier * contract.margin + contract.fee))));
}

function futureOrderInputs() {
  const position = futurePosition(futures.direction === "buy" ? "空头" : "多头");
  return {
    ...position, qty: futures.qty, offset: futureIsTwoSide() ? "auto" : futures.offset,
    split: currentFuture().split, priority: traderFuturesSettings.priority, openLimit: futureOpenLimit(),
  };
}

function futureAvailable() {
  const input = futureOrderInputs();
  const hedge = futureHedge(futureClosingSide());
  const effective = { ...input, availableToday: Math.min(input.availableToday, hedge.availableToday),
    availableYesterday: Math.min(input.availableYesterday, hedge.availableYesterday) };
  if (!input.split && input.offset === "close") {
    return Math.min(input.availableToday + input.availableYesterday, hedge.availableToday + hedge.availableYesterday);
  }
  return FuturesOrderPlan.available(effective);
}

function futurePlan() {
  const direction = futures.direction === "buy" ? "买入" : "卖出";
  const offsets = { open: "开仓", today: "平今", close: "平仓" };
  return FuturesOrderPlan.plan(futureOrderInputs()).map(row => ({ direction, offset: offsets[row.offset], qty: row.qty }));
}

function tradingWorkspaceView() {
  return `<div class="trading-workspace"><div class="top-tabs trading-market-tabs">${["证券交易", "期货交易", "债券交易", "篮子交易"].map(label => `<button class="top-tab ${state.tradePage === label ? "active" : ""}" data-trading-page="${label}">${label}</button>`).join("")}<span class="toolbar-spacer"></span><span class="prototype-label">交互原型 · 演示数据</span></div>${state.tradePage === "期货交易" ? futuresView() : ordersView()}</div>`;
}

function futuresView() {
  return `<section class="view with-trade-panel futures-workspace"><div class="main-column futures-main">${futureOrderList()}${futureLowerPanel()}</div><aside class="side-column futures-side">${futureQuotePanel()}${futureOrderForm()}</aside></section>${futureModal()}`;
}

function futureOrderList() {
  const query = futures.query;
  const rows = futureRows().filter(row => !query || ((query.direction === "全部" || query.direction === row.direction) && (query.offset === "全部" || query.offset === row.requested || query.offset === futureOrderOffsetLabel(row)) && (query.contract === "全部" || query.contract === row.code)));
  return `<section class="panel future-orders"><div class="future-panel-tabs">${["委托列表", "组合委托列表"].map(tab => `<button data-future-list="${tab}" class="${futures.listTab === tab ? "active" : ""}">${tab}</button>`).join("")}</div>${futures.listTab === "组合委托列表" ? futureCombinationList() : `<div class="future-filters"><label>标的代码<select data-future-filter="contract"><option>全部</option>${futuresContracts.map(c => `<option ${futures.filterContract === c.code ? "selected" : ""}>${c.code}</option>`).join("")}</select></label><label>买卖方向<select data-future-filter="direction">${["全部", "买入", "卖出"].map(x => `<option ${futures.filterDirection === x ? "selected" : ""}>${x}</option>`).join("")}</select></label><label>开平标识<select data-future-filter="offset">${["全部", "自动", "自动（优先平今）", "自动（优先平昨）", "自动开平", "开仓", "平仓", "平今", "平昨"].map(x => `<option ${futures.filterOffset === x ? "selected" : ""}>${x}</option>`).join("")}</select></label><button class="btn primary" data-future-query>筛选</button><button class="future-text-button" data-future-clear-filter>重置</button><span class="toolbar-spacer"></span><span class="future-day">交易日 <b>2026-11-05</b></span></div><div class="future-list-tools"><button class="btn ghost" data-future-cancel-selected>撤单</button><span class="toolbar-spacer"></span><span>数量单位　手</span><button class="future-text-button" data-future-modal="columns" aria-label="委托列表列设置">⚙ 列设置</button></div><div class="table-wrap future-table-scroll"><table class="data-table future-order-table"><thead><tr>${["序列", "操作", "合约代码", "买卖方向", "开平标识", "订单状态", "委托价格", "委托数量", "成交数量", "订单模式", "对冲渠道", "委托时间", "委托编号", "交易日"].map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map((row, index) => `<tr data-future-order="${row.id}" class="${futures.selectedOrder === row.id ? "selected" : ""}"><td>${index + 1}</td><td>${futureActions(row)}</td><td>${row.code}</td><td class="${row.direction === "买入" ? "buy" : "sell"}">${row.direction}</td><td><span class="offset-pill ${row.offset === "开仓" ? "opening" : "closing"}">${futureOrderOffsetLabel(row)}</span></td><td><span class="future-status ${row.status === "已成" ? "filled" : row.status === "已撤" ? "cancelled" : ""}">${row.status}</span></td><td class="number">${futureMoney(row.price)}</td><td class="number">${row.qty}</td><td class="number">${row.filled}</td><td>${row.mode}</td><td>${row.channel}</td><td>${row.time}</td><td>${row.id}</td><td>${row.day}</td></tr>`).join("")}</tbody></table>${rows.length ? "" : '<div class="future-empty">暂无符合条件的委托</div>'}</div><div class="future-table-footer"><span>共 ${rows.length} 条</span><span>第 1 / 1 页　　20条/页　　‹　›</span></div>`}</section>`;
}

function futureCombinationList() {
  return `<div class="table-wrap future-table-scroll"><table class="data-table future-combination-table"><thead><tr>${["组合名称", "买卖方向", "组合腿合约", "组合腿开平", "组合腿方向", "份数", "运行状态"].map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${futureCombinations.map(row => `<tr>${[row.name, row.direction, row.legs, row.offsets, row.sides, row.qty, row.status].map(value => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table></div><div class="future-table-footer">共 ${futureCombinations.length} 条</div>`;
}

function futurePositionTable(full = false) {
  const contract = currentFuture();
  const rows = [futurePosition("多头"), futurePosition("空头")];
  const headers = ["合约代码", "持仓类型", "持仓数量", "今仓数量", "昨仓数量", "可平今", "可平昨", "平今冻结", "平昨冻结", "对冲渠道", "框架名称"];
  return `<div class="table-wrap future-position-scroll"><table class="data-table future-position-table ${full ? "full" : ""}"><thead><tr>${headers.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(p => `<tr><td>${contract.code}</td><td class="${p.side === "多头" ? "buy" : "sell"}">${p.side}</td>${[p.today + p.yesterday, p.today, p.yesterday, p.availableToday, p.availableYesterday, p.frozenToday, p.frozenYesterday].map((value, index) => `<td class="number ${index === 3 || index === 4 ? "available-cell" : ""}">${value}</td>`).join("")}<td>${futures.channel}</td><td>${futures.frame}</td></tr>`).join("")}</tbody></table></div>`;
}


function futureLowerPanel() {
  const selected = futureRows().find(row => row.id === futures.selectedOrder);
  const empty = selected?.status === "待确认" ? `待拆数量 ${selected.remaining} 手` : "暂无记录";
  const children = selected?.origin ? FuturesExecution.children(selected.id) : [];
  const linkedPanel = (title, headers, rows = [], emptyLabel = "暂无记录") => `<section class="panel future-linked-panel"><div class="panel-title">${title}</div><div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(label => `<th>${label}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table>${rows.length ? "" : `<div class="future-linked-empty">${emptyLabel}</div>`}</div></section>`;
  const contract = futuresContracts.find(item => item.code === selected?.code);
  return `<div class="future-linked-panels">${linkedPanel("对冲委托订单", ["序列", "操作", "子单编号", "合约代码", "买卖方向", "开平标识", "委托数量", "委托状态"], children.map((row, i) => [i + 1, "—", row.id, selected.code, selected.direction, futureOffsetLabel(row.offset, contract), row.qty, "已报"]), empty)}${linkedPanel("对冲成交列表", ["序列", "标的代码", "合约代码", "成交编号", "成交价格", "成交数量", "成交时间"])}</div>`;
}

function futureQuotePanel() {
  const c = currentFuture();
  const book = (side, index) => side === "buy" ? c.price - index * c.tick : c.price + (index + 1) * c.tick;
  return `<section class="panel future-quote"><div class="future-quote-heading"><span>五档行情</span><span class="future-market-label">${c.exchange}</span></div><div class="future-symbol"><strong>${c.name}</strong><span>${c.code}</span></div><div class="future-price-row"><b>${futureMoney(c.price)}</b><span>+${futureMoney(c.tick * 6)}　+0.19%</span><small>14:59:58</small></div><div class="future-quote-meta"><span>今开 <b>${futureMoney(c.price - c.tick * 2)}</b></span><span>昨结 <b>${futureMoney(c.price - c.tick * 6)}</b></span><span>总手 <b>128,640</b></span></div><div class="future-book">${["buy", "sell"].map(side => `<div class="${side}"><div class="future-book-head"><span>${side === "buy" ? "买盘" : "卖盘"}</span><span>价格</span><span>手数</span></div>${Array.from({ length: 5 }, (_, index) => `<button data-future-book="${book(side, index)}"><span>${index + 1}</span><b>${futureMoney(book(side, index))}</b><span>${[186, 324, 95, 208, 172][(index + (side === "sell" ? 2 : 0)) % 5]}</span></button>`).join("")}</div>`).join("")}</div></section>`;
}

function futureOrderForm() {
  if (futures.type !== "期货交易") return futureSpreadForm();
  const isBuy = futures.direction === "buy";
  const side = futureClosingSide();
  const p = futurePosition(side);
  const hedge = futureHedge(side);
  const contract = currentFuture();
  const availableLabel = futureIsTwoSide() || futures.offset === "auto" ? (isBuy ? "可买数量" : "可卖数量") : futures.offset === "open" ? (isBuy ? "可买开" : "可卖开") : futures.offset === "today" && contract.split ? (isBuy ? "可买平今" : "可卖平今") : futures.offset === "close" && contract.split ? (isBuy ? "可买平昨" : "可卖平昨") : (isBuy ? "可买平" : "可卖平");
  const label = `${isBuy ? "买入" : "卖出"}${futureIsTwoSide() ? "" : futureOffsetLabel(futures.offset, contract)}`;
  const offsets = contract.split
    ? [{value:"auto",label:futureAutoOffsetLabel(contract)}, {value:"open",label:"开仓"}, {value:"today",label:"平今"}, {value:"close",label:"平昨"}]
    : [{value:"open",label:"开仓"}, {value:"close",label:"平仓"}];
  const positionBreakdown = contract.split
    ? `<span class="future-position-today">可平今 <b>${Math.min(p.availableToday, hedge.availableToday)}</b></span><span class="future-position-yesterday">可平昨 <b>${Math.min(p.availableYesterday, hedge.availableYesterday)}</b></span>`
    : `<span class="future-position-today">今仓可用 <b>${p.availableToday}</b></span><span class="future-position-yesterday">昨仓可用 <b>${p.availableYesterday}</b></span>`;
  return `<section class="panel future-ticket local-ticket">
    <div class="future-ticket-header">交易下单</div>
    ${futureTypeTabs()}
    <div class="future-ticket-scroll">
      <div class="future-ticket-context"><span>交易日 <b>2026-11-05</b></span><span>${currentFuture().exchange}</span></div>
      ${futureSelect("交易账户", "account", [{value:"交易账户01",label:"交易账户01（4-side）"}, {value:"交易账户02",label:"交易账户02（2-side）"}], futures.account)}
      ${futureSelect("交易对手名称", "customer", ["演示交易对手01", "演示交易对手02"], futures.customer)}
      ${futureSelect("资金账号", "fund", ["DEMO-F01", "DEMO-F02"], futures.fund)}
      ${futureSelect("对冲渠道", "channel", ["渠道A", "渠道B"], futures.channel)}
      ${futureSelect("框架名称", "frame", ["期货框架01", "期货框架02"], futures.frame)}
      ${futureSelect("订单类型", "orderType", ["限价单"], futures.orderType)}
      ${futureSelect("订单模式", "mode", ["HighTouch", "LowTouch"], futures.mode)}
      ${futureSelect("合约代码", "contract", futuresContracts.map((c, i) => ({value:i,label:`${c.code} ${c.name}`})), futures.contract)}
      <div class="future-local-entry">
        <div class="future-field future-direction-row"><span>买卖方向</span><div class="future-directions">${["buy", "sell"].map(side => `<button class="${side} ${futures.direction === side ? "active" : ""}" aria-pressed="${futures.direction === side}" data-future-direction="${side}">${side === "buy" ? "买入" : "卖出"}</button>`).join("")}</div></div>
        ${futureIsTwoSide() ? "" : `<div class="future-field"><span>开平标识</span><div class="future-offsets count-${offsets.length}" role="group" aria-label="开平标识">${offsets.map(o => `<button class="${futures.offset === o.value ? "active" : ""}" aria-pressed="${futures.offset === o.value}" title="${o.label}" data-future-offset="${o.value}">${o.label}</button>`).join("")}</div></div>`}
        <div class="future-position-availability"><span class="future-available-main">${availableLabel} <b id="futureAvailableQty">${futureAvailable()}</b> 手</span>${positionBreakdown}</div>
        ${futureStepper("委托价格", "price", futures.price, currentFuture().tick)}
        ${futureStepper("委托数量", "qty", futures.qty, 1)}
        <div class="future-fractions">${[[.25, "1/4"], [1/3,"1/3"], [.5,"1/2"], [1,"全仓"]].map(([v,t]) => `<button data-future-fraction="${v}">${t}</button>`).join("")}</div>
        <details class="ticket-preset"><summary>常用数量</summary>${TicketSettings.quantityButtons(traderFuturesSettings.quantities, "data-future-preset")}</details>
      </div>
      <div class="future-ticket-options"><label><input type="checkbox" data-future-check="noApproval" ${futures.noApproval ? "checked" : ""}>无需审批</label><button class="future-text-button" data-future-expand>${futures.expanded ? "收起 ⌃" : "更多 ⌄"}</button></div>
      ${futures.expanded ? `<div class="future-extra">${futureSelect("算法类型", "algorithm", ["无", "TWAP"], futures.algorithm)}<label class="future-inline-check"><input type="checkbox" data-future-check="manual" ${futures.manual ? "checked" : ""}> 手工成交</label><label class="future-field"><span>备注</span><input data-future-remark value="${futureEscape(futures.remark)}" maxlength="120"></label></div>` : ""}
    </div>
    ${futures.error ? `<div class="future-error" role="alert">${futureEscape(futures.error)}</div>` : ""}
    <div class="future-ticket-footer"><button class="future-reset" data-future-settings aria-label="期货下单自定义设置">⚙</button><button class="future-reset" data-future-reset aria-label="重置下单">↺</button><button class="future-submit ${isBuy ? "buy" : "sell"}" data-future-submit>${label}<span>${futures.qty} 手</span></button></div>
  </section>`;
}

function futureTypeTabs() {
  return `<div class="future-type-tabs">${["期货交易", "自设套利", "标准套利"].map(label => `<button data-future-type="${label}" class="${futures.type === label ? "active" : ""}">${label}</button>`).join("")}</div>`;
}

function futureSelect(label, key, options, value) {
  return `<label class="future-field"><span>${label}</span><select data-future-select="${key}" aria-label="${label}">${options.map(item => { const option = typeof item === "object" ? item : { value: item, label: item }; return `<option value="${option.value}" ${String(option.value) === String(value) ? "selected" : ""}>${option.label}</option>`; }).join("")}</select></label>`;
}

function futureStepper(label, key, value, step) {
  return `<label class="future-field"><span>${label}</span><div class="future-stepper"><button data-future-step="${key}" data-delta="-${step}" aria-label="减少${label}">−</button><input aria-label="${label}" type="number" min="${key === "qty" ? 1 : step}" step="${step}" data-future-input="${key}" value="${value}"><button data-future-step="${key}" data-delta="${step}" aria-label="增加${label}">＋</button></div></label>`;
}

function futureSpreadForm() {
  const custom = futures.type === "自设套利";
  return `<section class="panel future-ticket"><div class="future-ticket-header">交易下单</div>${futureTypeTabs()}<div class="future-ticket-scroll"><div class="future-ticket-context"><span>交易日 <b>2026-11-05</b></span><span>大商所</span></div>${futureSelect("资金账号", "spreadAccount", ["演示资金账号01"], "演示资金账号01")}${futureSelect("对冲渠道", "channel", ["渠道A", "渠道B"], futures.channel)}${futureSelect(custom ? "组合名称" : "组合代码", "spreadName", [custom ? "连豆跨期组合01" : "SP a2701&a2703"], custom ? "连豆跨期组合01" : "SP a2701&a2703")}<div class="future-leg-list">${["a2701.DCE", "a2703.DCE"].map((code, index) => `<div class="future-leg"><span class="future-leg-id">${index ? "B" : "A"}</span><div><b>${code}</b><small>${index ? "卖出" : "买入"}　1 手 / 份</small></div><select aria-label="${index ? "B" : "A"}腿开平" data-future-leg="${index}"><option value="open" ${futures.legOffsets[index] === "open" ? "selected" : ""}>开仓</option><option value="close" ${futures.legOffsets[index] === "close" ? "selected" : ""}>平仓</option></select></div>`).join("")}</div>${futureStepper("价差价格", "spreadPrice", futures.spreadPrice, 1)}${futureStepper("份数", "spreadQty", futures.spreadQty, 1)}${futureSelect("订单模式", "mode", ["HighTouch", "LowTouch"], futures.mode)}<div class="future-money"><span>可用资金</span><b>CNY 126,840.00</b></div></div><div class="future-ticket-footer"><button class="future-submit buy" data-future-spread-submit="buy">买入组合<span>${futures.spreadQty} 份</span></button><button class="future-submit sell" data-future-spread-submit="sell">卖出组合<span>${futures.spreadQty} 份</span></button></div></section>`;
}

function futureModal() {
  if (!futures.modal) return "";
  let title = "";
  let body = "";
  let footer = '<button class="btn primary" data-future-close-modal>确定</button>';
  if (futures.modal === "split") {
    title = "HighTouch 拆单";
    body = futureSplitEditor();
    footer = '<button class="btn ghost" data-future-close-modal>返回</button><button class="btn primary" data-future-send-split>提交拆单</button>';
  } else if (futures.modal === "columns") {
    title = "期货委托列表字段";
    body = '<div class="future-keep-grid">' + ["合约代码", "买卖方向", "开平标识", "订单状态", "委托价格", "委托数量", "成交数量", "订单模式", "对冲渠道", "委托时间", "委托编号", "交易日"].map(label => `<label><input type="checkbox" checked disabled>${label}</label>`).join("") + '</div>';
  } else if (futures.modal === "spread") {
    title = "组合订单确认";
    body = `<dl class="future-confirm-info"><dt>组合</dt><dd>连豆跨期组合01</dd><dt>份数</dt><dd>${futures.spreadQty}</dd><dt>价差价格</dt><dd>${futures.spreadPrice}</dd><dt>A腿</dt><dd>${futures.spreadDirection === "buy" ? "买入" : "卖出"} ${futureOffsetLabel(futures.legOffsets[0], futuresContracts[2])} a2701</dd><dt>B腿</dt><dd>${futures.spreadDirection === "buy" ? "卖出" : "买入"} ${futureOffsetLabel(futures.legOffsets[1], futuresContracts[2])} a2703</dd></dl>`;
    footer = '<button class="btn ghost" data-future-close-modal>返回修改</button><button class="btn primary" data-future-confirm-spread>确认</button>';
  } else {
    const c = currentFuture();
    title = "期货订单确认";
    body = `<dl class="future-confirm-info"><dt>交易账户</dt><dd>${futures.account}</dd><dt>交易日</dt><dd>2026-11-05</dd><dt>合约代码</dt><dd>${c.code} ${c.name}</dd><dt>对冲渠道</dt><dd>${futures.channel}</dd><dt>买卖方向</dt><dd>${futures.direction === "buy" ? "买入" : "卖出"}</dd>${futureIsTwoSide() ? "" : `<dt>开平标识</dt><dd>${futureRequestedOffsetLabel(c)}</dd>`}<dt>委托价格</dt><dd>${futureMoney(futures.price)}</dd><dt>委托数量</dt><dd>${futures.qty} 手</dd><dt>订单模式</dt><dd>${futures.mode}</dd></dl>${futures.mode === "HighTouch" ? "" : `<table class="data-table future-plan"><thead><tr><th>买卖方向</th><th>报送开平</th><th>数量（手）</th></tr></thead><tbody>${futurePlan().map(row => `<tr><td>${row.direction}</td><td>${row.offset === "平仓" && c.split ? "平昨" : row.offset}</td><td>${row.qty}</td></tr>`).join("")}</tbody></table>`}`;
    footer = '<button class="btn ghost" data-future-close-modal>返回修改</button><button class="btn primary" data-future-confirm>确认提交</button>';
  }
  return `<div class="modal-mask future-modal" role="dialog" aria-modal="true" aria-labelledby="futureModalTitle"><section class="dialog"><header><h3 id="futureModalTitle">${title}</h3><button class="modal-close" data-future-close-modal aria-label="关闭">×</button></header><div class="dialog-body">${body}</div><footer>${footer}</footer></section></div>`;
}


function futureValidate() {
  if (!Number.isSafeInteger(futures.qty) || futures.qty < 1) return "委托数量须为大于 0 的整数手。";
  const c = currentFuture();
  if (!Number.isFinite(futures.price) || futures.price <= 0) return "请输入有效的委托价格。";
  if (Math.abs(futures.price / c.tick - Math.round(futures.price / c.tick)) > 1e-6) return `委托价格须为最小变动价位 ${c.tick} 的整数倍。`;
  const order = futureOrderInputs();
  if (futures.mode === "HighTouch" && order.offset === "auto") return "";
  return FuturesExecution.rejection(FuturesOrderPlan.plan(order), order, futureHedge(futureClosingSide()), c.split, order.openLimit);
}

function futureSubmit() {
  futures.error = futureValidate();
  futures.modal = futures.error ? null : "confirm";
  render();
}

function futureConfirm() {
  futures.error = futureValidate();
  if (futures.error) { futures.modal = null; render(); return; }
  const contract = currentFuture();
  const order = futureOrderInputs();
  const requested = futureRequestedOffsetLabel(contract);
  const context = { account: futures.account, customer: futures.customer, fund: futures.fund,
    frame: futures.frame, channel: futures.channel, code: contract.code, direction: futures.direction,
    qty: futures.qty, price: futures.price, requested, offset: order.offset, time: "14:59:59", day: "2026-11-05" };
  if (futures.mode === "HighTouch") {
    futures.selectedOrder = FuturesExecution.create({ ...context, origin: "trader" }).id;
  } else {
    const executions = FuturesExecution.record(FuturesOrderPlan.plan(order), order,
      futureHedge(futureClosingSide()), contract.split, undefined, { ...context, origin: "trader" });
    futures.selectedOrder = executions[0].id;
  }
  futures.query = null;
  futures.modal = null;
  if (!traderFuturesSettings.keep.includes("交易账户")) futures.account = "交易账户01";
  if (!traderFuturesSettings.keep.includes("对冲渠道")) futures.channel = "渠道A";
  if (!traderFuturesSettings.keep.includes("框架名称")) futures.frame = "期货框架01";
  if (!traderFuturesSettings.keep.includes("合约代码")) futures.contract = 0;
  if (!traderFuturesSettings.keep.includes("订单模式")) futures.mode = "HighTouch";
  if (!traderFuturesSettings.keep.includes("开平标识")) futures.offset = "open";
  if (!traderFuturesSettings.keep.includes("交易对手名称")) futures.customer = "演示交易对手01";
  if (!traderFuturesSettings.keep.includes("资金账号")) futures.fund = "DEMO-F01";
  if (!traderFuturesSettings.keep.includes("买卖方向")) futures.direction = "buy";
  if (!traderFuturesSettings.keep.includes("委托数量")) futures.qty = 1;
  if (!traderFuturesSettings.keep.includes("委托价格")) futures.price = currentFuture().price;
  if (!traderFuturesSettings.keep.includes("备注")) futures.remark = "";
  futures.listTab = "委托列表";
  render();
  notify("委托已加入演示列表");
}

function futureCancel(id) {
  if (FuturesExecution.cancelParent(id)) { render(); notify("委托已撤销"); return; }
  const row = futureRows().find(order => order.id === id && !order.origin);
  if (!row || row.status !== "已报") return;
  if (row.reservations) {
    FuturesExecution.release(row.id);
  } else if (row.id === "F20261105003") {
    const key = FuturesExecution.clientKey({ account: "交易账户01", customer: "演示交易对手01",
      fund: "DEMO-F01", code: row.code, channel: row.channel, frame: row.frame, side: "多头" });
    const reservation = futuresReservations.get(key) || { today: 0, yesterday: 0 };
    reservation.today -= 1;
    futuresReservations.set(key, reservation);
  }
  row.status = "已撤";
  render();
  notify("演示委托已撤销");
}

function futureStartSplit(id) {
  const parent = FuturesExecution.parents().find(row => row.id === id && row.status === "待确认");
  if (!parent) return;
  futures.selectedOrder = id;
  const fixed = parent.offset !== "auto";
  futures.splitRows = [{ offset: fixed ? parent.offset : "", qty: fixed ? parent.remaining : 0 }];
  futures.splitError = "";
  futures.modal = "split";
  render();
}

function futureSplitEditor() {
  const parent = FuturesExecution.parents().find(row => row.id === futures.selectedOrder);
  if (!parent || parent.status !== "待确认") return '<div class="future-error" role="alert">该委托已处理，请刷新列表。</div>';
  const contract = futuresContracts.find(item => item.code === parent.code);
  const side = futureClosingSide(parent.direction);
  const client = futurePosition(side, parent, parent.code);
  const hedge = futureHedge(side, parent, parent.code);
  const fixed = parent.offset !== "auto";
  const offsets = contract.split ? ["today", "close", "open"] : ["close", "open"];
  const summary = position => contract.split
    ? `可平今 ${position.availableToday} 手　可平昨 ${position.availableYesterday} 手`
    : `可平 ${position.availableToday + position.availableYesterday} 手`;
  const rows = futures.splitRows.map((row, index) => `<tr>
    <td>${index + 1}</td>
    <td>${fixed ? `<span>${futureOffsetLabel(parent.offset, contract)}</span>`
      : `<select data-split-offset="${index}" class="select-field" aria-label="子单 ${index + 1} 开平标识">
          <option value="">请选择</option>${offsets.map(offset => `<option value="${offset}" ${offset === row.offset ? "selected" : ""}>${futureOffsetLabel(offset, contract)}</option>`).join("")}
        </select>`}</td>
    <td><input type="number" min="1" step="1" class="field" style="width:84px" aria-label="子单 ${index + 1} 数量" data-split-qty="${index}" value="${row.qty || ""}"></td>
    <td>${futures.splitRows.length > 1 ? `<button class="future-text-button" data-split-remove="${index}">删除</button>` : "—"}</td>
  </tr>`).join("");
  return `<dl class="future-confirm-info">
    <dt>母单编号</dt><dd>${parent.id}</dd><dt>合约代码</dt><dd>${contract.code}</dd>
    <dt>买卖方向</dt><dd>${parent.direction === "buy" ? "买入" : "卖出"}</dd><dt>开平标识</dt><dd>${parent.requested}</dd>
    <dt>对冲渠道</dt><dd>${parent.channel}</dd><dt>委托数量</dt><dd>${parent.qty} 手</dd>
    <dt>待拆数量</dt><dd>${parent.remaining} 手</dd><dt>对客仓</dt><dd>${summary(client)}</dd>
    <dt>对冲仓</dt><dd>${summary(hedge)}</dd>
  </dl>
  <table class="data-table future-plan"><thead><tr><th>序列</th><th>开平标识</th><th>数量（手）</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table>
  <button type="button" class="future-text-button" data-split-add>＋ 添加子单</button>
  ${futures.splitError ? `<div class="future-error" role="alert">${futureEscape(futures.splitError)}</div>` : ""}`;
}

function futureSendSplit() {
  const parent = FuturesExecution.parents().find(row => row.id === futures.selectedOrder);
  if (!parent || parent.status !== "待确认") { futures.modal = null; render(); return; }
  const contract = futuresContracts.find(item => item.code === parent.code);
  const allowed = parent.offset !== "auto" ? [parent.offset] : contract.split ? ["today", "close", "open"] : ["close", "open"];
  const rows = futures.splitRows;
  const total = rows.reduce((sum, row) => sum + row.qty, 0);
  const side = futureClosingSide(parent.direction);
  const client = futurePosition(side, parent, parent.code);
  const hedge = futureHedge(side, parent, parent.code);
  const alreadyOpened = FuturesExecution.children(parent.id)
    .filter(row => row.offset === "open").reduce((sum, row) => sum + row.qty, 0);
  const openLimit = Math.max(0, futureOpenLimit(parent, contract) - alreadyOpened);
  if (rows.some(row => !allowed.includes(row.offset))) {
    futures.splitError = "请选择适用的子单开平标识。";
  } else if (rows.some(row => !Number.isSafeInteger(row.qty) || row.qty < 1)) {
    futures.splitError = "子单数量须为大于 0 的整数手。";
  } else if (total > parent.remaining) {
    futures.splitError = `子单合计超过待拆数量 ${parent.remaining} 手。`;
  } else {
    futures.splitError = FuturesExecution.rejection(rows, client, hedge, contract.split, openLimit);
  }
  if (futures.splitError) { render(); return; }
  const executions = FuturesExecution.record(rows, client, hedge, contract.split, parent.id);
  if (!executions.length) { futures.splitError = "委托已更新，请重新打开拆单。"; render(); return; }
  futures.modal = null;
  render();
  notify("拆单已提交");
}



function bindFuturesInteractions() {
  document.querySelectorAll("[data-future-split]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    futureStartSplit(button.dataset.futureSplit);
  }));
  document.querySelectorAll("[data-split-offset], [data-split-qty]").forEach(input => input.addEventListener("input", () => {
    if (input.hasAttribute("data-split-offset")) futures.splitRows[Number(input.dataset.splitOffset)].offset = input.value;
    else futures.splitRows[Number(input.dataset.splitQty)].qty = Number(input.value);
  }));
  document.querySelector("[data-split-add]")?.addEventListener("click", () => {
    const parent = FuturesExecution.parents().find(row => row.id === futures.selectedOrder);
    if (!parent) return;
    futures.splitRows.push({ offset: parent.offset === "auto" ? "" : parent.offset, qty: 0 });
    render();
  });
  document.querySelectorAll("[data-split-remove]").forEach(button => button.addEventListener("click", () => {
    futures.splitRows.splice(Number(button.dataset.splitRemove), 1);
    render();
  }));
  document.querySelector("[data-future-send-split]")?.addEventListener("click", futureSendSplit);
  document.querySelectorAll("[data-trading-page]").forEach(button => button.addEventListener("click", () => {
    if (!["证券交易", "期货交易"].includes(button.dataset.tradingPage)) return notify("请选择证券交易或期货交易");
    state.tradePage = button.dataset.tradingPage;
    render();
  }));
  document.querySelectorAll("[data-future-select]").forEach(select => select.addEventListener("change", () => {
    const key = select.dataset.futureSelect;
    futures[key] = key === "contract" ? Number(select.value) : select.value;
    if (key === "account") futures.offset = "open";
    if (key === "contract") {
      futures.price = currentFuture().price;
      if (!currentFuture().split && ["today", "auto"].includes(futures.offset)) futures.offset = "close";
    }
    futures.error = "";
    render();
  }));
  document.querySelectorAll("[data-future-offset]").forEach(button => button.addEventListener("click", () => { futures.offset = button.dataset.futureOffset; futures.error = ""; render(); }));
  document.querySelectorAll("[data-future-direction]").forEach(button => button.addEventListener("click", () => { futures.direction = button.dataset.futureDirection; futures.error = ""; render(); }));
  document.querySelectorAll("[data-future-input]").forEach(input => input.addEventListener("input", () => {
    futures[input.dataset.futureInput] = Number(input.value);
    futures.error = "";
    document.querySelector(".future-error")?.remove();
    const available = document.querySelector("#futureAvailableQty");
    if (available) available.textContent = futureAvailable();
    const quantity = document.querySelector(".future-submit span");
    if (quantity) quantity.textContent = futures.type === "期货交易" ? `${futures.qty} 手` : `${futures.spreadQty} 份`;
  }));
  document.querySelectorAll("[data-future-step]").forEach(button => button.addEventListener("click", () => { const key = button.dataset.futureStep; futures[key] = Math.max(key === "price" ? currentFuture().tick : 1, Number((futures[key] + Number(button.dataset.delta)).toFixed(6))); futures.error = ""; render(); }));
  document.querySelectorAll("[data-future-fraction]").forEach(button => button.addEventListener("click", () => { futures.qty = Math.floor(futureAvailable() * Number(button.dataset.futureFraction)); futures.error = ""; render(); }));
  document.querySelectorAll("[data-future-book]").forEach(button => button.addEventListener("click", () => { futures.price = Number(button.dataset.futureBook); render(); }));
  document.querySelectorAll("[data-future-modal]").forEach(button => button.addEventListener("click", () => { futures.modal = button.dataset.futureModal; render(); }));
  document.querySelectorAll("[data-future-close-modal]").forEach(button => button.addEventListener("click", () => { futures.modal = null; render(); }));
  document.querySelectorAll("[data-future-check]").forEach(input => input.addEventListener("change", () => { futures[input.dataset.futureCheck] = input.checked; }));
  document.querySelector("[data-future-remark]")?.addEventListener("input", event => { futures.remark = event.target.value; });
  document.querySelector("[data-future-expand]")?.addEventListener("click", () => { futures.expanded = !futures.expanded; render(); });
  document.querySelector("[data-future-settings]")?.addEventListener("click", () => TicketSettings.open({
    key: traderFuturesSettingsKey, values: traderFuturesSettings,
    fields: ["交易账户", "交易对手名称", "资金账号", "对冲渠道", "框架名称", "订单类型", "合约代码", "买卖方向", "开平标识", "委托价格", "委托数量", "订单模式", "备注"],
    onSave: values => { traderFuturesSettings = values; render(); notify("设置已保存"); },
  }));
  TicketSettings.bindWheel(document.querySelector('[data-future-input="price"]'), traderFuturesSettings.priceWheel, currentFuture().tick, value => {
    futures.price = value;
    document.querySelector("#futureAvailableQty").textContent = futureAvailable();
  });
  TicketSettings.bindWheel(document.querySelector('[data-future-input="qty"]'), traderFuturesSettings.quantityWheel, 1, value => {
    futures.qty = value;
    document.querySelector(".future-submit span").textContent = `${value} 手`;
  });
  document.querySelectorAll("[data-future-preset]").forEach(button => button.addEventListener("click", () => {
    futures.qty = Number(button.dataset.futurePreset);
    futures.error = "";
    render();
  }));
  document.querySelector("[data-future-reset]")?.addEventListener("click", () => { Object.assign(futures, { direction: "buy", offset: "open", qty: 1, price: currentFuture().price, error: "", remark: "" }); render(); });
  document.querySelector("[data-future-submit]")?.addEventListener("click", futureSubmit);
  document.querySelector("[data-future-confirm]")?.addEventListener("click", futureConfirm);
  document.querySelectorAll("[data-future-order]").forEach(row => row.addEventListener("click", () => { futures.selectedOrder = row.dataset.futureOrder; render(); }));
  document.querySelectorAll("[data-future-cancel]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); futureCancel(button.dataset.futureCancel); }));
  document.querySelector("[data-future-cancel-selected]")?.addEventListener("click", () => futureCancel(futures.selectedOrder));
  document.querySelectorAll("[data-future-list]").forEach(button => button.addEventListener("click", () => { futures.listTab = button.dataset.futureList; render(); }));
  document.querySelectorAll("[data-future-type]").forEach(button => button.addEventListener("click", () => {
    futures.type = button.dataset.futureType;
    if (futures.type !== "期货交易") { futures.contract = 2; futures.price = currentFuture().price; if (["today", "auto"].includes(futures.offset)) futures.offset = "close"; }
    render();
  }));
  document.querySelectorAll("[data-future-leg]").forEach(select => select.addEventListener("change", () => { futures.legOffsets[Number(select.dataset.futureLeg)] = select.value; }));
  document.querySelectorAll("[data-future-spread-submit]").forEach(button => button.addEventListener("click", () => {
    if (!Number.isSafeInteger(futures.spreadQty) || futures.spreadQty < 1 || !Number.isFinite(futures.spreadPrice)) return notify("请输入有效的份数及价差价格");
    futures.spreadDirection = button.dataset.futureSpreadSubmit;
    futures.modal = "spread";
    render();
  }));
  document.querySelector("[data-future-confirm-spread]")?.addEventListener("click", () => {
    const buy = futures.spreadDirection === "buy";
    futureCombinations.unshift({ name: "连豆跨期组合01", direction: buy ? "买入" : "卖出", legs: "A a2701　B a2703", offsets: `A ${futureOffsetLabel(futures.legOffsets[0], futuresContracts[2])}　B ${futureOffsetLabel(futures.legOffsets[1], futuresContracts[2])}`, sides: buy ? "A 买入　B 卖出" : "A 卖出　B 买入", qty: futures.spreadQty, status: "待确认" });
    futures.modal = null;
    futures.listTab = "组合委托列表";
    render();
    notify("组合订单已加入演示列表");
  });
  document.querySelectorAll("[data-future-filter]").forEach(select => select.addEventListener("change", () => { const key = select.dataset.futureFilter; futures[`filter${key[0].toUpperCase()}${key.slice(1)}`] = select.value; }));
  document.querySelector("[data-future-query]")?.addEventListener("click", () => { futures.query = { direction: futures.filterDirection, offset: futures.filterOffset, contract: futures.filterContract }; render(); });
  document.querySelector("[data-future-clear-filter]")?.addEventListener("click", () => { futures.query = null; futures.filterDirection = "全部"; futures.filterOffset = "全部"; futures.filterContract = "全部"; render(); });
  document.querySelector("[data-future-position-page]")?.addEventListener("click", () => { state.view = "data"; state.dataTab = "持仓信息"; state.positionMarket = "期货"; state.positionMode = "对客"; render(); });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && futures.modal) { futures.modal = null; render(); }
});
render();

window.addEventListener("storage", event => {
  if (event.key === FuturesExecution.key && !futures.modal) render();
});
