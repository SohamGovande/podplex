"use client";
import { Gradient } from "@/components/gradient";
import { useEffect, useRef } from "react";
import Contact from "./Contact";

export default function ContactPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gradient = new Gradient();
    // @ts-ignore
    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <main className="h-[100vh] flex flex-col-reverse md:flex-row">
      <div className="flex-1 hidden md:flex items-center justify-center">
        <canvas ref={canvasRef} id="gradient-canvas" />
      </div>
      <div className="flex-1 flex flex-col gap-4 py-4 px-10">
        <h1 className="text-7xl">
          pod
          <span className="font-bold">plex</span>
        </h1>
        <p className="inline-flex gap-4 items-center text-sm opacity-75">
          powered by{" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThC8wcQBVw7rJ6HeejZ1sOe0i5ntA_tLb8u2ysHvL1&s"
            className="h-[2em]"
          />
          <img
            src="https://mms.businesswire.com/media/20211208005150/en/933943/23/nomic+logo_dark3x.jpg"
            className="h-[2em]"
          />
          <img
            src="https://image4.owler.com/logo/replit_owler_20230425_184256_original.png"
            className="h-[1.5em]"
          />
          <img
            src="https://raw.githubusercontent.com/vllm-project/vllm/main/docs/source/assets/logos/vllm-logo-text-light.png"
            className="h-[1em]"
          />
        </p>
        <p>distributed training & serverless inference at scale</p>
        <Contact />
      </div>
    </main>
  );
}
