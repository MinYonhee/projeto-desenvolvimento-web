async function fetchSavedRecipes() {
    const url = "https://parseapi.back4app.com/classes/receitas_salvas";
    const queryParameters = new URLSearchParams({
    where: JSON.stringify({
        userId: localStorage.getItem('userId'),
    }),
    });

    let savedRecipes = await fetch(`${url}?${queryParameters.toString()}`, {
        method: "GET",
        headers: {
            "X-Parse-Application-Id": "ypYcXausTPunhXtj7Qz2KdO7JDp3wjLjtcXv5hTj",
            "X-Parse-REST-API-Key": "17jeZZW0H22bYIA3MZrii1q9Qd2Sz0BEjOcPiC57",
            "X-Parse-Session-Token": localStorage.getItem('token')
        },
    });

    let savedRecipesJson = await savedRecipes.json();

    savedRecipesJson.results.forEach(recipe => {
        let div = document.createElement('div');
        div.setAttribute('id', 'savedRecipeCard');

        let span = document.createElement('span');
        span.innerText = recipe.name;

        div.appendChild(span);
        document.getElementById('savedRecipes').appendChild(div);

    });
    
}

fetchSavedRecipes()