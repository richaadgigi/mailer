import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { LogoInstagram, LogoX } from '@carbon/icons-react';

const Nav = () => {
  return (
    <nav className='flex justify-between py-6 border-b-2 border-color bg-white px-12'>
      <h2 className='text-2xl font-bold text-blue-700'>Mailer<sup className='pl-1 text-xs font-normal text-muted-foreground'>by xnyder</sup></h2>
      <ul className='flex gap-4'>
        <Link href={'https://instagram.com/xnyderhq'} className='flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full'>
            <LogoInstagram size={18.4} />
        </Link>
        <Link href={'https://x.com/xnyderhq'} className='flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full'>
            <LogoX size={18.4} />
        </Link>
      </ul>
      
    </nav>
  )
}

export default Nav
