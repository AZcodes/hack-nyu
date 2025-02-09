const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

// ✅ API Route: Fetch Recipe Info + Filter for South Asian Cuisine
app.get('/getRecipeInfo', async (req, res) => {
    const dish = req.query.dish;

    if (!dish) {
        return res.status(400).json({ error: "Dish parameter is required" });
    }

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${dish}&number=5&addRecipeInformation=true&apiKey=${API_KEY}`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        // ✅ Filter only South Asian recipes
        const southAsianFoods = data.results.filter(item =>
            (item.cuisines && (
                item.cuisines.includes("Indian") ||
                item.cuisines.includes("Pakistani") ||
                item.cuisines.includes("Bangladeshi") ||
                item.cuisines.includes("Sri Lankan") ||
                item.cuisines.includes("Nepalese") ||
                item.cuisines.includes("Bhutanese") ||
                item.cuisines.includes("Afghan")
            )) ||
            (item.title.toLowerCase().includes("dal") ||
             item.title.toLowerCase().includes("biryani") ||
             item.title.toLowerCase().includes("paneer") ||
             item.title.toLowerCase().includes("curry"))
        );

        if (southAsianFoods.length === 0) {
            return res.status(404).json({ error: "No South Asian alternatives found." });
        }

        // ✅ Get first valid South Asian recipe
        const recipe = southAsianFoods[0];
        const recipeId = recipe.id;

        // ✅ Fetch Nutrition Info
        const nutritionResponse = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${API_KEY}`);
        const nutritionData = await nutritionResponse.json();

        // ✅ Return only useful details
        res.json({
            original: {
                name: recipe.title,
                image: recipe.image,
                cuisine: recipe.cuisines.length > 0 ? recipe.cuisines[0] : "Unknown",
                nutrition: {
                    calories: nutritionData.calories || "N/A",
                    carbs: nutritionData.carbs || "N/A",
                    protein: nutritionData.protein || "N/A",
                    fat: nutritionData.fat || "N/A"
                }
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
