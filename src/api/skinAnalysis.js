import client from "./client";

/**
 * Sends a captured face frame (as a Blob) to the backend for ML analysis.
 */
export const submitSkinAnalysis = (imageBlob, faceMeta) => {
  const formData = new FormData();

  formData.append("file", imageBlob, "skin-scan.jpg");
  formData.append("face_meta", JSON.stringify(faceMeta));

  return client.post("/analysis/skin", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSkinReportHistory = () => client.get("/skin/reports");

export const getSkinReportById = (reportId) =>
  client.get(`/skin/reports/${reportId}`);