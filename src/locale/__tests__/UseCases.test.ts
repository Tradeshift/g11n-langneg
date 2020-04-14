import { Locale, LocaleMatcher, MatchStrategy, match } from '../../index';

describe('LocaleMatcher', () => {
	describe('possible uses', () => {
		it('matches from instance created withStrategy', () => {
			const matcher = LocaleMatcher.withStrategy(MatchStrategy.Default);
			expect(matcher.match('pt', ['en', 'pt', 'es'])).toEqual(Locale.parse('pt'));

			const matcherRegion = LocaleMatcher.withStrategy(MatchStrategy.PreferRegion);
			expect(matcherRegion.match('pt', ['en', 'pt', 'es'])).toEqual(Locale.parse('pt'));
		});

		it('matches from static "match"', () => {
			expect(match('pt', ['en', 'pt', 'es'])).toEqual(Locale.parse('pt'));
		});
	});
});
