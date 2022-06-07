import { stringifyStyle } from "@vue/shared";
import { DE, Term } from "./de-term";

export type DecodeFunctionArgs = Record<string, number>;
export type DecodeFunction = (args: DecodeFunctionArgs) => number;
export const decodeFunctions = {
  sum(functions: DecodeFunction[]): DecodeFunction {
    return (args: DecodeFunctionArgs) =>
      functions.map(fn => fn(args)).reduce((a, b) => a + b, 0);
  },
  const(constNumber: number): DecodeFunction {
    return (args: DecodeFunctionArgs) => constNumber;
  },
  multiply(functions: DecodeFunction[]): DecodeFunction {
    return (args: DecodeFunctionArgs) =>
      functions.map(fn => fn(args)).reduce((a, b) => a * b, 1);
  },
  getVariable(variableName: string): DecodeFunction {
    return (args: DecodeFunctionArgs) => args[variableName];
  }
}
export function factoryTerm(term: Term): DecodeFunction {
  switch (term.type) {
    case "const":
      return decodeFunctions.const(term.value);
    case "multiply":
      return decodeFunctions.multiply(term.values.map(child => factoryTerm(child)));
    case "variable":
      return decodeFunctions.getVariable(term.name);
  }
}
export function factoryFunction(terms: Term[]): DecodeFunction {
  return decodeFunctions.sum(terms.map(factoryTerm))
}

export default class Runner {
  variables: Record<string, number> = {};
  equations: Record<string, DecodeFunction> = {};
  constructor(equations: DE[], public interval: number) {
    for (const equation of equations) {
      this.variables[equation.target] = 0; // todo
      this.equations[equation.target] = factoryFunction(equation.terms)
    }
  }
  next() {
    const h = this.interval;
    const vars1: Record<string, number> = {};
    for (const varName in this.variables) {
      vars1[varName] = h * this.equations[varName](this.variables);
    }
    const vars2: Record<string, number> = {};
    let varsForNextVars: Record<string, number> = {}
    for (const varName in this.variables) {
      varsForNextVars[varName] = this.variables[varName] + vars1[varName] / 2;
    }
    for (const variableName in this.variables) {
      vars2[variableName] = h * this.equations[variableName](varsForNextVars);
    }
    const vars3: Record<string, number> = {};
    varsForNextVars = {}
    for (const varName in this.variables) {
      varsForNextVars[varName] = this.variables[varName] + vars2[varName] / 2;
    }
    for (const variableName in this.variables) {
      vars3[variableName] = h * this.equations[variableName](varsForNextVars);
    }
    const vars4: Record<string, number> = {};
    varsForNextVars = {}
    for (const varName in this.variables) {
      varsForNextVars[varName] = this.variables[varName] + vars3[varName];
    }
    for (const variableName in this.variables) {
      vars4[variableName] = h * this.equations[variableName](varsForNextVars);
    }
    for (const varName in this.variables) {
      this.variables[varName] += (vars1[varName] + vars2[varName] * 2 + vars3[varName] * 2 + vars4[varName]) / 6;
    }
  }
}