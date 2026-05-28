/**
 * disc.js
 * Wires up .disc buttons to the .tint-overlay and any associated targets
 * (frame colors, content, etc.).
 *
 * ─── Minimal usage ──────────────────────────────────────────────────────────
 *
 * Each .disc element needs a config entry keyed by dataset.tint:
 *
 *   const config = {
 *     amber: {
 *       tint: { r: 215, g: 140, b: 55, a: 0.22 },
 *     },
 *     rose: {
 *       tint: { r: 225, g: 105, b: 130, a: 0.20 },
 *     },
 *   };
 *
 *   initDiscs(config);
 *
 *   <button class="disc" data-tint="amber"> ... </button>
 *
 * ─── Extended usage (optional callbacks) ────────────────────────────────────
 *
 * Pass onHover and onSelect callbacks for side-effects beyond the tint
 * (e.g. updating frame CSS variables, swapping content):
 *
 *   initDiscs(config, {
 *     onHover: (key, entry) => { ... },
 *     onSelect: (key, entry) => { ... },
 *   });
 *
 * onHover fires on mouseenter (preview) and again on mouseleave to restore
 * the active key's values. onSelect fires on click after the active key
 * has been committed.
 */

/**
 * @typedef {{ r: number, g: number, b: number, a: number }} TintColor
 * @typedef {{ tint: TintColor, [key: string]: unknown }} DiscEntry
 *
 * @param {Record<string, DiscEntry>} config
 * @param {{ onHover?: (key: string, entry: DiscEntry) => void,
 *            onSelect?: (key: string, entry: DiscEntry) => void }} [callbacks]
 */
function initDiscs(config, callbacks = {}) {
  const root = document.documentElement;
  const { onHover, onSelect } = callbacks;

  /* Resolve the initial active key from the .active disc, or fall back to
     the first key in config. */
  const activeDisc = document.querySelector(".disc.active");
  let activeKey = activeDisc?.dataset.tint ?? Object.keys(config)[0];

  function applyTint(key) {
    const { r, g, b, a } = config[key].tint;
    root.style.setProperty("--tint-r", r);
    root.style.setProperty("--tint-g", g);
    root.style.setProperty("--tint-b", b);
    root.style.setProperty("--tint-a", a);
  }

  document.querySelectorAll(".disc").forEach((disc) => {
    const key = disc.dataset.tint;
    if (!config[key]) return;

    /* Hover previews the tint only. */
    disc.addEventListener("mouseenter", () => {
      applyTint(key);
      onHover?.(key, config[key]);
    });

    disc.addEventListener("mouseleave", () => {
      applyTint(activeKey);
      onHover?.(activeKey, config[activeKey]);
    });

    /* Click commits the selection. */
    disc.addEventListener("click", () => {
      activeKey = key;
      applyTint(activeKey);
      document.querySelectorAll(".disc").forEach((d) => d.classList.remove("active"));
      disc.classList.add("active");
      onSelect?.(activeKey, config[activeKey]);
    });
  });

  /* Apply the initial active state immediately. */
  applyTint(activeKey);
  onSelect?.(activeKey, config[activeKey]);
}

export { initDiscs };