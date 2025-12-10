"use client";

import { useEffect, useState } from "react";

// Define types for CollectJS
interface CollectJSFields {
  ccnumber: { selector: string; placeholder?: string };
  ccexp: { selector: string; placeholder?: string };
  cvv: { selector: string; placeholder?: string };
}

interface CollectJSConfig {
  variant: "inline" | string;
  styleSniffer?: boolean;
  callback: (token: CollectJSToken) => void;
  fields: CollectJSFields;
}

interface CollectJSToken {
  token: string;
  // Any other fields the SDK might return
  [key: string]: unknown;
}

interface CollectJSInstance {
  configure: (config: CollectJSConfig) => void;
  startPaymentRequest: (options?: {
    callback?: (token: CollectJSToken) => void;
  }) => void;
}

declare global {
  interface Window {
    CollectJS?: CollectJSInstance;
  }
}

export function useCollectJS(tokenizationKey: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // If already loaded, do nothing
    if (window.CollectJS) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://secure.mobiusgateway.com/token/Collect.js";
    script.dataset.tokenizationKey = tokenizationKey;
    script.async = true;

    script.onload = () => {
      console.log("CollectJS loaded.");
      setLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load CollectJS script");
    };

    document.body.appendChild(script);

    return () => {
      // Optional cleanup: Remove script + global object
      document.body.removeChild(script);
      // delete window.CollectJS; ← only if you want clean reset
    };
  }, [tokenizationKey]);

  return { CollectJS: window.CollectJS, loaded };
}
