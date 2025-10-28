import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "truncate",
    standalone: true,
})
export class TruncatePipe implements PipeTransform {
    transform(value: string | null | undefined, limit = 100, ellipsis = "..."): string {
        if (!value) return "";
        const str = String(value);
        if (str.length <= limit) return str;
        return str.slice(0, limit).trimEnd() + ellipsis;
    }
}
