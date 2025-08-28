"use client"

import { useEffect } from "react";
import TagManager from "react-gtm-module";

export default function GTM() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GTM_ID) {
      TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID });
    }
  }, []);

  return null;
}
