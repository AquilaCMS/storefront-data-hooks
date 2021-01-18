import { getConfig } from "../../../api"

export default function convertCartItemToBigCartItem(items: any[], type: string): any[] {
  const config = getConfig()
  return items
    .filter((item: any) => item.type === type)
    .map((item: any) => {
      const image = item.id.images.find((i: any) => i.default);
      return {
        id: item._id,
        parent_id: null,
        variant_id: item.id._id,
        product_id: item.id._id,
        sku: item.id._id,
        name: item.name,
        url: `${config.commerceUrl}/${item.id.slug[config.locale ?? 'en']}`,
        quantity: item.quantity,
        taxable: true,
        image_url: `${config.commerceUrl}/images/products/150x150/${image._id}/${image.name}`,
        discounts: [],
        coupons: [],
        discount_amount: 0,
        coupon_amount: 0,
        list_price: item.price.total.ati,
        sale_price: item.price.total.ati,
        extended_list_price: item.price.total.ati,
        extended_sale_price: item.price.total.ati,
        is_require_shipping: true,
        is_mutable: true
      }
  })
}