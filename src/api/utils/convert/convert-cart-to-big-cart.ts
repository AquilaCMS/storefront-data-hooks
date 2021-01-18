import { getConfig } from "../../../api";
import { Cart } from "../../../api/cart";
import convertCartItemToBigCartItem from "./convert-cart-item-to-big-cart-item";

export default function convertCartToBigCart(cart: any): Cart {
  const config = getConfig()
  return {
    id: cart._id,
    customer_id: 0,
    channel_id: 1,
    email: "",
    currency: {
      code: "EUR"
    },
    tax_included: true,
    base_amount: cart.priceSubTotal.ati,
    discount_amount: 0,
    cart_amount: cart.priceTotal.ati,
    coupons: [],
    line_items: {
      physical_items: convertCartItemToBigCartItem(cart.items, 'simple'),
      digital_items: convertCartItemToBigCartItem(cart.items, 'virtual'),
      gift_certificates: [],
      custom_items: []
    },
    created_time: cart.createdAt,
    updated_time: cart.updatedAt,
    locale: config.locale ?? 'en'
  }
}