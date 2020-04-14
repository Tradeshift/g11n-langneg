import { Locale } from '../Locale';
import { Matcher } from '../LocaleMatcher';

class LocaleMatcherPreferRegion implements Matcher {
	/**
	 * Matches the best locale. Differently than regular locale matching, this
	 * algorithm prefers to match the *region* before matching on the language.
	 *
	 * @return the best locale or new Locale('und')
	 */
	public match(key: Locale, candidates: Locale[]): Locale;
	public match(key: string, candidates: string[]): Locale;
	public match(key: any, candidates: any): Locale;
	public match(key: any, candidates: any) {
		if (candidates.length === 0) {
			throw new Error('Candidate list must not be empty');
		}

		key = Locale.parse(key);
		candidates = candidates.map(c => Locale.parse(c));

		const results = [
			LocaleMatcherPreferRegion.getDirectMatch(key, candidates),
			LocaleMatcherPreferRegion.getRegionMatch(key, candidates),
			// in case it did not find a match by region (getRegionMatch)
			// and the language part of the input is 'und',
			// the best locale will certainly be Locale.rootLocale.
			//
			// Otherwise it could match, with 'getLanguageMatch',
			// another label with the language part 'und' but with a more specific region,
			// which is not the desired behavior
			//
			// E.g.:  input: 'und' matches language part of 'und-150'
			LocaleMatcherPreferRegion.getRootLanguageMatch(key),
			LocaleMatcherPreferRegion.getLanguageMatch(key, candidates)
		].filter(x => x);

		if (results.length > 0) {
			return results[0];
		}

		return candidates[0];
	}

	private static getDirectMatch(input: Locale, candidates: Array<Locale>): Locale {
		let best: Locale;
		candidates.forEach(candidate => {
			if (input.toString() === candidate.toString()) {
				best = candidate;
			}
		});
		return best;
	}

	private static getRegionMatch(input: Locale, candidates: Array<Locale>): Locale {
		let best: Locale;

		// doesn't apply if there's no region
		if (input.getRegion() === null) {
			return null;
		}

		candidates.forEach(candidate => {
			// doesn't apply if there's no region
			if (candidate.getRegion() === null) {
				// fall through
			} else if (input.getRegion() === candidate.getRegion()) {
				best = candidate;
			}
		});
		return best;
	}

	private static getRootLanguageMatch(input: Locale): Locale {
		if (input.getLanguage() === Locale.rootLocale.getLanguage()) {
			return Locale.rootLocale;
		}

		return null;
	}

	private static getLanguageMatch(input: Locale, candidates: Array<Locale>): Locale {
		let best: Locale;

		candidates.forEach(candidate => {
			if (input.getLanguage() === candidate.getLanguage()) {
				best = candidate;
			}
		});

		return best;
	}
}

export default LocaleMatcherPreferRegion;
