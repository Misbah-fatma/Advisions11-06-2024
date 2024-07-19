const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const requireLogin = require('../middlewares/requireLogin');

router.post('/buy', purchaseController.buyCourse);

router.get('/purchased', purchaseController.getPurchasedCourses);

module.exports = router;