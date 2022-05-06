import { storage, context, u128 } from 'near-sdk-as';

function _oneNear(): u128 {
  return u128.fromString('1000000000000000000000000');
}

export function setNumber(number: i8): string {
  // check if the amount attached is higher than 1 NEAR. If not, return an error
  assert(context.attachedDeposit >= _oneNear(), 'At least 1 NEAR attached is needed to set the number.');

  // check if number is inside the range. If not, return an error
  assert(number > 0 && number < 100, 'The number must be higher than 0 and lower than 100');

  // Since it passed all assert checks, store the number
  storage.set<i8>('number', number);

  // return a string as declared before
  return `The number was stored.`;
}

// like in TypeScript, it can also be declared as arrow function
export const guessNumber = (number: i8): string => {
  
  // returns a default value if key doesn't exist. In this case stored will be 0 if key number isn't set yet
  // 'getPrimitive' is used for integer or bool. If string, use 'get' 
  const stored = storage.getPrimitive<i8>('number', 0);

  // if stored is not higher than 0, it's because it was set 0 before, which means number wasn't set
  assert(stored > 0, 'No number stored. Call setNumber first.');

  if (stored < number) {
    return `The number is lower than ${number}.`;
  } else if (stored > number) {
    return `The number is higher than ${number}.`;
  } else {
    // not lower or higher, means it's the exact number
    return 'You guessed right!';
  }
}

// not actually neeeded. It's only to show that 1 NEAR is actually a big number
// export function showAmount(): u128 {
//   return context.attachedDeposit;
// }

// export function whoAmI(): string {
//   return context.sender;
// }

// export function contractAccount(): string {
//   return context.contractName;
// }

function _isOwner(): bool {
  return context.contractName == context.sender;
}

export function revealNumber(): i8 {
  assert(_isOwner(), "Only contract account can reveal the number.");

  return storage.getPrimitive<i8>('number', 0);
}