"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

type Prediction = {
  input: string;
  score: number;
  confidence: number;
  risk: string;
  recommendation: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data);
      setHistory((prev) => [data, ...prev].slice(0, 10)); // Keep last 10
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Input + Result */}
          <div className="space-y-8">
            <Card className="bg-black/50 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Make Prediction</h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <textarea
                  className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  rows={3}
                  placeholder="Enter your input..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
                >
                  {loading ? "Predicting..." : "Get Prediction"}
                </button>
              </form>
            </Card>

            {prediction && (
              <Card className="bg-black/50 backdrop-blur">
                <h2 className="text-lg font-semibold text-white">Prediction Result</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Score</span>
                    <span className="font-medium text-white">
                      {prediction.score.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Confidence</span>
                    <span className="font-medium text-white">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Risk</span>
                    <span className="font-medium text-white">{prediction.risk}</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-zinc-400">
                      Recommendation
                    </h3>
                    <p className="mt-1 text-white">{prediction.recommendation}</p>
                  </div>
                </div>
              </Card>
            )}

            {error && (
              <Card className="bg-red-500/10 border-red-500/20">
                <p className="text-red-500">{error}</p>
              </Card>
            )}
          </div>

          {/* Right Column - History */}
          <div>
            <Card className="bg-black/50 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Prediction History</h2>
              <div className="mt-4 space-y-3">
                {history.length === 0 && (
                  <p className="text-zinc-500">No predictions yet</p>
                )}
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-white/10 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{item.input}</p>
                      <span
                        className={`text-sm font-medium ${
                          item.score > 0.5 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {item.score.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm text-zinc-400">
                      <span>{item.risk}</span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
