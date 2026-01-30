import { checkApiHealth } from "./api";

export interface ApiMetrics {
  requestCount: number;
  errorCount: number;
  lastRequestTime: number;
  responseTime: number[];
  healthStatus?: {
    status: string;
    timestamp: string;
    uptime: number;
    memory: any;
  };
}

class ApiMonitor {
  private metrics: ApiMetrics = {
    requestCount: 0,
    errorCount: 0,
    lastRequestTime: 0,
    responseTime: [],
  };

  private isDevelopment = process.env.NODE_ENV === "development";

  logRequest(method: string, url: string, startTime: number) {
    this.metrics.requestCount++;
    this.metrics.lastRequestTime = Date.now();

    if (this.isDevelopment) {
      console.log(`🚀 API Request: ${method} ${url}`);
    }
  }

  logResponse(
    method: string,
    url: string,
    status: number,
    startTime: number,
    error?: Error
  ) {
    const responseTime = Date.now() - startTime;
    this.metrics.responseTime.push(responseTime);
    
    // Keep only last 50 response times
    if (this.metrics.responseTime.length > 50) {
      this.metrics.responseTime.shift();
    }

    if (error) {
      this.metrics.errorCount++;
    }

    if (this.isDevelopment) {
      const statusIcon = status >= 200 && status < 300 ? "✅" : 
                        status >= 400 && status < 500 ? "⚠️" : "❌";
      console.log(
        `${statusIcon} API Response: ${method} ${url} - ${status} (${responseTime}ms)`
      );
      
      if (error) {
        console.error(`❌ API Error:`, error);
      }
    }
  }

  async checkHealth() {
    try {
      const health = await checkApiHealth();
      this.metrics.healthStatus = health;
      return health;
    } catch (error) {
      console.error("Health check failed:", error);
      return null;
    }
  }

  getMetrics(): ApiMetrics {
    const avgResponseTime = this.metrics.responseTime.length > 0
      ? this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length
      : 0;

    return {
      ...this.metrics,
      averageResponseTime: avgResponseTime,
    };
  }

  resetMetrics() {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      lastRequestTime: 0,
      responseTime: [],
    };
  }
}

export const apiMonitor = new ApiMonitor();