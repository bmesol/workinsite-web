export interface CuringType {
  id: number;
  curingType: string;
  remark: string;
}

export interface CuringTypeCreationRequest {
  curingType: string;
  remark: string;
}

export interface CuringTypeUpdationRequest {
  curingType: string;
  remark: string;
}