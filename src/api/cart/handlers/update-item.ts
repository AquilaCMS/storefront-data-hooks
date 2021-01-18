import getCartCookie from "../../utils/get-cart-cookie";
import type { CartHandlers } from "..";
import convertCartToBigCart from "../../../api/utils/convert/convert-cart-to-big-cart";

// Return current cart info
const updateItem: CartHandlers["updateItem"] = async ({
  res,
  body: { cartId, itemId, item },
  config,
}) => {
  if (!cartId || !itemId || !item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: "Invalid request" }],
    });
  }

  const options = {
    method: "PUT",
    body: JSON.stringify({
      item: {
        id: item.productId,
        quantity: item.quantity
      },
      cartId
    }),
  }
  const result: any = await config.storeApiFetch('/v2/cart/item', options);
  let data = convertCartToBigCart(result)

  // Update the cart cookie
  res.setHeader(
    "Set-Cookie",
    getCartCookie(config.cartCookie, cartId, config.cartCookieMaxAge)
  );
  res.status(200).json({ data });
};

export default updateItem;
