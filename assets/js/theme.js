"use strict";

const $HTML = document.documentElement;
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Define o tema inicial
if (sessionStorage.getItem("theme")) {
    $HTML.dataset.theme = sessionStorage.getItem("theme");
} else {
    $HTML.dataset.theme = isDark ? "dark" : "light";
}

// Função para alternar o tema
function toggleTheme() {
    const currentTheme = $HTML.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    $HTML.dataset.theme = newTheme;
    sessionStorage.setItem("theme", newTheme);
    
    // Atualiza o estado aria-pressed
    const themeToggleBtn = document.querySelector("[data-theme-btn]");
    themeToggleBtn.setAttribute("aria-pressed", newTheme === "dark");
}

// Adiciona evento de clique ao botão de tema
document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.querySelector("[data-theme-btn]");
    themeToggleBtn?.addEventListener("click", toggleTheme);
});