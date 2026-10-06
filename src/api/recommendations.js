import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export async function getProductRecommendations({
  budget = 800,
  skinType,
  hairType = null,
  concerns = [],
  dermatologistOnly = false,
  sensitive = false,
  weatherCondition = null,
}) {
  const token = localStorage.getItem("dermanova_access_token");

  const response = await axios.post(
    `${API_BASE_URL}/api/recommendations/routine`,
    {
      budget,
      skin_type: skinType,
      hair_type: hairType,
      concerns,
      dermatologist_only: dermatologistOnly,
      sensitive,
      weather_condition: weatherCondition,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}