interface Extension {
	singleton: string;
	extensions: string[];
}

export interface ParsedLocale {
	language: string;
	extendedLanguageSubtags: string[];
	script: string;
	region: string;
	variants: string[];
	extensions: Extension[];
	privateuse: string[];
	irregular: string;
	regular: string;
}
