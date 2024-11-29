import * as XLSX from "xlsx"; 
import { parse } from "papaparse"; 

export const handleCSVUpload = async (file: File) => {
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

export const convertTextFileToArray = async (data: File) => {
        const fileContent = await data.text(); // For text file
        const fileArray = fileContent
          .split(/\r?\n/) // Split by new lines
          .map((line: string) => line.trim()) // Trim whitespace
          .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); // Validate email format

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
 