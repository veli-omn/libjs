export interface HTTPRequestParameters {
    method?: "GET" | "POST" | "PUT" | "UPDATE" | "DELETE";
    headers?: object;
    body?: object;
}

export interface HTTPRequestResult<T> {
    error: {
        type: null | "external" | "internal";
        code?: number;
        text?: string;
        data?: unknown;
    },
    parsedData: T | null;
    rawResponse: Response | null;
}

export type HTTPResponseParseOption = "json" | "arrayBuffer" | "text";

export async function HTTPRequest<T>(
    URL: string,
    parseResponse?: HTTPResponseParseOption | null,
    params?: HTTPRequestParameters | null,
    fetchFn: Function = fetch
): Promise<HTTPRequestResult<T>> {
    const bodyIsObject: boolean = params?.body !== null && typeof params?.body === "object";
    const contentTypeHeaderIsSpecified: boolean = !!(params?.headers && "Content-Type" in params?.headers);
    const requestResult: HTTPRequestResult<T> = {
        error: {
            type: null
        },
        parsedData: null,
        rawResponse: null
    };

    console.log(`DEV LOG: bodyIsObject`, bodyIsObject); // Dev log, remove in production.
    console.log(`DEV LOG: contentTypeHeaderIsSpecified`, contentTypeHeaderIsSpecified); // Dev log, remove in production.
    console.log(`DEV LOG: http params`, JSON.stringify(params, null, 4)); // Dev log, remove in production.


    try {
        const parsedParams = {
            method: params?.method || "GET",
            headers: {
                ...params?.headers,
                ...((bodyIsObject && !contentTypeHeaderIsSpecified) && { "Content-Type": "application/json" })
            },
            body: bodyIsObject ? JSON.stringify((params as any).body) : params?.body
        };
        console.log(`DEV LOG: parsedParams`, JSON.stringify(parsedParams, null, 4)); // Dev log, remove in production.

        const response: Response = await fetchFn(URL, parsedParams);

        if (!response.ok) {
            requestResult.error.type = "external";
            requestResult.error.code = response.status;
            requestResult.error.text = response.statusText;
        }

        if (parseResponse) {
            const parsedData = await response[parseResponse]();
            requestResult.parsedData = parsedData;
        }

        requestResult.rawResponse = response;
    } catch (err) {
        requestResult.error.type = "internal";
        requestResult.error.data = err;
    }

    return requestResult;
}