export type AuthStatus = 'unverified' | 'verified';

export interface Proposal {
  id: number;
  title: string;
  description: string;
  deadline: string;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface Credential {
  type: string;
  createdAt: string;
  [key: string]: any;
}