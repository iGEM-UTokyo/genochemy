import { CodingBlock } from "./block";
import { DE, Term } from "./de-term";
import DrugA from "@/components/on-runner/DrugA.vue";
import BlueLightSwitch from "@/components/on-runner/BlueLightSwitch.vue";
import Fluorescence from "@/components/on-runner/Fluorescence.vue";
import Light from "@/components/on-runner/Light.vue";
import RecombinaseModifier from "@/components/on-runner/RecombinaseModifier.vue";

export interface RunnerComponent {
  name: string;
}

export type MatterEquations = {
  [matterName: string]: Term[];
};
export interface Actor {
  buildDE(matterEquations: MatterEquations): void;
}

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
  name = "青色アクチベーター結合性プロモーター";
  description =
    "青色アクチベーターの二量体が結合し、それにより下流の転写が促進されます。";
  buildDEForMessengerRNA(): Term[] {
    return [
      {
        type: "const",
        value: 0.05,
      },
      {
        type: "hill",
        deg: { type: "const", value: 1 },
        const: { type: "const", value: 1 },
        value: { type: "variable", name: "protein-dimerized-EL222" },
      },
    ];
  }
}

export abstract class Matter implements Actor {
  abstract get name(): string;
  guiViews: RunnerComponent[] = [];
  stageSettings: RunnerComponent[] = [];
  description = "";
  abstract buildDE(matterEquations: MatterEquations): void;
}

export class PromoterActor implements Actor {
  constructor(public promoter: Promoter, public mRNA: OperonMessengerRNA) {}
  buildDE(matterEquations: MatterEquations) {
    if (!matterEquations[this.mRNA.name]) {
      matterEquations[this.mRNA.name] = [];
    }
    matterEquations[this.mRNA.name].push(
      ...this.promoter.buildDEForMessengerRNA()
    );
  }
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
  buildDE(matterEquations: MatterEquations) {
    for (const block of this.codingBlocks) {
      const protein = new block.ProteinClass(block.name, [this]);
      if (!matterEquations[protein.name]) {
        matterEquations[protein.name] = [];
      }
      matterEquations[protein.name].push(...this.buildDEForProtein());
    }
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  buildDE(matterEquations: MatterEquations) {}
}

export class mCherry extends Protein {
  stageSettings = [Fluorescence];
  description = "赤色の蛍光を発します。";
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
}

export class GFP extends Protein {
  stageSettings = [Fluorescence];
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
  buildDE(matterEquations: MatterEquations) {
    if (!matterEquations[this.name]) {
      matterEquations[this.name] = [];
    }
    matterEquations[this.name].push(
      {
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
      },
      {
        type: "multiply",
        values: [
          { type: "const", value: 0.5 },
          {
            type: "variable",
            name: "protein-Repressor-bound",
          },
        ],
      }
    );
    if (!matterEquations["protein-Repressor-bound"]) {
      matterEquations["protein-Repressor-bound"] = [];
    }
    matterEquations["protein-Repressor-bound"].push(
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
      }
    );
    if (!matterEquations["drug"]) {
      matterEquations["drug"] = [];
    }
  }
}

export class EL222 extends Protein {
  stageSettings = [Light];
  guiViews = [BlueLightSwitch];
  description = "青色光によって二量体を形成します。";
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
  buildDE(matterEquations: MatterEquations) {
    if (!matterEquations[this.name]) {
      matterEquations[this.name] = [];
    }
    matterEquations[this.name].push(
      {
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
      },
      {
        type: "multiply",
        values: [
          { type: "const", value: 0.5 },
          {
            type: "variable",
            name: "protein-dimerized-EL222",
          },
        ],
      }
    );
    if (!matterEquations["protein-dimerized-EL222"]) {
      matterEquations["protein-dimerized-EL222"] = [];
    }
    matterEquations["protein-dimerized-EL222"].push(
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
      }
    );
    if (!matterEquations["blue-light"]) {
      matterEquations["blue-light"] = [];
    }
  }
}

export class RecombinaseA extends Protein {
  stageSettings = [RecombinaseModifier];
  description = "認識配列Aに挟まれた配列を切り出します。";
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
}

export class Degrader implements Actor {
  buildDE(matterEquations: MatterEquations): void {
    for (const matterName of Object.keys(matterEquations)) {
      if (matterName.startsWith("protein-") || matterName.startsWith("mRNA-")) {
        matterEquations[matterName].push({
          type: "multiply",
          values: [
            { type: "const", value: -1 },
            { type: "variable", name: matterName },
          ],
        });
      }
    }
  }
}
