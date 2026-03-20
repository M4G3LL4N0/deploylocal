import { NextResponse } from "next/server";
import { EmailInput, EmailResponse } from "@/lib/api/client";
import { sendEmail } from "@/lib/email/adapter";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { supabase, user } = await requireAdmin();
    const body = await req.json();
    
    const { leadId, to, subject, body: emailBody } = body as EmailInput;
    
    if (!leadId || !to || !subject || !emailBody) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email using configured adapter
    const result = await sendEmail({
      to,
      subject,
      body: emailBody,
      metadata: {
        leadId,
        userId: user.id,
      }
    });

    // Log the email attempt
    const { data: emailLog } = await supabase
      .from("outreach_emails")
      .insert({
        lead_id: leadId,
        user_id: user.id,
        subject,
        body: emailBody,
        status: result.success ? "sent" : "failed",
        metadata: {
          provider: result.provider,
          response: result.response,
        }
      })
      .select("*")
      .single();

    return NextResponse.json({
      emailId: emailLog?.id,
      status: emailLog?.status,
    } as EmailResponse);
    
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
