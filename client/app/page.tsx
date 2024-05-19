'use client'
import { Gradient } from '@/components/gradient'
import { useEffect, useRef } from 'react'

export default function MainPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const gradient = new Gradient()
    // @ts-ignore
    gradient.initGradient('#gradient-canvas')
  }, [])

  return (
    <main className='h-[100vh] flex flex-col-reverse md:flex-row'>
      <div className='flex-1 flex items-center justify-center'>
        <canvas ref={canvasRef} id='gradient-canvas' />
      </div>
      <div className='flex-1 flex flex-col gap-4 py-4 px-10'>
        <h1 className='text-7xl'>
          pod
          <span className='font-bold'>plex</span>
        </h1>
        <p className='inline-flex gap-4 items-center text-sm opacity-75'>
          powered by{' '}
          <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThC8wcQBVw7rJ6HeejZ1sOe0i5ntA_tLb8u2ysHvL1&s' className='h-[2em]' />
          <img src='https://mms.businesswire.com/media/20211208005150/en/933943/23/nomic+logo_dark3x.jpg' className='h-[2em]' />
          <img src='https://image4.owler.com/logo/replit_owler_20230425_184256_original.png' className='h-[1.5em]' />
          <img src='https://raw.githubusercontent.com/vllm-project/vllm/main/docs/source/assets/logos/vllm-logo-text-light.png' className='h-[1em]' />
        </p>

        <p>a distributed platform for running training and inference jobs on machine learning models.</p>
        <img src='/fsdp.jpg' width={600} className='self-center' style={{ width: '60%' }} />

        <p className='text-2xl'>how it works</p>
        <ol className='list-decimal list-inside'>
          <li>
            <b>select a model</b>: choose a model from the list of available models to finetune
          </li>
          <li>
            <b>hang tight! </b>
            we&apos;ll use runpod + FSDP to distribute your training job across multiple GPUs.
          </li>
          <li>
            <b>monitor your job</b>: track the progress of your training job in real-time using the pod status page
          </li>
        </ol>
        <a href='/pods' className='bg-black uppercase font-mono hover:bg-gray-800 self-start text-white p-4 rounded-md'>
          enter &rarr;
        </a>
      </div>
    </main>
  )
}
