import { LandPlot, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

const LandingPage = () => {
  return (
    <section className='flex md:flex-nowrap flex-wrap gap-4 max-w-max md:px-12 px-6 md:pt-36 pt-48 '>
        <div className='md:basis-1/2'>
            <div className='mb-7 w-fit'>
                <Link href="" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=467244&theme=neutral" alt="Mailer - Effortless&#0032;mailing&#0032;service&#0044;&#0032;Instant&#0032;Results | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" /></Link>
            </div>
            <Link target='_blank' href={'https://xnyder.com'} className='bg-[#eaebfb] px-4 py-2 text-blue-600 font-semibold text-sm'>A tool by Xnyder</Link>
            <h1 className='md:text-5xl py-4 text-4xl'>The <span className='text-blue-600'>Mailing</span> service<span className='text-blue-600'> designed</span> for you.</h1>
            <p className='my-2 text-sm'><span className='opacity-60'>Easily send mails to </span> <span className='text-blue-600'>Clients</span> <span className='opacity-60'>right here and now.  Tap the button and let the magic unfold! ✨</span></p>
            <p></p>
            <div className='md:mx-0 mx-auto border w-fit'>
                <Button className='bg-blue-600 px-20 py-6 transition-all duration-500'>Try it out <Send/></Button>
            </div>
        </div>
        <div className='md:basis-1/2'>
            <Image src={`/mail.png`} alt="Mail" width={500} height={200}/>
           
            
        </div>
      
    </section>
   
  )
}

export default LandingPage
