const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { productValidation, validate } = require('../middleware/validator');

router.route('/')
    .get(getProducts)
    .post(protect, admin, productValidation, validate, createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, admin, productValidation, validate, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
