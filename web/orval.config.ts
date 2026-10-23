import { defineConfig } from "orval";

export default defineConfig({
  ppsr: {
    // Written by the API on startup (api/src/main.ts) from its Swagger document.
    input: "../api/openapi.json",
    output: {
      mode: "tags-split",
      target: "src/api/generated/endpoints",
      schemas: "src/api/generated/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      override: {
        mutator: { path: "src/api/http.ts", name: "http" },
        query: { signal: true },
      },
    },
  },
});
