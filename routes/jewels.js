const express = require('express');
const router = express.Router();
const jewelController = require('../controllers/jewels');
const { isAuthenticated } = require('../middleware/authenticate');


/**
 * @swagger
 * /jewels:
 *   get:
 *     summary: Get all jewels
 *     tags: [Jewels]
 */

// Route to get all jewels
router.get('/', jewelController.getJewels);

// Route to get a jewel by ID
router.get('/:id', jewelController.getJewelById);

router.post('/', isAuthenticated, jewelController.createJewel);

router.put('/:id', isAuthenticated, jewelController.updateJewel); 

router.delete('/:id', isAuthenticated, jewelController.deleteJewel);

module.exports = router;