// src/utils/pdfGenerator.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface VendorResult {
  category: string;
  result: string;
  method: string;
  engine_name: string;
}

export const generatePdfReport = (reportData: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Set default font
  doc.setFont("helvetica", "normal");

  // Add title
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text("SECURITY SCAN REPORT", pageWidth / 2, 20, { align: "center" });

  // Add scan overview section
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text("Scan Overview", margin, 35);
  doc.setDrawColor(41, 128, 185);
  doc.line(margin, 37, pageWidth - margin, 37);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  let yPos = 45;

  // Extract the actual scanned URL from the raw data
  const scannedUrl =
    reportData.rawData?.meta?.url_info?.url ||
    reportData.permalink?.replace(
      "https://www.virustotal.com/api/v3/analyses/",
      ""
    ) ||
    "N/A";

  // Get the current date in the requested format
  const scanDate = new Date().toLocaleString();

  // Basic info table
  autoTable(doc, {
    startY: yPos,
    head: [["Scan Information", "Details"]],
    body: [
      ["Scanned URL", scannedUrl],
      ["Scan Date", scanDate],
      [
        "Vulnerability Details",
        reportData.vulnerabilities[0]?.details || "N/A",
      ],
      ["Reputation Score", reportData.scanDetails?.reputation || "N/A"],
      ["Total Vendors", reportData.scanDetails?.totalVendors || "N/A"],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { font: "helvetica", fontStyle: "bold", cellWidth: 70 },
      1: { cellWidth: "auto" },
    },
    margin: { top: yPos },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Add detection statistics section
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text("Detection Statistics", margin, yPos);
  doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
  yPos += 10;

  autoTable(doc, {
    startY: yPos,
    head: [["Category", "Count"]],
    body: [
      ["Malicious", reportData.stats?.malicious || 0],
      ["Suspicious", reportData.stats?.suspicious || 0],
      ["Harmless", reportData.stats?.harmless || 0],
      ["Undetected", reportData.stats?.undetected || 0],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { font: "helvetica", fontStyle: "bold" },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Add detailed vulnerabilities section
  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text("Vulnerability Assessment", margin, yPos);
  doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
  yPos += 10;

  autoTable(doc, {
    startY: yPos,
    head: [["Type", "Severity", "Confidence"]],
    body: reportData.vulnerabilities.map((vuln: any) => [
      vuln.type,
      vuln.severity,
      vuln.confidence,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
    },
    styles: {
      fontSize: 10,
    },
    willDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 1) {
        const severity = data.cell.raw as string;
        if (severity === "High") {
          doc.setTextColor(231, 76, 60);
        } else if (severity === "Medium") {
          doc.setTextColor(241, 196, 15);
        } else {
          doc.setTextColor(39, 174, 96);
        }
      }
    },
    didDrawCell: () => {
      doc.setTextColor(0, 0, 0);
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Add technical details section
  if (reportData.rawData?.attributes) {
    doc.addPage();
    yPos = 20;

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("Technical Details", margin, yPos);
    doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    yPos += 10;

    const attributes = reportData.rawData.attributes;
    const technicalDetails = [
      {
        name: "First Submission",
        value: attributes.first_submission_date
          ? new Date(attributes.first_submission_date * 1000).toLocaleString()
          : "N/A",
      },
      {
        name: "Last Analysis",
        value: attributes.last_analysis_date
          ? new Date(attributes.last_analysis_date * 1000).toLocaleString()
          : "N/A",
      },
      { name: "Times Submitted", value: attributes.times_submitted || "N/A" },
      {
        name: "Redirection Chain",
        value: attributes.redirection_chain?.join(" → ") || "None",
      },
      {
        name: "Threat Names",
        value: attributes.threat_names?.join(", ") || "None detected",
      },
      { name: "Tags", value: attributes.tags?.join(", ") || "None" },
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Field", "Value"]],
      body: technicalDetails.map((detail) => [detail.name, detail.value]),
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { font: "helvetica", fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: "auto" },
      },
      styles: {
        fontSize: 9,
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Add footer to each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      "Generated by Security Scanner",
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  // Save the PDF
  doc.save(`Security_Scan_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};
