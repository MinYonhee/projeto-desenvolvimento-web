"use strict";

/**
 * Função fetchData para buscar dados da Spoonacular API.
 * @param {string} query - Palavra-chave para a pesquisa (ex: "chicken").
 * @param {function} successCallback - Função de callback para processar a resposta da API.
 */
export const fetchData = async function (query, successCallback) {
    const apiKey = '0f9583f42d3f4ab89d19c1113fbba96f';  // Sua chave de API da Spoonacular
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&apiKey=${apiKey}&number=12`;

    try {
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            successCallback(data.results);  // Passa os resultados para o callback
        } else {
            console.error("Erro na resposta da API:", response.status);
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
};
