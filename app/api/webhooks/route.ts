import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { siteId, userId } = session.metadata;

    const supabase = createAdminClient();

    // Mark site as active
    await supabase
      .from("generated_sites")
      .update({ status: "active" })
      .eq("id", siteId)
      .eq("client_user_id", userId);

    console.log(`Site ${siteId} activated for user ${userId}`);
  }

  return NextResponse.json({ received: true });
}
