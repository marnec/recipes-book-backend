export interface ErrorData {
  code: string | number;
  message: string;
  params?: { [key: string]: any };
}
