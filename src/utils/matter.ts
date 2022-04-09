import { Term } from "./de-term";

export abstract class Promoter {
  abstract buildDEForMessangerRNA(): Term[]
}

export class T7Promoter extends Promoter {
  buildDEForMessangerRNA(): Term[] {
    return [{
      type: 'const',
      value: 1,
    }]
  }
}

export abstract class Matter {
  abstract get name(): string
  abstract buildDE(): Term[]
}

export function toMRNAName(name: string) {
  return `m${name}`
}

export class OperonMessengerRNA extends Matter {
  constructor(
    public promoters: Promoter[],
    public proteinNames: string[],
  ) {
    super()
  }
  get name() {
    return `mRNA-${this.proteinNames.join('-')}`
  }
  buildDE(): Term[] {
    return [
      ...this.promoters.map(promoter => promoter.buildDEForMessangerRNA()).flat(),
      {
        type: 'multiply',
        values: [{ type: 'const', value: -1 }, { type: 'variable', name: this.name }]
      },
    ]
  }
  buildDEForProtein(): Term[] {
    return [{
      type: 'variable',
      name: this.name
    }]
  }
}

export class Protein extends Matter {
  constructor(
    private _name: string,
    public messengerRNAs: OperonMessengerRNA[]
  ) {
    super()
  }
  get name() {
    return `protein-${this._name}`
  }
  buildDE(): Term[] {
    return [
      ...this.messengerRNAs.map(mRNA => mRNA.buildDEForProtein()).flat(),
      {
        type: 'multiply',
        values: [{ type: 'const', value: -1 }, { type: 'variable', name: this.name }]
      },
    ]
  }
}
