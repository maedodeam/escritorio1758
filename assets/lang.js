// Idioma da página: o do endereço (#en, #ja...), senão o do navegador, senão inglês (a mesma regra do jogo,
// LanguageRules: chinês tradicional não tem versão e cai no inglês). Não grava nada no navegador: a escolha manual
// fica só no endereço, e os links internos levam o idioma junto.
(function () {
  var CODES = ["pt-BR", "en", "es", "fr", "ja", "ko", "zh-CN"];
  var FALLBACK = "en";

  function fromTag(tag) {
    var t = String(tag || "").replace(/_/g, "-").toLowerCase();
    var parts = t.split("-");
    switch (parts[0]) {
      case "pt": return "pt-BR";
      case "en": return "en";
      case "es": return "es";
      case "fr": return "fr";
      case "ja": return "ja";
      case "ko": return "ko";
      case "zh":
        for (var i = 1; i < parts.length; i++) {
          if (["hant", "tw", "hk", "mo"].indexOf(parts[i]) >= 0) return null;
        }
        return "zh-CN";
      default: return null;
    }
  }

  function fromHash() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ""));
    return CODES.indexOf(h) >= 0 ? h : null;
  }

  function fromBrowser() {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < list.length; i++) {
      var code = fromTag(list[i]);
      if (code) return code;
    }
    return FALLBACK;
  }

  var blocks = document.querySelectorAll("[data-lang]");
  // Sem JavaScript, cada bloco tem id = código do idioma e o seletor rola até ele. Com JavaScript, um bloco por vez:
  // os ids saem para o navegador não rolar até o meio da página.
  for (var i = 0; i < blocks.length; i++) blocks[i].removeAttribute("id");
  document.documentElement.classList.add("js");

  function apply(code) {
    document.documentElement.lang = code;
    for (var i = 0; i < blocks.length; i++) {
      var on = blocks[i].getAttribute("data-lang") === code;
      blocks[i].hidden = !on;
      if (on && blocks[i].getAttribute("data-title")) document.title = blocks[i].getAttribute("data-title");
    }
    var choices = document.querySelectorAll(".langs a");
    for (var j = 0; j < choices.length; j++) {
      if (choices[j].getAttribute("hreflang") === code) choices[j].setAttribute("aria-current", "true");
      else choices[j].removeAttribute("aria-current");
    }
    var keep = document.querySelectorAll("a[data-keep-lang]");
    for (var k = 0; k < keep.length; k++) {
      keep[k].href = keep[k].getAttribute("href").split("#")[0] + "#" + code;
    }
  }

  apply(fromHash() || fromBrowser());
  window.addEventListener("hashchange", function () {
    apply(fromHash() || fromBrowser());
    window.scrollTo(0, 0);
  });
})();
