// src/utils/pdfGenerator.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdfReport = (reportData: any) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("Vulnerability Scan Report", 105, 20, { align: "center" });

  // Add scan summary
  doc.setFontSize(12);
  doc.text(`Scanned URL: ${reportData.permalink || "N/A"}`, 14, 30);
  doc.text(`Scan Date: ${new Date().toLocaleString()}`, 14, 38);
  doc.text(`Summary: ${reportData.summary}`, 14, 46);

  // Add stats table
  autoTable(doc, {
    startY: 55,
    head: [["Category", "Count"]],
    body: [
      ["Malicious", reportData.stats?.malicious || 0],
      ["Suspicious", reportData.stats?.suspicious || 0],
      ["Harmless", reportData.stats?.harmless || 0],
      ["Undetected", reportData.stats?.undetected || 0],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [41, 41, 41], // Dark gray
      textColor: 255, // White
    },
  });

  // Add vulnerabilities section
  doc.setFontSize(14);
  doc.text("Vulnerability Details", 14, (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [["Type", "Severity", "Confidence"]],
    body: reportData.vulnerabilities.map((vuln: any) => [
      vuln.type,
      vuln.severity,
      vuln.confidence,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [41, 41, 41],
      textColor: 255,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: "auto" },
      2: { cellWidth: "auto" },
    },
  });

  // Add raw data section if available
  if (reportData.rawData) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Detailed Scan Data", 14, 20);
    doc.setFontSize(10);

    const formattedData = JSON.stringify(reportData.rawData, null, 2);
    const splitText = doc.splitTextToSize(formattedData, 180);
    doc.text(splitText, 14, 30);
  }

  // Save the PDF
  doc.save(`VulnScan_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};
