// Simple in-memory rate limiter
// For production, use Vercel KV or Redis for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface EmailEntry {
  email: string;
  timestamp: number;
}

class RateLimiter {
  private ipLimits = new Map<string, RateLimitEntry>();
  private emailCache = new Map<string, EmailEntry>();
  
  // Rate limit: 3 requests per 15 minutes per IP
  private readonly MAX_REQUESTS = 3;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  
  // Email cache: 1 hour
  private readonly EMAIL_CACHE_MS = 60 * 60 * 1000; // 1 hour

  checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.ipLimits.get(ip);

    // Clean up old entries periodically
    this.cleanup();

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.ipLimits.set(ip, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return { allowed: true };
    }

    if (entry.count >= this.MAX_REQUESTS) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return { allowed: false, retryAfter };
    }

    // Increment count
    entry.count++;
    return { allowed: true };
  }

  cacheEmail(email: string): void {
    this.emailCache.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      timestamp: Date.now(),
    });
  }

  isEmailCached(email: string): boolean {
    const now = Date.now();
    const entry = this.emailCache.get(email.toLowerCase());
    
    if (!entry) return false;
    
    // Check if cache is still valid
    if (now - entry.timestamp > this.EMAIL_CACHE_MS) {
      this.emailCache.delete(email.toLowerCase());
      return false;
    }
    
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    
    // Clean up IP limits
    for (const [ip, entry] of this.ipLimits.entries()) {
      if (now > entry.resetTime) {
        this.ipLimits.delete(ip);
      }
    }
    
    // Clean up email cache
    for (const [email, entry] of this.emailCache.entries()) {
      if (now - entry.timestamp > this.EMAIL_CACHE_MS) {
        this.emailCache.delete(email);
      }
    }
  }

  // Get stats (for debugging)
  getStats() {
    return {
      ipLimits: this.ipLimits.size,
      emailCache: this.emailCache.size,
    };
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();
