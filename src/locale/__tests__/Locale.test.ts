import { Locale } from '../Locale';

describe('Locale', () => {
	const languageLocales: Array<string> = ['en', 'es', 'pt'];
	const languageRegionLocales: Array<string> = ['en-US', 'es-AR', 'pt-PT'];
	const languageRegionVariantsLocales: Array<string> = ['pt-BR-ao1990'];
	const languageScriptLocales: Array<string> = ['en-Latn', 'pt-Latn', 'zh-Hans'];
	const languageScriptRegionLocales: Array<string> = ['pt-Latn-BR', 'zh-Hans-CN'];
	const languageScriptRegionVariantsLocales: Array<string> = ['pt-Latn-BR-ao1990'];
	const languageScriptVariantLocales: Array<string> = ['en-Latn-macos', 'zh-Hans-posix'];
	const languageVariantLocales: Array<string> = ['en-macos', 'zh-posix'];

	const everyLocale: Array<string> = [
		...languageLocales,
		...languageRegionLocales,
		...languageRegionVariantsLocales,
		...languageScriptLocales,
		...languageScriptRegionLocales,
		...languageScriptRegionVariantsLocales,
		...languageScriptVariantLocales,
		...languageVariantLocales
	];

	describe('parsing (strict and lenient)', () => {
		it('superfluous content tags (throws error on strict mode)', () => {
			['xx-YY-w-ZZZZZ---', 'aa---BB', 'aa-BB-!'].forEach(tag => {
				expect(() => Locale.parseStrict(tag)).toThrow('Found superfluous content after tag');

				expect(() => Locale.parse(tag)).not.toThrow();
				expect(Locale.parse(tag).toString()).toBe(Locale.ROOT.toString());
			});
		});

		it('too many subtags (throws error on strict mode)', () => {
			['aa-bbb-ccc-ddd-eee'].forEach(tag => {
				expect(() => Locale.parseStrict(tag)).toThrow(
					'Too many extended language subtags, expected at most 3 subtags'
				);

				expect(() => Locale.parse(tag)).not.toThrow();
				expect(Locale.parse(tag).toString()).toBe(Locale.ROOT.toString());
			});
		});

		it('too long extension (throws error on strict mode)', () => {
			['en-i-abcdefghi'].forEach(tag => {
				expect(() => Locale.parseStrict(tag)).toThrow(
					'Too long extension, expected at most 8 characters'
				);

				expect(() => Locale.parse(tag)).not.toThrow();
				expect(Locale.parse(tag).toString()).toBe(Locale.ROOT.toString());
			});
		});
	});
	describe('toString()', () => {
		it('parsing stringifies to input locale', async () => {
			everyLocale.forEach(locale => {
				const lenient: Locale = Locale.parseStrict(locale);
				expect(lenient.toString()).toBe(locale);

				const strict: Locale = Locale.parse(locale);
				expect(strict.toString()).toBe(locale);
			});
		});
	});

	describe('setRegion', () => {
		const regions: string[] = ['001', 'ar', 'AR', 'BR', 'DE', 'ES'];

		it('should append region suffix to language-only locales (es -> es-{REGION})', async () => {
			languageLocales.forEach(locale => {
				const lenient: Locale = Locale.parse(locale);
				const strict: Locale = Locale.parseStrict(locale);

				regions.forEach(region => {
					const expectedLocale = `${locale}-${region.toUpperCase()}`;
					expect(lenient.setRegion(region).toString()).toBe(expectedLocale);
					expect(strict.setRegion(region).toString()).toBe(expectedLocale);
				});
			});
		});

		it('should replace region suffix of language+region locales (es-AR -> es-{REGION})', async () => {
			languageRegionLocales.forEach(locale => {
				const lenient: Locale = Locale.parse(locale);
				const strict: Locale = Locale.parseStrict(locale);

				regions.forEach(region => {
					const localeParts = locale.split('-');
					const language = localeParts[0];

					const expectedLocale = `${language}-${region.toUpperCase()}`;
					expect(lenient.setRegion(region).toString()).toBe(expectedLocale);
					expect(strict.setRegion(region).toString()).toBe(expectedLocale);
				});
			});
		});

		it('should replace region suffix of language+script+region locales (pt-Latn-BR -> pt-Latn-{REGION})', async () => {
			languageScriptRegionLocales.forEach(locale => {
				const lenient: Locale = Locale.parse(locale);
				const strict: Locale = Locale.parseStrict(locale);

				regions.forEach(region => {
					const localeParts = locale.split('-');
					const language = localeParts[0];
					const script = localeParts[1];

					const expectedLocale = `${language}-${script}-${region.toUpperCase()}`;
					expect(lenient.setRegion(region).toString()).toBe(expectedLocale);
					expect(strict.setRegion(region).toString()).toBe(expectedLocale);
				});
			});
		});
	});

	describe('getRegion()', () => {
		it('locales with region should return length 2 string', async () => {
			[
				...languageRegionLocales,
				...languageRegionVariantsLocales,
				...languageScriptRegionLocales,
				...languageScriptRegionVariantsLocales
			].forEach(locale => {
				let l: Locale = Locale.parse(locale);
				expect(l.getRegion()).not.toBeNull();
				expect(l.getRegion() as string).toHaveLength(2);

				l = Locale.parseStrict(locale);
				expect(l.getRegion()).not.toBeNull();
				expect(l.getRegion() as string).toHaveLength(2);
			});
		});

		it('hand-picked locales with region should return expected region', async () => {
			[
				['en-Latn-macos', null],
				['es-Latn-AR', 'AR'],
				['es', null],
				['pt-BR-ao1990', 'BR'],
				['pt-BR-u-fw-mon', 'BR'],
				['pt-PT', 'PT'],
				['und-EN', 'EN']
			].forEach(entry => {
				const [languageTag, expectedRegion] = entry;
				let l: Locale = Locale.parse(languageTag);
				expect(l.getRegion()).toBe(expectedRegion);

				l = Locale.parseStrict(languageTag);
				expect(l.getRegion()).toBe(expectedRegion);
			});
		});

		it('locales without region should return null', async () => {
			[
				...languageLocales,
				...languageScriptLocales,
				...languageVariantLocales,
				...languageScriptVariantLocales
			].forEach(locale => {
				let l: Locale = Locale.parse(locale);
				expect(l.getRegion()).toBeNull();

				l = Locale.parseStrict(locale);
				expect(l.getRegion()).toBeNull();
			});
		});
	});
});
