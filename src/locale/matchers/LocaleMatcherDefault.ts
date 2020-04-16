import { Locale } from '../Locale';
import { Matcher } from '../LocaleMatcher';

class LocaleMatcherDefault implements Matcher {
	/**
	 * Matches the best locale by splitting subtags
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

		const candidatesWithDefault = [...candidates, Locale.ROOT];
		const everyKey = LocaleMatcherDefault.getSplitLocales([key]);

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
			return this.match(maximized, candidates);
		}

		return candidates[0];
	}

	/**
	 * Unravels possible parent tags for a given set of
	 * locales by stripping the subtags
	 *
	 * E.g.: input: ['pt-BR'] -> output: ['pt-BR', 'pt']
	 */
	protected static getSplitLocales(desiredLocales: Array<Locale>): Array<Locale> {
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
			.map(candidate => Locale.parse(candidate))
			.filter(l => !l.hasParseError());

		return Array.from(new Set(converted));
	}
}

export default LocaleMatcherDefault;
