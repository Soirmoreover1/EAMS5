// promotionRoutes.js

const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const {validateAuth , checkRoles } = require('../middlewares/authMiddleware');
const {  validateCreatePromotion} = require('../middlewares/validationMiddleware');
// Create a new promotion
router.post('/create',validateCreatePromotion, promotionController.createPromotion);

// Get all promotions
router.get('/showpromotions', promotionController.getAllPromotions);

// Get a promotion by ID
router.get('/showpromotions/:id', promotionController.getPromotionById);

// Update a promotion
router.put('/edit/:id', promotionController.updatePromotion);

// Delete a promotion
router.delete('/delete/:id', promotionController.deletePromotion);

module.exports = router;
