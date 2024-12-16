import Link from 'next/link'
import React from 'react'
import { LogoInstagram, LogoX } from '@carbon/icons-react';
import Image from 'next/image';

const Nav = () => {
  return (
    <nav className='flex justify-between gap-3 py-6 border-b-2 border-color bg-white md:px-12 px-6 fixed w-full z-20'>
      <div className=''>
        <Link href={`/`} title='Mailer Logo' className='flex gap-2 items-center '>
          <Image src={`/apple-touch-icon.png`} alt="Mailer logo" width={200} height={200} className='!w-8 h-8'/>
          <h2 className='text-sm font-bold md:inline-block hidden xynder-text-color' >Mailer<sup className='pl-1 text-xs font-normal text-muted-foreground'>by xnyder</sup></h2>
        </Link>
      </div>
      <Link href="https://www.buymeacoffee.com/xnyderhq" className='md:flex-none flex-1 w-48'><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=xnyderhq&button_colour=5F7FFF&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"  className='w-48 ml-auto' alt="Buy Xnyder a coffee"/></Link>
    </nav>
  )
}

export default Nav
