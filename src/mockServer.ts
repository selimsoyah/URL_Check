export type UrlType = "file" | "folder";

export interface UrlCheckResponse {
  exists: boolean;
  type: UrlType;
}

export async function checkUrlExists(url: string): Promise<UrlCheckResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const path = new URL(url).pathname;
  const exists = !path.includes("missing");
  const type: UrlType = path.endsWith("/") || !/\.[a-z0-9]+$/i.test(path) ? "folder" : "file";

  return { exists, type };
}
