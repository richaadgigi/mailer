import { ArrowBigDownDash, ArrowRight, LandPlot, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import FlickeringGrid from "@/components/ui/flickering-grid";
import RetroGrid from "@/components/ui/retro-grid";
 
const LandingPage = () => {
  return (
    <section  className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
        <div className='flex flex-col z-10 justify-center items-center md:gap-3 gap-4 md:px-12 px-6 pt-40 pb-20 text-center'>
            {/* <div className='w-fit mb-4'>
                <Link href="" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=467244&theme=neutral" alt="Mailer - Effortless&#0032;mailing&#0032;service&#0044;&#0032;Instant&#0032;Results | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" /></Link>
            </div> */}
            <Link target='_blank' href={'https://xnyder.com'} className='bg-[#eaebfb] px-4 xynder-text-color font-semibold text-sm border'>A tool by Xnyder</Link>
            <h1 className='md:text-6xl text-4xl font-semibold md:max-w-[65rem]'>Send <span className='xynder-text-color'>bulk emails</span> with one click. Reach<span className='xynder-text-color'> everyone</span> instantly.</h1>
            <p className='my-2 text-sm md:max-w-[65rem]'><span className='opacity-60'>Explore the <span className='xynder-text-color'>simplicity </span>in mailing with<span className='xynder-text-color font-bold'> Mailer</span>. Easily send bulk mails to </span> <span className='xynder-text-color'>Clients</span> <span className='opacity-60'>right here and now.  Tap the button and let the magic unfold! ✨</span></p>
            <Image src={`/pointing-down.svg`} width={100} height={100} alt="Pointing down" className='animate-bounce delay-100 transition-all w-20 h-20'/>
              <Link href={`/demo`} className='md:mx-0 mx-auto w-fit delay-200 '>
                  <Button className='xynder-bg-color hover:w-60 w-56 py-7 pr-2 transition-all duration-500 delay-50 rounded-full  text-center'><span className='text-center w-full font-bold text-lg'> Try it out </span> <span className='bg-white p-3 rounded-full xynder-text-color border ml-auto font-bold'><ArrowRight className="animate-pulse mx-auto w-fit delay-100"/></span></Button>
              </Link>
              <Link className='mt-4  text-[#ff6b37] text-sm font-semibold underline-offset-4 underline' target='_blank' href={'https://documenter.getpostman.com/view/16645752/2sA3rxpD5v'}>Click to see our full documentation</Link>

        </div>
        <RetroGrid />
    </section>
   
  )
}

export default LandingPage
