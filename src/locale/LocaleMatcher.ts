import { Locale } from './Locale';

/**
 * Provides language negotiation logic.
 */
class LocaleMatcher {
	/**
	 * Matches the best locale. Differently than regular locale matching, this
	 * algorithm prefers to match the *region* before matching on the language.
	 *
	 * @return the best locale or new Locale('und')
	 */
	public static negotiatePreferRegion(key: Locale, candidates: Array<Locale>): Locale;
	public static negotiatePreferRegion(key: string, candidates: Array<string>): Locale;
	public static negotiatePreferRegion(key, candidates): Locale {
		key = new Locale(key);
		candidates = candidates.map(c => new Locale(c));

		const results = [
			LocaleMatcher.getDirectMatch(key, candidates),
			LocaleMatcher.getRegionMatch(key, candidates),
			// in case it did not find a match by region (getRegionMatch)
			// and the language part of the input is 'und',
			// the best locale will certainly be Locale.ROOT.
			//
			// Otherwise it could match, with 'getLanguageMatch',
			// another label with the language part 'und' but with a more specific region,
			// which is not the desired behavior
			//
			// E.g.:  input: 'und' matches language part of 'und-150'
			LocaleMatcher.getRootLanguageMatch(key),
			LocaleMatcher.getLanguageMatch(key, candidates)
		].filter(x => x);

		if (results.length > 0) {
			return results[0];
		}

		return Locale.ROOT;
	}

	/**
	 * Matches the best locale by splitting locale subtags
	 *
	 * @return the best locale or new Locale('und')
	 */
	public static negotiate(key: Locale, candidates: Array<Locale>): Locale;
	public static negotiate(key: string, candidates: Array<string>): Locale;
	public static negotiate(key, candidates): Locale {
		key = new Locale(key);
		candidates = candidates.map(c => new Locale(c));

		const candidatesWithDefault = [...candidates, Locale.ROOT];
		const everyKey = LocaleMatcher.getSplitLocales([key]);

		for (const currentKey of everyKey) {
			for (const candidate of candidatesWithDefault) {
				if (candidate.toString() === currentKey.toString()) {
					return currentKey;
				}
			}
		}

		// Match was not found, so will try again with the maximized version,
		// only if there exists a maximized version.
		const maximized = key.maximize();
		if (maximized.toString() !== key.toString()) {
			return LocaleMatcher.negotiate(maximized, candidates);
		}

		return Locale.ROOT;
	}

	/**
	 * Unravels possible parent tags for a given set of
	 * locales by stripping the subtags
	 *
	 * E.g.: input: ['pt-BR'] -> output: ['pt-BR', 'pt']
	 */
	private static getSplitLocales(desiredLocales: Array<Locale>): Array<Locale> {
		let candidates = Array<string>();

		desiredLocales.forEach(locale => {
			let localeCandidates = Array<string>();
			locale
				.toString()
				.split('-')
				.forEach((part, i) => {
					if (i === 0) {
						localeCandidates = [...localeCandidates, part];
						return;
					}

					localeCandidates = [...localeCandidates, `${localeCandidates[i - 1]}-${part}`];
				});

			const reversed = [...localeCandidates].reverse();
			candidates = [...candidates, ...reversed];
		});

		const converted = candidates
			.map(candidate => new Locale(candidate))
			.filter(l => !l.hasParseError());

		return Array.from(new Set(converted));
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
		if (input.getLanguage() === Locale.ROOT.getLanguage()) {
			return Locale.ROOT;
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

export const { negotiate, negotiatePreferRegion } = LocaleMatcher;
