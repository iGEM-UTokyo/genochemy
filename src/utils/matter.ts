import { CodingBlock } from "./block";
import { Term } from "./de-term";
import DrugA from "@/components/on-runner/DrugA.vue";
import BlueLightSwitch from "@/components/on-runner/BlueLightSwitch.vue";
import RedLightSwitch from "@/components/on-runner/RedLightSwitch.vue";
import Fluorescence from "@/components/on-runner/Fluorescence.vue";
import BlueLight from "@/components/on-runner/BlueLight.vue";
import RedLight from "@/components/on-runner/RedLight.vue";
import RecombinaseModifier from "@/components/on-runner/RecombinaseModifier.vue";
import KillSwitchVue from "@/components/on-runner/KillSwitch.vue";

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
        const: { type: "const", value: 0.1 },
        value: { type: "variable", name: "protein-Repressor-bound" },
      },
    ];
  }
}

export class EL222ActivatedPromoter extends Promoter {
  name = "EL222結合性プロモーター";
  description = "EL222の二量体が結合し、それにより下流の転写が促進されます。";
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

export class PhyBPIF3ActivatedPromoter extends Promoter {
  name = "PhyB-PIF3結合性プロモーター";
  description =
    "PhyB-PIF3のヘテロ二量体が結合し、それにより下流の転写が促進されます。";
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
        value: { type: "variable", name: "protein-PhyB-PIF3" },
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
          { type: "const", value: -2 },
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
          { type: "const", value: 0.1 },
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
          { type: "const", value: 2 },
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
          { type: "const", value: -0.1 },
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
  stageSettings = [BlueLight];
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

export class PhyB extends Protein {
  stageSettings = [RedLight];
  guiViews = [RedLightSwitch];
  description = "赤色光によってPIF3とヘテロ二量体を形成します。";
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
              { type: "variable", name: "red-light" },
              {
                type: "multiply",
                values: [
                  { type: "variable", name: this.name },
                  { type: "variable", name: "protein-PIF3" },
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
            name: "protein-PhyB-PIF3",
          },
        ],
      }
    );
    if (!matterEquations["protein-PhyB-PIF3"]) {
      matterEquations["protein-PhyB-PIF3"] = [];
    }
    matterEquations["protein-PhyB-PIF3"].push(
      {
        type: "multiply",
        values: [
          { type: "const", value: 1 },
          {
            type: "multiply",
            values: [
              { type: "variable", name: "red-light" },
              {
                type: "multiply",
                values: [
                  { type: "variable", name: this.name },
                  { type: "variable", name: "protein-PIF3" },
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
            name: "protein-PhyB-PIF3",
          },
        ],
      }
    );
    if (!matterEquations["red-light"]) {
      matterEquations["red-light"] = [];
    }
  }
}

export class PIF3 extends Protein {
  stageSettings = [RedLight];
  guiViews = [RedLightSwitch];
  description = "赤色光によってPhyBとヘテロ二量体を形成します。";
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
              { type: "variable", name: "red-light" },
              {
                type: "multiply",
                values: [
                  { type: "variable", name: "protein-PhyB" },
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
            name: "protein-PhyB-PIF3",
          },
        ],
      }
    );
    if (!matterEquations["protein-PhyB-PIF3"]) {
      matterEquations["protein-PhyB-PIF3"] = [];
    }
    if (!matterEquations["red-light"]) {
      matterEquations["red-light"] = [];
    }
  }
}

export class RecombinaseA extends Protein {
  stageSettings = [RecombinaseModifier];
  description = "認識配列Iに挟まれた配列を切り出します。";
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
}

export class RecombinaseB extends Protein {
  stageSettings = [RecombinaseModifier];
  description = "認識配列IIに挟まれた配列を切り出します。";
  constructor(_name: string, messengerRNAs: OperonMessengerRNA[]) {
    super(_name, messengerRNAs);
  }
}

export class KillSwitch extends Protein {
  stageSettings = [KillSwitchVue];
  description = "標的生物を死滅させます。";
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
