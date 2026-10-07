export const triggerSuctionAnimation = (targetElement, onComplete) => {
  document.body.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 z-50 pointer-events-none flex items-center justify-center";
  overlay.innerHTML = `
    <div class="vortex-ring w-10 h-10 rounded-full bg-linear-to-r from-purple-600 via-pink-500 to-blue-500 opacity-0 transform scale-0 animate-suction"></div>
  `;
  document.body.appendChild(overlay);

  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    document.body.style.overflow = "";
    overlay.remove();

    if (onComplete) onComplete();
  }, 850);
};
