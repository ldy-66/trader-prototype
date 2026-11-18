document.addEventListener("click", event => {
  if (!event.target.closest("[data-new-counter-mapping]")) return;

  const dialog = document.createElement("dialog");
  dialog.className = "mapping-dialog";
  dialog.setAttribute("aria-labelledby", "mapping-dialog-title");
  dialog.innerHTML = `
    <header><strong id="mapping-dialog-title">对冲渠道设置</strong><button class="close-mapping" type="button" aria-label="关闭">×</button></header>
    <form method="dialog">
      <label>交易账户<select><option value=""></option><option>DEMO-TA-01</option></select></label>
      <label>资金账号名称<select><option value=""></option><option>演示资金账号</option></select></label>
      <label>交易所<select><option>OSE</option></select></label>
      <label>交易账号<select><option value=""></option><option>DEMO-TR-01</option><option>DEMO-TR-02</option></select></label>
      <label>对冲渠道<select><option>11</option></select></label>
      <label>是否默认渠道<select><option>是</option><option>否</option></select></label>
      <label>对冲方资金账号<select><option value=""></option><option>DEMO-HF-01</option><option>DEMO-HF-02</option></select></label>
      <label>标的物代码规则<select><option value=""></option></select></label>
      <label>背靠背框架ID<input></label>
      <footer><button type="submit">确定</button><button type="button" data-cancel-mapping>取消</button></footer>
    </form>`;
  dialog.querySelectorAll(".close-mapping, [data-cancel-mapping]").forEach(button => {
    button.addEventListener("click", () => dialog.close());
  });
  dialog.addEventListener("close", () => dialog.remove(), { once: true });
  document.body.append(dialog);
  dialog.showModal();
});
