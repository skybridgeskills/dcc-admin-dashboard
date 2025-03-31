export type Tenant = {
  secret: string;    // PAYLOAD_SECRET
  smtp_host: string; // SMTP_HOST
  smtp_user: string; // SMTP_USER
  smtp_pass: string; // SMTP_PASS
  smtp_from: string; // EMAIL_FROM

  url_claim: string // CLAIM_PAGE_URL
  url_status: string; // STATUS_URL
  url_coordinator: string; // COORDINATOR_URL
}
const config: Record<string, Tenant> = {};

export function getTenant(origin: string): Tenant | undefined {
  return config[origin];
}
