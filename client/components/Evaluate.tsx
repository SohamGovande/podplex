"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Modal } from "@mantine/core";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://twuuwrleysnspvxvjfvl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dXV3cmxleXNuc3B2eHZqZnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYxMjQzMDUsImV4cCI6MjAzMTcwMDMwNX0.SnbmdBL_Vtj9_Gcn10zu_ohFsaszdQSFkusUk4kIQWk"
);

export default function Evaluate({
  open,
  setOpen,
  model,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  model: {
    name: string;
    hfName: string;
    metrics: string;
    baseUrl: string;
  } | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [evalSet, setEvalSet] = useState<File | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEvalSet(file);
    }
  };

  const handleSubmit = async () => {
    if (!evalSet) return;
    setOpen(false);

    // upload csv to supabase
    const { data } = await supabase.storage
      .from("eval_files")
      .upload(`${evalSet.name}`, evalSet);

    // evaluate model
    await axios.post("https://api.runpod.ai/v2/6lgg72smxe3cky/runsync", {
      input: {
        eval_file: data?.path,
        model_name: model?.name,
      },
    });
  };

  return (
    <Modal
      opened={open}
      onClose={() => {
        setOpen(false);
      }}
      title={`Evaluate ${model?.name}`}
      centered
    >
      <div className="grid gap-6 py-6">
        <div className="grid items-center gap-4">
          <Label className="text-left font-medium" htmlFor="file">
            Evaluation File (.csv)
          </Label>
          <div className="col-span-1 flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
            <Button
              className="w-full"
              variant="outline"
              onClick={handleButtonClick}
            >
              Upload Custom Evaluations
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant={"destructive"}
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Evaluate</Button>
      </DialogFooter>
    </Modal>
  );
}
