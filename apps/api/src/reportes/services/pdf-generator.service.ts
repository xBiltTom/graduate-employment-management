import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

type PdfSection = {
  heading: string;
  rows?: Array<Record<string, string | number | null>>;
  metrics?: Array<{ label: string; value: string | number }>;
};

@Injectable()
export class PdfGeneratorService {
  generateReportPdf(input: {
    title: string;
    subtitle?: string;
    generatedBy: string;
    generatedAt: Date;
    sections: PdfSection[];
  }): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 48,
        size: 'A4',
      });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);

      doc.fontSize(20).text(input.title, {
        align: 'left',
      });

      if (input.subtitle) {
        doc
          .moveDown(0.5)
          .fontSize(11)
          .fillColor('#555555')
          .text(input.subtitle);
      }

      doc
        .moveDown()
        .fontSize(10)
        .fillColor('#000000')
        .text(`Generado por: ${input.generatedBy}`);
      doc.text(`Fecha de generacion: ${input.generatedAt.toISOString()}`);

      for (const section of input.sections) {
        doc.moveDown().fontSize(14).text(section.heading);

        if (section.metrics && section.metrics.length > 0) {
          doc.moveDown(0.5).fontSize(10);

          for (const metric of section.metrics) {
            doc.text(`${metric.label}: ${metric.value}`);
          }
        }

        if (section.rows && section.rows.length > 0) {
          doc.moveDown(0.5).fontSize(9);
          const headers = Object.keys(section.rows[0]);
          doc.text(headers.join(' | '));
          doc.moveDown(0.3);

          for (const row of section.rows) {
            const line = headers
              .map((header) => {
                const value = row[header];
                return value === null ? '-' : String(value);
              })
              .join(' | ');

            doc.text(line);
          }
        }
      }

      doc
        .moveDown(2)
        .fontSize(8)
        .fillColor('#666666')
        .text('Reporte generado automaticamente por el sistema.');

      doc.end();
    });
  }
}
