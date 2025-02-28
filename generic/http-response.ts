export interface HTTPResponseParameters {
    status?: number;
    headers?: object;
}

export function HTTPResponse(body: any, params?: HTTPResponseParameters) {
    const bodyIsObject: boolean = body !== null && typeof body === "object";
    const contentTypeHeaderIsSpecified: boolean = !!(params?.headers && "Content-Type" in params?.headers);

    return new Response(
        bodyIsObject ? JSON.stringify(body) : body,
        {
            status: params?.status || 201,
            headers: {
                ...params?.headers,
                ...((bodyIsObject && !contentTypeHeaderIsSpecified) && { "Content-Type": "application/json" })
            }
        }
    );
}