const configuredServerUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "";

export const SERVER_BASE_URL = configuredServerUrl.replace(/\/+$/, "");
