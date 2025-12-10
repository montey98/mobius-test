"use client";

import React, { useEffect, useState } from "react";
import { useCollectJS } from "@/hooks/use-collect-js";

const TOKEN_KEY = process.env.NEXT_PUBLIC_MOBIUSPAY_PUBLIC_KEY!;

export default function InlineCartPage() {
  const { collectJSRef, loaded } = useCollectJS(TOKEN_KEY);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const firstNameRef = React.useRef(firstName);
  const lastNameRef = React.useRef(lastName);
  const emailRef = React.useRef(email);

  useEffect(() => {
    firstNameRef.current = firstName;
    lastNameRef.current = lastName;
    emailRef.current = email;
  }, [firstName, lastName, email]);

  const handleSubmit = (token: object) => {
    console.log(firstNameRef.current, lastNameRef.current, emailRef.current); // all ""
    console.log("Token Info", token);
  };

  // Configure CollectJS once loaded
  useEffect(() => {
    if (!loaded || !collectJSRef.current) return;

    collectJSRef.current!.configure({
      variant: "inline",
      callback: (token: object) => {
        handleSubmit(token);
      },
      fields: {
        ccnumber: { selector: "#ccnumber" },
        ccexp: { selector: "#ccexp" },
        cvv: { selector: "#cvv" },
      },
    });
  }, [loaded, collectJSRef]);

  if (!loaded) return <p>Loading payment system…</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (collectJSRef) {
          collectJSRef.current!.startPaymentRequest();
        }
      }}
      className="space-y-4 container"
    >
      <div>
        <label className="block mb-1">First Name</label>
        <input
          className="w-full border px-2 py-1 rounded"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">Last Name</label>
        <input
          className="w-full border px-2 py-1 rounded"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          className="w-full border px-2 py-1 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* CollectJS card fields */}
      <div>
        <label className="block mb-1">Card Number</label>
        <div id="ccnumber" className="border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1">Expiration</label>
        <div id="ccexp" className="border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1">CVV</label>
        <div id="cvv" className="border p-2 rounded" />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit Payment
      </button>
    </form>
  );
}
