export interface RequestContext {
	accessToken: string;
	apiBaseUrl: string;
	app?: string;
	baseUrl?: string;
	cancelToken?: Promise<string>;
	companyId?: string;
	environment?: string;
	locale?: string;
	requestId?: string;
	timeout?: number;
	tracingParentSpan?: string;
	userId?: string;
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			runtime: RequestContext;
		}
	}
	interface Window {
		runtime: RequestContext;
	}
}

const getGlobal = (): Window | NodeJS.Global => {
	let globalAny: Window | NodeJS.Global;

	if (typeof self !== 'undefined') {
		globalAny = self;
	}
	if (typeof window !== 'undefined') {
		globalAny = window;
	}
	if (typeof global !== 'undefined') {
		globalAny = global;
	}

	if (!globalAny) {
		throw new Error('Unable to locale global object');
	}

	return globalAny;
};

export const getRuntime = () => {
	return getGlobal().runtime;
};
