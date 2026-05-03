import { jsPDF } from 'jspdf';

export interface RenderOptions {
  text: string;
  style: {
    slant: number;
    spacing: number;
    strokeWeight: number;
    jitter: number;
    fontFamily: string;
    lineHeight: number;
  };
  color: string;
  pageSize: 'a4' | 'letter';
}

export async function renderHandwriting(canvas: HTMLCanvasElement, options: RenderOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { text, style, color } = options;
  
  // Ensure font is loaded
  try {
    await document.fonts.load(`${24 * style.strokeWeight}px ${style.fontFamily}`);
  } catch (e) {
    console.warn("Font loading failed, falling back", e);
  }

  const padding = 60;
  const maxWidth = canvas.width - padding * 2;
  
  // Clear canvas with paper-like texture
  ctx.fillStyle = '#fdfdfb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw subtle lines if needed
  ctx.strokeStyle = 'rgba(0, 0, 100, 0.05)';
  ctx.lineWidth = 1;
  for (let y = padding + 40; y < canvas.height - padding; y += 40 * style.lineHeight) {
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }

  ctx.fillStyle = color;
  ctx.font = `${24 * style.strokeWeight}px ${style.fontFamily}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const words = text.split(' ');
  let x = padding;
  let y = padding + 10;

  for (const word of words) {
    const metrics = ctx.measureText(word + ' ');
    const wordWidth = metrics.width * style.spacing;

    if (x + wordWidth > maxWidth) {
      x = padding;
      y += 40 * style.lineHeight;
    }

    if (y > canvas.height - padding) break;

    ctx.save();
    // Apply slant and jitter
    const jitterX = (Math.random() - 0.5) * style.jitter;
    const jitterY = (Math.random() - 0.5) * style.jitter;
    const rad = (style.slant * Math.PI) / 180;
    
    ctx.translate(x + jitterX, y + jitterY);
    ctx.transform(1, 0, Math.tan(rad), 1, 0, 0);
    
    ctx.fillText(word, 0, 0);
    ctx.restore();

    x += wordWidth;
  }
}

export function exportToPDF(canvas: HTMLCanvasElement, filename: string = 'handwritten_note.pdf') {
  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });
  
  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}
