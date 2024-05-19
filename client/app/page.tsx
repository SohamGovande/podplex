"use client";

import { useState, useEffect } from "react";
import { TextInput, Button } from "@mantine/core";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import PodStatus from "@/components/PodStatus";
import { POD_RENT_MUTATION } from "@/utils/rentPod";
import { GET_ALL_PODS } from "@/utils/getPods";
import { STOP_POD } from "@/utils/stopPod";

export default function Home() {
  const [model, setModel] = useState("");
  const [dataSet, setDataSet] = useState("");
  const [loading, setLoading] = useState(false);
  const [podId, setPodId] = useState("");

  const [rentPod, { data, loading: rentPodLoading, error }] =
    useMutation(POD_RENT_MUTATION);
  const [listAllPods, { data: allPodsData, loading: allPodsLoading }] =
    useLazyQuery(GET_ALL_PODS);
  const [stopPod, { data: stopPodData, loading: stopPodLoading }] =
    useMutation(STOP_POD);

  useEffect(() => {
    listAllPods();
  }, []);

  const startTraining = async () => {
    setLoading(true);

    setLoading(false);
  };

  // RTX A6000, 0.55, 1 GPU, 48 GB,
  const createPod = async () => {
    rentPod({
      variables: {
        input: {
          bidPerGpu: 0.55,
          cloudType: "SECURE",
          containerDiskInGb: 20,
          volumeInGb: 20,
          gpuCount: 1,
          gpuTypeId: "NVIDIA RTX A6000",
          minMemoryInGb: 50,
          minVcpuCount: 8,
          networkVolumeId: null,
          startJupyter: true,
          startSsh: true,
          templateId: "runpod-torch",
          volumeKey: null,
          ports: "8888/http,22/tcp",
          dataCenterId: null,
        },
      },
    });
  };

  const stopPodWithId = async () => {
    stopPod({
      variables: {
        input: {
          podId,
        },
      },
    });
  };

  const listPods = async () => {
    listAllPods();
  };

  return (
    <div className="p-24 flex flex-col gap-y-8">
      <TextInput
        label="Pod ID"
        value={podId}
        onChange={(event) => setPodId(event.currentTarget.value)}
      />
      <div className="flex gap-x-8">
        <Button variant="filled" onClick={createPod} loading={loading}>
          Create Pod
        </Button>
        <Button variant="filled" onClick={stopPodWithId} loading={loading}>
          Stop Pod
        </Button>
        <Button variant="filled" onClick={listPods} loading={loading}>
          Show All Pods
        </Button>
      </div>
      <div>
        {allPodsData?.myself.pods.map((pod: any) => (
          <PodStatus key={pod.id} pod={pod} />
        ))}
      </div>
      {/* <div>
        <p className="text-xl">Model</p>
        <TextInput
          value={model}
          onChange={(event) => setModel(event.currentTarget.value)}
        />
      </div>
      <div>
        <p className="text-xl">Data Set</p>
        <TextInput
          value={dataSet}
          onChange={(event) => setDataSet(event.currentTarget.value)}
        />
      </div>
      <div>
        <p className="text-xl">Partition</p>
      </div>
      <div>
        <Button variant="filled" onClick={startTraining} loading={loading}>
          Train
        </Button>
      </div> */}
    </div>
  );
}
