"use client";

import {useState, useEffect} from "react";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import { apiMonitor } from "@/lib/api-monitor";
import { checkApiHealth } from "@/lib/api";

interface ApiHealthIndicatorProps {
  className?: string;
}

export function ApiHealthIndicator({ className = "" }: ApiHealthIndicatorProps) {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const healthData = await checkApiHealth();
      setHealth(healthData);
    } catch {
      setHealth({ status: "unhealthy" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (loading) return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />;
    
    switch (health?.status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (health?.status) {
      case "healthy":
        return "bg-green-100 border-green-200 text-green-800";
      case "unhealthy":
        return "bg-red-100 border-red-200 text-red-800";
      default:
        return "bg-yellow-100 border-yellow-200 text-yellow-800";
    }
  };

  const metrics = apiMonitor.getMetrics();

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div 
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${getStatusColor()}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">
          {health?.status || "Checking..."}
        </span>
      </div>

      {showDetails && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            API Status
          </h3>
          
          {health && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{health.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">{health.uptime?.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Memory:</span>
                <span className="font-medium">
                  {health.memory ? `${(health.memory.heapUsed / 1024 / 1024).toFixed(1)}MB` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Check:</span>
                <span className="font-medium">
                  {health.timestamp ? new Date(health.timestamp).toLocaleTimeString() : "N/A"}
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t">
            <h4 className="font-medium mb-2">Client Metrics</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Requests:</span>
                <span className="font-medium">{metrics.requestCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Errors:</span>
                <span className="font-medium">{metrics.errorCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span className="font-medium">
                  {(metrics as any).averageResponseTime?.toFixed(0)}ms
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              checkHealth();
            }}
            className="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}