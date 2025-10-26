/// <reference types="jasmine" />
import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
    const pipe = new TruncatePipe();

    it('returns the same short string without ellipsis', () => {
        const short = 'Short text';
        expect(pipe.transform(short, 20)).toBe(short);
    });

    it('truncates long strings and appends ellipsis', () => {
        const long = 'a'.repeat(200);
        const out = pipe.transform(long, 50, '...');
        expect(out.length).toBeLessThanOrEqual(53);
        expect(out.endsWith('...')).toBeTrue();
    });
});
