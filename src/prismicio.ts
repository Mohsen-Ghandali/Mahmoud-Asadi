import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";

import config from "../slicemachine.config.json";

export const repositoryName = config.repositoryName;

export const routes: prismic.ClientConfig["routes"] = [
  {
    type: "page",
    path: "/:uid",
  },
];

export function createClient(config: prismicNext.CreateClientConfig = {}) {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  prismicNext.enableAutoPreviews({ client, ...config });

  return client;
}
