document.getElementById("searchBtn").addEventListener("click", async () => {
    const foodItem = document.getElementById("searchInput").value.trim();
    if (!foodItem) {
        alert("Please enter a food name!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/getRecipeInfo?dish=${foodItem}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Something went wrong. Please try again later.");
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (!data.results || data.results.length === 0) {
        resultsDiv.innerHTML = `<p>No results found.</p>`;
        return;
    }

    data.results.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" width="200">
            <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
            <p><strong>Calories:</strong> ${recipe.nutrition.calories}</p>
            <p><strong>Carbs:</strong> ${recipe.nutrition.carbs}</p>
            <p><strong>Protein:</strong> ${recipe.nutrition.protein}</p>
            <p><strong>Fat:</strong> ${recipe.nutrition.fat}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        `;
        resultsDiv.appendChild(recipeCard);
    });
}
