import { Button } from '@/components/ui/button'
import { TypographyH1 } from '@/components/ui/typography/TypographyH1'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
     <TypographyH1>AI Adventure</TypographyH1>
     <Button>Get Started</Button>
    </main>
  )
}
