"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Alert } from "@/src/components/ui/alert";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type SearchUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
};

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (query.trim().length < 2) {
      setError("Type at least 2 characters");
      setResults(null);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `${API_BASE}/users/search?q=${encodeURIComponent(query.trim())}`,
        { credentials: "include" },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Search failed");
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResults(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Customers</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or phone"
        />
        <Button type="submit" disabled={searching}>
          {searching ? "Searching…" : "Search"}
        </Button>
      </form>

      {error && <Alert variant="danger">{error}</Alert>}

      {results !== null && (
        <div className="flex flex-col gap-2">
          {results.length === 0 ? (
            <Card className="border-dashed">
              <p className="text-muted text-sm">No customers found.</p>
            </Card>
          ) : (
            results.map((customer) => (
              <Link
                key={customer.id}
                href={`/admin/users/${customer.id}`}
                className="block rounded-lg border border-border bg-surface p-4 hover:border-foreground transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-bold">
                    {customer.firstName} {customer.lastName}
                  </span>
                  <span className="text-sm text-muted">{customer.email}</span>
                  <span className="text-sm text-muted">
                    {customer.telephone}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
