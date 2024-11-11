"use strict";

import { fetchData } from "./api.js";
import { $skeletonCard, cardQueries } from "./global.js";

/* Home page search */
const $searchField = document.querySelector("[data-search-field]");
const $searchBtn = document.querySelector("[data-search-btn]");

$searchBtn.addEventListener("click", function() {
    if ($searchField.value) window.location = `/recipes.html?q=${$searchField.value}`;
});

/* Search submit when pressing "Enter" key */
$searchField.addEventListener("keydown", e => {
    if (e.key === "Enter") $searchBtn.click();
});

/* Tab panel navigation */
const $tabBtns = document.querySelectorAll("[data-tab-btn]");
const $tabPanels = document.querySelectorAll("[data-tab-panel]");

let [$lastActiveTabPanel] = $tabPanels;
let [$lastActiveTabBtn] = $tabBtns;

function addEventOnElements(elements, event, handler) {
    elements.forEach(element => element.addEventListener(event, handler));
}

// Adiciona o evento de clique nas abas
addEventOnElements($tabBtns, "click", function() {
    // Oculta o painel da última aba ativa
    $lastActiveTabPanel.setAttribute("hidden", "");
    // Remove o destaque (aria-selected) do último botão de aba
    $lastActiveTabBtn.setAttribute("aria-selected", false);
    $lastActiveTabBtn.setAttribute("tabindex", -1);

    // Exibe o painel correspondente à aba clicada
    const $currentTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
    $currentTabPanel.removeAttribute("hidden");
    this.setAttribute("aria-selected", true);
    this.setAttribute("tabindex", 0);

    // Atualiza as variáveis para a próxima navegação
    $lastActiveTabPanel = $currentTabPanel;
    $lastActiveTabBtn = this;

    // Carrega o conteúdo da aba atual
    addTabContent(this, $currentTabPanel);
});

// Navegação entre abas com as setas
addEventOnElements($tabBtns, "keydown", function(e) {
    const $nextElement = this.nextElementSibling;
    const $previousElement = this.previousElementSibling;

    if (e.key === "ArrowRight" && $nextElement) {
        this.setAttribute("tabindex", -1);
        $nextElement.setAttribute("tabindex", 0);
        $nextElement.focus();
    } else if (e.key === "ArrowLeft" && $previousElement) {
        this.setAttribute("tabindex", -1);
        $previousElement.setAttribute("tabindex", 0);
        $previousElement.focus(); 
    } else if (e.key === "Tab") {
        e.preventDefault();
        this.setAttribute("tabindex", -1);
        $lastActiveTabBtn.setAttribute("tabindex", 0);
    }
});

/* Work with API */
const addTabContent = ($currentTabBtn, $currentTabPanel) => {
    const $gridlist = document.createElement("div");
    $gridlist.classList.add("grid-list");

    // Exibe skeleton enquanto carrega
    $currentTabPanel.innerHTML = `
        <div class="grid-list">
            ${$skeletonCard.repeat(12)}
        </div>`;

    // Obtém o nome da categoria (tipo de refeição) da aba ativa
    const query = $currentTabBtn.textContent.trim().toLowerCase();
    fetchData(query, function(data) {
        $currentTabPanel.innerHTML = ""; // Limpa o conteúdo atual
        $gridlist.innerHTML = ""; // Limpa skeletons

        if (!data || data.results.length === 0) {
            // Se não houver dados ou o array estiver vazio
            $gridlist.innerHTML = "<p>Nenhuma receita encontrada.</p>";
        } else {
            // Popula com os dados reais
            data.results.slice(0, 12).forEach((hit, i) => {
                const { image, title, readyInMinutes: cookingTime, id } = hit;

                const $card = document.createElement("div");
                $card.classList.add("card");
                $card.style.animationDelay = `${100 * i}ms`;

                $card.innerHTML = `
                    <div class="card">
                        <figure class="card-media img-holder">
                            <img src="${image}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
                        </figure>

                        <div class="card-body">
                            <h3 class="title-small">
                                <a href="./detail.html?id=${id}" class="card-link">${title ?? "Untitled"}</a>
                            </h3>
                            <div class="meta-wrapper">
                                <div class="meta-item">
                                    <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                                    <span class="label-medium">${cookingTime || "<1"} minutos</span>
                                </div>
                                <button class="icon-btn has-state removed" aria-label="Add to saved recipes">
                                    <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                                    <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                $gridlist.appendChild($card);
            });
        }

        $currentTabPanel.appendChild($gridlist);
    });
};

// Inicializa o conteúdo para a primeira aba
addTabContent($lastActiveTabBtn, $lastActiveTabPanel);

