
export enum Operation {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '×',
  Division = '÷',
}

export interface GameSettings {
  operations: Operation[];
  timePerQuestion: number; // in seconds
  digits: number;
}

export interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}
