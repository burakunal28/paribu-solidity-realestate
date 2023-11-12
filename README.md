# RealEstate Smart Contract 🏠

RealEstate is a Solidity smart contract designed for secure real estate transactions on the Ethereum blockchain. It enables users to create, update, and manage property listings, ensuring transparency and efficiency in property transactions.

## Features 🌟

- **Property Management**: Create, update, and manage real estate property listings securely on the blockchain.
- **Ownership Transfer**: Seamlessly transfer property ownership between users with proper authentication and authorization.
- **Transparent Transactions**: Maintain a transparent transaction history for each property, allowing users to verify ownership changes and transaction details.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Coinbase Wallet](https://www.coinbase.com/wallet) or [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.

## Developer 👨‍💻

This project was created by [Burak Ünal](https://linktr.ee/burakunal28).

## License 📜

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.