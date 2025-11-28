const express = require('express');
const router = express.Router();
const jewelController = require('../controllers/jewels');
// Route to get all jewels
router.get('/', jewelController.getJewels);

// Route to get a jewel by ID
router.get('/:id', jewelController.getJewelById);

router.post('/', jewelController.createJewel);

router.put('/:id', jewelController.updateJewel); 

router.delete('/:id', jewelController.deleteJewel);

module.exports = router;