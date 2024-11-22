"use strict";

import { fetchData } from "./api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

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
    // Criar o contêiner para as receitas
    const $gridlist = document.createElement("div");
    $gridlist.classList.add("grid-list");

    // Adicionar os esqueletos de carregamento
    $currentTabPanel.innerHTML = `
        <div class="grid-list">
            ${$skeletonCard.repeat(12)} <!-- Exibe os esqueletos enquanto carrega -->
        </div>
    `;
    
    // Fazer a requisição para a API
    fetchData([['mealType', $currentTabBtn.textContent.trim().toLowerCase()], ...cardQueries], function(data) {
        console.log("API Response for", $currentTabBtn.textContent.trim().toLowerCase(), data);
        // Limpar os esqueletos e adicionar as receitas
        $currentTabPanel.innerHTML = ""; // Limpa os esqueletos de carregamento

        // Criar os cartões com as receitas
        data.hits.forEach((item, i) => {
            const {
                recipe: {
                    image,
                    label: title,
                    totalTime: cookingTime,
                    uri
                }
            } = item;

            const  recipeId = uri.slice(uri.lastIndexOf("_") + 1);
            const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);
            
            const $card = document.createElement("div");
            $card.classList.add("card");
            $card.style.animationDelay = `${100 * i}ms`; // Atraso de animação para cada cartão

            $card.innerHTML = `
                <figure class="card-media img-holder">
                    <img src="${image}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
                </figure>
                <div class="card-body">
                    <h3 class="title-small">
                        <a href="${uri}" class="card-link">${title ?? "Untitled"}</a>
                    </h3>
                    <div class="meta-wrapper">
                        <div class="meta-item">
                            <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                            <span class="label-medium">${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUnit}</span>
                        </div>
                        <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">
                            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                        </button>
                    </div>
                </div>
            `;

            $gridlist.appendChild($card);
        });

        // Adicionar o botão "Show more" ao final
        $currentTabPanel.appendChild($gridlist);
        $currentTabPanel.innerHTML += `
            <a href="./recipes.html?mealType=${$currentTabBtn.textContent.trim().toLowerCase()}" class="btn btn-secondary label-large has-state">Show more</a>
        `;
    });
};

addTabContent($lastActiveTabBtn, $lastActiveTabPanel);

/* Fetch data for slider card */

let cuisineType = ["Asia", "French"];
const $sliderSections = document.querySelectorAll("[data-slider-section]");

$sliderSections.forEach(($sliderSection, index) => {
    // Montar a estrutura inicial do slider
    $sliderSection.innerHTML = `
        <div class="container">
            <h2 class="section-title headline-small" id="slider-label-1"> Latest ${cuisineType[index]} Recipes</h2>
            <div class="slider">
                <ul class="slider-wrapper" data-slider-wrapper>
                    ${`<li class="slider-item">${$skeletonCard}</li>`.repeat(10)} <!-- Esqueleto de carregamento -->
                </ul>
            </div>
        </div>
    `;

    // Corrigir o seletor para o slider-wrapper
    const $sliderWrapper = $sliderSection.querySelector("[data-slider-wrapper]");

    // Fazer a requisição para a API
    fetchData([...cardQueries, ["cuisineType", cuisineType[index]]], function(data) {
        // Limpar esqueleto e adicionar os itens reais
        $sliderWrapper.innerHTML = "";

        data.hits.map(item => {
            const {
                recipe: {
                    image,
                    label: title,
                    totalTime: cookingTime,
                    uri
                }
            } = item;

            const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
            const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

            const $sliderItem = document.createElement("li");
            $sliderItem.classList.add("slider-item");

            $sliderItem.innerHTML = `
                <div class="card">
                    <figure class="card-media img-holder">
                        <img src="${image}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
                    </figure>
                    <div class="card-body">
                        <h3 class="title-small">
                            <a href="${uri}" class="card-link">${title ?? "Untitled"}</a>
                        </h3>
                        <div class="meta-wrapper">
                            <div class="meta-item">
                                <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                                <span class="label-medium">${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUnit}</span>
                            </div>
                            <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">
                                <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                                <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            $sliderWrapper.appendChild($sliderItem);
        });

        // Adicionar o botão "Show more" ao final
        $sliderWrapper.innerHTML += `
            <li class="slider-item" data-slider-item>
                <a href="./recipes.html?cuisineType=${cuisineType[index].toLowerCase()}" class="load-more-card has-state">
                    <span class="label-large">Show more</span>
                    <span class="material-symbols-outlined" aria-hidden="true">navigate_next</span>
                </a>
            </li>
        `;
    });
});