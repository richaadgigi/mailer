"use client"

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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import * as XLSX from "xlsx"; 
import { parse } from "papaparse"; 
import axios from "axios";
import { useToast } from "@/hooks/use-toast"

const AcceptedTypes = ['text/csv', 'text/xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']

const ContentForm = () => {
  const [ resultLoaded, setResultLoaded ] = React.useState(false);
  const [ isPasswordShown, setIsPasswordShown ] = React.useState(false);
  const [ resultCode, setResultCode ] = React.useState(null);
  const [isSingleEmail, setIsSingleEmail] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { toast } = useToast()
  // console.log("log", isOther)
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
    z.instanceof(FileList, {message: "Required"}).refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).refine((files) => AcceptedTypes.includes(files?.[0].type), {message: "Only csv, xlsx, txt accepted"}).optional()
    :
    z.any().refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).refine((files) => files?.[0].type === "text/plain", {message: "Only txt accepted"}).optional()
    :
    z.string().email().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    subject: z.string().min(2, {
      message: "Subject must be at least 2 characters.",
    }).optional(),
    text: z.string().min(2, {
      message: "Text must be at least 2 characters.",
    }).optional(),
    html: z.string().min(2, {
      message: "Html must be at least 2 characters.",
    }),
    attachments: typeof window !== "undefined" ?
    z.instanceof(FileList, {message: "Required"}).refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).optional()
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
      attachments: undefined,
      sender: "",
      reply_to: ""
    },
  })

  const isOther = form.watch("host_type").toLocaleLowerCase() === "other"
  // console.log("isOther", isOther)

  const handleCSVUpload = async (file: File) => {
    const csvData = await new Promise<string[]>((resolve, reject) => {
          parse(file, {
            complete: (result) => {
              const parsedEmails: any = result.data.flat(); // Flatten in case of nested arrays
              resolve(parsedEmails.filter((email:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))); // Filter valid emails
            },
            error: reject,
          });
        });
      return csvData
    
  };

  const handleXLSXUpload = async (file: File) => {
    // Read Excel file and parse emails
   let emailsArray: string[] = []
    const reader = new FileReader();
    await new Promise<void>((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
          emailsArray = rows.flat().filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

    return emailsArray
  };

  const convertTextFileToArray = async (data: File) => {
        const fileContent = await data.text(); // For text file
        const fileArray = fileContent
          .split(/\r?\n/) // Split by new lines
          .map((line: string) => line.trim()) // Trim whitespace
          .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); // Validate email format

          return fileArray

  }


const convertEmailsToArray = async (emails: FileList | string) => {
  let emailsArray: string[] = [];
    
    if (emails instanceof FileList) {
     const file = emails[0];
     const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension === "csv") {
      emailsArray = await handleCSVUpload(file);
    } else if (fileExtension === "xlsx") {
      emailsArray =  await handleXLSXUpload(file)
    } else if (fileExtension === "txt"){
      emailsArray = await convertTextFileToArray(emails[0]);
    }
    else {
      alert("Unsupported file type. Please upload a CSV or XLSX or Txt file.");
      return;
    }
  }
  else if (typeof emails === "string") {
    emailsArray = [emails];
  }

  if (emailsArray.length === 0) {
    alert("No valid email addresses found.");
    return;
  }
    return emailsArray

}

const convertAttachmentToArray = (attachments:any) => {
    let attachmentArray: { filename: string; path: File; }[] = [];
    if (attachments) {
      attachmentArray = Array.from(attachments).map((file: any) => ({
        filename: file.name,
        path: file
      }));
    }
    return attachmentArray
}
 

  async function onSubmit(data: z.infer<typeof formSchema>) {

    const  emailArray = await convertEmailsToArray(data.emails)
    const  attachmentArray = convertAttachmentToArray(data.attachments)
    if(!emailArray){
      return
    }
    console.log("email", emailArray)
    console.log("att", attachmentArray)
    

    const formData = new FormData();
    formData.append("host_type", data.host_type);
    formData.append("smtp_host", data.smtp_host as string);
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("from_email", data.from_email);
    formData.append("emails", JSON.stringify(emailArray)); 
    formData.append("subject", data.subject as string);
    formData.append("text", data.text as string);
    formData.append("html", data.html);
    formData.append("attachments", JSON.stringify(attachmentArray));
    formData.append("sender", data.sender as string);
    formData.append("reply_to", data.reply_to as string);

    // Debugging form data
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try{
      setIsLoading(true)
      const response = await axios.post("https://api.mailer.xnyder.com/send/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
        toast({
          description: "Network error. Please check your internet connection and try again.",
          variant: "destructive"
      })
        
      } else if (error.response?.status === 400) {
        toast({
          description: "Bad Request. Please ensure all form fields are valid.",
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
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <section className='flex gap-7 md:flex-nowrap flex-wrap md:px-12 px-6 pt-44 pb-24 md:flex-row flex-col-reverse'>
        <div className=''>
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
                          <Input placeholder="Host type" {...field} className={`${form.control._formState.errors.host_type && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                            The type of host.
                        </FormDescription>
                        <FormMessage/>
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
                </div>
                <div className='flex gap-3 md:flex-nowrap flex-wrap'>
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
                </div>
                  <FormField
                    control={form.control}
                    name="from_email"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input type='email' placeholder="info@server.com" {...field} className={`${form.control._formState.errors.from_email && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                          The sender's email address ('sender@server.com' or formatted 'Sender Name sender@server.com').
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <div>
                    <div className='flex justify-center items-center gap-2 pb-1'>
                      <span className='text-xs text-muted-foreground'>Single email</span>
                        <Switch checked={isSingleEmail}  onCheckedChange={()=>setIsSingleEmail(!isSingleEmail)}/>
                      <span className='text-xs text-muted-foreground'>Multiple emails</span>
                    </div>
                    <FormField
                      control={form.control}
                      name="emails"
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormControl>
                            {isSingleEmail ?
                            <div>
                            <Input type={'file'} ref={field.ref}  accept=".xlsx, .csv, .txt" onChange={(e) => field.onChange(e.target.files)} className={`${form.control._formState.errors.emails && "border-b-red-500"} file:bg-violet-50 file:text-violet-700 rounded-md hover:file:bg-violet-100 ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow pt-4 pb-8`}/>
                            <FormDescription>
                              Recipients email addresses should be in txt file.
                            </FormDescription>
                            
                            </div>
                            :
                            <div>
                            <Input type="email" placeholder="Email address" ref={field.ref} onChange={(e) => field.onChange(e.target.value)} className={`${form.control._formState.errors.emails && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                            <FormDescription>
                              Recipient email address.
                            </FormDescription>
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
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder="Subject" {...field} className={`${form.control._formState.errors.subject && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                          The subject of the email.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="html"
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Textarea placeholder="HTML Content" {...field} className={`${form.control._formState.errors.html && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                          The HTML content of the email.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                

                <hr className='h-[0.1rem]' color='black'/>
                <h3 className='text-center'>Additional Options</h3>
                <div className='flex gap-3 md:flex-nowrap flex-wrap'>
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
                </div>
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
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Textarea placeholder="Plain text content" {...field} className={`${form.control._formState.errors.text && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                            The plain text content of the email.
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                <Button type="submit" className='bg-blue-600 w-full py-3 font-bold' disabled={isLoading}>{isLoading ? <span className='mx-auto'><Loader2 className='animate-spin'/></span>: "Send"} </Button>
              </form>
            </Form>

            
        </div>
        <div className='overflow-hidden w-full md:sticky top-28 h-fit'>
        <CodeBlock
                                text={!resultLoaded ? `
const fd = new FormData();
fd.append("host_type", ${form.watch('host_type') ? `${form.getValues('host_type')}` : undefined} || OTHER);
fd.append("smtp_host", ${form.watch('smtp_host') ? `${form.getValues('smtp_host')}` : undefined});
fd.append("username", ${form.watch('username') ? `${form.getValues('username')}` : undefined});
fd.append("password", ${form.watch('password') ? `${"*".repeat(form.getValues('password')?.length as number)}` : undefined});
fd.append("from_email", ${form.watch('from_email') ? `${form.getValues('from_email')}` : undefined});
fd.append("emails", [array]);
fd.append("subject", ${form.watch('subject') ? `${form.getValues('subject')}` : undefined});
fd.append("text", ${form.watch('text') ? `${form.getValues('text')}` : undefined});
fd.append("html", ${form.watch('html') ? `Html inserted` : undefined});
fd.append("attachments", [array]);
fd.append("sender", ${form.watch('sender') ? `${form.getValues('sender')}` : undefined});
fd.append("reply_to", ${form.watch('reply_to') ? `${form.getValues('reply_to')}` : undefined});
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
