"use strict";

const ACCESS_POINT = "https://recipe-by-api-ninjas.p.rapidapi.com/v1/recipe";
const API_HOST = "recipe-by-api-ninjas.p.rapidapi.com";
const API_KEY = "e106c261ddmsh416bc9013ff3ef0p1dce89jsn7aa9cbf99922";

/**
 * Função fetchData para buscar dados da API.
 * @param {string} query - Parâmetros de pesquisa para a receita (por exemplo, "chicken").
 * @param {function} successCallback - Função de callback para processar a resposta da API.
 */
export const fetchData = async function (query, successCallback) {
    // Formata a URL com o parâmetro de pesquisa
    const url = `${ACCESS_POINT}?query=${encodeURIComponent(query)}`;

    // Define opções do fetch incluindo cabeçalhos necessários
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST
        }
    };

    try {
        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            successCallback(data);
        } else {
            console.error("Erro na resposta da API:", response.status);
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
};
