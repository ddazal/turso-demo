import { createClient } from "@tursodatabase/api";

export const tursoPlatform = createClient({
    org: "ddazal",
    token: process.env.TURSO_AUTH_TOKEN,
});