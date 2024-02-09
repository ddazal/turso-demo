import { createClient } from "@libsql/client";

export const createTursoClient = (url) => {
    const client = createClient({
        url: `libsql://${url}`,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return client
}

