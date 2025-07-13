const express = require('express');
const router = express.Router();

const controller = require("../controllers/product.controller");
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const validation = require('../validations/product.validate');

router.post('/import', upload.single('file'), controller.importProducts);
router.get('', controller.getProducts);
router.patch('/:id', validate(validation.productSchema), controller.updateProduct);
router.get('/categories', controller.getProductCategories);


module.exports = router;
