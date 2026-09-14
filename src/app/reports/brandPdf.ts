import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

// jspdf-autotable v5 no longer patches jsPDF on import.
applyPlugin(jsPDF);

// ── Brand ─────────────────────────────────────────────────────────────────
// Mirrors src/index.css: primary navy, secondary blue, accent red.
export const BRAND = {
    name: 'Umukamezi',
    tagline: 'Global B2B Marketplace · Powered by Nexventures Ltd.',
    site: 'umukamezi.com',
    email: 'info@umukamezi.com',
    primary:   [29, 41, 61]   as [number, number, number], // #1d293d
    secondary: [59, 130, 246] as [number, number, number], // #3b82f6
    accent:    [246, 59, 59]  as [number, number, number], // #f63b3b
    success:   [21, 128, 61]  as [number, number, number],
    warning:   [161, 98, 7]   as [number, number, number],
    ink:       [30, 41, 59]   as [number, number, number],
    muted:     [100, 116, 139] as [number, number, number],
    line:      [226, 232, 240] as [number, number, number],
    panel:     [248, 250, 252] as [number, number, number],
    logoUrl: '/Umukamezilogo.jpg',
};

export const RWF = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 });

// Loads the public logo as a data URL so jsPDF can embed it.
let logoCache: string | null = null;
export const loadLogo = async (): Promise<string | null> => {
    if (logoCache) return logoCache;
    try {
        const res = await fetch(BRAND.logoUrl);
        const blob = await res.blob();
        logoCache = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result as string);
            r.onerror = reject;
            r.readAsDataURL(blob);
        });
        return logoCache;
    } catch {
        return null;
    }
};

// ── Document ──────────────────────────────────────────────────────────────
export class BrandPdf {
    doc: jsPDF;
    pageW: number;
    pageH: number;
    margin = 16;
    y = 0;
    private title: string;
    private subtitle: string;
    private logo: string | null;
    private headedPages = new Set<number>();

    constructor(title: string, subtitle: string, logo: string | null) {
        this.doc = new jsPDF({ unit: 'mm', format: 'a4' });
        this.pageW = this.doc.internal.pageSize.getWidth();
        this.pageH = this.doc.internal.pageSize.getHeight();
        this.title = title;
        this.subtitle = subtitle;
        this.logo = logo;
        this.header();
    }

    get contentW() { return this.pageW - this.margin * 2; }

    // Full-width brand band with logo, title, period, generated-at.
    private header() {
        const d = this.doc;
        d.setFillColor(...BRAND.primary);
        d.rect(0, 0, this.pageW, 34, 'F');
        d.setFillColor(...BRAND.accent);
        d.rect(0, 34, this.pageW, 1.2, 'F');

        if (this.logo) {
            d.setFillColor(255, 255, 255);
            d.roundedRect(this.margin, 6, 22, 22, 2, 2, 'F');
            d.addImage(this.logo, 'JPEG', this.margin + 1.5, 7.5, 19, 19);
        }
        const tx = this.margin + (this.logo ? 27 : 0);
        d.setTextColor(255, 255, 255);
        d.setFont('helvetica', 'bold'); d.setFontSize(17);
        d.text(this.title, tx, 15);
        d.setFont('helvetica', 'normal'); d.setFontSize(9.5);
        d.setTextColor(203, 213, 225);
        d.text(this.subtitle, tx, 22);
        d.setFontSize(8);
        d.text(`${BRAND.name.toUpperCase()} · ${BRAND.site}`, tx, 28);

        d.setFontSize(8); d.setTextColor(203, 213, 225);
        d.text(`Generated ${new Date().toLocaleString()}`, this.pageW - this.margin, 12, { align: 'right' });
        d.setTextColor(255, 255, 255); d.setFont('helvetica', 'bold');
        d.text('CONFIDENTIAL', this.pageW - this.margin, 18, { align: 'right' });

        this.headedPages.add(1);
        this.y = 44;
    }

    // Slim brand band for every page after the first — used by newPage() and
    // by autoTable when a long table spills onto pages it created itself.
    private slimHeader() {
        const d = this.doc;
        const page = d.getCurrentPageInfo().pageNumber;
        if (this.headedPages.has(page)) return;
        this.headedPages.add(page);
        d.setFillColor(...BRAND.primary);
        d.rect(0, 0, this.pageW, 10, 'F');
        d.setFillColor(...BRAND.accent);
        d.rect(0, 10, this.pageW, 0.8, 'F');
        d.setTextColor(255, 255, 255); d.setFont('helvetica', 'bold'); d.setFontSize(8);
        d.text(`${BRAND.name.toUpperCase()} — ${this.title}`, this.margin, 6.8);
    }

    // Page-break guard: adds a page (with a slim header) if `needed` mm won't fit.
    ensure(needed: number) {
        if (this.y + needed > this.pageH - 18) this.newPage();
    }

    newPage() {
        this.doc.addPage();
        this.slimHeader();
        this.y = 18;
    }

    section(label: string) {
        this.ensure(14);
        const d = this.doc;
        d.setFillColor(...BRAND.secondary);
        d.rect(this.margin, this.y - 4, 1.6, 7, 'F');
        d.setTextColor(...BRAND.primary);
        d.setFont('helvetica', 'bold'); d.setFontSize(12);
        d.text(label.toUpperCase(), this.margin + 5, this.y + 1.2);
        d.setDrawColor(...BRAND.line); d.setLineWidth(0.3);
        d.line(this.margin, this.y + 4, this.pageW - this.margin, this.y + 4);
        this.y += 10;
    }

    note(text: string) {
        this.ensure(8);
        const d = this.doc;
        d.setTextColor(...BRAND.muted); d.setFont('helvetica', 'normal'); d.setFontSize(8.5);
        const lines = d.splitTextToSize(text, this.contentW);
        d.text(lines, this.margin, this.y);
        this.y += lines.length * 4 + 2;
    }

    // Row of KPI tiles: [{label, value, tone?}]
    kpis(items: { label: string; value: string; sub?: string; tone?: 'primary' | 'success' | 'accent' | 'warning' | 'secondary' }[]) {
        const gap = 4;
        const perRow = Math.min(items.length, 4);
        const w = (this.contentW - gap * (perRow - 1)) / perRow;
        const h = 20;
        const rows = Math.ceil(items.length / perRow);
        this.ensure(rows * (h + gap));
        const d = this.doc;
        items.forEach((it, i) => {
            const col = i % perRow, row = Math.floor(i / perRow);
            const x = this.margin + col * (w + gap);
            const y = this.y + row * (h + gap);
            const tone = BRAND[it.tone ?? 'primary'];
            d.setFillColor(...BRAND.panel);
            d.setDrawColor(...BRAND.line);
            d.roundedRect(x, y, w, h, 1.8, 1.8, 'FD');
            d.setFillColor(...tone);
            d.rect(x, y, 1.4, h, 'F');
            d.setTextColor(...BRAND.muted); d.setFont('helvetica', 'normal'); d.setFontSize(7.2);
            d.text(it.label.toUpperCase(), x + 4.5, y + 6);
            d.setTextColor(...tone); d.setFont('helvetica', 'bold'); d.setFontSize(12.5);
            d.text(it.value, x + 4.5, y + 13.5);
            if (it.sub) {
                d.setTextColor(...BRAND.muted); d.setFont('helvetica', 'normal'); d.setFontSize(6.8);
                d.text(it.sub, x + 4.5, y + 17.8);
            }
        });
        this.y += rows * (h + gap) + 2;
    }

    table(head: string[], body: (string | number)[][], opts: { align?: ('left' | 'right' | 'center')[]; widths?: (number | undefined)[]; zebra?: boolean; fontSize?: number } = {}) {
        this.ensure(20);
        const columnStyles: Record<number, any> = {};
        head.forEach((_, i) => {
            columnStyles[i] = {};
            if (opts.align?.[i]) columnStyles[i].halign = opts.align[i];
            if (opts.widths?.[i]) columnStyles[i].cellWidth = opts.widths[i];
        });
        (this.doc as any).autoTable({
            startY: this.y,
            head: [head],
            body,
            theme: 'grid',
            // top margin keeps spill-over pages clear of the slim header band;
            // bottom keeps them clear of the footer.
            margin: { left: this.margin, right: this.margin, top: 18, bottom: 16 },
            styles: { font: 'helvetica', fontSize: opts.fontSize ?? 8, cellPadding: 2.2, textColor: BRAND.ink, lineColor: BRAND.line, lineWidth: 0.2, overflow: 'linebreak' },
            headStyles: { fillColor: BRAND.primary, textColor: 255, fontStyle: 'bold', fontSize: 7.6, halign: 'left' },
            alternateRowStyles: opts.zebra === false ? {} : { fillColor: BRAND.panel },
            columnStyles,
            // autoTable creates its own pages for long tables — brand those too.
            didDrawPage: () => this.slimHeader(),
        });
        this.y = ((this.doc as any).lastAutoTable?.finalY ?? this.y) + 6;
    }

    // Footer with page numbers on every page — call last.
    finish(): jsPDF {
        const d = this.doc;
        const n = d.getNumberOfPages();
        for (let i = 1; i <= n; i++) {
            d.setPage(i);
            d.setDrawColor(...BRAND.line); d.setLineWidth(0.3);
            d.line(this.margin, this.pageH - 12, this.pageW - this.margin, this.pageH - 12);
            d.setFont('helvetica', 'normal'); d.setFontSize(7.5); d.setTextColor(...BRAND.muted);
            d.text(`© ${new Date().getFullYear()} ${BRAND.name} · ${BRAND.email} · ${BRAND.site}`, this.margin, this.pageH - 7.5);
            d.setFont('helvetica', 'bold'); d.setTextColor(...BRAND.primary);
            d.text(`Page ${i} of ${n}`, this.pageW - this.margin, this.pageH - 7.5, { align: 'right' });
        }
        return d;
    }
}

// CSV helper — quotes every cell, BOM so Excel opens it as UTF-8.
export const downloadCsv = (filename: string, head: string[], rows: (string | number | null | undefined)[][]) => {
    const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [head, ...rows].map(r => r.map(esc).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
