(() => {
  const boards = ["主板", "科创板", "创业板", "港股", "美股"];

  function label(selected) {
    return selected.length ? selected.join("、") : "全部";
  }

  function render(selected) {
    return `<details class="board-multi"><summary>板块：<span>${label(selected)}</span></summary>
      <div class="board-options" role="group" aria-label="板块">
        <label><input type="checkbox" data-board="" ${selected.length ? "" : "checked"}>全部</label>
        ${boards.map(board => `<label><input type="checkbox" data-board="${board}" ${selected.includes(board) ? "checked" : ""}>${board}</label>`).join("")}
      </div>
    </details>`;
  }

  function bind(root, onChange) {
    const menu = root.querySelector(".board-multi");
    menu?.addEventListener("change", event => {
      const option = event.target;
      if (!option.hasAttribute("data-board")) return;
      const boxes = [...menu.querySelectorAll("[data-board]")];
      if (option.dataset.board === "") {
        for (const box of boxes.slice(1)) box.checked = false;
      }
      const selected = boxes.slice(1).filter(box => box.checked).map(box => box.dataset.board);
      boxes[0].checked = !selected.length;
      menu.querySelector("summary span").textContent = label(selected);
      onChange(selected, option.dataset.board);
    });
  }

  window.HoldingsBoards = {render,bind};
})();
