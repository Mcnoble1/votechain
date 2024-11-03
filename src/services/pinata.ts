const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API_URL = 'https://api.pinata.cloud';

interface PinJSONResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface PinListResponse {
  count: number;
  rows: Array<{
    ipfs_pin_hash: string;
    metadata: {
      name: string;
    };
  }>;
}

export const storeCredential = async (address: string, credential: any): Promise<string> => {
  try {
    const data = {
      address,
      credential,
      timestamp: Date.now(),
    };

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: `credential-${address}`,
        },
        pinataOptions: {
          cidVersion: 1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: PinJSONResponse = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error storing credential:', error);
    throw error;
  }
};

export const storeVote = async (proposalId: number, vote: string, voterHash: string): Promise<string> => {
  try {
    const voteData = {
      proposalId,
      vote,
      voterHash,
      timestamp: Date.now(),
    };

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: voteData,
        pinataMetadata: {
          name: `vote-${proposalId}-${voterHash}`,
        },
        pinataOptions: {
          cidVersion: 1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: PinJSONResponse = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error storing vote:', error);
    throw error;
  }
};

export const verifyCredential = async (address: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${PINATA_API_URL}/data/pinList?metadata[name]=credential-${address}`,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: PinListResponse = await response.json();
    return result.count > 0;
  } catch (error) {
    console.error('Error verifying credential:', error);
    throw error;
  }
};