const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Route to handle AI content generation
app.post('/chat', async (req, res) => {
    try {
        // Get prompt from request body
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({
                error: 'Prompt is required'
            });
        }

        // Generate content
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Send response
        res.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate content'
        });
    }
});

// Health check endpoint
app.get('/chat', (req, res) => {
    res.json({ status: 'OK' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});