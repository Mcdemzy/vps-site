// src/components/ScannerForm.tsx
import React, { useState } from "react";

interface ScannerFormProps {
  onScan: (url: string) => Promise<void>;
  isScanning: boolean;
  error?: string | null;
}

const ScannerForm = ({ onScan, isScanning, error }: ScannerFormProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onScan(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-grow px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isScanning || !url}
          className={`px-6 py-3 rounded-md font-semibold transition ${
            isScanning || !url
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isScanning ? "Scanning..." : "Scan"}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
          <p className="text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ScannerForm;
