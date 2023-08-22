"use strict";

/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  async create({ data }) {
    data.products.forEach(async (product) => {
      const serverProduct = await strapi.entityService.findOne(
        "api::product.product",
        product.productId,
        {
          fields: ["stock"],
        }
      );

      await strapi.entityService.update(
        "api::product.product",
        product.productId,
        {
          data: {
            stock: serverProduct.stock - product.quantity,
          },
        }
      );
    });

    return await strapi.entityService.create("api::order.order", {
      data: {
        name: data.name,
        email: data.email,
        products: data.products,
      },
    });
  },
}));
