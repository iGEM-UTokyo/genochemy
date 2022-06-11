import { CodingBlock } from "./block";
import { DE, Term } from "./de-term";
import DrugA from "@/components/on-runner/DrugA.vue";
import MonomerCherryEmission from "@/components/on-runner/MonomerCherryEmission.vue";

export abstract class Promoter {
  abstract buildDEForMessengerRNA(): Term[];
}

export class T7Promoter extends Promoter {
  buildDEForMessengerRNA(): Term[] {
    return [
      {
        type: "const",
        value: 1,
      },
    ];
  }
}

export class DrugRepressiblePromoter extends Promoter {
  buildDEForMessengerRNA(): Term[] {
    return [
      {
        type: "hillrev",
        deg: { type: "const", value: 1 },
        const: { type: "const", value: 1 },
        value: { type: "variable", name: "protein-Repressor-bound" },
      },
    ];
  }
}

export abstract class Matter {
  abstract get name(): string;
  guiViews: any[] = []; // todo
  stageSettings: any[] = [];
  abstract buildDE(): DE[];
}

export function toMRNAName(name: string) {
  return `m${name}`;
}

export class OperonMessengerRNA extends Matter {
  constructor(
    public promoters: Promoter[],
    public codingBlocks: CodingBlock[]
  ) {
    super();
  }
  get name() {
    return `mRNA-${this.codingBlocks.map((block) => block.name).join("-")}`;
  }
  buildDE(): DE[] {
    return [
      {
        target: this.name,
        terms: [
          ...this.promoters
            .map((promoter) => promoter.buildDEForMessengerRNA())
            .flat(),
          {
            type: "multiply",
            values: [
              { type: "const", value: -1 },
              { type: "variable", name: this.name },
            ],
          },
        ],
      },
    ];
  }
  buildDEForProtein(): Term[] {
    return [
      {
        type: "variable",
        name: this.name,
      },
    ];
  }
}

export class Protein extends Matter {
  constructor(
    private _name: string,
    public messengerRNAs: OperonMessengerRNA[]
  ) {
    super();
  }
  get name() {
    return `protein-${this._name}`;
  }
  buildDE(): DE[] {
    return [
      {
        target: this.name,
        terms: [
          ...this.messengerRNAs.map((mRNA) => mRNA.buildDEForProtein()).flat(),
          {
            type: "multiply",
            values: [
              { type: "const", value: -1 },
              { type: "variable", name: this.name },
            ],
          },
        ],
      },
    ];
  }
}

export class mCherry extends Protein {
  stageSettings = [MonomerCherryEmission];
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
}

export class Repressor extends Protein {
  guiViews = [DrugA];
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
  buildDE(): DE[] {
    const baseTerm = super.buildDE()[0];
    baseTerm.terms.push({
      type: "multiply",
      values: [
        { type: "const", value: -1 },
        {
          type: "multiply",
          values: [
            { type: "variable", name: this.name },
            { type: "variable", name: "drug" },
          ],
        },
      ],
    });
    baseTerm.terms.push({
      type: "multiply",
      values: [
        { type: "const", value: 0.5 },
        {
          type: "variable",
          name: "protein-Repressor-bound",
        },
      ],
    });
    return [
      baseTerm,
      {
        target: "drug",
        terms: [],
      },
      {
        target: "protein-Repressor-bound",
        terms: [
          {
            type: "multiply",
            values: [
              { type: "const", value: 1 },
              {
                type: "multiply",
                values: [
                  { type: "variable", name: this.name },
                  { type: "variable", name: "drug" },
                ],
              },
            ],
          },
          {
            type: "multiply",
            values: [
              { type: "const", value: -0.5 },
              {
                type: "variable",
                name: "protein-Repressor-bound",
              },
            ],
          },
        ],
      },
    ];
  }
}
