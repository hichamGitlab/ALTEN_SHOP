/// <reference types="jasmine" />
import { FormatPricePipe } from './format-price.pipe';

describe('FormatPricePipe', () => {
    const pipe = new FormatPricePipe();

    it('formats a number into a currency string containing the currency symbol', () => {
        const formatted = pipe.transform(65);
        expect(formatted).toBeTruthy();
        expect(formatted).toContain('€');
    });

    it('returns empty string for null/undefined/NaN', () => {
        expect(pipe.transform(null as any)).toBe('');
        expect(pipe.transform(undefined as any)).toBe('');
        expect(pipe.transform(NaN)).toBe('');
    });
});
