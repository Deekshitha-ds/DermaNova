
import client from "./client";

// Save a scan in the backend
export const saveScan = (analysisId) => {
  return client.post(`/analysis/saved/${analysisId}`);
};

// Remove a scan from saved scans
export const unsaveScan = (analysisId) => {
  return client.delete(`/analysis/saved/${analysisId}`);
};

// Get all saved scans for the logged-in user
export const getSavedScans = () => {
  return client.get("/analysis/saved");
};
