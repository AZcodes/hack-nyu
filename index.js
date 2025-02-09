document.getElementById("searchBtn").addEventListener("click", async () => {
    const foodItem = document.getElementById("searchInput").value;
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
        alert("Something went wrong!");
    }
});
function displayResults(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results
    if (data.error) {
        resultsDiv.innerHTML = `<p>${data.error}</p>`;
        return;
    }
    resultsDiv.innerHTML = `
        <h3>${data.original.name}</h3>
        <img src="${data.original.image}" width="200">
        <p><strong>Cuisine:</strong> ${data.original.cuisine}</p>
        <p><strong>Calories:</strong> ${data.original.nutrition.calories}</p>
        <p><strong>Carbs:</strong> ${data.original.nutrition.carbs}</p>
        <p><strong>Protein:</strong> ${data.original.nutrition.protein}</p>
        <p><strong>Fat:</strong> ${data.original.nutrition.fat}</p>
    `;
}