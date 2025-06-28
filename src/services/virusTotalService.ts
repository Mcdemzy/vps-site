// src/services/virusTotalService.ts
import axios from "axios";

const API_KEY = import.meta.env.VITE_VIRUSTOTAL_API_KEY; // Store in .env
const BASE_URL = "https://www.virustotal.com/api/v3";

const virusTotalApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-apikey": API_KEY,
    accept: "application/json",
  },
});

export const scanUrl = async (url: string) => {
  try {
    // First submit the URL for scanning
    const formData = new FormData();
    formData.append("url", url);

    const scanResponse = await virusTotalApi.post("/urls", formData, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    const analysisId = scanResponse.data.data.id;

    // Then get the analysis report
    const analysisResponse = await virusTotalApi.get(`/analyses/${analysisId}`);

    return analysisResponse.data;
  } catch (error) {
    console.error("VirusTotal API error:", error);
    throw error;
  }
};

export const getUrlReport = async (urlId: string) => {
  try {
    const response = await virusTotalApi.get(`/urls/${urlId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching URL report:", error);
    throw error;
  }
};
