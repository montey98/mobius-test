"use client";

import { useEffect, useRef, useState } from "react";

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
  const [loaded, setLoaded] = useState(false); // use state for rendering
  const collectJSRef = useRef<CollectJSInstance | null>(null); // ref for SDK instance

  useEffect(() => {
    if (typeof window === "undefined") return; // only run in client

    const script = document.createElement("script");
    script.src = "https://secure.mobiusgateway.com/token/Collect.js";
    script.dataset.tokenizationKey = tokenizationKey;
    script.async = true;

    script.onload = () => {
      collectJSRef.current = window.CollectJS ?? null;
      setLoaded(true); // triggers re-render safely
      console.log("CollectJS loaded");
    };

    script.onerror = () => {
      console.error("Failed to load CollectJS script");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      collectJSRef.current = null;
    };
  }, [tokenizationKey]);

  // only return the SDK instance; do not use it for conditional rendering
  return { collectJSRef, loaded };
}
