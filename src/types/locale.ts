export interface ParsedLocale {
	language: string;
	extendedLanguageSubtags: string[];
	script: string;
	region: string;
	variants: string[];
	extensions: string[];
	privateuse: string[];
	irregular: string;
	regular: string;
}
