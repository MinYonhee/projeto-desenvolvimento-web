"use strict";

import { fetchDataByIgredient } from "./api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const q = params.get('q');
console.log(q)

if (localStorage.getItem('token') === null) {
    window.location.href = '/login.html'
}

async function getUserData() {
    const response = await fetch('https://parseapi.back4app.com/users/me', {
        headers: {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': 'ypYcXausTPunhXtj7Qz2KdO7JDp3wjLjtcXv5hTj',
            'X-Parse-REST-API-Key': '17jeZZW0H22bYIA3MZrii1q9Qd2Sz0BEjOcPiC57',
            'X-Parse-Session-Token': 'r:b07c7bae680c04ae1ee3f045cd69e7cf'                     
        }
    });

    const responseJson = await response.json();
    document.getElementById('userName').innerText = responseJson.username;
}

getUserData()

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
    // Create the container for recipes
    const $gridlist = document.createElement("div");
    $gridlist.classList.add("grid-list");

    // Add loading skeletons
    $currentTabPanel.innerHTML = `
        <div class="grid-list">
            ${$skeletonCard.repeat(12)} <!-- Display skeletons while loading -->
        </div>
    `;
    
    // Make the API request
    fetchDataByIgredient(q, [['mealType', $currentTabBtn.getAttribute('search').trim().toLowerCase()], ...cardQueries], function(data) {
        console.log("API Response for", $currentTabBtn.getAttribute('search').trim().toLowerCase(), data);

        // Check if data is valid before proceeding
        if (data && Array.isArray(data.hits)) {
            // Clear the skeletons and add the recipes
            $currentTabPanel.innerHTML = ""; // Clear the skeletons

            // Create the recipe cards
            data.hits.forEach((item, i) => {
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
                
                const $card = document.createElement("div");
                $card.classList.add("card");
                $card.style.animationDelay = `${100 * i}ms`; // Animation delay for each card

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

            // Add the "Show more" button
            $currentTabPanel.appendChild($gridlist);
            $currentTabPanel.innerHTML += `
                <a href="./recipes.html?mealType=${$currentTabBtn.textContent.trim().toLowerCase()}" class="btn btn-secondary label-large has-state">Show more</a>
            `;
        } else {
            console.error("Data is not in the expected format:", data);
            $currentTabPanel.innerHTML = "<p>No recipes found.</p>";
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
};

addTabContent($lastActiveTabBtn, $lastActiveTabPanel);

/* Fetch data for slider card */

// Fetch slider data for different cuisines
let cuisineType = ["Asia", "French"];

// Correct initialization of $sliderSection
const $sliderSections = document.querySelectorAll("[data-slider-section]");

cuisineType.forEach((cuisine, index) => {
    const $sliderSection = $sliderSections[index];  // Access each section individually
    $sliderSection.innerHTML = `
        <div class="container">          
            <div class="slider">
                <ul class="slider-wrapper" data-slider-wrapper>
                    ${`<li class="slider-item">${$skeletonCard}</li>`.repeat(10)}  <!-- Loading skeletons -->
                </ul>
            </div>
        </div>
    `;

    const $sliderWrapper = $sliderSection.querySelector("[data-slider-wrapper]");

    // Fetch data for the current cuisine type
    fetchDataByIgredient(q, [...cardQueries, ["cuisineType", cuisine]], function(data) {
        // Clear skeletons and add actual content
        if (data && Array.isArray(data.hits)) {
            $sliderWrapper.innerHTML = "";

            // Loop through the fetched data and create cards
            data.hits.forEach(item => {
                const { recipe: { image, label: title, totalTime: cookingTime, uri } } = item;
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

            // Add "Show more" button
            $sliderWrapper.innerHTML += `
                <li class="slider-item" data-slider-item>
                    <a href="./recipes.html?cuisineType=${cuisineType[index].toLowerCase()}" class="load-more-card has-state">
                        <span class="label-large">Show more</span>
                        <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                    </a>
                </li>
            `;
        } else {
            console.error("Error fetching data for cuisine:", cuisine);
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
});