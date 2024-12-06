import { fetchData } from "./api.js";

/**
 * Função para adicionar ouvintes de evento a múltiplos elementos.
 * 
 * @param {NodeList} $elements Lista de elementos aos quais adicionar o ouvinte de evento.
 * @param {string} eventType Tipo do evento (ex: 'click', 'keydown').
 * @param {Function} callback Função que será chamada quando o evento for disparado.
 */
window.addEventOnElements = ($elements, eventType, callback) => {
    for (const $element of $elements) {
        $element.addEventListener(eventType, callback);
    }
}


export const cardQueries = [
    ["field", "uri"],
    ["field", "label"],
    ["field", "image"],
    ["field", "totalTime"]
];

export const $skeletonCard = `
<div class="card skeleton-card">
    
    <div class="skeleton card-banner"></div>

        <div class="card-body">
            <div class="skeleton card-title"></div>
                    
            <div class="skeleton card-text"></div>
        </div>
    </div>`;

const ROOT = "https://api.edamam.com/api/recipes/v2";

window.saveRecipe = async function(element, recipeId) {
    const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);
    ACCESS_POINT = `${ROOT}/${recipeId}`;

    if(!isSaved) {
        fetchData(cardQueries, async function(data) {
            window.localStorage.setItem(`cookio-recipe${recipeId}`, JSON.stringify(data));
            element.classList.toggle("saved");
            element.classList.toggle("removed");
            showNotification("Added to Recipe book");

            let recipeData = {
                name: data.recipe.label,
                url: data.recipe.uri,
                userId: localStorage.getItem('userId')
            }

            try {
                await fetch('https://parseapi.back4app.com/classes/receitas_salvas', {
                    method: 'POST',
                    headers: {
                        "X-Parse-Application-Id": "ypYcXausTPunhXtj7Qz2KdO7JDp3wjLjtcXv5hTj",
                        "X-Parse-REST-API-Key": "17jeZZW0H22bYIA3MZrii1q9Qd2Sz0BEjOcPiC57",
                        "X-Parse-Revocable-Session": "1",
                        "X-Parse-Session-Token": localStorage.getItem('token')
                    },
                    body: JSON.stringify(recipeData)
                })
            } catch (error) {
                console.log('Algo deu errado: ', error)
            }

        });

        ACCESS_POINT = ROOT;
    } else {
        fetchData(cardQueries, async function(data) {
            console.log('data', data)            
            const params = {
                where: JSON.stringify({
                  name: data.recipe.label,
                  url: data.recipe.uri
                })
            };
    
            const query = new URLSearchParams(params).toString();
    
            try {
              
                let recipeToDelete = await fetch(`https://parseapi.back4app.com/classes/receitas_salvas/?${query}`, {
                    headers: {
                        "X-Parse-Application-Id": "ypYcXausTPunhXtj7Qz2KdO7JDp3wjLjtcXv5hTj",
                        "X-Parse-REST-API-Key": "17jeZZW0H22bYIA3MZrii1q9Qd2Sz0BEjOcPiC57",
                        "X-Parse-Revocable-Session": "1",
                        "X-Parse-Session-Token": localStorage.getItem('token')
                    },
                })
    
                let recipeToDeleteJson = await recipeToDelete.json();
                console.log('receita para deletar', recipeToDeleteJson)
    
            } catch(error) {
                console.log('Algo deu errado', error)
            }
        })


      

        window.localStorage.removeItem(`cookio-recipe${recipeId}`);
        element.classList.toggle("saved");
        element.classList.toggle("removed");
        showNotification("Removed to Recipe book");

    }
}

const $snackbarContainer = document.createElement("div");

$snackbarContainer.classList.add("snackbar-container");
document.body.appendChild($snackbarContainer);

function showNotification(message) {
    const $snackbar = document.createElement("div");
    $snackbar.classList.add("snackbar");
    $snackbar.innerHTML = `<p class="body-medium">${message}</p"`;
    $snackbarContainer.appendChild($snackbar);
    $snackbar.addEventListener("animationend", e => $snackbarContainer.removeChild($snackbar));
}



