"use client";

import { useState } from "react";

import Evaluate from "@/components/Evaluate";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";

const models = [
  {
    name: "GPT-3 Turbo",
    metrics: "Perplexity: 8.2, Accuracy: 92%, Inference Time: 120ms",
    endpoint: "https://api.openai.com/v1/engines/gpt-3-turbo",
  },
  {
    name: "BERT-Large",
    metrics: "Perplexity: 6.9, Accuracy: 94%, Inference Time: 150ms",
    endpoint: "https://api.openai.com/v1/engines/bert-large",
  },
  {
    name: "RoBERTa-Base",
    metrics: "Perplexity: 7.5, Accuracy: 93%, Inference Time: 130ms",
    endpoint: "https://api.openai.com/v1/engines/roberta-base",
  },
  {
    name: "GPT-J",
    metrics: "Perplexity: 8.7, Accuracy: 91%, Inference Time: 180ms",
    endpoint: "https://api.openai.com/v1/engines/gpt-j",
  },
  {
    name: "T5-Base",
    metrics: "Perplexity: 7.2, Accuracy: 92%, Inference Time: 160ms",
    endpoint: "https://api.openai.com/v1/engines/t5-base",
  },
];

export default function ModelsPage() {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<{
    name: string;
    metrics: string;
    endpoint: string;
  } | null>(null);

  return (
    <main className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Trained Models
            </h1>
            <Link href="/train">
              <Button className="gap-x-2">
                Train a new model
                <LuPlus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400 font-inter">
            View details and metrics for the language models you&apos;ve
            trained.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-900 dark:text-gray-50 font-inter">
                  Model Name
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-900 dark:text-gray-50 font-inter">
                  Metrics
                </th>
                <th className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-50 font-inter"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {models.map((model) => (
                <tr key={model.name}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-50 font-inter">
                    {model.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-inter">
                    {model.metrics}
                  </td>
                  <td className="px-6 py-4 text-right font-inter">
                    <Button
                      onClick={() => {
                        setOpen(true);
                        setModel(model);
                      }}
                    >
                      Evaluate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Evaluate open={open} setOpen={setOpen} model={model} />
    </main>
  );
}
