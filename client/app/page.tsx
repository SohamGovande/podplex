"use client";

import { useState } from "react";
import { TextInput, Button } from "@mantine/core";
import { useQuery, useMutation } from "@apollo/client";
import PodStatus from "@/Components/PodStatus";

export default function Home() {
  const [model, setModel] = useState("");
  const [dataSet, setDataSet] = useState("");
  const [loading, setLoading] = useState(false);
  const [podId, setPodId] = useState("");

  const startTraining = async () => {
    setLoading(true);

    setLoading(false);
  };

  return (
    <div className="p-24 flex flex-col gap-y-8">
      <TextInput
        label="Pod ID"
        value={podId}
        onChange={(event) => setPodId(event.currentTarget.value)}
      />
      <div>
        <PodStatus podId={podId} />
      </div>
      <div className="flex gap-x-8">
        <Button variant="filled" onClick={startTraining} loading={loading}>
          Create Pod
        </Button>
        <Button variant="filled" onClick={startTraining} loading={loading}>
          Stop Pod
        </Button>
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
