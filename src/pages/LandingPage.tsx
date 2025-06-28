import { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ScannerForm from "../components/ScannerForm";
import ReportPreview from "../components/ReportPreview";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import { scanUrl } from "../services/virusTotalService";
import axios from "axios";

interface Vulnerability {
  type: string;
  severity: string;
  confidence: string;
}

interface ScanReport {
  vulnerabilities: Vulnerability[];
  summary: string;
  stats?: {
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
  };
  permalink?: string;
}

const LandingPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (url: string) => {
    setIsScanning(true);
    setError(null);
    setReport(null); // Clear previous results

    try {
      const result = await scanUrl(url);

      if (result.data?.attributes?.status !== "completed") {
        throw new Error("Scan is still processing");
      }

      const transformedReport = transformVirusTotalData(result);
      setReport(transformedReport);
    } catch (err) {
      console.error("Scan error:", err);

      let errorMessage = "Scan failed. Please try again.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          errorMessage =
            "API rate limit exceeded (4 requests/minute). Please wait...";
        } else if (err.response?.data?.error?.message) {
          errorMessage = err.response.data.error.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const transformVirusTotalData = (data: any): ScanReport => {
    const stats = data.data.attributes.stats;
    const maliciousCount = stats.malicious;
    const suspiciousCount = stats.suspicious;

    const vulnerabilities: Vulnerability[] = [];

    // Add malicious vulnerability if found
    if (maliciousCount > 0) {
      vulnerabilities.push({
        type: "Malicious URL Detected",
        severity: maliciousCount > 5 ? "High" : "Medium",
        confidence: `${Math.min(100, maliciousCount * 15)}%`,
      });
    }

    // Add suspicious vulnerability if found
    if (suspiciousCount > 0) {
      vulnerabilities.push({
        type: "Suspicious Activity Detected",
        severity: "Low",
        confidence: `${suspiciousCount * 10}%`,
      });
    }

    // If no threats found, add a clean result
    if (maliciousCount === 0 && suspiciousCount === 0) {
      vulnerabilities.push({
        type: "No Threats Detected",
        severity: "None",
        confidence: "100%",
      });
    }

    // Create summary message
    let summary;
    if (maliciousCount > 0) {
      summary = `🚨 ${maliciousCount} security vendors flagged this URL as malicious`;
    } else if (suspiciousCount > 0) {
      summary = `⚠️ ${suspiciousCount} vendors reported suspicious activity`;
    } else {
      summary = "✅ No security vendors flagged this URL as malicious";
    }

    return {
      vulnerabilities,
      summary,
      stats,
      permalink: data.meta?.url_info?.url || "https://www.virustotal.com",
    };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-12">
          <h2 className="text-2xl font-bold mb-4">Website Security Scanner</h2>
          <p className="text-gray-300 mb-6">
            Enter a URL below to check for malicious activity, phishing
            attempts, and other security threats using VirusTotal's database of
            70+ security vendors.
          </p>
          <ScannerForm
            onScan={handleScan}
            isScanning={isScanning}
            error={error}
          />

          {isScanning && (
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600 flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>
                Scanning URL with VirusTotal... This may take a few seconds.
              </span>
            </div>
          )}
        </div>
      </div>

      {report && <ReportPreview report={report} />}

      <FeaturesSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
