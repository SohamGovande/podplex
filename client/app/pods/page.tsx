"use client";

import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import PodStatus from "@/components/PodStatus";
import { GET_ALL_PODS } from "@/utils/getPods";
import { IoRefresh } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [prevAllPods, setPrevAllPods] = useState([]);
  const [listAllPods, { data: allPodsData, loading: allPodsLoading }] =
    useLazyQuery(GET_ALL_PODS, {
      pollInterval: 5000,
    });

  useEffect(() => {
    listAllPods();
  }, []);

  useEffect(() => {
    if (allPodsData && allPodsData.myself?.pods?.length === 4) {
      setPrevAllPods(allPodsData.myself.pods);
    }
  }, [allPodsData]);

  const listPods = async () => {
    await listAllPods();
  };

  return (
    <div className="p-24 flex flex-col gap-y-8 w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-2xl">Pod Status</p>
        <Button
          className="flex gap-x-4"
          onClick={listPods}
          disabled={allPodsLoading}
        >
          Refresh
          <IoRefresh size={16} />
        </Button>
      </div>
      {prevAllPods.length === 0 && <NoPods />}
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-0 sm:gap-x-4 gap-y-3">
        {prevAllPods.map((pod: any, index) => (
          <PodStatus key={`${index}-${pod.id}`} pod={pod} />
        ))}
      </div>
    </div>
  );
}

function NoPods() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center min-h-[50vh] flex flex-col items-center justify-center">
      <PackageIcon className="mx-auto h-12 w-12 text-gray-500 dark:text-gray-400" />
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
        No Active Pods
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        You don&apos;t have any active pods yet. Pods will automatically be
        started when you start training a model.
      </p>
      <Link href="/train">
        <Button>Train Model</Button>
      </Link>
    </div>
  );
}

function PackageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
