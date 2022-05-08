Hi! 
The purpose of this tutorial is to get people started with development for the NEAR blockchain. 
We are going to learn how to create and deploy a simple smart contract and interact with it using the NEAR C-L-I.

NEAR supports writting smart contracts in Rust and AssemblyScript. I think AssemblyScript is a good choice for starting out because it's based in TypeScript, a programming language that many developers out there are comfortable with.

You are going to need a code editor, a command line tool, node.js and npm installed before starting to follow this tutorial.

```
node -v
npm -v
```

In order to make the video shorter, we are going to clone the base project instead of just typing all the boilerplate code. 
The link for the repository is in the description.

https://github.com/adrianosingolani/near-tutorial

```
git clone https://github.com/adrianosingolani/near-tutorial.git
```

Let's checkout to a branch called video-start, which is the real boilerplate. The main branch has the final code that we will produce here in this tutorial.

```
git branch
git checkout video-start
```

If you want to know how it was created, all the steps are listed on the README file of this specific branch.

The only dependecy that we are going to need is the NEAR AssemblyScript SDK that is what makes possible to turn our AssemblyScript code into a NEAR smart contract. Let's install it as a development dependecy:

```
npm install --save-dev near-sdk-as
```

The last two things to install are the NEAR CLI and an AssemblyScript compiler called asbuild:

```
npm install -g near-cli asbuild
```

With everything installed the last thing we need is to create a NEAR account on the testnet and log in with it. 
Go to https://wallet.testnet.near.org, click on the "Create Account" button and follow the instructions. It's pretty straightforward.

https://wallet.testnet.near.org

With an account created, log in with near-cli:

```
near login
```

That's it! We have everything set to start writing our first smart contract and interacting with it.


VIDEO DESCRIPTION:

- How to install the Terminal (for Windows), Node and NPM: https://docs.near.org/docs/tools/near-cli#installation
- VS Code editor download: https://code.visualstudio.com/download
- Base project repository: https://github.com/adrianosingolani/near-tutorial
- Create NEAR account: https://wallet.testnet.near.org
- AssemblyScript documentation: https://www.assemblyscript.org/introduction.html
- NEAR AssemblyScript smart contracts introduction: https://docs.near.org/docs/develop/contracts/as/intro
- NEAR Discord server: https://discord.gg/urC9Eh3C (my Discord handle is trpr#0158)
- @AdSingolani on Twitter: https://twitter.com/AdSingolani