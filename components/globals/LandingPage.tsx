import { ArrowBigDownDash, ArrowRight, LandPlot, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const LandingPage = () => {
  return (
    <section className='flex flex-col justify-center items-center md:gap-3 gap-4 md:px-12 px-6 md:pt-36 pt-48 pb-5 text-center'>
            <div className='w-fit mb-4'>
                <Link href="" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=467244&theme=neutral" alt="Mailer - Effortless&#0032;mailing&#0032;service&#0044;&#0032;Instant&#0032;Results | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" /></Link>
            </div>
            <Link target='_blank' href={'https://xnyder.com'} className='bg-[#eaebfb] px-4 text-blue-600 font-semibold text-sm'>A tool by Xnyder</Link>
            <h1 className='md:text-6xl text-4xl font-semibold'>Send <span className='text-blue-600'>bulk emails</span> with one click. Reach<span className='text-blue-600'> everyone</span> instantly.</h1>
            <h2 className='md:text-4xl text-lg'>Explore the <span className='text-blue-600'>simplicity </span>in mailing with<span className='text-blue-600 font-bold'> Mailer</span>.</h2>
            <p className='my-2 text-sm'><span className='opacity-60'>Easily send bulk mails to </span> <span className='text-blue-600'>Clients</span> <span className='opacity-60'>right here and now.  Tap the button and let the magic unfold! ✨</span></p>
            <ArrowBigDownDash className='animate-bounce delay-100 transition-all'/>
            <Link href={`/demo`} className='md:mx-0 mx-auto w-fit delay-200 transition-all'>
                <Button className='bg-blue-600 w-56 py-7 pr-2 transition-all duration-500 delay-100 rounded-full  text-center'><span className='text-center w-full font-bold text-lg'> Try it out </span> <span className='bg-white p-3 rounded-full text-blue-700 border ml-auto font-bold'><ArrowRight className="animate-pulse mx-auto w-fit delay-100"/></span></Button>
            </Link>
    </section>
   
  )
}

export default LandingPage
