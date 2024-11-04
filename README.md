# VoteChain - Decentralized Voting System

A secure, transparent, and decentralized voting platform built with React, TypeScript, and IPFS. VoteChain leverages proof of personhood credentials to ensure vote integrity while maintaining user privacy.

![VoteChain Screenshot](https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1200)

## Features

- **Proof of Personhood Verification**
  - Secure credential issuance
  - Credential management system
  - Revocation capabilities
  - Real-time status tracking

- **Secure Voting System**
  - One credential, one vote policy
  - Real-time vote counting
  - Transparent vote tracking
  - Automatic deadline enforcement

- **Decentralized Storage**
  - IPFS integration via Pinata
  - Immutable vote records
  - Verifiable credential system
  - Distributed data storage

- **Modern UI/UX**
  - Responsive design
  - Real-time updates
  - Interactive voting interface
  - Credential management dashboard

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons

- **Storage**
  - IPFS (Pinata)

- **Build Tools**
  - Vite
  - PostCSS
  - Autoprefixer

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/votechain.git
cd votechain
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_JWT=your_pinata_jwt
```

4. Start the development server:
```bash
npm run dev
```

## Environment Setup

Required environment variables:

- `VITE_PINATA_API_KEY`: Your Pinata API key
- `VITE_PINATA_JWT`: Your Pinata JWT token

## Project Structure

```
src/
├── components/
│   ├── CredentialCard.tsx
│   ├── CredentialManager.tsx
│   ├── CredentialVerification.tsx
│   ├── CredentialsList.tsx
│   ├── VoteStats.tsx
│   └── VotingInterface.tsx
├── services/
│   └── pinata.ts
├── types.ts
├── App.tsx
└── main.tsx
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [IPFS](https://ipfs.io/)
- [Pinata](https://pinata.cloud/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)