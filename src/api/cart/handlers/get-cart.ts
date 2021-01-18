import { BigcommerceApiError } from "../../utils/errors";
import getCartCookie from "../../utils/get-cart-cookie";
import type { Cart, CartHandlers } from "..";
import convertCartToBigCart from "../../../api/utils/convert/convert-cart-to-big-cart";

// Return current cart info
const getCart: CartHandlers["getCart"] = async ({
  res,
  body: { cartId },
  config,
}) => {
  let result: { data?: Cart } = {};

  if (cartId) {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          lang: "en",
          PostBody: {
            populate: ["items.id"]
          }
        })
      }
      result = await config.storeApiFetch(`/v2/cart/${cartId}`, options);
    } catch (error) {
      if (error instanceof BigcommerceApiError && error.status === 404) {
        // Remove the cookie if it exists but the cart wasn't found
        res.setHeader("Set-Cookie", getCartCookie(config.cartCookie));
      } else {
        throw error;
      }
    }
  }
  let data = result ? convertCartToBigCart(result) : null
  res.status(200).json({ data });
};

export default getCart;
