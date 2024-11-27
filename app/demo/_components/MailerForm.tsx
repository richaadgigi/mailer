"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import axios from "axios";
import { useToast } from "@/hooks/use-toast"
import { convertAttachmentToArray, convertEmailsToArray } from '@/lib/global'

const AcceptedTypes = ['text/csv', 'text/xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']

const MailerForm = () => {
  const [isSingleEmail, setIsSingleEmail] = React.useState<boolean>(false)
  const [ isPasswordShown, setIsPasswordShown ] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { toast } = useToast()




    const formSchema = z.object({
        host_type: z.string().min(2, {
          message: "Host type is required",
        }),
        smtp_host: z.string().optional(),
        username: z.string().min(2, {
          message: "Username must be at least 2 characters.",
        }),
        password: z.string().min(2, {
          message: "Password must be at least 2 characters.",
        }),
        from_email: z.string().email().min(2, {
          message: "Email must be at least 2 characters.",
        }),
        emails: isSingleEmail ?
        typeof window !== "undefined" ?
        z.instanceof(FileList, {message: ""}).refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).refine((files) => AcceptedTypes.includes(files?.[0].type), {message: "Only csv, xlsx, txt accepted"}).optional()
        :
        z.any().refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).refine((files) => files?.[0].type === "text/plain", {message: "Only txt accepted"}).optional()
        :
        z.string({required_error: ""}).email().min(2, {
          message: "Email must be at least 2 characters.",
        }),
        subject: z.string().min(2, {
          message: "Subject must be at least 2 characters.",
        }).optional(),
        text: z.string().optional(),
        html: z.string().min(2, {
          message: "Html must be at least 2 characters.",
        }),
        attachments: typeof window !== "undefined" ?
        z.instanceof(FileList, {message: ""}).refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).optional()
        :
        z.any().refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).optional()
        ,
        sender: z.string().optional(),
        reply_to: z.string().optional().refine((value) =>  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {message: "Reply-to must be a valid email address."}),
      }).superRefine((data, ctx) => {
        if (data.host_type.toLocaleLowerCase() === "other" && !data.smtp_host?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["smtp_host"], 
            message: "Smtp host is required when host type is 'other'",
          })
        }
        })

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
              host_type: "",
              smtp_host: "",
              username: "",
              password: "",
              from_email: "",
              emails: undefined,
              subject: "",
              html: "",
              text: "",
              attachments: undefined,
              sender: "",
              reply_to: ""
            },
          })
        
          async function onSubmit(data: z.infer<typeof formSchema>) {
            const  emailArray = await convertEmailsToArray(data.emails)
            const  attachmentArray = convertAttachmentToArray(data.attachments)
            if(!emailArray){
            return
            }

            // Prepare JSON payload
            const payload = {
              host_type: data.host_type.toLocaleUpperCase(),
              smtp_host: data.smtp_host || undefined,
              username: data.username,
              password: data.password,
              from_email: data.from_email,
              emails: emailArray, 
              subject: data.subject || undefined,
              text: data.text || undefined,
              html: data.html,
              attachments: attachmentArray.length > 0 ? attachmentArray : undefined, 
              sender: data.sender || undefined,
              reply_to: data.reply_to || undefined,
            };

            console.log("payload", payload)
            try{
            setIsLoading(true)
            const response = await axios.post("https://api.mailer.xnyder.com/send/multiple", payload, {
                headers: {
                "Content-Type": "application/json",
                "mailer-access-key": "d8b40bda-9193-4ac8-b7cf-82d2c09ed7c1",
                },
            });
        
            // Handle successful response
            console.log("File uploaded successfully:", response.data);
            toast({
                description: "File uploaded successfully!",
                variant: "success"
            })

        

            }catch(error:any){
            if (error.message === "Network Error") {
                console.log("network: ", error.message)
                toast({
                description: "Network error. Please check your internet connection and try again.",
                variant: "destructive"
            })
                
            } else if (error.response?.status === 400) {
                toast({
                description: "Bad Request. Please ensure all form fields are valid.",
                variant: "destructive"
            })
            }else if (error.response?.status === 422) {
                toast({
                description: error.response.data.data[0].msg,
                variant: "destructive"
            })
            } else if (error.response?.status === 500) {
                toast({
                description: "Server error. Please try again later.",
                variant: "destructive"
            })
            } else if (error.message) {
                toast({
                description: error.message,
                variant: "destructive"
            })
            } else {
                toast({
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive"
            })
                
            }
            console.log("error", error)
            }finally{
            setIsLoading(false)
            }
          }
  return (
    <section className='relative'>
         <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6 flex md:flex-nowrap flex-wrap md:pt-0 pt-24">
                <div className='bg-white mt-24 py-5 md:max-w-[36rem] w-full mx-auto p-4 md:rounded-2xl md:!sticky h-fit top-28 md:flex-1'>
                    <FormField
                        control={form.control}
                        name="from_email"
                        render={({ field }) => (
                        <FormItem className={`${form.control._formState.errors.from_email && "border-b-red-500 !border-b-2"} border-b w-full flex items-center gap-x-1`}>
                            <FormLabel className="text-muted-foreground">
                                From:
                            </FormLabel>
                            <FormControl>
                            <Input type='email' placeholder="info@server.com" {...field} className={` ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 pl-0 !bg-white focus:!bg-white focus-within:!bg-white shadow-none border-0 rounded-none pt-0 pb-2`}/>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                  <div className='relative'>
                    <div className='flex justify-center items-center gap-2 pb-1 absolute right-4 top-4'>
                        <Switch checked={isSingleEmail}  onCheckedChange={()=>setIsSingleEmail(!isSingleEmail)}/>
                    </div>
                    <FormField
                      control={form.control}
                      name="emails"
                      render={({ field }) => (
                        <FormItem className={`${form.control._formState.errors.emails && "border-b-red-500 !border-b-2"} border-b w-full flex items-center gap-x-1`}>
                        <FormLabel className="text-muted-foreground">
                           {isSingleEmail ? 'Recipients:' : 'Recipient:'} 
                        </FormLabel>
                          <FormControl>
                            {isSingleEmail ?
                            <div>
                            <Input type={'file'} ref={field.ref}  accept=".xlsx, .csv, .txt" onChange={(e) => field.onChange(e.target.files)} className={`file:bg-violet-50 file:text-violet-700 rounded-md hover:file:bg-violet-100 ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-none bg-white shadow-none`}/>
                            </div>
                            :
                            <div>
                            <Input type="email" placeholder="receiver@gmail.com" ref={field.ref} onChange={(e) => field.onChange(e.target.value)} className={`ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 pl-0 !bg-white focus:!bg-white focus-within:!bg-white shadow-none border-0 rounded-none pt-0 pb-2`}/>
                            </div>
                            }
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />

                  </div>
              
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className={`${form.control._formState.errors.subject && "border-b-red-500 !border-b-2"} border-b w-full flex items-center gap-x-1`}>
                        <FormLabel className="text-muted-foreground">
                            Subject:
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Subject" {...field} className={`ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 pl-0 !bg-white focus:!bg-white focus-within:!bg-white shadow-none border-0 rounded-none pt-0 pb-2`}/>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="html"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Textarea placeholder="Type here..." {...field} rows={12} className={`${form.control._formState.errors.html && "border-b-red-500 !border-b-2"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 pl-0 !bg-white focus:!bg-white focus-within:!bg-white shadow-none border-b rounded-none mt-4 px-2`}/>
                        </FormControl>
                        <FormDescription>
                          The content of the email.
                        </FormDescription>
                      </FormItem>
                    )}
                  />


                </div>
                <div className='md:right-0 !py-20 px-3 md:!w-80 w-full bg-white space-y-5'>
                    <h2 className='text-lg pb-1 font-bold'>Configuration</h2>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormControl>
                            <Input placeholder="Username" {...field} className={`${form.control._formState.errors.username && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                            </FormControl>
                            <FormDescription>
                            The username for authentication.
                            </FormDescription>
                        </FormItem>
                        )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Input type={ isPasswordShown ? 'text' : 'password'} placeholder="Password" {...field} className={`${form.control._formState.errors.password && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <div className='absolute top-2 right-4 w-fit cursor-pointer'>
                            {isPasswordShown ?
                            <EyeOff onClick={()=> setIsPasswordShown(false)}/>
                            :
                            <Eye onClick={()=> setIsPasswordShown(true)}/>

                            }
                        </div>
                        <FormDescription>
                            The password for authentication.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="host_type"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder="Host type" {...field} className={`${form.control._formState.errors.host_type && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                            The type of host.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smtp_host"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder="SMTP Host" {...field} className={`${form.control._formState.errors.smtp_host && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                          The SMTP host, this is needed if the host_type is equal to OTHER.
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                <hr className='h-[0.1rem] my-2' color='black'/>
                <h3 className='text-center '>Additional Options</h3>
                <FormField
                    control={form.control}
                    name="sender"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input type='text' placeholder="Sender of the email" {...field} className={`${form.control._formState.errors.sender && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                          The sender of the email.
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reply_to"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Input  type={'email'} placeholder="Email address replies can be sent." {...field} className={`${form.control._formState.errors.reply_to && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                          The email address to which replies should be sent.
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Input type={'file'} ref={field.ref}  onChange={(e) => field.onChange(e.target.files)} className={`${form.control._formState.errors.attachments && "border-b-red-500"} file:bg-violet-50 file:text-violet-700 rounded-md hover:file:bg-violet-100 ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow pt-4 pb-8`} multiple={true}/>
                        </FormControl>
                        <FormDescription>
                            Attachments 
                        </FormDescription>
                        {/* <p></p> */}
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                
                    <Button type="submit" className='bg-blue-600 w-full py-3 font-bold' disabled={isLoading}>{isLoading ? <span className='mx-auto'><Loader2 className='animate-spin'/></span>: "Send"} </Button>

                </div>
              </form>
            </Form>


      
    </section>
  )
}

export default MailerForm
