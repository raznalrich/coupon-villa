import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs/operators';


// ── Font option model ────────────────────────────────────────────────────────
export interface FontOption {
  label: string;      // Display name shown in font card and preview caption
  value: string;      // Unique key for tracking
  className: string;  // CSS class applied to the preview text element
  multiplier: number; // Price multiplier applied on top of base rate
  sample: string;     // Text shown inside the font card as a preview sample
}
@Component({
  selector: 'app-neon-cutomizer',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './neon-cutomizer.html',
  styleUrl: './neon-cutomizer.scss',
})
export class NeonCutomizer {
  readonly baseRate = 180; // ₹ per letter — adjust as needed
  readonly whatsappNumber = '+917593016782'; // replace with real number

  // ── Available font options ─────────────────────────────────────────────────
  readonly fonts: FontOption[] = [
    { label: 'Signature Script', value: 'signature-script', className: 'font-signature-script', multiplier: 1.00, sample: 'Neon Love' },
    { label: 'Bold Script',      value: 'bold-script',      className: 'font-signature-bold',   multiplier: 1.08, sample: 'Neon Love' },
    { label: 'Arcade',           value: 'arcade',           className: 'font-arcade',           multiplier: 1.15, sample: 'Glow Zone' },
    { label: 'Vintage Serif',    value: 'vintage-serif',    className: 'font-vintage',          multiplier: 1.12, sample: 'Luna Bar'  },
    { label: 'Outline Neon',     value: 'outline-neon',     className: 'font-outline',          multiplier: 1.20, sample: 'Party'    }
  ];

  // ── Form control ───────────────────────────────────────────────────────────
  readonly textControl = new FormControl('Raznal', { nonNullable: true });

  // ── Selected font signal ───────────────────────────────────────────────────
  readonly selectedFont = signal<FontOption>(this.fonts[0]);

  // ── Convert form control value to a signal ────────────────────────────────
  private readonly rawText = toSignal(
    this.textControl.valueChanges.pipe(startWith(this.textControl.value)),
    { initialValue: this.textControl.value }
  );

  // ── Derived computed state ─────────────────────────────────────────────────

  /** Sanitised text — trimmed leading spaces, collapse multiple spaces */
  readonly cleanText = computed(() =>
    (this.rawText() ?? '').replace(/\s+/g, ' ').trimStart().slice(0, 20)
  );

  /** Text shown in the neon preview — fallback to placeholder when empty */
  readonly previewText = computed(() =>
    this.cleanText().trim() || 'Your Name'
  );

  /** Count only non-space characters */
  readonly letterCount = computed(() =>
    this.cleanText().replace(/\s/g, '').length
  );

  /** Estimated price rounded to nearest rupee */
  readonly totalPrice = computed(() =>
    Math.round(this.letterCount() * this.baseRate * this.selectedFont().multiplier)
  );

  /** Human-readable size estimate based on character count */
  readonly estimatedSize = computed(() => {
    const count = this.letterCount();
    if (count === 0)  return 'Enter a name';
    if (count <= 5)   return 'Compact sign';
    if (count <= 10)  return 'Medium sign';
    if (count <= 15)  return 'Wide sign';
    return 'Extra wide sign';
  });

  /** WhatsApp URL pre-filled with text, font, and price */
  readonly whatsappLink = computed(() => {
    const text = this.previewText();
    const font = this.selectedFont().label;
    const price = this.totalPrice();
    const message = `Hi, I want to order a custom neon sign!\n\nText: "${text}"\nFont style: ${font}\nEstimated price: ₹${price}\n\nPlease confirm and share the order details.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  });

  // ── Event handlers ─────────────────────────────────────────────────────────

  /** Set selected font from font card radio group */
  setFont(font: FontOption): void {
    this.selectedFont.set(font);
  }

  /** Reset form to initial state */
  resetCustomizer(): void {
    this.textControl.setValue('Raznal');
    this.selectedFont.set(this.fonts[0]);
  }
}
