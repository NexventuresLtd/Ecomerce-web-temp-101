// Shared letterhead/footer/table styling for every admin PDF report (carts,
// transactions, wishlists, dashboard summary) — one professional format
// instead of each page rolling its own "LOGO" placeholder box.
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

// jspdf-autotable v5 is function-first (`autoTable(doc, opts)`) and no longer
// side-effect-patches jsPDF just by importing it — `applyPlugin` restores the
// `doc.autoTable(...)` / `doc.lastAutoTable` API every call site here uses.
applyPlugin(jsPDF);

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
        lastAutoTable?: { finalY: number };
    }
}

export const BRAND_RGB: [number, number, number] = [29, 41, 61]; // #1d293d — matches the app's primary/dark-navy brand color

let cachedLogo: string | null | undefined;

async function loadLogoDataUrl(): Promise<string | null> {
    if (cachedLogo !== undefined) return cachedLogo;
    try {
        const res = await fetch('/Umukamezilogo.jpg');
        const blob = await res.blob();
        cachedLogo = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        cachedLogo = null;
    }
    return cachedLogo;
}

/** Creates a new jsPDF doc with the Umukamezi letterhead already drawn. */
export async function createReportDoc(title: string, subtitle?: string): Promise<jsPDF> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const logo = await loadLogoDataUrl();

    doc.setFillColor(...BRAND_RGB);
    doc.rect(0, 0, pageWidth, 38, 'F');

    const textX = logo ? 44 : 14;
    if (logo) {
        try {
            doc.addImage(logo, 'JPEG', 14, 7, 24, 24, undefined, 'FAST');
        } catch {
            // corrupt/unreadable image — fall back to text-only header
        }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('UMUKAMEZI', textX, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Global B2B Marketplace', textX, 24);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth - 14, 16, { align: 'right' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated ${new Date().toLocaleString()}`, pageWidth - 14, 23, { align: 'right' });
    if (subtitle) {
        doc.text(subtitle, pageWidth - 14, 29, { align: 'right' });
    }

    doc.setTextColor(0, 0, 0);
    return doc;
}

/** Draws a footer rule + page numbers on every page — call right before doc.save(). */
export function addReportFooter(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(...BRAND_RGB);
        doc.setLineWidth(0.4);
        doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text('Umukamezi · Global B2B Marketplace', 14, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    }
}

/** Shared table look — spread into any doc.autoTable({ ...REPORT_TABLE_THEME, ... }) call. */
export const REPORT_TABLE_THEME = {
    theme: 'grid' as const,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: BRAND_RGB, textColor: 255, fontStyle: 'bold' as const },
    alternateRowStyles: { fillColor: [244, 246, 249] as [number, number, number] },
};

/** Draws a light summary band with label/value pairs — replaces the old gray "SUMMARY OVERVIEW" box. */
export function drawSummaryBand(
    doc: jsPDF,
    y: number,
    stats: { label: string; value: string }[],
): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    const bandHeight = 24;

    doc.setFillColor(244, 246, 249);
    doc.rect(14, y, pageWidth - 28, bandHeight, 'F');
    doc.setDrawColor(...BRAND_RGB);
    doc.setLineWidth(0.3);
    doc.rect(14, y, pageWidth - 28, bandHeight);

    const colWidth = (pageWidth - 28) / stats.length;
    stats.forEach((s, i) => {
        const x = 14 + i * colWidth + colWidth / 2;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(s.label.toUpperCase(), x, y + 9, { align: 'center' });
        doc.setFontSize(13);
        doc.setTextColor(...BRAND_RGB);
        doc.setFont('helvetica', 'bold');
        doc.text(s.value, x, y + 18, { align: 'center' });
    });

    doc.setTextColor(0, 0, 0);
    return y + bandHeight + 12;
}
