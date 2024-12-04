import { LandPlot, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const LandingPage = () => {
  return (
    <section className='flex flex-col justify-center items-center gap-3 md:px-12 px-6 md:pt-36 pt-48 text-center'>
            <div className='w-fit mb-4'>
                <Link href="" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=467244&theme=neutral" alt="Mailer - Effortless&#0032;mailing&#0032;service&#0044;&#0032;Instant&#0032;Results | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" /></Link>
            </div>
            <Link target='_blank' href={'https://xnyder.com'} className='bg-[#eaebfb] px-4 text-blue-600 font-semibold text-sm'>A tool by Xnyder</Link>
            <h1 className='md:text-5xl text-6xl'>The <span className='text-blue-600'>Mailing</span> service<span className='text-blue-600'> designed</span> for you.</h1>
            <h1 className='md:text-2xl text-lg'>Explore <span className='text-blue-600'>the </span> simplicity in mailing with<span className='text-blue-600'> Mailer</span>.</h1>
            <p className='my-2 text-sm'><span className='opacity-60'>Easily send mails to </span> <span className='text-blue-600'>Clients</span> <span className='opacity-60'>right here and now.  Tap the button and let the magic unfold! ✨</span></p>
            
            <Link href={`/demo`} className='md:mx-0 mx-auto border w-fit  delay-200 transition-all'>
                <Button className='bg-blue-600 w-52 py-6 transition-all duration-500 delay-100 rounded-full  text-center'><span className='text-center w-full'> Try it out </span> <span className='bg-white p-2 rounded-full text-blue-700 border ml-auto '><Send className="animate-pulse mx-auto w-fit"/></span></Button>
            </Link>
    </section>
   
  )
}

export default LandingPage
