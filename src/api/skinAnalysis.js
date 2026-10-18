import client from "./client";

/**
 * Sends a skin image to the backend for ML analysis.
 *
 * mode:
 * - "live"   → image captured from live camera
 * - "upload" → image selected from device
 */
export const submitSkinAnalysis = (
  imageBlob,
  faceMeta,
  mode = "upload"
) => {
  const formData = new FormData();

  formData.append("file", imageBlob, "skin-scan.jpg");

  formData.append(
    "face_meta",
    JSON.stringify(faceMeta || {})
  );

  formData.append("mode", mode);

  return client.post("/analysis/skin", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


/**
 * Get the logged-in user's analysis history.
 */
export const getSkinReportHistory = () =>
  client.get("/analysis/history");


/**
 * Get one specific analysis report.
 */
export const getSkinReportById = (reportId) =>
  client.get(`/analysis/history/${reportId}`);


/**
 * Delete one saved analysis report.
 */
export const deleteSkinReport = (reportId) =>
  client.delete(`/analysis/history/${reportId}`);

/**
 * Get product recommendations for a specific skin scan.
 * Called only when the user clicks "See Suitable Products".
 */
export const getScanRecommendations = (analysisId) =>
  client.get(
    `/analysis/history/${analysisId}/recommendations`
);
