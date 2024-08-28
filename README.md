# My Project

## Overview

This project consists of two main products designed for users interacting with the Solana blockchain:

1. **Wallet Creation**: Users can create their own cryptocurrency wallet using Web3Auth, currently supporting only the Solana blockchain.
2. **Link-based Crypto Sharing**: Users can create a secure link to share cryptocurrency with others, leveraging cryptographic techniques to ensure the safety and integrity of the transaction.

## Product 1: Wallet Creation

### Introduction

This feature allows users to create a Solana wallet easily using Web3Auth. Web3Auth simplifies the onboarding process by abstracting away the complexity of key management, enabling users to create and manage their wallets without directly dealing with private keys.

### How Web3Auth Works

**Web3Auth** is a decentralized authentication infrastructure that provides a seamless user experience by integrating with OAuth providers (like Google, Facebook, etc.) and social logins. Here's how it works:

1. **User Authentication**: Users authenticate using their social login credentials (e.g., Google).
2. **Key Management**: Web3Auth handles the key management by splitting and distributing the private key across multiple nodes, ensuring no single entity has full control over the key.
3. **Wallet Creation**: After authentication, Web3Auth generates a private key for the user, which is used to create a Solana wallet.
4. **Interaction with Solana**: Users can interact with the Solana blockchain, sending and receiving tokens, viewing transaction history, and tracking wallet balances.

### Key Benefits

- **User-Friendly**: Simplifies wallet creation for non-technical users.
- **Secure**: Distributes key management across multiple nodes, reducing the risk of key compromise.
- **Scalable**: Supports a large number of users with minimal configuration and setup.

## Product 2: Link-Based Crypto Sharing

### Introduction

This feature enables users to generate a link that contains a cryptographic keypair, allowing them to share cryptocurrency with others securely. The recipient of the link can access the funds associated with the keypair.

### Core Concepts

- **Hyperlink Cryptography**: The system uses cryptographic methods to encode a keypair within a URL, allowing the secure transfer of funds.
- **Key Derivation Function (KDF)**: A Key Derivation Function is used to generate a cryptographic keypair from a password and a salt.
- **Sodium Library**: The [libsodium](https://libsodium.gitbook.io/doc/) library is used for various cryptographic operations.

### Code Breakdown

Below is an explanation of the main components used in the implementation:

#### Constants and Defaults

- **DEFAULT_HYPERLINK_KEYLENGTH**: The length of the cryptographic key used to generate the wallet (32 bytes, equivalent to 256 bits).
- **DEFAULT_ORIGIN**: The default URL origin for the generated link.
- **HYPERLINK_ORIGIN**: A configurable origin for the generated link, allowing for environment-specific URLs.
- **HYPERLINK_PATH**: The path appended to the origin to create the final URL.
- **VERSION_DELIMITER & CURRENT_VERSION**: Define the versioning scheme used in the URL, enabling backward compatibility and validation.

#### Helper Functions

- **getSodium()**: Loads the libsodium library asynchronously, ensuring that cryptographic operations can proceed once the library is ready.
- **kdf()**: The Key Derivation Function takes a password and salt as inputs and returns a cryptographic key of the specified length.
- **randBuf()**: Generates a secure random buffer of the specified length using the libsodium library.
- **pwToKeypair()**: Converts a password and salt into a cryptographic keypair using the key derivation function.

#### HyperLink Class

The `HyperLink` class is the core of the link-based crypto sharing functionality:

- **Properties**:

  - `url`: The generated URL containing the cryptographic information.
  - `keypair`: The Solana keypair derived from the password and salt.
  - `salt`: The salt used in the key derivation process.

- **Methods**:
  - `create()`: Generates a new `HyperLink` instance with a random password and salt, derives the corresponding keypair, and encodes the information into a URL.
  - `fromUrl(url: URL)`: Parses an existing URL to extract the password and salt, regenerates the keypair, and returns a `HyperLink` instance.
  - `fromLink(link: string)`: Convenience method to create a `HyperLink` instance from a string link.

### Example Usage

1. **Creating a New Link**:
   ```typescript
   const newLink = await HyperLink.create();
   ```
