const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const OpenAI = require('openai');

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: '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', // Replace with your actual OpenAI API key
});

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Fetch product data
    const products = await Product.find({  });
    const productList = products
      .map((p) => `- ${p.title} ($${p.price})`)
      .join('\n');

    // Fetch category data
    const categories = await Category.find({});
    const categoryList = categories.map((c) => `- ${c.title}`).join('\n');

    // Chat AI Prompt
    const prompt = `
      You are a helpful assistant for an e-commerce store.
      The user is asking about products and categories. Respond accordingly.

      Available Categories:
      ${categoryList}

      Available Products:
      ${productList}

      User: ${message}
      AI:
    `;

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in AI chat:', error.message || error);
    res.status(500).json({ error: 'An error occurred while processing your request. Please try again later.' });
  }
});

module.exports = router;
