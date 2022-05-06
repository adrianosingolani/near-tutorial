import { storage, context, u128 } from 'near-sdk-as';

const ONE_NEAR = u128.fromString('1000000000000000000000000');

export function setNumber(number: i8): string {
  // number can only be set if it's equal to zero, which means someone guessed it
  assert(_getNumber() == 0, "Number is already set. You can set to another one after someone guess it.");

  // return an error if not the owner of the contract 
  assert(_isOwner(), "Only contract account can set the number.");

  // check if number is inside the range. If not, return an error
  assert(number > 0 && number < 100, 'The number must be higher than 0 and lower than 100.');

  // Since it passed all assert checks, store the number
  storage.set<i8>('number', number);

  // return a string as declared before
  return `The number was stored.`;
}

export function guessNumber(number: i8): string {
  // call a private function to get the stored number
  const stored = _getNumber();

  // if stored is not higher than 0, it's because it was set 0 before, which means number wasn't set
  assert(stored > 0, 'No number stored. Call setNumber first.');

  if (stored < number) {
    return `The number is lower than ${number}.`;
  } else if (stored > number) {
    return `The number is higher than ${number}.`;
  } else {
    // not lower or higher, which means it's the exact number
    storage.set<i8>('number', 0);
    return 'You guessed right!';
  }
}

// not actually neeeded. It's only to show that 1 NEAR is actually a big number
// export function attachedDeposit(): u128 {
//   return context.attachedDeposit;
// }

// export function whoAmI(): string {
//   return context.sender;
// }

// export function contractAccount(): string {
//   return context.contractName;
// }

// checks if the account who deployed the contract is the same that is requesting
function _isOwner(): bool {
  return context.contractName == context.sender;
}

// returns the stored number
function _getNumber(): i8 {
  // returns a default value if key doesn't exist. In this case stored will be 0 if key number isn't set yet
  // 'getPrimitive' is used for integer or bool. If string, use 'get' 
  return storage.getPrimitive<i8>('number', 0);
}

export function revealNumber(): i8 {
  // check if the amount attached is higher than 1 NEAR or if it's the contract owner. 
  // If not for both cases, return an error
  assert(
    context.attachedDeposit >= ONE_NEAR || _isOwner(),
    'At least 1 NEAR attached is needed to set the number.'
  );

  return _getNumber();
}