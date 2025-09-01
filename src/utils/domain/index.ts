import { headers } from "next/headers";

export async function getDomain() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  return `${protocol}://${host}`;
}
