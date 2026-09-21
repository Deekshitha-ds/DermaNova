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

export const getSkinReportHistory = () =>
  client.get("/skin/reports");

export const getSkinReportById = (reportId) =>
  client.get(`/skin/reports/${reportId}`);