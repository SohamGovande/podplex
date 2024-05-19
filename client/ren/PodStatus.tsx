import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/ren/ui/card'
import { LuCircuitBoard, LuNetwork } from 'react-icons/lu'

type Props = {
  pod: any
}

function formatTime(seconds: number) {
  const days = Math.floor(seconds / (24 * 3600))
  seconds %= 24 * 3600
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60

  const results = []
  if (days > 0) results.push(`${days} day${days > 1 ? 's' : ''}`)
  if (hours > 0) results.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  if (minutes > 0) results.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  if (seconds > 0) results.push(`${seconds} second${seconds > 1 ? 's' : ''}`)

  // Return the largest two units
  if (results.length > 2) {
    return results.slice(0, 2).join(', ')
  } else {
    return results.join(', ')
  }
}

export default function PodStatus({ pod }: Props) {
  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader className='flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between'>
        <div>
          <CardTitle className='text-2xl font-bold'>Pod {pod.id}</CardTitle>
          <CardDescription className='text-gray-500 dark:text-gray-400'>Uptime: {formatTime(pod?.runtime?.uptimeInSeconds ?? 0)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='grid gap-8'>
        <div className='grid gap-6'>
          <div className='grid gap-2'>
            <h3 className='text-xl font-semibold'>GPUs</h3>
            <div className='grid sm:grid-cols-2 gap-4'>
              {pod?.runtime?.gpus.map((gpu: any) => (
                <div key={gpu.id} className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md'>
                  <div className='flex items-center justify-between'>
                    <div className='font-medium text-lg'>{gpu.id}</div>
                    <LuCircuitBoard className='h-6 w-6 min-w-6 text-gray-500 dark:text-gray-400' />
                  </div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>Utilization: {gpu.gpuUtilPercent}%</div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>Memory: {gpu.memoryUtilPercent}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className='grid gap-2'>
            <h3 className='text-xl font-semibold'>Ports</h3>
            <div className='grid sm:grid-cols-2 gap-4'>
              {pod?.runtime?.ports.map((port: any, index: number) => (
                <div
                  key={`${index}-${port.ip}`}
                  className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md'
                >
                  <div className='flex items-center justify-between'>
                    <div className='font-medium text-lg'>Port {index}</div>
                    <LuNetwork className='h-6 w-6 min-w-6 text-gray-500 dark:text-gray-400' />
                  </div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>IP: {port.ip}</div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>Public IP: {port.isIpPublic ? 'Yes' : 'No'}</div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>Private Port: {port.privatePort}</div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>Public Port: {port.publicPort}</div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm flex gap-x-1'>
                    Type: <p className='uppercase'>{port.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
