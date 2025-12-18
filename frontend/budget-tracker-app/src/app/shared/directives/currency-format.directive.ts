import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[appCurrencyFormat]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyFormatDirective),
      multi: true
    }
  ]
})
export class CurrencyFormatDirective implements ControlValueAccessor {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: any): void {
    // Form'dan gelen değeri input'a yaz
    const formattedValue = this.formatCurrency(value);
    this.el.nativeElement.value = formattedValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    // Kullanıcı yazarken sadece rakam ve virgülü kabul et
    let numericValue = value.replace(/[^\d,]/g, '');

    // Virgülü noktaya çevir (ondalık için)
    numericValue = numericValue.replace(',', '.');

    // Sayıya çevir
    const numberValue = parseFloat(numericValue) || 0;

    // Form'a düz sayı olarak gönder
    this.onChange(numberValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();

    // Blur olduğunda formatı uygula
    const currentValue = this.el.nativeElement.value;
    const numericValue = parseFloat(currentValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const formattedValue = this.formatCurrency(numericValue);
    this.el.nativeElement.value = formattedValue;
  }

  @HostListener('focus')
  onFocus(): void {
    // Focus olduğunda formatı kaldır, sadece sayıyı göster
    const currentValue = this.el.nativeElement.value;
    const numericValue = parseFloat(currentValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0;

    // Eğer 0 değilse düz sayı olarak göster
    if (numericValue !== 0) {
      this.el.nativeElement.value = numericValue.toString();
    } else {
      this.el.nativeElement.value = '';
    }
  }

  private formatCurrency(value: any): string {
    if (!value && value !== 0) return '';

    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';

    // Türkçe formatlama: 13000 -> 13.000
    return num.toLocaleString('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}
