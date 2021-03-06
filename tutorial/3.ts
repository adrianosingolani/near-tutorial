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