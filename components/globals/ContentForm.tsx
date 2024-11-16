"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CodeBlock, vs2015 } from 'react-code-blocks';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from 'lucide-react';
import { Textarea } from '../ui/textarea';
 
const formSchema = z.object({
  host_type: z.string().min(2, {
    message: "Host type is required",
  }),
  smtp_host: z.string().min(2, {
    message: "Host type is required",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  from_email: z.string().email({message: "From email needed"}).min(2, {
    message: "Username must be at least 2 characters.",
  }),
  emails: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  subject: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  text: z.string(),
  html: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  attachments: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  sender: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  reply_to: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const ContentForm = () => {
  const [ resultLoaded, setResultLoaded ] = React.useState(false);
  const [ isPasswordShown, setIsPasswordShown ] = React.useState(false);
  const [ resultCode, setResultCode ] = React.useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <section className='flex gap-7 md:flex-nowrap flex-wrap px-12 py-16 md:flex-row flex-col-reverse'>
        <div>
            <div className='mb-7 w-fit'>
                <Link href="" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=467244&theme=neutral" alt="Mailer - Effortless&#0032;mailing&#0032;service&#0044;&#0032;Instant&#0032;Results | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" /></Link>
            </div>
            <Link target='_blank' href={'https://xnyder.com'} className='bg-[#eaebfb] px-4 py-2 text-blue-600 font-semibold text-sm'>A tool by Xnyder</Link>
            <h1 className='md:text-6xl py-4 text-4xl'>The <span className='text-blue-600'>Mailing</span> service<span className='text-blue-600'> designed</span> for you.</h1>
            <p className='mt-1 text-sm'><span className='opacity-60'>Easily send mails to </span> <span className='text-blue-600'>Clients</span> <span className='opacity-60'>right here and now. Tap the button and let the magic unfold! ✨</span></p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
                <div className='flex gap-3 md:flex-nowrap flex-wrap'>
                  <FormField
                    control={form.control}
                    name="host_type"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder="Host type" {...field} className={`${form.control._formState.errors.host_type && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smtp_host"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder="SMTP Host" {...field} className={`${form.control._formState.errors.smtp_host && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex gap-3 md:flex-nowrap flex-wrap'>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder="Username" {...field} className={`${form.control._formState.errors.username && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Input type={ isPasswordShown ? 'text' : 'password'} placeholder="Password" {...field} className={`${form.control._formState.errors.password && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                        <div className='absolute bottom-3 right-4 w-fit cursor-pointer'>
                            {isPasswordShown ?
                            <EyeOff onClick={()=> setIsPasswordShown(false)}/>
                            :
                            <Eye onClick={()=> setIsPasswordShown(true)}/>

                            }
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex gap-3 md:flex-nowrap flex-wrap'>
                  <FormField
                    control={form.control}
                    name="from_email"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input type='email' placeholder="info@server.com" {...field} className={`${form.control._formState.errors.from_email && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input type={'file'} {...field} className={`${form.control._formState.errors.emails && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex gap-3 md:flex-nowrap flex-wrap'>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder="Subject" {...field} className={`${form.control._formState.errors.subject && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Textarea placeholder="Plain text content" {...field} className={`${form.control._formState.errors.password && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex gap-3 md:flex-nowrap flex-wrap'>
                  <FormField
                    control={form.control}
                    name="html"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Textarea placeholder="HTML Content" {...field} className={`${form.control._formState.errors.username && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Input type={'file'} placeholder="Password" {...field} className={`${form.control._formState.errors.password && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex gap-3 md:flex-nowrap flex-wrap'>
                  <FormField
                    control={form.control}
                    name="sender"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder="Sender of the email" {...field} className={`${form.control._formState.errors.username && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reply_to"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Input  type={'email'} placeholder="Email address replies can be sent." {...field} className={`${form.control._formState.errors.password && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}  onFocus={()=> console.log("user",form.control._formState.errors.username)}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className='bg-blue-600 w-full py-3 font-bold'>Send </Button>
              </form>
            </Form>

            
        </div>
        <div className='overflow-hidden w-full '>
        <CodeBlock
                                text={!resultLoaded ? `
const fd = new FormData();
fd.append("host_type", undefined || OTHER);
fd.append("smtp_host", undefined);
fd.append("username", undefined);
fd.append("password", ******);
fd.append("from_email", "");
fd.append("emails", [""]);
fd.append("subject", "");
fd.append("text", "");
fd.append("html", "");
fd.append("attachments", [array]);
fd.append("sender", "");
fd.append("reply_to", "");
try {
    const response = await axios({
        method: 'POST',
        url: 'https://api.mailer.xnyder.com/send/multiple',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'mailer-access-key': '***********'
        }
    });
    console.log('File uploaded successfully:', response.data);
    alert('File uploaded successfully!');
} catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file. Please try again.');
}` : `
${resultCode}
`}
                                language={!resultLoaded ? 'javascript' : 'json'}
                                showLineNumbers={false}
                                startingLineNumber={1}
                                theme={vs2015}
                                codeContainerStyle={{
                                    // backgroundColor: 'black',
                                    padding: '16px 16px',
                                    fontSize: '13.4px',
                                    fontFamily: 'Consolas',
                                    overflow: 'auto',
                                    scrollbarWidth: 'none', // Firefox
                                    msOverflowStyle: 'none', // IE
                                    
                                    
                                }}
                                
                                
                                
                            />
                            <Link className='mt-1 text-[#ff6b37] text-sm font-semibold underline-offset-4 underline' target='_blank' href={'https://documenter.getpostman.com/view/16645752/2sA3rxpD5v'}>Click to see our full documentation</Link>

        </div>
      
    </section>
  )
}

export default ContentForm
