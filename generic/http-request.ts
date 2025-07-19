export interface HTTPRequestParameters {
    method?: "GET" | "POST" | "PUT" | "UPDATE" | "DELETE";
    headers?: object;
    body?: object;
    credentials?: "omit" | "same-origin" | "include";
}

export interface HTTPRequestResult<T> {
    error: {
        type: null | "external" | "internal";
        code?: number;
        text?: string;
        data?: unknown;
    };
    parsedData: T | null;
    rawResponse: Response | null;
}

export type HTTPResponseParseOption = "json" | "arrayBuffer" | "text";

export async function HTTPRequest<T>(
    URL: string,
    params?: HTTPRequestParameters | null,
    parseResponse?: HTTPResponseParseOption | null,
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

    try {
        const parsedParams = {
            method: params?.method || (params?.body && "POST") || "GET",
            headers: {
                ...params?.headers,
                ...((bodyIsObject && !contentTypeHeaderIsSpecified) && { "Content-Type": "application/json" })
            },
            ...(params?.body && { body: bodyIsObject ? JSON.stringify(params.body) : params.body }),
            ...(params?.credentials && { credentials: params.credentials })
        };

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
