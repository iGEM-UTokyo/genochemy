import { CodingBlock } from "./block";
import { DE, Term } from "./de-term";
import DrugA from "@/components/on-runner/DrugA.vue";
import BlueLightSwitch from "@/components/on-runner/BlueLightSwitch.vue";
import MonomerCherryEmission from "@/components/on-runner/MonomerCherryEmission.vue";
import GFPEmission from "@/components/on-runner/GFPEmission.vue";
import Light from "@/components/on-runner/Light.vue";

export abstract class Promoter {
  abstract buildDEForMessengerRNA(): Term[];
  name = "";
  description = "";
}

export class T7Promoter extends Promoter {
  name = "常時発現";
  description = "常に一定の割合で下流を転写します。";
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
  name = "リプレッサーA結合性プロモーター";
  description =
    "活性化されたリプレッサーAが結合すると下流の転写が抑制されます。";
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

export class EL222ActivatedPromoter extends Promoter {
  name = "青色センサー結合性プロモーター";
  description =
    "青色センサーの二量体が結合し、それにより下流の転写が促進されます。";
  buildDEForMessengerRNA(): Term[] {
    return [
      {
        type: "hill",
        deg: { type: "const", value: 1 },
        const: { type: "const", value: 1 },
        value: { type: "variable", name: "protein-dimerized-EL222" },
      },
    ];
  }
}

export abstract class Matter {
  abstract get name(): string;
  guiViews: any[] = []; // todo
  stageSettings: any[] = [];
  description = "";
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
  description = "赤色の蛍光を発します。";
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
}

export class GFP extends Protein {
  stageSettings = [GFPEmission];
  description = "緑色の蛍光を発します。";
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
}

export class RepressorA extends Protein {
  guiViews = [DrugA];
  description =
    "薬剤Aと結合すると活性化し、リプレッサーA結合プロモーター下流の転写を阻害します。";
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

export class EL222 extends Protein {
  stageSettings = [Light];
  guiViews = [BlueLightSwitch];
  description = "青色光によって二量体を形成します。";
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
            { type: "variable", name: "blue-light" },
            {
              type: "multiply",
              values: [
                { type: "variable", name: this.name },
                { type: "variable", name: this.name },
              ],
            },
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
          name: "protein-dimerized-EL222",
        },
      ],
    });
    return [
      baseTerm,
      {
        target: "blue-light",
        terms: [],
      },
      {
        target: "protein-dimerized-EL222",
        terms: [
          {
            type: "multiply",
            values: [
              { type: "const", value: 1 },
              {
                type: "multiply",
                values: [
                  { type: "variable", name: "blue-light" },
                  {
                    type: "multiply",
                    values: [
                      { type: "variable", name: this.name },
                      { type: "variable", name: this.name },
                    ],
                  },
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
                name: "protein-dimerized-EL222",
              },
            ],
          },
        ],
      },
    ];
  }
}
