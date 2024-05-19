"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Dropzone } from "@mantine/dropzone";

export default function Component() {
  const [dataSet, setDataSet] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [podNumber, setPodNumber] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [modelUrl, setModelUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDataSet(file);
    }
  };

  const startTraining = async () => {
    setLoading(true);
    setTraining(true);

    try {
      await axios.post(
        "https://8vz7zrwpyd.execute-api.us-west-1.amazonaws.com/default/scheduler?action=start"
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stopTraining = async () => {
    setLoading(true);
    setTraining(false);

    try {
      await axios.post(
        "https://8vz7zrwpyd.execute-api.us-west-1.amazonaws.com/default/scheduler?action=stop"
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4 flex flex-col h-full">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Dataset Selection
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Upload a dataset(s) to use for training.
            </p>
          </div>
          <Card className="flex flex-1 items-center justify-center p-6">
            <Dropzone
              className="w-full h-full"
              onDrop={(files) => setDataSet(files[0])}
              onReject={(files) => console.log("rejected files", files)}
              // accept={IMAGE_MIME_TYPE}
            >
              <div className="flex flex-col items-center justify-center space-y-4 min-h-[120px] w-full">
                <div>
                  <p className="text-lg">Upload Custom Dataset</p>
                </div>
              </div>
            </Dropzone>
            {/* <div className="space-y-4 p-3 flex-1">
              <Button
                className="w-full h-full"
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
            </div> */}
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
            <CardContent className="space-y-3">
              <Input
                id="model"
                placeholder="HuggingFace Model URL"
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
              />
              <Input
                id="accessToken"
                placeholder="HuggingFace Access Token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
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
                <Label htmlFor="pods">Pods</Label>
                <Input
                  id="pods"
                  placeholder="Number of pods"
                  type="number"
                  value={podNumber}
                  onChange={(e) => setPodNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input
                  id="batch-size"
                  placeholder="Batch size"
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
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
              <div className="flex gap-x-2">
                <Button
                  className="w-full"
                  disabled={
                    loading ||
                    training ||
                    dataSet === null ||
                    !modelUrl ||
                    !podNumber ||
                    !batchSize
                  }
                  onClick={startTraining}
                >
                  Start Training
                </Button>
                <Button
                  className="w-full"
                  disabled={loading || !training}
                  variant="destructive"
                  onClick={stopTraining}
                >
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
