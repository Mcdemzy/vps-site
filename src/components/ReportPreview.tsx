// src/components/ReportPreview.tsx
import { generatePdfReport } from "../utils/pdfGenerator";

interface Vulnerability {
  type: string;
  severity: string;
  confidence: string;
  details?: string;
}

interface ReportPreviewProps {
  report: {
    vulnerabilities: Vulnerability[];
    summary: string;
    stats?: {
      malicious: number;
      suspicious: number;
      harmless: number;
      undetected: number;
    };
    permalink?: string;
    rawData?: any;
    scanDetails?: {
      lastAnalysisDate?: string;
      categories?: Record<string, string>;
      reputation?: number;
      totalVendors?: number;
    };
  };
}

const ReportPreview = ({ report }: ReportPreviewProps) => {
  const handleDownloadPdf = () => {
    generatePdfReport(report);
  };

  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Scan Results</h2>

        <div className="mb-6">
          <p className="text-lg mb-2">
            <span className="font-semibold">Summary:</span> {report.summary}
          </p>

          {report.scanDetails && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-6">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Last Scan</p>
                <p className="text-sm font-medium">
                  {report.scanDetails.lastAnalysisDate || "N/A"}
                </p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Reputation</p>
                <p className="text-sm font-medium">
                  {report.scanDetails.reputation || "N/A"}
                </p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Total Vendors</p>
                <p className="text-sm font-medium">
                  {report.scanDetails.totalVendors || "N/A"}
                </p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-sm font-medium">
                  {report.scanDetails.categories
                    ? Object.values(report.scanDetails.categories).join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
          )}

          {report.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Malicious</p>
                <p className="text-xl font-bold text-red-400">
                  {report.stats.malicious}
                </p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Suspicious</p>
                <p className="text-xl font-bold text-yellow-400">
                  {report.stats.suspicious}
                </p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Harmless</p>
                <p className="text-xl font-bold text-green-400">
                  {report.stats.harmless}
                </p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Undetected</p>
                <p className="text-xl font-bold text-gray-400">
                  {report.stats.undetected}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-lg">Detailed Findings</h3>
          {report.vulnerabilities.map((vuln, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border-l-4 ${
                vuln.severity === "High"
                  ? "border-red-500 bg-red-900/10"
                  : vuln.severity === "Medium"
                  ? "border-yellow-500 bg-yellow-900/10"
                  : "border-green-500 bg-green-900/10"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{vuln.type}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    vuln.severity === "High"
                      ? "bg-red-900/30 text-red-400"
                      : vuln.severity === "Medium"
                      ? "bg-yellow-900/20 text-yellow-400"
                      : "bg-green-900/20 text-green-400"
                  }`}
                >
                  {vuln.severity} Risk
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="text-gray-400">Confidence:</span>{" "}
                  <span className="font-semibold">{vuln.confidence}</span>
                </p>
                {vuln.details && (
                  <p>
                    <span className="text-gray-400">Details:</span>{" "}
                    <span className="font-medium">{vuln.details}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={report.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition text-center"
          >
            View Full Report on VirusTotal
          </a>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Detailed PDF Report
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportPreview;
