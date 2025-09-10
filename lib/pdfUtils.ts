import { PDFDocument, rgb, PDFName } from "pdf-lib";

type Drawing = { id: string; path: string; color: string; page?: number };
type StickyNote = {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
};

const noteColorMap: Record<string, [number, number, number]> = {
  yellow: [1, 1, 0.6],
  blue: [0.6, 0.8, 1],
  pink: [1, 0.7, 0.8],
  green: [0.6, 1, 0.6],
};

function toPdfCoords(note: StickyNote, page: any) {
  const { height } = page.getSize();
  return {
    x: note.x,
    y: height - note.y - note.height,
    width: note.width,
    height: note.height,
  };
}

export async function exportWithNotes(
  originalPdfBytes: Uint8Array,
  drawings: Drawing[],
  notes: StickyNote[]
) {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  drawings.forEach((drawing) => {
    const page = pages[drawing.page ?? 0];
    const { height } = page.getSize();
    const commands = drawing.path.split(" ");
    let pathOps: [number, number][] = [];

    for (let i = 0; i < commands.length; i++) {
      if (commands[i] === "M" || commands[i] === "L") {
        const x = parseFloat(commands[i + 1]);
        const y = parseFloat(commands[i + 2]);
        pathOps.push([x, height - y]);
      }
    }

    if (pathOps.length > 1) {
      page.drawSvgPath(
        `M ${pathOps.map(([x, y]) => `${x} ${y}`).join(" L ")}`,
        {
          borderColor:
            drawing.color === "red"
              ? rgb(1, 0, 0)
              : drawing.color === "blue"
              ? rgb(0, 0, 1)
              : drawing.color === "green"
              ? rgb(0, 1, 0)
              : rgb(0, 0, 0),
          borderWidth: 2,
        }
      );
    }
  });

  notes.forEach((note) => {
    const page = pages[note.page];
    const { x, y, width, height } = toPdfCoords(note, page);

    const [r, g, b] = noteColorMap[note.color] || [1, 1, 0.7];

    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: rgb(r, g, b),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
      opacity: 0.8,
    });

    page.drawText(note.text || "(empty)", {
      x: x + 4,
      y: y + height - 14,
      size: 10,
      maxWidth: width - 8,
      lineHeight: 12,
      color: rgb(0, 0, 0),
    });
  });

  return pdfDoc.save();
}

export async function exportWithAnnotations(
  originalPdfBytes: Uint8Array,
  drawings: Drawing[],
  notes: StickyNote[]
) {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  notes.forEach((note) => {
    const page = pages[note.page];
    const { x, y, width, height } = toPdfCoords(note, page);

    const annotationDict = pdfDoc.context.obj({
      Type: "Annot",
      Subtype: "Text",
      Rect: [x, y, x + width, y + height],
      Contents: note.text || "Sticky Note",
      Name: "Comment",
      C: [1, 1, 0],
      Open: false,
    });

    const annotationRef = pdfDoc.context.register(annotationDict);

    let annots = page.node.lookup(PDFName.of("Annots"));
    if (!annots) {
      annots = pdfDoc.context.obj([annotationRef]);
      page.node.set(PDFName.of("Annots"), annots);
    } else {
      annots.push(annotationRef);
    }
  });

  return pdfDoc.save();
}
