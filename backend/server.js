const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Load API keys from .env

const app = express();  // ✅ This line initializes Express
const PORT = 3000;

app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Allows backend to handle JSON data

const API_KEY = process.env.API_KEY; // Get API key from .env

// ✅ API Route: Fetch Recipe Info from Spoonacular
app.get('/getRecipeInfo', async (req, res) => {
    const dish = req.query.dish; // Get dish name from frontend input

    if (!dish) {
        return res.status(400).json({ error: "Dish parameter is required" });
    }

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${dish}&number=1&apiKey=${API_KEY}`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        const recipeId = data.results[0].id; // Get first recipe's ID
        const recipeDetailsResponse = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${API_KEY}`);
        const nutritionData = await recipeDetailsResponse.json();

        res.json({
            original: {
                name: data.results[0].title,
                image: data.results[0].image,
                nutrition: nutritionData
            }
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Home Route (To Test Server)
app.get('/', (req, res) => {
    res.send("🚀 Backend is working! Use /getRecipeInfo?dish=Biryani to fetch recipes.");
});

// ✅ Start the Express server
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

