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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronDown, Eye, EyeOff, Loader2, Paperclip, X } from 'lucide-react';
import axios from "axios";
import { useToast } from "@/hooks/use-toast"
import { convertAttachmentToArray, convertEmailsToArray, emailRegExp, getSmtpHost, isEmailValidated, steps } from '@/lib/global'
import AppTour from '@/hooks/Tour'
import Editor from '@/components/editor/advanced-editor'


const AcceptedTypes = ['text/csv', 'text/xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']

const MailerForm = () => {
  const [isSingleEmail, setIsSingleEmail] = React.useState<boolean>(false)
  const [ isPasswordShown, setIsPasswordShown ] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { toast } = useToast()
  const [acceptedEmails, setAcceptedEmails] = React.useState<Array<string> | undefined>([])
  const [isTourOpen, setIsTourOpen] = React.useState(false);
  const [currentInput, setCurrentInput] = React.useState<string>("");
  const EMAIL_MAX_SIZE = 100

    const formSchema = z.object({
        host_type: z.string().min(2, {
          message: "Host type is required",
        }),
        smtp_host: z.string().optional(),
        username: z.string().min(2, {
          message: "Username must be at least 2 characters.",
        }).refine((value) => value && value?.trim().length >= 2, {message: "Invalid data."}),
        password: z.string().min(2, {
          message: "Password must be at least 2 characters.",
        }).refine((value) => value && value?.trim().length >= 2, {message: "Invalid data."}),
        from_email: z.string().min(2, {
          message: "Text must be at least 2 characters.",
        }).refine((value) => value && value?.trim().length >= 2, {message: "Invalid data."}),
        emails: 
        z.string({required_error: ""}).refine(() => acceptedEmails!.length > 0, {message: "No email added."}),
        subject: z.string().min(2, {
          message: "Subject must be at least 2 characters.",
        }).optional().refine((value) => value && value?.trim().length >= 2, {message: "Invalid data."}),
        text: z.string().optional(),
        html: z.string().min(4, {
          message: "Content must be at least 2 characters.",
        }).refine((value) => value && value?.trim().length >= 2, {message: "Too short."}),
        attachments: typeof window !== "undefined" ?
        z.instanceof(FileList, {message: ""}).refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).optional()
        :
        z.any().refine((files) => files?.[0]?.size <= 1024 * 1024 * 5, {message: "File max size is 5MB"}).optional()
        ,
        sender: z.string().optional(),
        reply_to: z.string().optional().refine((value) =>  !value || emailRegExp.test(value), {message: "Reply-to must be a valid email address."}),
      })
      // .superRefine((data, ctx) => {
      //   if (data.host_type.toLocaleLowerCase() === "other" && !data.smtp_host?.trim()) {
      //     ctx.addIssue({
      //       code: z.ZodIssueCode.custom,
      //       path: ["smtp_host"], 
      //       message: "Smtp host is required when host type is 'other'",
      //     })
      //   }
      //   })

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

          const handleAdditionOfEmails = (emailArray: string[]) => {
            if(acceptedEmails && acceptedEmails?.length < EMAIL_MAX_SIZE){
              const remainingEmails = EMAIL_MAX_SIZE - acceptedEmails?.length
              const filteredEmailArray = emailArray.slice(0,remainingEmails).filter((email:string, index: number) =>emailRegExp.test(email) && !acceptedEmails?.includes(email) && emailArray.indexOf(email) === index);
              if (filteredEmailArray.length > 0){
                setAcceptedEmails((prev)=> [...(prev as string[]), ...filteredEmailArray])
                toast({
                  description: `Emails added`,
                  variant: "updated"
              })
              }
            }else{
              toast({
                description: `Only ${EMAIL_MAX_SIZE} emails per batch`,
                variant: "destructive"
            })
            }

          }

          const handleEmailOnchangeArrayFile = async (emailFile: any) => {
            const  emailArray = await convertEmailsToArray(emailFile)
            handleAdditionOfEmails(emailArray as string[])
        }

          const handleEmailInput = async (email: any) => {
            const  emailArray = email.split(/[\s,]+/)
            if(emailArray.length <= 1){
              const trimmedEmail = email.trim();
              setCurrentInput(trimmedEmail)
            }else{
              handleAdditionOfEmails(emailArray)
          }
        }

          const removeEmail = (email:string) => {
            const filteredEmailArray = acceptedEmails?.filter((prev) => prev !== email)
            setAcceptedEmails(filteredEmailArray)
          }
        
          const addEmail = () => {
            const trimmedEmail = currentInput.trim();
            if(acceptedEmails && acceptedEmails?.length < EMAIL_MAX_SIZE){
              if (emailRegExp.test(trimmedEmail) && !acceptedEmails?.includes(trimmedEmail)) {
                setAcceptedEmails([...(acceptedEmails as string[]), trimmedEmail]);
              }
              setCurrentInput("");
            }else{
              toast({
                description: `Only ${EMAIL_MAX_SIZE} emails per batch`,
                variant: "destructive"
            })
            }
          };
        
          const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              // event.stopPropagation(); 
              addEmail();
            }
          };
          const handlePrematureFormSubmission = (event: React.KeyboardEvent<HTMLFormElement>) => {
            // Prevent Enter globally if not inside an input
            if (event.key === "Enter" && !(event.target instanceof HTMLInputElement)) {
              event.preventDefault();
            }
          };


          const renderEmails = () => (
            <ol className='text-sm flex items-center'>
                {acceptedEmails && acceptedEmails.length > 2 ?
                  <Dialog>
                    <DialogTrigger>
                        <span className='flex border rounded-2xl py-1 px-2 w-fit items-center'>
                          <span>
                            {acceptedEmails[0].length > 10 ? (acceptedEmails[0].slice(0,5) + "...") : acceptedEmails[0]} and {acceptedEmails.length - 1} more.
                          </span>
                          <ChevronDown/>                   
                        </span>

                    </DialogTrigger>
                    <DialogContent className='max-h-[40rem] max-w-96 text-wrap overflow-y-auto overflow-x-hidden no-scrollbar'>
                      <DialogHeader className='space-y-5'>
                        <DialogTitle className='text-left text-2xl'><span className='border rounded-full mr-1 mb-2 px-4 py-2 text-sm xynder-bg-color text-white'>{acceptedEmails.length}</span>Accepted Emails</DialogTitle>
                        <hr className='py-1'/>
                        <DialogDescription asChild className='space-y-2'>
                          <ul style={{"listStyleType": "decimal"}}>
                            {acceptedEmails && acceptedEmails.map((email, index) => (
                              <span key={`${email}-${index}`} className='flex justify-between text-sm text-black '>
                                <li className='!break-all max-w-full text-left list-inside'>{email}</li>
                                <X color='red' onClick={()=>removeEmail(email)} className='cursor-pointer'/>
                              </span>
                            ))}

                          </ul>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                :
                acceptedEmails?.map((email, index) => (
                  <span
                    key={index}
                    className={`flex items-center rounded-full border px-2 py-1 mr-2 ${
                      emailRegExp.test(email) ? "border-gray-300" : "border-red-500 border-dotted"
                    }`}
                  >
                    {email}
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => removeEmail(email)}
                    >
                      &times;
                    </button>
                  </span>
                ))

                }

            </ol>
          )

          const isHTML = (value: string): boolean => {
            const doc = new DOMParser().parseFromString(value, "text/html")
            return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1) // Check if there's at least one element node
          }
        
          async function onSubmit(data: z.infer<typeof formSchema>) {
            const  attachmentArray = convertAttachmentToArray(data.attachments)

            const payload = {
              host_type: data.host_type.toLocaleUpperCase(),
              smtp_host: data.host_type === "OTHER" ? getSmtpHost(data.username) : undefined,
              username: data.username,
              password: data.password,
              from_email: data.from_email,
              emails: acceptedEmails, 
              subject: data.subject || undefined,
              text: data.text || undefined,
              html: data.html,
              attachments: attachmentArray.length > 0 ? attachmentArray : undefined, 
              sender: data.sender || undefined,
              reply_to: data.reply_to || undefined,
            };

            try{
            setIsLoading(true)
            const response = await axios.post("https://api.mailer.xnyder.com/send/multiple", payload, {
                headers: {
                "Content-Type": "application/json",
                "mailer-access-key": "d8b40bda-9193-4ac8-b7cf-82d2c09ed7c1",
                },
            });

            toast({
                description: "Sent successfully!",
                variant: "success"
            })
            form.reset()
            setAcceptedEmails([])
            }catch(error:any){
            if (error.message === "Network Error") {
                console.log("network: ", error.message)
                toast({
                description: "Network error. Please check your internet connection and try again.",
                variant: "destructive"
            })
                
            } else if (error.response?.status === 400) {
                toast({
                description: error.response.data.message,
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
            
            }finally{
            setIsLoading(false)
            }
          }
          
  return (
    <section className='relative'>
         <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handlePrematureFormSubmission} className="space-y-4 pt-6 flex md:flex-nowrap flex-wrap md:pt-7">
                {/* <span onClick={() => setIsTourOpen(true)} className='mt-24 border bg-white shadow w-fit h-fit py-2 px-4 ml-2 cursor-pointer md:sticky top-24'>Take Tour</span> */}

                <div className='bg-white mt-24 py-5 md:max-w-[36rem] w-full mx-auto p-4 md:rounded-2xl md:!sticky h-fit top-28 md:flex-1'>
                  
                    <FormField
                        control={form.control}
                        name="from_email"
                        render={({ field }) => (
                        <FormItem id='from-email' className={`${form.control._formState.errors.from_email && "border-b-red-500 !border-b-2"} border-b w-full flex items-center gap-x-1`}>
                            <FormLabel className="text-muted-foreground">
                                From:
                            </FormLabel>
                            <FormControl>
                            <Input placeholder="'Customer Agent info@server.com' or 'info@server.com'"  {...field} className={` ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 pl-0 !bg-white focus:!bg-white focus-within:!bg-white shadow-none border-0 rounded-none pt-0 pb-2`}/>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                  <div className='relative'>
                  <div className="flex justify-center w-fit items-center gap-2 pb-1 absolute right-4 top-5" id="emails-toggle">
                      <div className="relative pr-2" >
                        <label htmlFor="file-input" className="cursor-pointer">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                                <Paperclip size={18}/>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add your .csv, .xlsx, .txt file and watch us filter valid emails.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        </label> 
                        <Input type="file" id="file-input" className="hidden" accept='.csv, .xlsx, .txt'  onChange={(e) => {handleEmailOnchangeArrayFile(e.target.files)}} />
                      </div>
                    </div>

                        
                    <FormField
                      control={form.control}
                      name="emails"
                      render={({ field }) => (
                        <FormItem id='emails' className={`${form.control._formState.errors.emails && "border-b-red-500 !border-b-2"} border-b w-full flex gap-x-1 flex-col py-2`}>
                          <div className='flex items-center gap-x-1'>
                            <FormLabel className="text-muted-foreground">
                              Recipients:
                            </FormLabel>
                              <FormControl>
                                <div className='w-full pr-5 flex items-center px-2 py-1 gap-2 flex-wrap overflow-auto no-scrollbar'>
                                    {renderEmails()}
                                    <Input type="text" value={currentInput} placeholder="receiver@gmail.com" onKeyDown={handleKeyPress} ref={field.ref} onChange={(e) => {field.onChange(e.target.value), handleEmailInput(e.target.value)}} className={`ring-offset-transparent flex-1 focus-visible:!ring-offset-0 focus-visible:!ring-0 pl-0 !bg-white focus:!bg-white focus-within:!bg-white shadow-none border-0  rounded-none `}/>
                                  {emailRegExp.test(currentInput) && (
                                    <div
                                      className="absolute top-full mt-1 bg-white border rounded-md shadow-md p-2 cursor-pointer flex items-center gap-2"
                                      onClick={addEmail}
                                    >
                                      <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>{currentInput.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <span className='!break-all max-w-full'>{currentInput}</span>
                                    </div>
                                  )}

                                   
                                </div>
                              </FormControl>
                          </div>
                          

                          <FormMessage/>
                        </FormItem>
                      )}
                    />

                  </div>
              
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem id='subject' className={`${form.control._formState.errors.subject && "border-b-red-500 !border-b-2"} border-b w-full flex items-center gap-x-1`}>
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
                      <FormItem id='html' className='w-full'>
                        <FormControl>
                          <Editor {...field} givenClass={`${form.control._formState.errors.html && "border-b-red-500 !border-b-2"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 !bg-white focus:!bg-white focus-within:!bg-white shadow-none border-b rounded-none mt-4 px-2 list-inside`}/>
                        </FormControl>
                        <div className='flex justify-between'>
                          <FormDescription>
                            The content of the email.
                          </FormDescription>
                          {field.value.trim().length > 1 &&
                              <Dialog>
                              <DialogTrigger asChild>
                                      <Button type='button' className='xynder-bg-color'>Preview</Button>
                              </DialogTrigger>
                              <DialogContent className='h-[35rem] px-2 text-wrap overflow-y-auto overflow-x-hidden no-scrollbar'>
                                <DialogHeader className='space-y-5'>
                                  <DialogTitle className='text-left text-2xl'></DialogTitle>
                                  <DialogDescription asChild className='space-y-2'>
                                    {isHTML(field.value) ? (
                                      <div dangerouslySetInnerHTML={{__html:field.value}} className='formatted-html'/>
                                    ):
                                    <pre className='formatted-text whitespace-pre-wrap'>
                                      {field.value}
                                    </pre>
                                    }
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          }

                        </div>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='md:right-0 !pt-20 pb-6 px-3 md:!w-80 w-full bg-white space-y-5'>
                    <h2 className='text-lg pb-1 font-bold'>Configuration</h2>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                        <FormItem  className='w-full'>
                            <FormControl>
                            <Input id='username' placeholder="Username" {...field} className={`${form.control._formState.errors.username && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
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
                            <Input id='password' type={ isPasswordShown ? 'text' : 'password'} placeholder="Password" {...field} className={`${form.control._formState.errors.password && "border-b-red-500"} pr-12 ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id='host' className={`${form.control._formState.errors.host_type && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6 text-muted-foreground`}>
                            <SelectValue placeholder="Send message with?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GOOGLE">Google</SelectItem>
                          <SelectItem value="OTHER">My Server</SelectItem>
                        </SelectContent>
                      </Select>
                        <FormDescription>
                            The type of host.
                        </FormDescription>
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
                          <Input id='sender' type='text' placeholder="Sender of the email" {...field} className={`${form.control._formState.errors.sender && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
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
                          <Input id='reply_to' type={'email'} placeholder="Email address replies can be sent." {...field} className={`${form.control._formState.errors.reply_to && "border-b-red-500"} ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow py-6`}/>
                        </FormControl>
                        <FormDescription>
                          The email address to which replies should be sent.
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                   {/* <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormControl>
                          <Input id='attachments' type={'file'} ref={field.ref}  onChange={(e) => field.onChange(e.target.files)} className={`${form.control._formState.errors.attachments && "border-b-red-500"} file:bg-violet-50 file:text-violet-700 rounded-md hover:file:bg-violet-100 ring-offset-transparent focus-visible:!ring-offset-0 focus-visible:!ring-0 border-b-2 bg-white shadow pt-4 pb-8`} multiple={true}/>
                        </FormControl>
                        <FormDescription>
                            Attachments 
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  /> */}
                
                    <Button type="submit" className='bg-blue-600 w-full py-3 font-bold' disabled={isLoading}>{isLoading ? <span className='mx-auto'><Loader2 className='animate-spin'/></span>: "Send"} </Button>

                </div>
              </form>
          </Form>
      <AppTour steps={steps} isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </section>
  )
}

export default MailerForm
