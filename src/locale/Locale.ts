import { parse as parseTag, stringify } from 'bcp-47';

import { ParsedLocale } from '../types/locale';

const defaultLocale = 'und';

export class Locale {
	readonly locale: ParsedLocale;
	readonly parseError: Error;

	/**
	 * A subset of the CLDR Likely Subtags data,
	 * giving preference to most common locales with
	 * the intent of reducing lib size.
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
		'sr-rs': 'sr-Cyrl-RS',
		'sr-ru': 'sr-Latn-RU',
		sr: 'sr-Cyrl-RS',
		sv: 'sv-Latn-SE',
		uk: 'uk-Cyrl-UA',
		vi: 'vi-Latn-VN',
		'zh-cn': 'zh-Hans-CN',
		'zh-gb': 'zh-Hant-GB',
		'zh-hans': 'zh-Hans-CN',
		'zh-hant': 'zh-Hant-TW',
		'zh-hk': 'zh-Hant-HK',
		'zh-us': 'zh-Hant-US',
		zh: 'zh-Hans-CN'
	};

	public static ROOT: Locale = Locale.parse('und');

	public static forLanguageTag(locale: string = defaultLocale): Locale {
		return Locale.parse(locale);
	}

	private constructor(locale?: Locale);
	private constructor(locale?: string);
	private constructor(locale?) {
		if (locale instanceof Locale) {
			return locale;
		}

		const defaultParsedLocale = parseTag(defaultLocale);
		if (typeof locale !== 'string' || locale === '') {
			this.locale = defaultParsedLocale;
			this.parseError = new TypeError('Provided input type was unexpected');
			return;
		}

		let parseError;
		try {
			const parsed = parseTag(locale.toLowerCase().replace(/_/g, '-'), {
				warning: msg => {
					parseError = msg;
				}
			});

			this.locale = this.normalize(parsed);
		} catch (e) {
			this.locale = defaultParsedLocale;
			this.parseError = e;
		}

		if (parseError) {
			this.locale = defaultParsedLocale;
			this.parseError = new Error(parseError);
		}
	}

	public static parse(locale?: Locale): Locale;
	public static parse(locale?: string): Locale;
	public static parse(locale?): Locale {
		return new Locale(locale);
	}

	public static parseStrict(locale?: Locale): Locale;
	public static parseStrict(locale?: string): Locale;
	public static parseStrict(locale?): Locale {
		const l = new Locale(locale);
		if (l.parseError) {
			throw l.parseError;
		}

		return l;
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

	public getScript(): string | void {
		if (!this.locale) {
			return null;
		}

		const { script } = this.locale;
		return script ?? null;
	}

	public setLanguageTag(languageTag: string): Locale {
		return Locale.parse(languageTag);
	}

	public setRegion(region: string): Locale {
		const upperRegion = region.toUpperCase();
		this.locale.region = upperRegion;
		return Locale.parse(stringify(this.locale));
	}

	public setScript(script: string): Locale {
		script = script.toLowerCase();
		this.locale.script = script.charAt(0).toUpperCase() + script.slice(1);
		return Locale.parse(stringify(this.locale));
	}

	public maximize(): Locale {
		if (this.getScript() && this.getRegion()) {
			// short circuit, already maximized
			return this;
		}

		const likely =
			this.maximizeLanguageRegion() ?? this.maximizeLanguageScript() ?? this.maximizeLanguage();

		if (likely) {
			let maximized: Locale = Locale.parse(this.toString());
			const region = likely.getRegion();
			const script = likely.getScript();

			if (!this.getRegion() && region) {
				maximized = maximized.setRegion(region);
			}

			if (!this.getScript() && script) {
				maximized = maximized.setScript(script);
			}

			return maximized;
		}

		if (!this.getScript()) {
			return this.setScript('Latn');
		}

		return this;
	}

	private maximizeLanguageRegion(): Locale {
		if (!this.getRegion()) {
			return null;
		}

		const localeString = `${this.getLanguage()}-${this.getRegion()}`;
		const likely = Locale.reducedLikelySubtags[(localeString as string).toLowerCase()];
		if (likely) {
			return Locale.parse(likely);
		}

		return null;
	}

	private maximizeLanguageScript(): Locale {
		if (!this.getScript()) {
			return null;
		}

		const localeString = `${this.getLanguage()}-${this.getScript()}`;
		const likely = Locale.reducedLikelySubtags[(localeString as string).toLowerCase()];
		if (likely) {
			return Locale.parse(likely);
		}

		return null;
	}

	private maximizeLanguage(): Locale {
		const localeString = this.getLanguage();

		const likely = Locale.reducedLikelySubtags[(localeString as string).toLowerCase()];
		if (likely) {
			return Locale.parse(likely);
		}

		return null;
	}

	public hasParseError(): boolean {
		return this.parseError !== undefined;
	}

	public toString(): string {
		return stringify(this.locale);
	}

	/**
	 * Normalizes a parsed locale structure to the
	 * expected casing according to BCP-47.
	 *
	 * Expects ParsedLocale with all parts in lowercase.
	 *
	 * E.g.:
	 * - en-us -> un-US
	 * - pt-latn-br -> pt-Latn-BR
	 *
	 * @param parsed
	 */
	private normalize(parsed: ParsedLocale): ParsedLocale {
		if (parsed.script) {
			parsed.script = parsed.script.charAt(0).toUpperCase() + parsed.script.slice(1);
		}

		if (parsed.region) {
			parsed.region = parsed.region.toUpperCase();
		}

		return parsed;
	}
}
