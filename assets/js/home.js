"use strict";

import { fetchData } from "./api.js";
import { $skeletonCard } from "./global.js";

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

addEventOnElements($tabBtns, "click", function() {
    $lastActiveTabPanel.setAttribute("hidden", "");
    $lastActiveTabBtn.setAttribute("aria-selected", false);
    $lastActiveTabBtn.setAttribute("tabindex", -1);

    const $currentTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
    $currentTabPanel.removeAttribute("hidden");
    this.setAttribute("aria-selected", true);
    this.setAttribute("tabindex", 0);

    $lastActiveTabPanel = $currentTabPanel;
    $lastActiveTabBtn = this;
    addTabContent(this.textContent.trim().toLowerCase(), $currentTabPanel);
});

/* Fetch and display recipes from the API */

const addTabContent = (query, $currentTabPanel) => {
    const $gridlist = document.createElement("div");
    $gridlist.classList.add("grid-list");

    $currentTabPanel.innerHTML = `
        <div class="grid-list">
            ${$skeletonCard.repeat(12)}
        </div>`;

    fetchData(query, function(data) {
        $currentTabPanel.innerHTML = ""; // Limpa o conteúdo atual
        $gridlist.innerHTML = ""; // Limpa skeletons

        if (!data || data.length === 0) {
            // Exibe mensagem se não houver receitas encontradas
            $gridlist.innerHTML = "<p>Nenhuma receita encontrada.</p>";
        } else {
            // Popula com os dados reais
            data.slice(0, 12).forEach((recipe, i) => {
                const {
                    image_url = "placeholder.jpg", // Imagem padrão caso não haja uma
                    title = "Título não disponível",
                    prep_time = "Tempo não disponível",
                    source_url
                } = recipe;

                const $card = document.createElement("div");
                $card.classList.add("card");
                $card.style.animationDelay = `${100 * i}ms`;

                $card.innerHTML = `
                    <figure class="card-media img-holder">
                        <img src="${image_url}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
                    </figure>

                    <div class="card-body">
                        <h3 class="title-small">
                            <a href="${source_url}" target="_blank" class="card-link">${title}</a>
                        </h3>
                        <div class="meta-wrapper">
                            <div class="meta-item">
                                <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                                <span class="label-medium">${prep_time || "<1"} minutos</span>
                            </div>
                            <button class="icon-btn has-state removed" aria-label="Add to saved recipes">
                                <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                                <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                            </button>
                        </div>
                    </div>
                `;

                $gridlist.appendChild($card);
            });
        }

        $currentTabPanel.appendChild($gridlist);
        $currentTabPanel.innerHTML += `
            <a href="./recipes.html" class="btn btn-secondary label large has-state">Show More</a>
        `;
    });
};

// Initialize content for the first tab
addTabContent($lastActiveTabBtn.textContent.trim().toLowerCase(), $lastActiveTabPanel);
