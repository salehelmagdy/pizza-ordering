import { authOptions } from "../auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItems";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
const stripe = require("stripe")(process.env.STRIPE_SK);

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  console.log(req.headers);

  const { cartProducts, address } = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    cartProducts,
    paid: false,
  });

  const stripeLineItems = [];

  for (const cartProduct of cartProducts) {
    const productInfo = await MenuItem.findById(cartProduct._id);

    // let productPrice = productInfo.basePrice;
    let productPrice = 55;

    if (cartProduct.size) {
      const size = productInfo.sizes.find(
        (size) => size._id.toString() === cartProduct.size._id.toString()
      );
      // productPrice += size.price;
      productPrice += 1;
    }

    if (cartProduct.extras?.length > 0) {
      for (const cartProductExtraThing of cartProduct.extras) {
        const productExtras = productInfo.extraIngredientPrices;
        const extraThingInfo = productExtras.find(
          (extra) =>
            extra._id.toString() === cartProductExtraThing._id.toString()
        );
        // productPrice += extraThingInfo.price;
        productPrice += 1;
      }
    }

    // const productName = cartProduct.name  ;
    const productName = cartProduct.name || "unKnown name product";

    if (!productName) {
      throw new Error(
        `Product name is missing for product ID: ${cartProduct._id}`
      );
    }

    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        unit_amount: productPrice * 100,
        product_data: {
          name: productName,
        },
      },
    });
  }

  console.log(stripeLineItems);

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: "payment",
      customer_email: userEmail,
      success_url:
        process.env.NEXTAUTH_URL +
        "orders/" +
        orderDoc._id.toString() +
        "?clear-cart=1",
      cancel_url: process.env.NEXTAUTH_URL + "cart?canceled=1",
      metadata: { orderId: orderDoc._id.toString() },
      payment_intent_data: {
        metadata: { orderId: orderDoc._id.toString() },
      },
      payment_intent_data: {
        metadata: { orderId: orderDoc._id.toString() },
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Delivery fee",
            type: "fixed_amount",
            fixed_amount: { amount: 500, currency: "USD" },
          },
        },
      ],
    });

    // console.log(stripeSession);

    return Response.json(stripeSession.url);
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
