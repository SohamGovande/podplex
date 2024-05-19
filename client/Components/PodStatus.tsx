// const PodStatus = ({ pod }: Props) => {
//   return (
//     <Card className="border rounded-lg flex flex-col">
//       <CardContent className="flex flex-col gap-y-3">
//         <p className="text-2xl font-semibold">{pod.name}</p>
//         <p className="text-xl font-semibold">GPUs</p>
//         <div className="grid grid-cols-2">
//           {pod?.runtime?.gpus.map((gpu: any) => (
//             <div
//               key={gpu.id}
//               className="flex flex-col border rounded-lg bg-slate-100 p-3"
//             >
//               <p className="font-medium">{gpu.id}</p>
//               <div className="mt-3">
//                 <p>Utilization: {gpu.gpuUtilPercent}%</p>
//                 <p>Memory: {gpu.memoryUtilPercent}%</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div>
//           <p>Ports</p>
//           {pod?.runtime?.ports.map((port: any) => (
//             <div key={port.ip} className="flex gap-x-4">
//               <p>IP: {port.ip}</p>
//               <p>Public IP: {port.isIpPublic ? "Yes" : "No"}</p>
//               <p>Private Port: {port.privatePort}</p>
//               <p>Public Port: {port.publicPort}</p>
//               <p>Type: {port.type}</p>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PodStatus;

type Props = {
  pod: any;
};

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

export default function PodStatus({ pod }: Props) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>CPU Pod</CardTitle>
        <CardDescription>Runtime: 2 days 3 hours</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">GPUs</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {pod?.runtime?.gpus.map((gpu: any) => (
              <>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg grid gap-2">
                  <div className="font-medium">{gpu.id}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Utilization: {gpu.gpuUtilPercent}%
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Memory: {gpu.memoryUtilPercent}%
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Ports</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg grid gap-2">
              <div className="font-medium">Port 1</div>
              <div className="text-gray-500 dark:text-gray-400">
                IP: 192.168.1.100
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Public IP: 123.45.67.89
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Private Port: 8080
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Public Port: 80
              </div>
              <div className="text-gray-500 dark:text-gray-400">Type: HTTP</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg grid gap-2">
              <div className="font-medium">Port 2</div>
              <div className="text-gray-500 dark:text-gray-400">
                IP: 192.168.1.101
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Public IP: 123.45.67.90
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Private Port: 8081
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Public Port: 443
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Type: HTTPS
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
