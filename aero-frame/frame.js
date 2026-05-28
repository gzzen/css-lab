/**
 * frame.js
 * Wires up the bezel-light (--mx/--my) and click-ripple (--click-x/--click-y)
 * interactions for any .frame element.
 *
 * Call initFrame(el) per element, or initFrames() to target all .frame elements
 * in the document.
 */

/**
 * @param {HTMLElement} el
 */
function initFrame(el) {
  el.addEventListener("mousemove", (event) => {
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  });

  el.addEventListener("click", (event) => {
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--click-x", `${x}%`);
    el.style.setProperty("--click-y", `${y}%`);

    /* Force reflow so removing + re-adding the class restarts the animation. */
    el.classList.remove("rippling");
    void el.offsetWidth;
    el.classList.add("rippling");
  });
}

function initFrames() {
  document.querySelectorAll(".frame").forEach(initFrame);
}

export { initFrame, initFrames };
