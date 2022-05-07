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