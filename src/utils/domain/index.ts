"use server"
import { headers } from "next/headers";
import { INITIAL_DOMAIN } from "../constants";

export async function getDomain() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  if(protocol === 'http'){
    return INITIAL_DOMAIN
  }
  return `${protocol}://${host}`;
}
