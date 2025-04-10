import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { WorkEntry } from '../types';

export const generatePDF = (
  entries: WorkEntry[],
  period: string,
  entriesByCategory: Record<string, WorkEntry[]>
) => {
  const doc = new jsPDF();
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  // Title
  doc.setFontSize(20);
  doc.text('Work Report', 14, 20);

  // Period and Total Hours
  doc.setFontSize(12);
  doc.text(`Period: ${period}`, 14, 30);
  doc.text(`Total Hours: ${totalHours}`, 14, 37);

  // Entries Table
  const tableData = entries.map(entry => [
    new Date(entry.date).toLocaleDateString(),
    entry.description,
    entry.hours.toString(),
    entry.category,
    entry.status
  ]);

  autoTable(doc, {
    head: [['Date', 'Description', 'Hours', 'Category', 'Status']],
    body: tableData,
    startY: 45,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Category Summary
  let currentY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(14);
  doc.text('Category Summary', 14, currentY);
  currentY += 10;

  doc.setFontSize(10);
  Object.entries(entriesByCategory).forEach(([category, categoryEntries]) => {
    const categoryHours = categoryEntries.reduce((sum, entry) => sum + entry.hours, 0);
    doc.text(`${category}: ${categoryHours} hours`, 14, currentY);
    currentY += 7;
  });

  // Generate and download
  const date = new Date().toISOString().split('T')[0];
  doc.save(`work-report-${period}-${date}.pdf`);
};