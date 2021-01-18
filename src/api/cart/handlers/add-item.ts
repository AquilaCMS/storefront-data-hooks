import { parseCartItem } from "../../utils/parse-item";
import getCartCookie from "../../utils/get-cart-cookie";
import type { CartHandlers } from "..";
import convertCartToBigCart from "../../../api/utils/convert/convert-cart-to-big-cart";

// Return current cart info
const addItem: CartHandlers["addItem"] = async ({
  res,
  body: { cartId, item },
  config,
}) => {
  if (!item) {
    return res.status(400).json({
      data: null,
      errors: [{ message: "Missing item" }],
    });
  }
  if (!item.quantity) item.quantity = 1;

  const options = {
    method: "PUT",
    body: JSON.stringify({
      cartId,
      item: {
        id: item.productId,
        quantity: item.quantity
      }
    }),
  };
  const result: any = await config.storeApiFetch(`/v2/cart/item`, options)
  let data = convertCartToBigCart(result)

  // Create or update the cart cookie
  res.setHeader(
    "Set-Cookie",
    getCartCookie(config.cartCookie, data.id, config.cartCookieMaxAge)
  );
  res.status(200).json({ data });
};

export default addItem;
