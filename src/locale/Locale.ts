import { parse, stringify } from 'bcp-47';

import { ParsedLocale } from '../types/locale';

const defaultLocale = 'und';

export class Locale {
	readonly locale: ParsedLocale;
	readonly parseError: Error;

	/**
	 * This is a manually crafted list of likely subtags corresponding
	 * to the Unicode CLDR likelySubtags dataset.
	 *
	 * This list is curated by the Tradeshift Globalization Team and is
	 * intended to be used in place of the full likelySubtags list in use cases
	 * where full list cannot be (for example, due to the size).
	 *
	 * This version of the list is based on CLDR 36:
	 * https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/likelySubtags.json
	 */
	private static readonly reducedLikelySubtags: {} = {
		ar: 'ar-Arab-EG',
		'az-arab': 'az-Arab-IR',
		'az-ir': 'az-Arab-IR',
		da: 'da-Latn-DK',
		de: 'de-Latn-DE',
		el: 'el-Grek-GR',
		en: 'en-Latn-US',
		es: 'es-Latn-ES',
		fa: 'fa-Arab-IR',
		fi: 'fi-Latn-FI',
		fr: 'fr-Latn-FR',
		he: 'he-Hebr-IL',
		hu: 'hu-Latn-HU',
		it: 'it-Latn-IT',
		ja: 'ja-Jpan-JP',
		ko: 'ko-Kore-KR',
		'ms-cc': 'ms-Arab-CC',
		'ms-id': 'ms-Arab-ID',
		ms: 'ms-Latn-MY',
		nl: 'nl-Latn-NL',
		pl: 'pl-Latn-PL',
		pt: 'pt-Latn-BR',
		ro: 'ro-Latn-RO',
		sk: 'sk-Latn-SK',
		'sr-ru': 'sr-Latn-RU',
		sr: 'sr-Cyrl-RS',
		sv: 'sv-Latn-SE',
		uk: 'uk-Cyrl-UA',
		vi: 'vi-Latn-VN',
		'zh-gb': 'zh-Hant-GB',
		'zh-hant': 'zh-Hant-TW',
		'zh-hk': 'zh-Hant-HK',
		'zh-us': 'zh-Hant-US',
		zh: 'zh-Hans-CN'
	};

	public static ROOT: Locale = new Locale(defaultLocale);

	public static forLanguageTag(locale: string = defaultLocale): Locale {
		return new Locale(locale);
	}

	constructor(locale: string = defaultLocale) {
		const defaultParsedLocale = parse(defaultLocale);

		if (typeof locale !== 'string' || locale === '') {
			this.locale = defaultParsedLocale;
			return;
		}

		let parseError;
		try {
			this.locale = parse(locale, {
				warning: msg => {
					parseError = msg;
				}
			});
		} catch (e) {
			this.locale = defaultParsedLocale;
			this.parseError = e;
		}

		if (parseError) {
			this.locale = defaultParsedLocale;
			this.parseError = new Error(parseError);
		}
	}

	public getLanguage(): string | void {
		if (!this.locale) {
			return null;
		}

		const { language } = this.locale;
		return language ?? null;
	}

	public getRegion(): string | void {
		if (!this.locale) {
			return null;
		}

		return this.locale.region ?? null;
	}

	public setLanguageTag(languageTag: string): Locale {
		return new Locale(languageTag);
	}

	/**
	 * @deprecated replaced by setRegion(region: string)
	 */
	public withRegion(region: string): Locale {
		return this.setRegion(region);
	}

	public setRegion(region: string): Locale {
		const upperRegion = region.toUpperCase();
		this.locale.region = upperRegion;
		return new Locale(stringify(this.locale));
	}

	public maximize(): Locale {
		const likely = Locale.reducedLikelySubtags[stringify(this.locale).toLowerCase()];
		if (likely) {
			return new Locale(likely);
		}

		return this;
	}

	public hasParseError(): boolean {
		return this.parseError !== undefined;
	}

	public toString(): string {
		return stringify(this.locale);
	}
}
