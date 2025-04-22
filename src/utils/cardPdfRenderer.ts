import { jsPDF } from "jspdf";

export interface CardElement {
  id: string;
  type: string;
  content: string;
  style: any;
  dynamic?: boolean;
  fieldName?: string;
}

export interface CardData {
  name: string;
  canvasSize: { width: number; height: number };
  elements: CardElement[];
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function renderCardToPDF(card: CardData, pdf?: jsPDF): Promise<jsPDF> {
  const { canvasSize, elements } = card;
  const width = canvasSize.width;
  const height = canvasSize.height;
  let doc = pdf;
  if (!doc) {
    doc = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "pt",
      format: [width, height],
      precision: 4,
      putOnlyUsedFonts: true,
      compress: false
    });
  } else {
    doc.addPage([width, height], width > height ? "landscape" : "portrait");
    doc.setPage(doc.getNumberOfPages());
  }

  for (const el of elements) {
    if (el.type === "image" && el.content) {
      try {
        const img = await loadImage(el.content);
        doc.addImage(
          img,
          "PNG",
          el.style.x || 0,
          el.style.y || 0,
          el.style.width || img.width,
          el.style.height || img.height
        );
      } catch (e) {
        // Ignore image load errors
      }
    } else if (el.type === "text" && el.content) {
      doc.setFont(el.style.fontFamily || "helvetica", "normal");
      doc.setFontSize(el.style.fontSize || 12);
      doc.setTextColor(el.style.color || "#000000");
      if (el.style.fontWeight === "bold" || el.style.fontWeight === "600") {
        doc.setFont(undefined, "bold");
      }
      let align: "left" | "center" | "right" = "left";
      if (el.style.textAlign === "center") align = "center";
      if (el.style.textAlign === "right") align = "right";
      doc.text(
        el.content,
        (el.style.x || 0) + (align === "center" ? (el.style.width || 0) / 2 : 0),
        (el.style.y || 0) + (el.style.fontSize || 12),
        { align: align, maxWidth: el.style.width || undefined }
      );
    }
    // Add more element types if needed
  }
  return doc;
}