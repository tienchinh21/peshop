export interface File {
  name: string;
}
export interface ApiError {
  message: string;
  exMessage: string;
}
export interface Response<T> {
  error: ApiError;
  data: T;
  file: File;
}