"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Evaluate from "@/components/Evaluate";
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";
import { createClient } from "@/lib/utils";

type Model = {
  name: string;
  hfName: string;
  metrics: string;
  baseUrl: string;
};

const supabase = createClient();

export default function Models() {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<Model | null>(null);
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      const { data, error } = await supabase.from("models").select("*");
      if (error) {
        console.error(error);
        return;
      }

      setModels(data);
    };

    fetchModels();
  }, []);

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
                  Accuracy
                </th>
                <th className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-50 font-inter"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {models.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-4 text-gray-500 dark:text-gray-400 font-inter"
                    colSpan={3}
                  >
                    No models available.
                  </td>
                </tr>
              )}
              {models.map((model) => (
                <tr key={model.name}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-50 font-inter">
                    {model.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-inter">
                    {model.metrics ?? "N/A"}
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
