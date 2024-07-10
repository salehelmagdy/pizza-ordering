import { Order } from "@/models/Order";
import { buffer } from "micro";
const stripe = require("stripe")(process.env.STRIPE_SIGN_SECRET);

export async function POST(req) {
  // console.log(req.headers.get("stripe-signature"));
  const sig = req.headers.get("stripe-signature");
  let event;

  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (err) {
    console.log("stripe error");
    console.log(err);
    return new Response.json(err, { status: 400 });
  }

  // console.log(event);
  // const orderId = event?.data?.object?.metadata?.orderId;
  // if (orderId) {
  //   console.log(event.type);
  // }

  if (event.type === "checkout.session.completed") {
    console.log(event);
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === "paid";
    console.log(isPaid);
    if (isPaid) {
      await Order.updateOne({ _id: orderId }, { paid: true });
    }
  }

  return Response.json("ok", { status: 200 });
}
