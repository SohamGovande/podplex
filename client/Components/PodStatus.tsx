type Props = {
  pod: any;
};

const PodStatus = ({ pod }: Props) => {
  return (
    <div className="border p-4 flex flex-col gap-y-4">
      <p className="text-lg">Pod Details</p>
      <p>ID: {pod.id}</p>
      <div>
        <p>GPUs</p>
        {pod?.runtime?.gpus.map((gpu: any) => (
          <div key={gpu.id} className="flex gap-x-4">
            <p>GPU ID: {gpu.id}</p>
            <p>GPU Util %: {gpu.gpuUtilPercent}%</p>
            <p>GPU Memory %: {gpu.memoryUtilPercent}%</p>
          </div>
        ))}
      </div>
      <div>
        <p>Ports</p>
        {pod?.runtime?.ports.map((port: any) => (
          <div key={port.ip} className="flex gap-x-4">
            <p>IP: {port.ip}</p>
            <p>Public IP: {port.isIpPublic ? "Yes" : "No"}</p>
            <p>Private Port: {port.privatePort}</p>
            <p>Public Port: {port.publicPort}</p>
            <p>Type: {port.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodStatus;
