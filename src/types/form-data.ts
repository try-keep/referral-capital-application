export interface FormData {
  [key: string]: any;
  existingLoans?: Array<{ lenderName: string; loanAmount: string }>;
  bankConnectionMethod?: 'flinks' | 'manual' | '';
  bankStatements?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>;
}
