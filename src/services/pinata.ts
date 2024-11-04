const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API_URL = 'https://api.pinata.cloud';

import { Credential, VoteRecord, PinataResponse } from '../types';

export const listCredentials = async (address?: string): Promise<Credential[]> => {
  try {
    const queryParams = address 
      ? `metadata[keyvalues]={"address":{"value":"${address}","op":"eq"},"type":{"value":"credential","op":"eq"}}`
      : `metadata[keyvalues]={"type":{"value":"credential","op":"eq"}}`;

    const response = await fetch(
      `${PINATA_API_URL}/data/pinList?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    const credentials = await Promise.all(
      result.rows.map(async (pin: any) => {
        const contentResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${pin.ipfs_pin_hash}`);
        if (!contentResponse.ok) {
          return null;
        }
        const credential = await contentResponse.json();
        return {
          ...credential,
          hash: pin.ipfs_pin_hash,
          status: credential.status || 'active'
        };
      })
    );

    return credentials.filter((cred): cred is Credential => cred !== null);
  } catch (error) {
    console.error('Error listing credentials:', error);
    throw error;
  }
};

export const retrieveCredential = async (address: string): Promise<Credential | null> => {
  try {
    const response = await fetch(
      `${PINATA_API_URL}/data/pinList?metadata[keyvalues]={"address":{"value":"${address}","op":"eq"},"type":{"value":"credential","op":"eq"}}`,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.count === 0) {
      return null;
    }

    // Get the most recent credential
    const pin = result.rows[0];
    const contentResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${pin.ipfs_pin_hash}`);
    
    if (!contentResponse.ok) {
      throw new Error(`HTTP error! status: ${contentResponse.status}`);
    }

    const credential = await contentResponse.json();
    return {
      ...credential,
      hash: pin.ipfs_pin_hash,
      status: credential.status || 'active'
    };
  } catch (error) {
    console.error('Error retrieving credential:', error);
    throw error;
  }
};

export const storeCredential = async (address: string, credential: Partial<Credential>): Promise<string> => {
  try {
    const fullCredential: Credential = {
      type: 'ProofOfPersonhood',
      createdAt: new Date().toISOString(),
      address,
      hash: '',
      status: 'active',
      ...credential
    };

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: fullCredential,
        pinataMetadata: {
          name: `credential-${address}`,
          keyvalues: {
            address,
            type: 'credential'
          }
        },
        pinataOptions: {
          cidVersion: 1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: PinataResponse = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error storing credential:', error);
    throw error;
  }
};

export const revokeCredential = async (address: string): Promise<string> => {
  try {
    const existingCredential = await retrieveCredential(address);
    
    if (!existingCredential) {
      throw new Error('No credential found to revoke');
    }

    const revokedCredential: Credential = {
      ...existingCredential,
      status: 'revoked',
      hash: ''
    };

    return await storeCredential(address, revokedCredential);
  } catch (error) {
    console.error('Error revoking credential:', error);
    throw error;
  }
};

export const verifyCredential = async (address: string): Promise<boolean> => {
  try {
    const credential = await retrieveCredential(address);
    return credential !== null && credential.status === 'active';
  } catch (error) {
    console.error('Error verifying credential:', error);
    throw error;
  }
};

export const getVoteCounts = async (proposalId: number): Promise<{ yes: number; no: number }> => {
  try {
    const response = await fetch(
      `${PINATA_API_URL}/data/pinList?metadata[keyvalues]={"proposalId":{"value":"${proposalId}","op":"eq"},"type":{"value":"vote","op":"eq"}}`,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const votes = await Promise.all(
      result.rows.map(async (pin: any) => {
        const voteResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${pin.ipfs_pin_hash}`);
        return voteResponse.json();
      })
    );

    return votes.reduce(
      (acc, vote: VoteRecord) => {
        acc[vote.vote]++;
        return acc;
      },
      { yes: 0, no: 0 }
    );
  } catch (error) {
    console.error('Error getting vote counts:', error);
    throw error;
  }
};

export const storeVote = async (
  proposalId: number, 
  vote: 'yes' | 'no', 
  credential: Credential
): Promise<string> => {
  try {
    const voteRecord: VoteRecord = {
      proposalId,
      vote,
      credentialHash: credential.hash,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: voteRecord,
        pinataMetadata: {
          name: `vote-${proposalId}-${credential.hash}-${Date.now()}`,
          keyvalues: {
            proposalId: proposalId.toString(),
            credentialHash: credential.hash,
            type: 'vote'
          }
        },
        pinataOptions: {
          cidVersion: 1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: PinataResponse = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error storing vote:', error);
    throw error;
  }
};