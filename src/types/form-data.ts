export interface FormData {
  [key: string]: any;
  existingLoans?: Array<{ lenderName: string; loanAmount: string }>;
}
