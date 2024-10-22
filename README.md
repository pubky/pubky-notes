# Pubky Notes

![image1](https://github.com/user-attachments/assets/7292476d-2546-4297-9b2a-0081895c7f26)

## Introduction

We’re all used to note-taking apps—Evernote, Google Keep, and others that let us jot down thoughts or create to-do lists. But have you ever wondered who actually owns your notes and what control you have over them? That’s where Pubky Notes comes in. As part of Pubky’s hackweek, we’ve created a simple note-taking app that takes a different approach: you control your data. Built on the Pubky Core protocol, this app makes sure that your notes are stored on your own home-server, giving you full ownership and flexibility.

**Note:** This is a demo app created to demonstrate the capabilities of the Pubky framework and the Tauri-based desktop app. **It is not recommended to use this for real data** as it is only for demonstration purposes.

## Installation

To get started with **Pubky Notes**, follow the steps below:

### Prerequisites

- Install Tauri prerequisites as per the [Tauri documentation](https://tauri.app/start/prerequisites/).

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/pubky/pubky-notes.git
    ```

2. Navigate to the project directory:
    ```bash
    cd pubky-notes
    ```

3. Install dependencies:
    ```bash
    yarn install
    ```

4. Run the app in development mode:
    ```bash
    yarn tauri dev
    ```

5. Build the app for production:
    ```bash
    yarn tauri build
    ```

## Homeserver

To run a local instance of the testnet homeserver, follow these steps below:

### Steps

1. Clone the `pubky` repository:
    ```bash
    git clone https://github.com/pubky/pubky.git
    ```

2. Navigate to the directory:
    ```bash
    cd pubky/pubky/pkg
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Run the homeserver in testnet mode:
    ```bash
    npm run testnet
    ```

The **Pubky Notes** desktop app will already be pointed to this server.

## Contribution

Feel free to open an issue or a pull request if you want to contribute to the development of this project. We welcome feedback and suggestions!
