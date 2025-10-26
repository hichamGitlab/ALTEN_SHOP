import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "formatPrice",
    standalone: true,
})
export class FormatPricePipe implements PipeTransform {
    transform(value: number | null | undefined, currency = "€", locale = "fr-FR"): string {
        if (value == null || isNaN(Number(value))) return "";
        try {
            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency: currency,
                maximumFractionDigits: 2,
            }).format(Number(value));
        } catch (e) {
            // Fallback
            return `${value} ${currency}`;
        }
    }
}
