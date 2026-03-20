import { EmailAdapter, EmailResult } from "./adapter";

export class ConsoleEmailAdapter implements EmailAdapter {
  async send(options: EmailOptions): Promise<EmailResult> {
    console.log("Mock email sent:", {
      to: options.to,
      subject: options.subject,
      body: options.body,
      metadata: options.metadata,
    });

    return {
      success: true,
      provider: "console",
      response: "Email logged to console",
    };
  }
}

// Set as default adapter for development
if (process.env.NODE_ENV === "development") {
  setEmailAdapter(new ConsoleEmailAdapter());
}
