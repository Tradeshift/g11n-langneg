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

	describe('instantiation', () => {
		it('defaults to "und" when instantiating with no params', async () => {
			expect(new Locale().toString()).toBe('und');
		});
	});

	describe('toString()', () => {
		it('new Locale() stringifies to input locale', async () => {
			everyLocale.forEach(locale => {
				const l = new Locale(locale);
				expect(l.toString()).toBe(locale);
			});
		});
	});

	describe('setRegion', () => {
		const regions = ['001', 'ar', 'AR', 'BR', 'DE', 'ES'];

		it('should append region suffix to language-only locales (es -> es-{REGION})', async () => {
			languageLocales.forEach(locale => {
				const l: Locale = new Locale(locale);

				regions.forEach(region => {
					const expectedLocale = `${locale}-${region.toUpperCase()}`;
					expect(l.setRegion(region).toString()).toBe(expectedLocale);
				});
			});
		});

		it('should replace region suffix of language+region locales (es-AR -> es-{REGION})', async () => {
			languageRegionLocales.forEach(locale => {
				const l: Locale = new Locale(locale);

				regions.forEach(region => {
					const localeParts = locale.split('-');
					const language = localeParts[0];

					const expectedLocale = `${language}-${region.toUpperCase()}`;
					expect(l.setRegion(region).toString()).toBe(expectedLocale);
				});
			});
		});

		it('should replace region suffix of language+script+region locales (pt-Latn-BR -> pt-Latn-{REGION})', async () => {
			languageScriptRegionLocales.forEach(locale => {
				const l: Locale = new Locale(locale);

				regions.forEach(region => {
					const localeParts = locale.split('-');
					const language = localeParts[0];
					const script = localeParts[1];

					const expectedLocale = `${language}-${script}-${region.toUpperCase()}`;
					expect(l.setRegion(region).toString()).toBe(expectedLocale);
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
				const l: Locale = new Locale(locale);
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
				const l: Locale = new Locale(languageTag);
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
				const l: Locale = new Locale(locale);
				expect(l.getRegion()).toBeNull();
			});
		});
	});
});
