const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product Management API",
      version: "1.0.0",
      description: "API for managing products: import, update, list, categories",
    },
    servers: [
      {
        url: "http://localhost:3000", // change this to your deployed URL if needed
      },
    ],
    tags: [
      {
        name: "Products",
        description: "Product management routes",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64b3cfc0fc13ae1c5e000001" },
            name: { type: "string", example: "Apple iPhone 13" },
            price: { type: "number", example: 799.99 },
            stock: { type: "integer", example: 25 },
            category: { type: "string", example: "Electronics" },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              example: "active",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProductUpdate: {
          type: "object",
          properties: {
            name: { type: "string", example: "New Name" },
            price: { type: "number", example: 99.99 },
            stock: { type: "integer", example: 10 },
            category: { type: "string", example: "Books" },
            status: { type: "string", enum: ["active", "inactive"] },
          },
        },
      },
    },
    paths: {
      "/products": {
        get: {
          tags: ["Products"],
          summary: "Get list of products with filters",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
            { name: "minPrice", in: "query", schema: { type: "number" } },
            { name: "maxPrice", in: "query", schema: { type: "number" } },
            { name: "minStock", in: "query", schema: { type: "number" } },
            { name: "maxStock", in: "query", schema: { type: "number" } },
            {
              name: "categories",
              in: "query",
              schema: { type: "array", items: { type: "string" } },
              style: "form",
              explode: false,
            },
            {
              name: "onlyLowStock",
              in: "query",
              schema: { type: "boolean" },
            },
            {
              name: "onlyOutOfStock",
              in: "query",
              schema: { type: "boolean" },
            },
            {
              name: "showHidden",
              in: "query",
              schema: { type: "boolean" },
            },
            {
              name: "sortBy",
              in: "query",
              schema: {
                type: "string",
                enum: ["priceAsc", "priceDesc", "stockAsc", "stockDesc"],
              },
            },
          ],
          responses: {
            200: {
              description: "List of products",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          page: { type: "integer" },
                          limit: { type: "integer" },
                          hasMore: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/products/import": {
        post: {
          tags: ["Products"],
          summary: "Import products from CSV file",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Import summary with counts and errors",
            },
          },
        },
      },
      "/products/{id}": {
        patch: {
          tags: ["Products"],
          summary: "Update a product by ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductUpdate" },
              },
            },
          },
          responses: {
            200: {
              description: "Updated product",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            404: {
              description: "Product not found",
            },
          },
        },
      },
      "/products/categories": {
        get: {
          tags: ["Products"],
          summary: "Get all distinct product categories",
          responses: {
            200: {
              description: "List of categories",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
