"use client";

import React from "react";

export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-lg text-gray-200 mb-4">
        This is a placeholder for the Terms of Service. Replace with your actual legal text.
      </p>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-gray-300">By using this site, you agree to these terms.</p>
        <h2 className="text-2xl font-semibold">2. Use of Service</h2>
        <p className="text-gray-300">You may use the service in accordance with applicable laws.</p>
        {/* Add more sections as needed */}
      </section>
    </main>
  );
}
