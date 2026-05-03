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
  ctx.fillStyle = '#fbfbfb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw notebook lines (Blue)
  ctx.strokeStyle = 'rgba(0, 100, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let y = padding + 40; y < canvas.height - padding; y += 40 * style.lineHeight) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw Vertical Margin (Red)
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding * 1.5, 0);
  ctx.lineTo(padding * 1.5, canvas.height);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = `${24 * style.strokeWeight}px ${style.fontFamily}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const lines = text.split('\n');
  const startX = padding * 1.5 + 20;
  let x = startX;
  let y = padding + 10;

  for (const line of lines) {
    const words = line.split(' ');
    
    for (const word of words) {
      if (!word) continue;

      const wordMetrics = ctx.measureText(word + ' ');
      const wordWidth = wordMetrics.width * style.spacing;
      
      if (x + wordWidth > maxWidth) {
        x = startX;
        y += 40 * style.lineHeight;
      }

      if (y > canvas.height - padding) break;

      // Render each character individually for organic feel
      for (const char of word) {
        const charMetrics = ctx.measureText(char);
        const charWidth = charMetrics.width * style.spacing;

        ctx.save();
        
        // Organic variations per character
        const jitterX = (Math.random() - 0.5) * style.jitter;
        const jitterY = (Math.random() - 0.5) * style.jitter;
        const rotation = (Math.random() - 0.5) * (style.jitter * 0.03);
        const slantRad = (style.slant * Math.PI) / 180;
        
        // Pressure simulation (random scale and opacity)
        const scale = 1 + (Math.random() - 0.5) * (style.jitter * 0.04);
        const alpha = 0.85 + Math.random() * 0.15;
        
        ctx.translate(x + jitterX, y + jitterY);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.transform(1, 0, Math.tan(slantRad), 1, 0, 0);
        
        ctx.globalAlpha = alpha;

        // Draw shadow for subtle "ink depth"
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = style.jitter * 0.5;
        
        // Render character
        ctx.fillText(char, 0, 0);
        
        // Optional: Second pass for "ink bleed" if jitter is high
        if (style.jitter > 3) {
          ctx.globalAlpha = 0.15;
          ctx.fillText(char, 0.4, 0.4);
        }
        
        ctx.restore();
        x += charWidth;
      }
      
      // Add space after word
      x += ctx.measureText(' ').width * style.spacing;
    }

    // Move to next line after processing all words in the line
    x = startX;
    y += 40 * style.lineHeight;
    if (y > canvas.height - padding) break;
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
