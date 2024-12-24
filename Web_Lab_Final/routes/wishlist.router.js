const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.models'); // Import User model
const ProductModel = require('../models/product.model'); // Import Product model
const auth = require('../middleware/auth'); // Import authentication middleware

// Add a product to the wishlist
router.post('/wishlist/add/:itemId', auth.isAuthenticated, async (req, res) => {
  try {
    const { itemId } = req.params;

    // Access the authenticated user
    const currentUser = req.currentUser;

    // Verify the product exists
    const selectedProduct = await ProductModel.findById(itemId);
    if (!selectedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add the product to the wishlist if not already included
    if (!currentUser.wishlist.includes(itemId)) {
      currentUser.wishlist.push(itemId);
      await currentUser.save();
    }

    // Fetch the updated wishlist with populated product details
    const updatedUser = await UserModel.findById(currentUser._id).populate('wishlist');

    // Render the wishlist page
    return res.render('wishlist', { wishlist: updatedUser.wishlist });
  } catch (err) {
    console.error('Error adding product to wishlist:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



// Get the user's wishlist
router.get('/wishlist', auth.isAuthenticated, async (req, res) => {
  try {
    const loggedUser = await UserModel.findById(req.session.user.id).populate('wishlist');
    if (!loggedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Render the wishlist page
    return res.render('wishlist', { wishlist: loggedUser.wishlist, Product: ProductModel });
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
