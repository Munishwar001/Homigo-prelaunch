export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}
