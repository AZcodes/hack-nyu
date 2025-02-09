const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ Healthier Hardcoded Recipes (No API Needed!)
const healthyRecipes = {
    "biryani": {
        name: "Low-Carb Chicken Biryani",
        image: "https://via.placeholder.com/150",
        cuisine: "Indian",
        instructions: "Use brown basmati rice or cauliflower rice, cook with lean chicken, and reduce oil and salt.",
        nutrition: {
            calories: "400 kcal",
            carbs: "55g",
            protein: "35g",
            fat: "8g"
        }
    },
    "butter chicken": {
        name: "Healthy Butter Chicken",
        image: "https://via.placeholder.com/150",
        cuisine: "Indian",
        instructions: "Use grilled chicken breast, replace cream with Greek yogurt, and cook with tomatoes and mild spices.",
        nutrition: {
            calories: "350 kcal",
            carbs: "12g",
            protein: "40g",
            fat: "10g"
        }
    },
    "daal": {
        name: "Protein-Packed Daal",
        image: "https://via.placeholder.com/150",
        cuisine: "Indian",
        instructions: "Use mixed lentils, cook with turmeric and cumin, and use minimal oil.",
        nutrition: {
            calories: "250 kcal",
            carbs: "40g",
            protein: "18g",
            fat: "5g"
        }
    },
    "aloo paratha": {
        name: "Whole Wheat Aloo Paratha",
        image: "https://via.placeholder.com/150",
        cuisine: "Indian",
        instructions: "Use whole wheat flour, mash potatoes with less oil, and cook with minimal butter.",
        nutrition: {
            calories: "220 kcal",
            carbs: "45g",
            protein: "7g",
            fat: "6g"
        }
    },
    "chaat": {
        name: "Healthy Chaat",
        image: "https://via.placeholder.com/150",
        cuisine: "Indian",
        instructions: "Use baked puris, replace potatoes with chickpeas, and use homemade low-sugar chutneys.",
        nutrition: {
            calories: "180 kcal",
            carbs: "35g",
            protein: "10g",
            fat: "3g"
        }
    },
    "gulab jamun": {
        name: "Low-Sugar Gulab Jamun",
        image: "https://via.placeholder.com/150",
        cuisine: "Indian",
        instructions: "Use whole wheat flour and low-fat milk, bake instead of frying, and use honey instead of sugar syrup.",
        nutrition: {
            calories: "150 kcal",
            carbs: "28g",
            protein: "5g",
            fat: "3g"
        }
    },
    "kheer": {
        name: "Healthy Kheer",
        image: "https://via.placeholder.com/150",
        cuisine: "Indian",
        instructions: "Use brown rice, replace sugar with dates, and use almond milk instead of whole milk.",
        nutrition: {
            calories: "200 kcal",
            carbs: "35g",
            protein: "8g",
            fat: "4g"
        }
    }
};

// ✅ API Route: Fetch Recipe Info
app.get('/getRecipeInfo', async (req, res) => {
    let dish = req.query.dish ? req.query.dish.toLowerCase() : null;

    if (!dish) {
        return res.status(400).json({ error: "Dish parameter is required" });
    }

    if (!healthyRecipes[dish]) {
        return res.json({
            message: "No exact match found, but here are some related healthy dishes.",
            results: Object.values(healthyRecipes) // Returns all available healthy versions
        });
    }

    res.json({ results: [healthyRecipes[dish]] });
});

// ✅ Home Route (To Test Server)
app.get('/', (req, res) => {
    res.send("🚀 Backend is running! Use /getRecipeInfo?dish=Biryani to fetch recipes.");
});

// ✅ Start the Express Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
