export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: "customer" | "provider";
  createdAt: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}
