export type AuthStatus = 'unverified' | 'verified';

export interface Proposal {
  id: number;
  title: string;
  description: string;
  deadline: string;
  voteCount?: {
    yes: number;
    no: number;
  };
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface Credential {
  type: string;
  createdAt: string;
  address: string;
  hash: string;
  status: 'active' | 'revoked';
}

export interface VoteRecord {
  proposalId: number;
  vote: 'yes' | 'no';
  credentialHash: string;
  timestamp: string;
}