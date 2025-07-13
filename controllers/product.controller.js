const Papa = require("papaparse");
const { ProductModel } = require("../models/product.model");
const {
  productImportSchema,
} = require("../validations/product.validate");
// controllers/productController.js

exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '20',
      minPrice = '0',
      maxPrice = '999999',
      minStock = '0',
      maxStock = '999999',
      categories, 
      onlyLowStock = 'false',
      onlyOutOfStock = 'false',
      showHidden = 'false',
      sortBy
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.max(parseInt(limit, 10), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const filters = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      stock: { $gte: Number(minStock), $lte: Number(maxStock) }
    };

    // Stock logic
    if (onlyLowStock === 'true') {
      filters.stock = { $gt: 0, $lte: 10 };
    } else if (onlyOutOfStock === 'true') {
      filters.stock = { $eq: 0 };
    }

    if (showHidden === 'false') {
      filters.status = 'active';
    }

    // Handle category filtering
    if (categories) {
      if (Array.isArray(categories)) {
        filters.category = { $in: categories.map((c) => c.trim()) };
      } else if (typeof categories === 'string') {
        filters.category = categories.trim();
      }
    }

    const sortMap = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      stockAsc: { stock: 1 },
      stockDesc: { stock: -1 }
    };

    const sort = sortMap[sortBy] || {};

    const [products, total] = await Promise.all([
      ProductModel.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      ProductModel.countDocuments(filters)
    ]);

    res.status(200).json({
      data: products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        hasMore: skip + products.length < total
      }
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    next(error);
  }
};



exports.importProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    const csvStr = req.file.buffer.toString("utf-8");
    const parsed = Papa.parse(csvStr, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length) {
      return res.status(400).json({ 
        error: "CSV parse error", 
        details: parsed.errors 
      });
    }

    const csvProducts = parsed.data;
    const validatedProducts = [];
    const skippedProducts = [];

    for (const rawProduct of csvProducts) {
      const { error, value } = productImportSchema.validate(rawProduct);

      if (error) {
        skippedProducts.push({
          data: rawProduct,
          error: error.details[0].message,
        });
      } else {
        validatedProducts.push({
          ...value,
          status: "active",
        });
      }
    }

    // Mark all existing products as inactive
    await ProductModel.updateMany({}, { status: "inactive" });

    if (validatedProducts.length > 0) {
      await ProductModel.insertMany(validatedProducts);
    }

    res.status(200).json({
      message: "Import completed",
      data: {
        imported: validatedProducts.length,
        skipped: skippedProducts.length,
        errors: skippedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "ProductModel not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

exports.getProductCategories = async (req, res, next) => {
  try {
    const categories = await ProductModel.distinct('category').sort();
    res.status(200).json({
      success: true,
      data: categories.filter(cat => cat) 
    });
  } catch (error) {
    next(error);
  }
};