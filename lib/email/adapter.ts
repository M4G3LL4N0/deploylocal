export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailResult {
  success: boolean;
  provider: string;
  response: unknown;
}

export interface EmailAdapter {
  send(options: EmailOptions): Promise<EmailResult>;
}

let emailAdapter: EmailAdapter | null = null;

export function setEmailAdapter(adapter: EmailAdapter) {
  emailAdapter = adapter;
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  if (!emailAdapter) {
    throw new Error("No email adapter configured");
  }
  return emailAdapter.send(options);
}
