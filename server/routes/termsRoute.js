// backend/routes/termsRoutes.js
const express = require('express');
const Terms = require('../model/TermsModel');
const { addTerms } = require('../controllers/termsController');

const router = express.Router();

router.post('/terms', addTerms);

router.get("/terms", async (req, res) => {
    try {
      const terms = await Terms.find();
      res.status(200).json(terms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching terms and policy" });
    }
  });

module.exports = router;
