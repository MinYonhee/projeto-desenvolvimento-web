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
    
    addTabContent(this, $currentTabPanel);
});

/* Navigate tab with arrow keys */

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

    $currentTabPanel.innerHTML = `
        <div class="grid-list">
         ${$skeletonCard.repeat(12)}
        </div>
    `;

    fetchData([['mealType', $currentTabBtn.textContent.trim().toLowerCase()], ...cardQueries], function(data) {

        $currentTabPanel.innerHTML = ""; // Limpa o conteúdo atual

        for (let i = 0; i < 12; i++) {
            const {
                recipe: {
                    image,
                    label: title,
                    totalTime: cookingtime,
                    uri
                }
            } = data.hits[i];
        }
        $gridlist.innerHTML = ""; // Clear skeletons
        
        const $card = document.createElement("div");
        $card.classList.add("card");
        $card.style.animationDelay = `${100 * i}ms`;

        $card.innerHTML = `
                
            <figure class="card-media img-holder">
                <img src="${image}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
            </figure>

            <div class="card-body">
                <h3 class="title-small">
                    <a href="./detail.html" class="card-link">${title ?? "Untitled"}
                    </a>
                </h3>
                    <div class="meta-wrapper">
                        <div class="meta-item">
                            <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                            <span class="label-medium">${cookingTime || "<1"}minutes</span>
                        </div>
                            <button class="icon-btn has-state removed" aria-label="Add to saved recipes">
                                <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                                <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                            </button>
                        </div>
                    </div>
                `;
             // HTML do cartão de receita
             card.innerHTML = `
             <img src="${image}" alt="${title}" class="recipe-image">
             <h3>${title}</h3>
             <p>Tempo de preparo: ${cookingTime} minutos</p>
             <a href="${uri}" target="_blank" class="recipe-link">Ver receita</a>
         `;

         $gridlist.appendChild(card);
     });
 }

 $currentTabPanel.appendChild($gridlist);

// Initialize content for the first tab
addTabContent($lastActiveTabBtn, $lastActiveTabPanel);

                