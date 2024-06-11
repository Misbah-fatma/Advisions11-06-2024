// backend/controllers/termsController.js
const Terms = require('../model/TermsModel');

const addTerms = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newTerms = new Terms({ title, content });
    await newTerms.save();
    res.status(201).json({ message: 'Terms and policy added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding terms and policy', error });
  }
};

module.exports = { addTerms };
