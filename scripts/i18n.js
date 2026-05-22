(function () {
  const storageKey = "ufpaNumerosLanguage";
  const defaultLanguage = "pt";
  const supportedLanguages = ["pt", "en"];

  function normalizeLanguage(language) {
    return supportedLanguages.includes(language) ? language : defaultLanguage;
  }

  function getLanguage() {
    return normalizeLanguage(localStorage.getItem(storageKey) || defaultLanguage);
  }

  function translate(key) {
    const language = getLanguage();
    return (
      translations[language]?.[key] ||
      translations[defaultLanguage]?.[key] ||
      key
    );
  }

  function applyLanguage(language) {
    const selectedLanguage = normalizeLanguage(language);
    localStorage.setItem(storageKey, selectedLanguage);
    document.documentElement.lang = selectedLanguage === "pt" ? "pt-br" : "en";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.innerHTML = translate(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute(
        "placeholder",
        translate(element.dataset.i18nPlaceholder),
      );
    });

    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.setAttribute("title", translate(element.dataset.i18nTitle));
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      element.setAttribute("alt", translate(element.dataset.i18nAlt));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute(
        "aria-label",
        translate(element.dataset.i18nAriaLabel),
      );
    });

    const titleKey = document.body?.dataset.pageTitle;
    if (titleKey) {
      document.title = translate(titleKey);
    }

    document.querySelectorAll("[data-language-option]").forEach((element) => {
      const isActive = element.dataset.languageOption === selectedLanguage;
      element.classList.toggle("active", isActive);
      element.setAttribute("aria-pressed", String(isActive));
    });

    window.dispatchEvent(
      new CustomEvent("languagechange", { detail: { language: selectedLanguage } }),
    );
  }

  window.i18n = {
    getLanguage,
    setLanguage: applyLanguage,
    t: translate,
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-language-option]").forEach((element) => {
      element.addEventListener("click", () => {
        applyLanguage(element.dataset.languageOption);
      });
    });

    applyLanguage(getLanguage());
  });
})();
