import { Locale } from '../Locale';
import { negotiate, negotiatePreferRegion } from '../LocaleMatcher';

describe('LocaleMatcher', () => {
	describe('negotiatePreferRegion', () => {
		it('returns root locale in case no match is found', () => {
			const locale = new Locale('pt');
			const candidates = [new Locale('da'), new Locale('es')];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(Locale.ROOT);
		});

		it('finds direct matches', () => {
			let locale = new Locale('pt');
			let candidates = [new Locale('da'), new Locale('es'), new Locale('pt')];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(new Locale('pt'));

			locale = new Locale('es');
			candidates = [new Locale('da'), new Locale('es'), new Locale('pt')];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(new Locale('es'));

			locale = new Locale('da');
			candidates = [new Locale('da'), new Locale('es'), new Locale('pt')];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(new Locale('da'));
		});

		it('prefers locales with more specific regions, if available', () => {
			let locale = new Locale('und-BR');
			let candidates = [new Locale('en-BR'), new Locale('pt')];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(new Locale('en-BR'));

			locale = new Locale('und-BR');
			candidates = [new Locale('en'), new Locale('en-US'), new Locale('pt-Latn-BR')];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(new Locale('pt-Latn-BR'));

			locale = new Locale('und-BR');
			candidates = [new Locale('en'), new Locale('pt')];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(Locale.ROOT);
		});

		it('also accepts plain strings as input', () => {
			let locale = 'und-BR';
			let candidates = ['en', 'pt-Latn-BR'];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(new Locale('pt-Latn-BR'));

			locale = 'pt';
			candidates = ['es', 'pt-Latn-BR'];
			expect(negotiatePreferRegion(locale, candidates)).toEqual(new Locale('pt-Latn-BR'));
		});
	});

	describe('negotiate', () => {
		it('returns root locale in case no match is found', () => {
			const locale = new Locale('pt');
			const candidates = [new Locale('da'), new Locale('es')];
			expect(negotiate(locale, candidates)).toEqual(Locale.ROOT);
		});

		it('finds direct matches', () => {
			let locale = new Locale('pt');
			let candidates = [new Locale('da'), new Locale('es'), new Locale('pt')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt'));

			locale = new Locale('es');
			candidates = [new Locale('da'), new Locale('es'), new Locale('pt')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('es'));

			locale = new Locale('da');
			candidates = [new Locale('da'), new Locale('es'), new Locale('pt')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('da'));
		});

		it('prefers more specific locales, if available', () => {
			let locale = new Locale('pt');
			let candidates = [new Locale('pt'), new Locale('pt-BR'), new Locale('pt-BR-ao1990')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt'));

			locale = new Locale('pt-BR');
			candidates = [new Locale('pt'), new Locale('pt-BR'), new Locale('pt-BR-ao1990')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt-BR'));

			locale = new Locale('pt-BR-ao1990');
			candidates = [new Locale('pt'), new Locale('pt-BR'), new Locale('pt-BR-ao1990')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt-BR-ao1990'));

			locale = new Locale('pt-BR-ao1990-x-macos');
			candidates = [new Locale('pt'), new Locale('pt-BR'), new Locale('pt-BR-ao1990')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt-BR-ao1990'));
		});

		it('matches available maximized versions (direct matches preferred)', () => {
			let locale = new Locale('zh');
			let candidates = [new Locale('zh-Hans-CN')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('zh-Hans-CN'));

			locale = new Locale('zh'); // direct match will be preferred
			candidates = [new Locale('zh-Hans-CN'), new Locale('zh')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('zh'));

			locale = new Locale('pt');
			candidates = [new Locale('pt-Latn'), new Locale('pt-Latn-BR')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt-Latn-BR'));
		});

		it('handles language tags with variants and extensions', () => {
			let locale = new Locale('pt-BR-ao1990');
			let candidates = [new Locale('da'), new Locale('es'), new Locale('pt')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt'));

			locale = new Locale('en-DE-u-co-phonebk');
			candidates = [new Locale('es'), new Locale('da'), new Locale('en')];
			expect(negotiate(locale, candidates)).toEqual(new Locale('en'));
		});

		it('also accepts plain strings as input', () => {
			let locale = 'pt';
			let candidates = ['da', 'es', 'pt'];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt'));

			locale = 'pt';
			candidates = ['es', 'pt-Latn-BR'];
			expect(negotiate(locale, candidates)).toEqual(new Locale('pt-Latn-BR'));
		});
	});
});
