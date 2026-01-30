interface TokenManager {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken?: string): void;
  clearTokens(): void;
  isTokenExpired(token: string): boolean;
  refreshAccessToken(): Promise<string | null>;
}

class TokenManagerImpl implements TokenManager {
  private readonly ACCESS_KEY = "access";
  private readonly REFRESH_KEY = "refresh";

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.ACCESS_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_KEY, refreshToken);
    }
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Consider token expired if it's within 5 minutes of expiry
      return payload.exp < currentTime + (5 * 60);
    } catch {
      return true; // If we can't parse, consider it expired
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      this.setTokens(data.access, data.refresh);
      
      return data.access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      return null;
    }
  }
}

export const tokenManager = new TokenManagerImpl();

// Enhanced API function with automatic token refresh
export async function fetchWithRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = tokenManager.getAccessToken();

  // If no token, proceed with original request
  if (!token) {
    return fetch(url, options);
  }

  // If token is expired, try to refresh
  if (tokenManager.isTokenExpired(token)) {
    token = await tokenManager.refreshAccessToken();
    
    // If refresh failed, proceed with original request (will likely fail with 401)
    if (!token) {
      return fetch(url, options);
    }
  }

  // Add fresh token to headers
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  // If we get a 401, try one more refresh and retry
  if (response.status === 401 && tokenManager.getRefreshToken()) {
    const newToken = await tokenManager.refreshAccessToken();
    
    if (newToken) {
      const retryHeaders = {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
      };

      return fetch(url, { ...options, headers: retryHeaders });
    }
  }

  return response;
}