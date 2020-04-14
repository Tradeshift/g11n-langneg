import { Locale } from './Locale';
import { LocaleMatcherDefault, LocaleMatcherPreferRegion } from './matchers';

export enum MatchStrategy {
	Default = 0,
	PreferRegion
}

export interface Matcher {
	match(key: Locale, candidates: Locale[]): Locale;
	match(key: string, candidates: string[]): Locale;
	match(key: any, candidates: any): Locale;
}

/**
 * Provides language negotiation logic.
 */
export class LocaleMatcher {
	private static DEFAULT = new LocaleMatcherDefault();

	public static withStrategy(strategy: MatchStrategy): Matcher {
		switch (strategy) {
			case MatchStrategy.Default:
				return LocaleMatcher.DEFAULT;
			case MatchStrategy.PreferRegion:
				return new LocaleMatcherPreferRegion();
			default:
				throw new Error(`Unexpected strategy: "${strategy}"`);
		}
	}

	public static match(key: Locale, candidates: Array<Locale>): Locale;
	public static match(key: string, candidates: Array<string>): Locale;
	public static match(key, candidates): Locale {
		return LocaleMatcher.DEFAULT.match(key, candidates);
	}
}

export default LocaleMatcher;
export const match = LocaleMatcher.match;
