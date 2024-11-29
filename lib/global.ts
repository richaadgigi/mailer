import * as XLSX from "xlsx"; 
import { parse } from "papaparse"; 

 
export const steps = [
  {
    id: 'email-step',
    title: 'Email Input',
    text: 'Which email are you sending from?',
    attachTo: { element: '#from-email', on: "bottom" },
  },
  {
    id: 'email-step',
    title: 'Emails',
    text: 'Emails that will receive the message. You can add multiple email will a comma.',
    attachTo: { element: '#emails', on: "bottom" },
  },
  {
    id: 'email-icon-step',
    title: 'Toggle',
    text: 'Switch and insert a - .txt, .csv, .xlsx - file. We filter the emails in it.',
    attachTo: { element: '#emails-toggle', on: "bottom" },
  },
  {
    id: 'subject-step',
    title: 'Subject Input',
    text: 'The heading of your mail.',
    attachTo: { element: '#subject', on: "bottom" },
  },
  {
    id: 'html-step',
    title: 'Text content',
    text: 'Type your content here...',
    attachTo: { element: '#html', on: "top" },
  },
  {
    id: 'username-step',
    title: 'Username',
    text: 'The username you use for sign in.',
    attachTo: { element: '#username', on: "top" },
  },
  {
    id: 'password-step',
    title: 'Password',
    text: 'Password needed for sign in',
    attachTo: { element: '#password', on: "top" },
  },
  {
    id: 'host-step',
    title: 'Host type',
    text: 'Choose my server if you prefer to use your server.',
    attachTo: { element: '#host', on: "top" },
  },
  {
    id: 'sender-step',
    title: 'Sender',
    text: 'The name that will appear as the sender.',
    attachTo: { element: '#sender', on: "top" },
  },
  {
    id: 'reply-step',
    title: 'Reply',
    text: 'An accessible email that is easily reached.',
    attachTo: { element: '#reply_to', on: "top" },
  },
  {
    id: 'attachment-step',
    title: 'Documents',
    text: 'Documents can be attached here.',
    attachTo: { element: '#attachments', on: "top" },
  },
];

export const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const handleCSVUpload = async (file: File) => {
    const csvData = await new Promise<string[]>((resolve, reject) => {
          parse(file, {
            complete: (result) => {
              const parsedEmails: any = result.data.flat(); // Flatten in case of nested arrays
              resolve(parsedEmails.filter((email:string) => emailRegExp.test(email))); // Filter valid emails
            },
            error: reject,
          });
        });
      return csvData
    
  };

export   const handleXLSXUpload = async (file: File) => {
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
          emailsArray = rows.flat().filter((email) => emailRegExp.test(email));
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

export const convertTextFileToArray = async (data: File) => {
        const fileContent = await data.text(); // For text file
        const fileArray = fileContent
          .split(/\r?\n/) // Split by new lines
          .map((line: string) => line.trim()) // Trim whitespace
          .filter((email) => emailRegExp.test(email)); // Validate email format

          return fileArray

  }


export const convertEmailsToArray = async (emails: FileList | string) => {
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

export const convertAttachmentToArray = (attachments:any) => {
    let attachmentArray: { filename: string; path: File; }[] = [];
    if (attachments) {
      attachmentArray = Array.from(attachments).map((file: any) => ({
        filename: file.name,
        path: file
      }));
    }
    return attachmentArray
}

export const getSmtpHost = (email: string) => {
  const smtphost = email.split('@')[1]
  return smtphost
}
 
export const isEmailValidated = (email: string) => {
  const emailArray = email.split(/[\s,]+/)

  let isValid;
  for(const email of emailArray){
    if(email.trim().length){
      isValid = emailRegExp.test(email)
      if(!isValid){
        return false
      }

    }
  }
  return isValid
}