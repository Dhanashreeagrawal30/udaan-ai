import { PredictApiRequest, PredictApiResponse, ModelMetricsInfo } from '../types';
import { inferStudentRiskClientSide } from './mlEngine';

// Relative URLs keep the browser on the same origin in production.
// Vite proxies /api to the local FastAPI server during development.
const API_BASE_URL = '';

export interface BackendStatus {
  isConnected: boolean;
  modelLoaded: boolean;
  version?: string;
  lastChecked: string;
  error?: string;
}

let cachedBackendStatus: BackendStatus = {
  isConnected: false,
  modelLoaded: false,
  lastChecked: new Date().toISOString()
};

/**
 * Check health of backend FastAPI server
 */
export async function checkBackendHealth(): Promise<BackendStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      signal: controller.signal,
      method: 'GET',
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      cachedBackendStatus = {
        isConnected: true,
        modelLoaded: Boolean(data.model_loaded),
        version: data.model_version || '1.0.0-techformers',
        lastChecked: new Date().toISOString()
      };
      return cachedBackendStatus;
    }
    throw new Error(`Health check returned status ${response.status}`);
  } catch (err: unknown) {
    cachedBackendStatus = {
      isConnected: false,
      modelLoaded: false,
      lastChecked: new Date().toISOString(),
      error: err instanceof Error ? err.message : 'Backend unreachable'
    };
    return cachedBackendStatus;
  }
}

export function getCachedBackendStatus(): BackendStatus {
  return cachedBackendStatus;
}

/**
 * Predict risk using Python FastAPI backend, falling back to embedded ML client if offline
 */
export async function predictStudentRisk(
  req: PredictApiRequest,
  forceClientDemo: boolean = false
): Promise<{ result: PredictApiResponse; source: 'connected_model' | 'demo_mode' }> {
  if (!forceClientDemo) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const result: PredictApiResponse = await response.json();
        cachedBackendStatus.isConnected = true;
        return { result, source: 'connected_model' };
      }
    } catch {
      // Backend not running or connection timed out, fallback to embedded client engine
      cachedBackendStatus.isConnected = false;
    }
  }

  // Fallback to client-side mathematical model
  const result = inferStudentRiskClientSide(req);
  return { result, source: 'demo_mode' };
}

/**
 * Fetch ML Model evaluation metrics from backend or local bundle
 */
export async function fetchModelMetrics(): Promise<ModelMetricsInfo> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/model-info`);
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // If backend is offline, load from pre-bundled static JSON
  }

  const staticMetrics = await import('../data/model_metrics.json');
  return staticMetrics.default as unknown as ModelMetricsInfo;
}
