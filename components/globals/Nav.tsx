
import Link from 'next/link'
import React from 'react'
import { LogoInstagram, LogoX } from '@carbon/icons-react';
import { Coffee } from 'lucide-react';

const Nav = () => {
  return (
    <nav className='flex justify-between gap-3 md:flex-row flex-col py-6 border-b-2 border-color bg-white md:px-12 px-6 fixed w-full z-20'>
      <div className='md:border-0 md:py-0 border-b-2 border-color py-5'>
        <Link href={`/`} title='Mailer Logo'>
          <h2 className='text-2xl font-bold text-blue-700' >Mailer<sup className='pl-1 text-xs font-normal text-muted-foreground'>by xnyder</sup></h2>
        </Link>
      </div>
      <ul className='flex gap-4'>
        <Link href={'https://instagram.com/xnyderhq'} title='Instagram' className='flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full'>
            <LogoInstagram size={18.4} />
        </Link>
        <Link href={'https://x.com/xnyderhq'} title='Twitter' className='flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full'>
            <LogoX size={18.4} />
        </Link>
        <Link href={``} className='flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-all duration-500' title='Buy us a coffee'>Buy us a coffee <Coffee className='ml-2'/></Link>
      </ul>
      
    </nav>
  )
}

export default Nav
