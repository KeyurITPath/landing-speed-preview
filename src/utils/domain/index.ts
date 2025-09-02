"use server"
import { headers } from "next/headers";
import { INITIAL_DOMAIN } from "../constants";

export async function getDomain() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', protocol, host)
  if(protocol === 'http'){
    return INITIAL_DOMAIN
  }
  return `${protocol}://${host}`;
}

export const fetchIP = async() => {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if(forwardedFor){
    return forwardedFor.split(",")?.[0].trim();
  }
  return headersList.get("x-real-ip") || null
}
