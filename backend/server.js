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
    let dish = req.query.dish.toLowerCase();

// ✅ Automatically replace common South Asian food names with better-recognized versions
const alternativeNames = {
    // Biryani Variations
    "chicken biryani": "biryani",
    "lamb biryani": "biryani",
    "mutton biryani": "biryani",
    "beef biryani": "biryani",
    "hyderabadi biryani": "biryani",
    "sindhi biryani": "biryani",
    "kolkata biryani": "biryani",
    "pakistani biryani": "biryani",

    // Daal (Lentils)
    "daal": "lentil curry",
    "dal makhani": "black lentil curry",
    "tadka dal": "yellow lentil curry",
    "moong dal": "split green lentil curry",
    "chana daal": "chickpea curry",
    "matar daal": "pea curry",

    // Curries & Gravies
    "butter chicken": "chicken curry",
    "chicken tikka masala": "chicken curry",
    "paneer butter masala": "paneer curry",
    "shahi paneer": "creamy paneer curry",
    "palak paneer": "spinach curry",
    "keema curry": "minced meat curry",
    "rogan josh": "lamb curry",
    "nihari": "slow-cooked stew",
    "chicken korma": "chicken curry",
    "mutton korma": "lamb curry",
    "bhuna gosht": "spicy meat curry",

    // Tandoori & Grilled Items
    "chicken tandoori": "grilled chicken",
    "seekh kabab": "minced meat kabab",
    "shami kabab": "pan-fried beef patty",
    "chapli kabab": "spicy minced meat kabab",
    "malai tikka": "creamy grilled chicken",

    // Vegetarian Dishes
    "aloo gobi": "potato and cauliflower stir fry",
    "baingan bharta": "mashed eggplant curry",
    "bhindi masala": "okra stir fry",
    "methi malai matar": "fenugreek and pea curry",
    "gobi manchurian": "spicy cauliflower",
    "chana masala": "chickpea curry",
    "rajma masala": "kidney bean curry",

    // Paratha & Breads
    "aloo paratha": "stuffed potato flatbread",
    "lachha paratha": "layered flatbread",
    "naan": "indian flatbread",
    "butter naan": "buttered flatbread",
    "garlic naan": "garlic flatbread",

    // Snacks & Street Food
    "samosa": "fried potato pastry",
    "pakora": "fried vegetable fritter",
    "pani puri": "crispy water balls",
    "bhel puri": "spicy puffed rice snack",
    "sev puri": "crispy puri with chutney",
    "papri chaat": "crispy cracker with yogurt",
    "dahi vada": "lentil dumplings in yogurt",

    // Rice & Pulao
    "zeera rice": "cumin rice",
    "yakhni pulao": "flavored rice with meat",
    "veg pulao": "vegetable rice dish",
    "matar pulao": "pea rice",
    "bagara rice": "spiced rice",
    
    // Breakfast Dishes
    "halwa puri": "sweet semolina with fried bread",
    "paya": "slow-cooked trotters stew",
    "chole bhature": "chickpea curry with fried bread",
    "anda bhurji": "spicy scrambled eggs",

    // Desserts
    "gulab jamun": "deep-fried milk balls in syrup",
    "jalebi": "crispy deep-fried syrup rings",
    "rasmalai": "soft cheese dumplings in milk",
    "kheer": "rice pudding",
    "seviyan": "vermicelli pudding",
    "gajar ka halwa": "carrot pudding",
    "double ka meetha": "bread pudding",
    "shahi tukda": "royal bread dessert"
};

// ✅ Check if the dish has an alternative name
if (alternativeNames[dish]) {
    dish = alternativeNames[dish];
}


    if (!dish) {
        return res.status(400).json({ error: "Dish parameter is required" });
    }

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${dish}&number=5&addRecipeInformation=true&apiKey=${API_KEY}`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return res.json({
                message: "No exact match found, but here are some related dishes.",
                results: [
                    { name: "Biryani", image: "https://via.placeholder.com/150", cuisine: "Indian" },
                    { name: "Paneer Curry", image: "https://via.placeholder.com/150", cuisine: "Indian" },
                    { name: "Butter Chicken", image: "https://via.placeholder.com/150", cuisine: "Indian" }
                ]
            });
        }
        

        // ✅ Filter only South Asian recipes
        const southAsianFoods = data.results; // No filtering, return everything



        if (southAsianFoods.length === 0) {
            return res.status(404).json({ error: "No South Asian alternatives found." });
        }

        // ✅ Get up to 3 valid South Asian recipes
        const selectedRecipes = southAsianFoods.slice(0, 3);
        const nutritionPromises = selectedRecipes.map(async (recipe) => {
            const nutritionResponse = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json?apiKey=${API_KEY}`);
            const nutritionData = await nutritionResponse.json();
            return {
                name: recipe.title,
                image: recipe.image,
                cuisine: recipe.cuisines.length > 0 ? recipe.cuisines[0] : "Unknown",
                nutrition: {
                    calories: nutritionData.calories || "N/A",
                    carbs: nutritionData.carbs || "N/A",
                    protein: nutritionData.protein || "N/A",
                    fat: nutritionData.fat || "N/A"
                }
            };
        });

        const recipesWithNutrition = await Promise.all(nutritionPromises);
        res.json({ results: recipesWithNutrition });

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
