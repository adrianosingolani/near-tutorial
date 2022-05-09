Let me first give a quick introduction on what we are going to build. 

We are going to create a smart contract that will work as a guess game. 

The contract owner will set a number and the players will need to guess what number is. If the guess is wrong, the contract will tell if the number is lower or higher than the guess. If it's right, the contract reset the game and the owner will be able to set another one. 

Players can also pay a small fee to reveal the number, so they can easily win the game.
It seems simple but we will be able to learn some basic concepts of AssemblyScript and how smart contracts work on the NEAR blockchain.

```javascript
import { storage } from 'near-sdk-as';

export function setNumber(number: u8): void {
  storage.set<u8>('number', number);
}

export function guessNumber(number: u8): string {
  const stored = storage.getPrimitive<u8>('number', 0);

  if (stored < number) {
    return `The number is lower than ${number}.`;
  } else if (stored > number) {
    return `The number is higher than ${number}.`;
  } else {
    return 'You guessed right!';
  }
}
```
Basically, the only file that we are going to work on is the index.ts file inside the assembly directory.

We are going to start by creating a couple of functions.

The first one we will call setNumber.

Export means it's public, that will be possible to call it from outside the contract, using the CLI. It will receive a parameter called number of type u8, that is a type of integer that can only stores a number from 0 to 255. Let's use this limitation in our favor and make it a rule for the game. The number to be guessed will be inside this range. The word after colon is the data type that will be returned by the function. In this case, void means that the function will not return anything.

Now let's import the storage class from the NEAR SDK. This will give us useful methods for storing persistent data in the NEAR blockchain. We will use the method "set" to store u8 data which will be refered by the key "number" and with the value that we will pass when calling this function later.

The second function will be called guessNumber that will return a string. The method getPrimitive will look for the key "number" with a value of u8 type and set it to a constant called stored. If this key doesn't exist or if it's different of the declared type, it will use the default value set as the second parameter, in this case 0. A good practice is to name it only capital letters so we can easily indentify it as a constant.

The if statement will compare the guessed number with the one stored and return a string with the result.

Now let's see how to deploy it:

First we can run the command asb. It's the AssemblyScript compiler that we installed before. By default it will look inside the assembly directory for a file called index.ts, compile it into a WebAssembly program and save it to build/release with the same name as defined in the package.json.

```
asb
```

Now to deploy it to the NEAR blockchain we will use the near command. Let's see how to do it by running near deploy --help

```
near deploy --help
```

It asks for the account ID where the contract will live and the actual file to be deployed. The other arguments aren't required.

```
near deploy [accountId] ./build/release/near-tutorial.wasm
```

But before going forward, let's create a script command in the package.json file to easily compile and deploy, because we are going to do it many times.

```
"deploy": "asb && near deploy tutorial.theclash.testnet ./build/release/near-tutorial.wasm -f"
```

Our contract is deployed and any account on the NEAR testnet can now make requests to it.

There are two ways to do it using the near-cli, one is by using the call command and the other is with the view command. Which one to use depends of the type of function that your are interacting with.

"View" functions are the ones that doesn't change the state of the blockchain and can not also use some methods of the NEAR core. Check the [NEAR AssemblyScript smart contracts introduction](https://docs.near.org/docs/develop/contracts/as/intro) for more details.

The other type of function is called "change". Those are the ones that can do what "view" functions can not.
In our case setNumber is a "change" function and guessNumber a "view" one. It will change later because guessNumber will also change the state of the blockchain, so for now we can use the view command to make requests.
But first, let's call the setNumber.

The contractName is the account where the contract was deployed, methodName is setNumber and inside single quotes and curly brackets are the parameters. We put the key name inside double quotes but the value no, because it's a number. The accountId option is the account who is making the call. We can use the same as the contract. 

```
near call --help
near call [accountId] setNumber '{"number": 77}' --accountId [accountId]
```

Now let's make a guess by using the view command. It's almost the same as the one before, but you don't need to specifies who is making the request.

```
near view [accountId] guessNumber '{"number": 55}'
near view [accountId] guessNumber '{"number": 99}'
near view [accountId] guessNumber '{"number": 77}'
```

Let's do some improvements on our contract.

```javascript
import { storage } from 'near-sdk-as';

export function setNumber(number: u8): void {
  assert(number > 0, 'The number must be higher than 0 and lower than 256.');

  assert(storage.getPrimitive<u8>('number', 0) == 0, "Number is already set. You can set to another one after someone guess it.");

  storage.set<u8>('number', number);
}

export function guessNumber(number: u8): string {
  const stored = storage.getPrimitive<u8>('number', 0);

  assert(stored > 0, 'No number stored. Call setNumber first.');

  if (stored < number) {
    return `The number is lower than ${number}.`;
  } else if (stored > number) {
    return `The number is higher than ${number}.`;
  } else {
    storage.set<u8>('number', 0);
    return 'You guessed right!';
  }
}
```

The assert method has too paremeters. The first is a condition that needs to be true to continue. If it's false the contract will throw an error with the message in the second parameter.

Since the default value for the stored number is 0, we will let it out of the range.
The first assert makes sure that the number to be set is inside the range.

The second won't let the number be changed if nobody guessed it yet. 

If both assert conditions are true, then the number will be set.

On the guessNumber function, we make sure that someone can play the game only if there's a number to guess. If it's zero, the game has not started yet.

If someone win the game, we change the number back to zero and the contract owner will be allowed to set it to a new one. Now it's not a view function anymore because we are changing the state, so you will get an error if you try to use the view command.

```javascript
import { storage, context } from 'near-sdk-as';

export function setNumber(number: u8): void {
  assert(number > 0, 'The number must be higher than 0 and lower than 256.');

  assert(_getNumber() == 0, "Number is already set. You can set to another one after someone guess it.");

  assert(_isOwner(), "Only the contract account can set the number.");

  storage.set<u8>('number', number);
}

export function guessNumber(number: u8): string {
  const stored = _getNumber();

  assert(stored > 0, 'No number stored. Call setNumber first.');

  if (stored < number) {
    return `The number is lower than ${number}.`;
  } else if (stored > number) {
    return `The number is higher than ${number}.`;
  } else {
    storage.set<u8>('number', 0);
    return 'You guessed right!';
  }
}

function _getNumber(): u8 {
  return storage.getPrimitive<u8>('number', 0);
}

function _isOwner(): bool {
  return context.contractName == context.sender;
}

// export function whoAmI(): string {
//   return context.sender;
// }

// export function contractAccount(): string {
//   return context.contractName;
// }
```

Since we are using the same getPrimitive method twice to get the number stored, let's create a private function that will return the number for us.

The difference from a private to a public function is very simple: there's no export in the begining. As a private function, only other functions of the contract are allowed to call it.

A good practice is to use an underline in the begining of the name of a private function, so we can easily indentify when coding.

We also are going to create a private function that will check if the account is the owner of the contract. For this we are going to need another class from the NEAR SDK called context. It has some useful properties that we can use like "contractName" that gives us the account where the contract is deployed and "sender" that give us the account who is making the call.

The whoAmI and contractAccount functions will help us to visualize it, but they aren't needed for our contract. Try to make view and call requests to them and see the results. Don't forget to set the accountId option.  You will get an error when trying to view the "whoAmI" function because context.sender is one of the methods not allowed for this kind of function. You won't have a problem by using either the call and view commands for the "contractAccount" function.

Let's comment these two functions and keep doing improvements to our contract.

```javascript
import { storage, context, u128 } from 'near-sdk-as';

const ONE_NEAR = u128.fromString('1000000000000000000000000');

export function setNumber(number: u8): void {
  assert(number > 0, 'The number must be higher than 0 and lower than 256.');

  assert(_getNumber() == 0, "Number is already set. You can set to another one after someone guess it.");

  assert(_isOwner(), "Only the contract account can set the number.");

  storage.set<u8>('number', number);
}

export function guessNumber(number: u8): string {
  const stored = _getNumber();

  assert(stored > 0, 'No number stored. Call setNumber first.');

  if (stored < number) {
    return `The number is lower than ${number}.`;
  } else if (stored > number) {
    return `The number is higher than ${number}.`;
  } else {
    storage.set<u8>('number', 0);
    return 'You guessed right!';
  }
}

function _getNumber(): u8 {
  return storage.getPrimitive<u8>('number', 0);
}

function _isOwner(): bool {
  return context.contractName == context.sender;
}

// export function attachedDeposit(): u128 {
//   return context.attachedDeposit;
// }

// export function whoAmI(): string {
//   return context.sender;
// }

// export function contractAccount(): string {
//   return context.contractName;
// }
```


We are now going to create another function that players can call and reveal the number by paying a little fee, but first let's see how the NEAR token value is stored. It uses an special type called u128 that the AssemblyScript doesn't have but it's provided by the NEAR SDK. The attachedDeposit function returns the context.attachedDeposit.

```
near call [accountId] attachedDeposit --accountId [accountId] --ammount 1
```

By using the "amount" option we can attach NEAR tokens to our call. 

See the big number that was returned? This is how one NEAR token value is stored. Let's copy this big number and set it to a global constant in our contract.

I like to name it with all capital letters so when I'm coding I know they are global, which means that it can be accessed for any functions in our contract and that it's a constant, so don't even try to change its value anywhere in our code.

The fromString method will transform a string in a u128 number.

Let's go back and finish our contract.

```javascript
import { storage, context, u128 } from 'near-sdk-as';

const ONE_NEAR = u128.fromString('1000000000000000000000000');

export function setNumber(number: u8): void {
  assert(number > 0, 'The number must be higher than 0 and lower than 256.');

  assert(_getNumber() == 0, "Number is already set. You can set to another one after someone guess it.");

  assert(_isOwner(), "Only the contract account can set the number.");

  storage.set<u8>('number', number);
}

export function guessNumber(number: u8): string {
  const stored = _getNumber();

  assert(stored > 0, 'No number stored. Call setNumber first.');

  if (stored < number) {
    return `The number is lower than ${number}.`;
  } else if (stored > number) {
    return `The number is higher than ${number}.`;
  } else {
    storage.set<u8>('number', 0);
    return 'You guessed right!';
  }
}

function _getNumber(): u8 {
  return storage.getPrimitive<u8>('number', 0);
}

function _isOwner(): bool {
  return context.contractName == context.sender;
}

// export function attachedDeposit(): u128 {
//   return context.attachedDeposit;
// }

// export function whoAmI(): string {
//   return context.sender;
// }

// export function contractAccount(): string {
//   return context.contractName;
// }

export function revealNumber(): u8 {
  assert(
    context.attachedDeposit >= ONE_NEAR || _isOwner(),
    'At least 1 NEAR attached is needed to set the number.'
  );

  return _getNumber();
}
```


Using the assert method we can check if at least one near is attached to the call or if the one who is calling is the owner of the contract. If at least one of these conditions is true, it will return the number to be guessed.

That's it for this video, but I would like to give a challenge to you. It would be cool if our contract could show the players who had won the game.

Would you like to give a try? I will give you some tips to help you complete this challenge:

Go to the [NEAR AssemblyScript smart contracts introduction](https://docs.near.org/docs/develop/contracts/as/intro) and look for some information about collections, specially the one called PersistentMap. It's almost like an array, but instead of having a numbered index for each value, it has a key that you can set that refers to a value.

You can use it to store the accountId as key and the number that was guessed, or maybe the timestamp, which is a complex subject for blockchains, as value, then make a function that can be viewed to return the list of winners.

If you are having a hard time to do implement it or want to connect with others interested in NEAR smart contract development, go to the [NEAR Discord server](https://discord.gg/urC9Eh3C), my handle there is trpr#0158, or reach out to me on [Twitter](https://twitter.com/AdSingolani).

I hope you liked this video and thanks for watching. 

See you around. Bye!