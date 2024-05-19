"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const dummy_data = [
  {
    id: "1",
    name: "data.zip",
  },
  {
    id: "2",
    name: "data2.zip",
  },
  {
    id: "3",
    name: "data3.zip",
  },
];

const empty_data = [];

export default function Component() {
  const [dataSet, setDataSet] = useState("");
  const [dataOptions, setDataOptions] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState("");
  const [podInstances, setPodInstances] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch data sets
    setDataOptions(dummy_data);
  }, []);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newUuid = uuidv4();
      setDataOptions([...dataOptions, { id: newUuid, name: file.name }]);
      setDataSet(newUuid);
    }
  };

  const startTraining = async () => {
    setLoading(true);

    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Dataset Selection
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Choose the dataset(s) to use for training.
            </p>
          </div>
          <Card>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataset">Select Dataset</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="w-full justify-between"
                      variant="outline"
                    >
                      {dataOptions.find((data) => data.id === dataSet)?.name ||
                        "Select Dataset"}
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={dataSet}
                      onValueChange={setDataSet}
                    >
                      {dataOptions.map((data, index) => (
                        <DropdownMenuRadioItem key={index} value={data.id}>
                          {data.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleButtonClick}
                >
                  Upload Custom Dataset
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Model Selection
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a pre-trained model or use a custom model.
            </p>
          </div>
          <Card>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <div className="relative">
                  <Input id="model" placeholder="HuggingFace Model URL" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Training Configuration
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Set the training parameters and resources.
            </p>
          </div>
          <Card>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pods">Pods/Instances</Label>
                <Input id="pods" placeholder="Number of pods" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="learning-rate">Learning Rate</Label>
                <Input
                  disabled
                  id="learning-rate"
                  placeholder="Learning rate"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input id="batch-size" placeholder="Batch size" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="epochs">Epochs</Label>
                <Input
                  id="epochs"
                  placeholder="Number of epochs"
                  type="number"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Training Controls
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Monitor and control the training process.
            </p>
          </div>
          <Card>
            <CardContent className="flex flex-col gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  Start Training
                </Button>
                <Button className="w-full" variant="outline">
                  Stop Training
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Pod Logs</Label>
                <div className="md:col-span-2 border rounded-lg p-3 font-mono text-sm min-h-[200px] max-h-[40vh] overflow-h-screen"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function ChevronDownIcon(props: any) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
