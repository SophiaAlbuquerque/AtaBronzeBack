import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function criarPagamento(amount, currency, paymentMethodId) {
  // amount em centavos (ex: R$10,00 = 1000)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
    });
    return paymentIntent;
  } catch (error) {
    throw error;
  }
}
