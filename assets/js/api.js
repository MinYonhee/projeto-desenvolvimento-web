"use strict";

window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2";
const APP_ID = "4fec3d5e";
const API_KEY = "9d6daf8554fef2e9f5927871826b1c1a";
const TYPE = "public";

/** 
 * @param {Array} queries 
 * @param {Function} successCallback 
 */

export const fetchData = async function (queries, successCallback) {
    const query = queries?.join("$")
    .replace(/,/g, "=")
    .replace(/ /g, "%20")
    .replace(/\+/g, "%2B");

    const url = `${ACCESS_POINT}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${query ? `&${query}` : ""}`;


    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();
        successCallback(data);
    }
}

    
