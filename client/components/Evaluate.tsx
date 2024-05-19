'use client'

import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DialogTitle, DialogHeader, DialogFooter, DialogContent, Dialog } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Modal } from '@mantine/core'

export default function Evaluate({
  open,
  setOpen,
  model,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  model: {
    name: string;
    hfName: string;
    metrics: string;
    baseUrl: string;
  } | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [evalSet, setEvalSet] = useState<File | null>(null)

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setEvalSet(file)
    }
  }

  const handleSubmit = () => {
    setOpen(false)
    // TODO: run evals
  }

  return (
    <Modal
      opened={open}
      onClose={() => {
        setOpen(false)
      }}
      title={`Evaluate ${model?.name}`}
    >
      <div className='grid gap-6 py-6'>
        <div className='grid items-center gap-4'>
          <Label className='text-left font-medium' htmlFor='file'>
            Evaluation File (.csv)
          </Label>
          <div className='col-span-1 flex items-center gap-2'>
            <input ref={fileInputRef} type='file' className='hidden' accept='.csv' onChange={handleFileChange} />
            <Button className='w-full' variant='outline' onClick={handleButtonClick}>
              Upload Custom Evaluations
            </Button>
          </div>
        </div>
        <div className='grid items-center gap-4'>
          <Label className='text-left font-medium' htmlFor='balance'>
            Price/Speed Balance
          </Label>
          <Slider defaultValue={[50]} id='balance' max={100} step={1} />
        </div>
      </div>
      <DialogFooter>
        <Button
          variant={'destructive'}
          onClick={() => {
            setOpen(false)
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Evaluate</Button>
      </DialogFooter>
    </Modal>
  )
}
