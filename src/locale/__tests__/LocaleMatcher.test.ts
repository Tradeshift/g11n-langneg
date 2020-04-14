import { Locale } from '../Locale';
import LocaleMatcher, { match, MatchStrategy } from '../LocaleMatcher';

describe('LocaleMatcher', () => {
	describe('matchPreferRegion', () => {
		const matcherRegion = LocaleMatcher.withStrategy(MatchStrategy.PreferRegion);

		it('returns first candidate in case no match is found', () => {
			const locale = Locale.parse('pt');
			const candidates = [Locale.parse('da'), Locale.parse('es')];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('da'));
		});

		it('throws error is candidate array is empty', () => {
			const locale = Locale.parse('pt');
			const candidates = [];
			expect(() => matcherRegion.match(locale, candidates)).toThrow(
				'Candidate list must not be empty'
			);
		});

		it('finds direct matches', () => {
			let locale = Locale.parse('pt');
			let candidates = [Locale.parse('da'), Locale.parse('es'), Locale.parse('pt')];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('pt'));

			locale = Locale.parse('es');
			candidates = [Locale.parse('da'), Locale.parse('es'), Locale.parse('pt')];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('es'));

			locale = Locale.parse('da');
			candidates = [Locale.parse('da'), Locale.parse('es'), Locale.parse('pt')];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('da'));

			locale = Locale.parse('da-Latn');
			candidates = [Locale.parse('da'), Locale.parse('da-Latn'), Locale.parse('pt')];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('da-Latn'));

			locale = Locale.parse('pt-Latn-BR');
			candidates = [
				Locale.parse('da'),
				Locale.parse('da-Latn'),
				Locale.parse('pt'),
				Locale.parse('pt-Latn'),
				Locale.parse('pt-Latn-BR')
			];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('pt-Latn-BR'));

			locale = Locale.parse('pt-BR-ao1990-x-macos');
			candidates = [
				Locale.parse('pt'),
				Locale.parse('pt-BR'),
				Locale.parse('pt-BR-ao1990-x-macos'),
				Locale.parse('pt-BR-ao1990')
			];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('pt-BR-ao1990-x-macos'));
		});

		it('prefers locales with more specific regions, if available', () => {
			let locale = Locale.parse('und-BR');
			let candidates = [Locale.parse('en-BR'), Locale.parse('pt')];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('en-BR'));

			locale = Locale.parse('und-BR');
			candidates = [Locale.parse('en'), Locale.parse('en-US'), Locale.parse('pt-Latn-BR')];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('pt-Latn-BR'));

			locale = Locale.parse('und-BR');
			candidates = [Locale.parse('en'), Locale.parse('pt')];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.rootLocale);
		});

		it('also accepts plain strings as input', () => {
			let locale = 'und-BR';
			let candidates = ['en', 'pt-Latn-BR'];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('pt-Latn-BR'));

			locale = 'pt';
			candidates = ['es', 'pt-Latn-BR'];
			expect(matcherRegion.match(locale, candidates)).toEqual(Locale.parse('pt-Latn-BR'));
		});
	});

	describe('match', () => {
		it('returns first candidate in case no match is found', () => {
			const locale = Locale.parse('pt');
			const candidates = [Locale.parse('da'), Locale.parse('es')];
			expect(match(locale, candidates)).toEqual(Locale.parse('da'));
		});

		it('throws error is candidate array is empty', () => {
			const locale = Locale.parse('pt');
			const candidates = [];
			expect(() => match(locale, candidates)).toThrow('Candidate list must not be empty');
		});

		it('finds direct matches', () => {
			let locale = Locale.parse('pt');
			let candidates = [Locale.parse('da'), Locale.parse('es'), Locale.parse('pt')];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt'));

			locale = Locale.parse('es');
			candidates = [Locale.parse('da'), Locale.parse('es'), Locale.parse('pt')];
			expect(match(locale, candidates)).toEqual(Locale.parse('es'));

			locale = Locale.parse('da');
			candidates = [Locale.parse('da'), Locale.parse('es'), Locale.parse('pt')];
			expect(match(locale, candidates)).toEqual(Locale.parse('da'));

			locale = Locale.parse('da-Latn');
			candidates = [Locale.parse('da'), Locale.parse('da-Latn'), Locale.parse('pt')];
			expect(match(locale, candidates)).toEqual(Locale.parse('da-Latn'));

			locale = Locale.parse('pt-Latn-BR');
			candidates = [
				Locale.parse('da'),
				Locale.parse('da-Latn'),
				Locale.parse('pt'),
				Locale.parse('pt-Latn'),
				Locale.parse('pt-Latn-BR')
			];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt-Latn-BR'));

			locale = Locale.parse('pt-BR-ao1990-x-macos');
			candidates = [
				Locale.parse('pt'),
				Locale.parse('pt-BR'),
				Locale.parse('pt-BR-ao1990-x-macos'),
				Locale.parse('pt-BR-ao1990')
			];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt-BR-ao1990-x-macos'));
		});

		it('prefers more specific locales, if available', () => {
			let locale = Locale.parse('pt');
			let candidates = [Locale.parse('pt'), Locale.parse('pt-BR'), Locale.parse('pt-BR-ao1990')];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt'));

			locale = Locale.parse('pt-BR');
			candidates = [Locale.parse('pt'), Locale.parse('pt-BR'), Locale.parse('pt-BR-ao1990')];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt-BR'));

			locale = Locale.parse('pt-BR-ao1990');
			candidates = [Locale.parse('pt'), Locale.parse('pt-BR'), Locale.parse('pt-BR-ao1990')];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt-BR-ao1990'));

			locale = Locale.parse('pt-BR-ao1990-x-macos');
			candidates = [Locale.parse('pt'), Locale.parse('pt-BR'), Locale.parse('pt-BR-ao1990')];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt-BR-ao1990'));
		});

		it('matches available maximized versions (direct matches preferred)', () => {
			let locale = Locale.parse('zh');
			let candidates = [Locale.parse('zh-Hans-CN')];
			expect(match(locale, candidates)).toEqual(Locale.parse('zh-Hans-CN'));

			locale = Locale.parse('zh'); // direct match will be preferred
			candidates = [Locale.parse('zh-Hans-CN'), Locale.parse('zh')];
			expect(match(locale, candidates)).toEqual(Locale.parse('zh'));

			locale = Locale.parse('pt');
			candidates = [Locale.parse('pt-Latn'), Locale.parse('pt-Latn-BR')];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt-Latn-BR'));
		});

		it('handles language tags with variants and extensions', () => {
			let locale = Locale.parse('pt-BR-ao1990');
			let candidates = [Locale.parse('da'), Locale.parse('es'), Locale.parse('pt')];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt'));

			locale = Locale.parse('en-DE-u-co-phonebk');
			candidates = [Locale.parse('es'), Locale.parse('da'), Locale.parse('en')];
			expect(match(locale, candidates)).toEqual(Locale.parse('en'));
		});

		it('also accepts plain strings as input', () => {
			let locale = 'pt';
			let candidates = ['da', 'es', 'pt'];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt'));

			locale = 'pt';
			candidates = ['es', 'pt-Latn-BR'];
			expect(match(locale, candidates)).toEqual(Locale.parse('pt-Latn-BR'));
		});
	});
});
