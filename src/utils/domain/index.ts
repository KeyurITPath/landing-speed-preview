"use server"
import { headers } from "next/headers";

export async function getDomain() {
  const headersList = await headers();
  const host = headersList.get("host");
  if(['staging.eduelle.com', 'staging.edzen.org', 'eduelle.com', 'edzen.org'].includes(host)){
    return `https://${host}`;
  }else return 'https://staging.eduelle.com'
}

export const fetchIP = async() => {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if(forwardedFor){
    return forwardedFor.split(",")?.[0].trim();
  }
  return headersList.get("x-real-ip") || null
}
