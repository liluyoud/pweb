/*
 * NAVEGAÇÃO DA APRESENTAÇÃO
 *   → / Espaço / PageDown  próximo slide      ← / PageUp  anterior
 *   Home / End             primeiro / último  F           tela cheia
 *   N                      notas do professor G           visão geral (grade)
 * O número do slide fica no endereço (#12), então dá para compartilhar um link direto.
 */
(function () {
  const palco = document.getElementById("palco");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const barra = document.getElementById("barra");
  const painel = document.getElementById("painel-notas");
  let atual = 0;

  function escalar() {
    const s = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    palco.style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  function ir(n, atualizarEndereco = true) {
    atual = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, i) => s.classList.toggle("ativo", i === atual));
    barra.style.width = ((atual + 1) / slides.length) * 100 + "%";
    const notas = slides[atual].querySelector(".notas");
    painel.innerHTML = `<b>Slide ${atual + 1} de ${slides.length}</b> · ${notas ? notas.innerHTML : "(sem notas)"}`;
    document.title = (slides[atual].dataset.titulo || "Controle Acadêmico") + " · Aula";
    if (atualizarEndereco) history.replaceState(null, "", "#" + (atual + 1));
  }

  function lerEndereco() {
    const n = parseInt(location.hash.slice(1), 10);
    ir(isNaN(n) ? 0 : n - 1, false);
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); ir(atual + 1); }
    else if (["ArrowLeft", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); ir(atual - 1); }
    else if (k === "Home") ir(0);
    else if (k === "End") ir(slides.length - 1);
    else if (k === "n" || k === "N") painel.classList.toggle("aberto");
    else if (k === "f" || k === "F") {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    } else if (k === "g" || k === "G" || k === "Escape") {
      if (k === "Escape" && !document.body.classList.contains("geral")) return;
      document.body.classList.toggle("geral");
      if (!document.body.classList.contains("geral")) { escalar(); ir(atual); }
      else slides[atual].scrollIntoView({ block: "center" });
    }
  });

  // Clique: metade direita avança, esquerda volta. Na visão geral, abre o slide.
  palco.addEventListener("click", (e) => {
    if (e.target.closest("a, pre, table")) return;
    if (document.body.classList.contains("geral")) {
      const s = e.target.closest(".slide");
      if (s) { document.body.classList.remove("geral"); escalar(); ir(slides.indexOf(s)); }
      return;
    }
    ir(e.clientX > window.innerWidth / 2 ? atual + 1 : atual - 1);
  });

  // Toque (celular/tablet): arrastar para os lados.
  let x0 = null;
  palco.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  palco.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) ir(dx < 0 ? atual + 1 : atual - 1);
    x0 = null;
  });

  window.addEventListener("resize", escalar);
  window.addEventListener("hashchange", lerEndereco);
  setTimeout(() => document.getElementById("ajuda")?.classList.add("some"), 5000);
  escalar();
  lerEndereco();
})();
