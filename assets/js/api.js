"use strict";

/**
 * Função fetchData para buscar dados da TheMealDB API.
 * @param {string} query - Palavra-chave para a pesquisa (ex: "chicken").
 * @param {function} successCallback - Função de callback para processar a resposta da API.
 */
export const fetchData = async function (query, successCallback) {
    // Formata a URL com o parâmetro de pesquisa
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);

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
