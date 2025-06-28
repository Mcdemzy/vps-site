// src/components/ReportPreview.tsx

interface Vulnerability {
  type: string;
  severity: string;
  confidence: string;
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
  };
}

const severityColors = {
  High: "bg-red-900/30 text-red-400 border-red-700",
  Medium: "bg-yellow-900/20 text-yellow-400 border-yellow-700",
  Low: "bg-blue-900/20 text-blue-400 border-blue-700",
  None: "bg-green-900/20 text-green-400 border-green-700",
};

const ReportPreview = ({ report }: ReportPreviewProps) => {
  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl animate-fadeIn">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Scan Results</h2>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              report.vulnerabilities.some((v) => v.severity === "High")
                ? "bg-red-900/30 text-red-400"
                : report.vulnerabilities.some((v) => v.severity === "Medium")
                ? "bg-yellow-900/20 text-yellow-400"
                : "bg-green-900/20 text-green-400"
            }`}
          >
            {report.vulnerabilities.some((v) => v.severity === "High")
              ? "Unsafe"
              : report.vulnerabilities.some((v) => v.severity === "Medium")
              ? "Suspicious"
              : "Safe"}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              {report.summary.includes("🚨") ? (
                <span className="text-red-500 text-xl">🚨</span>
              ) : report.summary.includes("⚠️") ? (
                <span className="text-yellow-500 text-xl">⚠️</span>
              ) : (
                <span className="text-green-500 text-xl">✅</span>
              )}
            </div>
            <p className="text-lg ml-2">
              {report.summary.replace(/[🚨⚠️✅]/g, "")}
            </p>
          </div>

          {report.stats && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Malicious"
                value={report.stats.malicious}
                color="text-red-400"
                bg="bg-red-900/10"
              />
              <StatCard
                label="Suspicious"
                value={report.stats.suspicious}
                color="text-yellow-400"
                bg="bg-yellow-900/10"
              />
              <StatCard
                label="Harmless"
                value={report.stats.harmless}
                color="text-green-400"
                bg="bg-green-900/10"
              />
              <StatCard
                label="Undetected"
                value={report.stats.undetected}
                color="text-gray-400"
                bg="bg-gray-700/10"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 mb-8">
          <h3 className="font-semibold text-lg">Detailed Findings</h3>
          {report.vulnerabilities.map((vuln, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border-l-4 ${
                severityColors[vuln.severity as keyof typeof severityColors] ||
                severityColors.None
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
                      : vuln.severity === "Low"
                      ? "bg-blue-900/20 text-blue-400"
                      : "bg-green-900/20 text-green-400"
                  }`}
                >
                  {vuln.severity} Risk
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-sm text-gray-400">Confidence: </span>
                  <span className="font-medium">{vuln.confidence}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {report.permalink && (
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={report.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition text-center flex items-center justify-center gap-2"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View Full Report on VirusTotal
            </a>
            <button className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition flex items-center justify-center gap-2">
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
              Download PDF Report
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const StatCard = ({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) => (
  <div className={`p-3 rounded-lg ${bg}`}>
    <p className="text-sm text-gray-400">{label}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
  </div>
);

export default ReportPreview;
