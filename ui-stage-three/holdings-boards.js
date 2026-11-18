(() => {
  const boards = ["主板", "科创板", "创业板", "港股", "美股"];

  function label(selected) {
    return selected.length ? selected.join("、") : "全部";
  }

  function render(selected) {
    return `<details class="board-multi"><summary>板块：<span>${label(selected)}</span></summary>
      <div class="board-options" popover="auto" role="group" aria-label="板块选项">
        <label><input type="checkbox" data-board="" ${selected.length ? "" : "checked"}>全部</label>
        ${boards.map(board => `<label><input type="checkbox" data-board="${board}" ${selected.includes(board) ? "checked" : ""}>${board}</label>`).join("")}
      </div>
    </details>`;
  }

  function position(menu, panel) {
    const anchor = menu.querySelector("summary").getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const gap = 4;
    panel.style.minWidth = `${anchor.width}px`;
    const { width, height } = panel.getBoundingClientRect();
    const below = viewportHeight - anchor.bottom;
    const top = below < height + gap && anchor.top > below
      ? anchor.top - height - gap
      : anchor.bottom + gap;
    panel.style.left = `${Math.max(gap, Math.min(anchor.left, viewportWidth - width - gap))}px`;
    panel.style.top = `${Math.max(gap, Math.min(top, viewportHeight - height - gap))}px`;
  }

  function open(menu) {
    const panel = menu.querySelector(".board-options");
    menu.open = true;
    if (!panel.matches(":popover-open")) panel.showPopover();
    position(menu, panel);
  }

  function bind(root, onChange) {
    const menu = root.querySelector(".board-multi");
    if (!menu) return;
    const panel = menu.querySelector(".board-options");
    menu.addEventListener("toggle", () => {
      if (!menu.isConnected) return;
      if (menu.open) open(menu);
      else if (panel.matches(":popover-open")) panel.hidePopover();
    });
    panel.addEventListener("toggle", event => {
      if (event.newState === "closed" && !panel.matches(":popover-open")) menu.open = false;
    });
    menu.addEventListener("change", event => {
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

  function repositionOpenMenu() {
    const panel = document.querySelector(".board-options:popover-open");
    if (panel) position(panel.closest(".board-multi"), panel);
  }

  window.addEventListener("resize", repositionOpenMenu);
  window.addEventListener("scroll", repositionOpenMenu, true);
  window.HoldingsBoards = {render, bind, open};
})();
