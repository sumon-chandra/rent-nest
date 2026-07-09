import Stripe from "stripe";
import envConfigs from "../configs/env-configs";

export const stripe = new Stripe(envConfigs.stripe.secret_key, {
	apiVersion: "2026-06-24.dahlia",
});
