const byId = id => document.getElementById(id);
const filters = byId("filters");
const results = byId("results");
const confirmation = byId("confirm");
const accounts = ["DEMO-1001", "DEMO-1002", "DEMO-1003", "DEMO-1004"];
let configurations = [
  {id: 1, account: accounts[0], business: "普通交易", direction: "买入", order: "普通买入顺序"},
  {id: 2, account: accounts[0], business: "普通交易", direction: "卖出", order: "普通卖出顺序"},
  {id: 3, account: accounts[0], business: "融券交易", direction: "卖出", order: "融券卖出顺序"},
  {id: 4, account: accounts[1], business: "普通交易", direction: "买入", order: "普通买入顺序"},
  {id: 5, account: accounts[2], business: "融券交易", direction: "买入", order: "融券买入顺序"},
  {id: 6, account: accounts[3], business: "普通交易", direction: "卖出", order: "普通卖出顺序"},
];
for (const account of accounts) byId("account").add(new Option(account, account));

let applied = {};
let page = 1;
const expanded = new Set([accounts[0]]);
const selected = new Set();
let pending = [];
const fields = ["account", "business", "direction"];

function getGroups() {
  const groups = new Map();
  for (const row of configurations) {
    if (!fields.every(key => !applied[key] || applied[key] === row[key])) continue;
    if (!groups.has(row.account)) groups.set(row.account, []);
    groups.get(row.account).push(row);
  }
  return groups;
}

function render() {
  const groups = getGroups();
  const size = Number(byId("pageSize").value);
  const pageCount = Math.max(1, Math.ceil(groups.size / size));
  page = Math.min(page, pageCount);
  const visible = [...groups].slice((page-1)*size, page*size);
  const body = visible.map(([account, rows]) => {
    const open = expanded.has(account);
    const detail = open ? `<tr><td colspan="3" class="detail-cell"><table aria-label="${account} 配置明细">
      <thead><tr><th class="check"></th><th>业务类型</th><th>合约类型</th><th>交易所</th><th>资产品种</th><th>交易方向</th><th>顺序名称</th></tr></thead>
      <tbody>${rows.map(row => `<tr><td class="check"><input type="checkbox" data-config="${row.id}" aria-label="选择配置 ${row.id}" ${selected.has(row.id) ? "checked" : ""}></td><td>${row.business}</td><td></td><td>全部</td><td>全部</td><td>${row.direction}</td><td>${row.order}</td></tr>`).join("")}</tbody></table></td></tr>` : "";
    return `<tr><td class="expand"><button type="button" class="toggle" data-expand="${account}" aria-expanded="${open}" aria-label="${open ? "收起" : "展开"} ${account}">${open ? "−" : "+"}</button></td>
      <td class="check"><input type="checkbox" data-account="${account}" aria-label="选择 ${account} 的匹配配置"></td><td>${account}</td></tr>${detail}`;
  }).join("");
  results.innerHTML = `<table aria-label="交易账户"><thead><tr><th class="expand"></th><th class="check"><input type="checkbox" id="selectAll" aria-label="全选查询结果" ${groups.size ? "" : "disabled"}></th><th>交易账户</th></tr></thead><tbody>${body || '<tr><td class="empty" colspan="3">暂无符合条件的客户配置</td></tr>'}</tbody></table>`;
  for (const box of results.querySelectorAll("[data-account]")) syncSelection(box, groups.get(box.dataset.account));
  syncSelection(byId("selectAll"), [...groups.values()].flat());
  byId("remove").disabled = !selected.size;
  byId("remove").textContent = selected.size ? `批量删除配置（${selected.size}）` : "批量删除配置";
  byId("count").textContent = `共 ${groups.size} 个交易账户`;
  byId("pageNumber").textContent = page;
  byId("prev").disabled = page === 1;
  byId("next").disabled = page === pageCount;
}

function syncSelection(box, rows) {
  const count = rows.filter(row => selected.has(row.id)).length;
  box.checked = count > 0 && count === rows.length;
  box.indeterminate = count > 0 && count < rows.length;
}

results.addEventListener("click", event => {
  const account = event.target.dataset.expand;
  if (!account) return;
  if (expanded.has(account)) expanded.delete(account);
  else expanded.add(account);
  render();
});
results.addEventListener("change", event => {
  const box = event.target;
  const groups = getGroups();
  const ids = box.dataset.config ? [Number(box.dataset.config)] :
    (box.id === "selectAll" ? [...groups.values()].flat() : groups.get(box.dataset.account)).map(row => row.id);
  for (const id of ids) {
    if (box.checked) selected.add(id);
    else selected.delete(id);
  }
  render();
});

function query() {
  applied = Object.fromEntries(fields.map(key => [key, byId(key).value]));
  page = 1;
  selected.clear();
  render();
}
filters.addEventListener("submit", event => { event.preventDefault(); query(); });
byId("resetFilters").addEventListener("click", () => { filters.reset(); query(); });
byId("prev").addEventListener("click", () => { page--; render(); });
byId("next").addEventListener("click", () => { page++; render(); });
byId("pageSize").addEventListener("change", () => { page = 1; render(); });
byId("remove").addEventListener("click", () => {
  pending = [...selected];
  confirmation.returnValue = "";
  byId("prompt").textContent = `确认删除已选中的 ${pending.length} 条客户配置？`;
  confirmation.showModal();
});
confirmation.addEventListener("close", () => {
  if (confirmation.returnValue !== "delete") return;
  configurations = configurations.filter(row => !pending.includes(row.id));
  selected.clear();
  render();
});
render();

