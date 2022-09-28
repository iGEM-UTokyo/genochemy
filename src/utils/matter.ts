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
import { MessagesAddresses } from "@/messages";

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
  name: MessagesAddresses | "" = "";
  description: MessagesAddresses | "" = "";
}

export class T7Promoter extends Promoter {
  name = "matter.promT7.name" as const;
  description = "matter.promT7.description" as const;
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
  name = "matter.promReprRepressorADrugA.name" as const;
  description = "matter.promReprRepressorADrugA.description" as const;
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
  name = "matter.promActivEL222dim.name" as const;
  description = "matter.promActivEL222dim.description" as const;
  buildDEForMessengerRNA(): Term[] {
    return [
      {
        type: "const",
        value: 0.02,
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
  name = "matter.promActivPhyBPIF3.name" as const;
  description = "matter.promActivPhyBPIF3.description" as const;
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
  description: MessagesAddresses | "" = "";
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
    return `mRNA-${this.codingBlocks
      .map((block) => block.getProtein().name)
      .join("-")}`;
  }
  getDisplayName(t: (a: string) => string) {
    return `${this.codingBlocks
      .map((block) => t(block.getProtein().displayName))
      .join(",")}`;
  }
  buildDE(matterEquations: MatterEquations) {
    for (const block of this.codingBlocks) {
      const protein = block.getProtein();
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
  displayName: MessagesAddresses | "" = "";
  messengerRNAs: OperonMessengerRNA[] = [];
  constructor(private _name: string) {
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
  displayName = "matter.visiMCherry.name" as const;
  description = "matter.visiMCherry.description" as const;
  constructor() {
    super("mCherry");
  }
}

export class GFP extends Protein {
  stageSettings = [Fluorescence];
  displayName = "matter.visiGFP.name" as const;
  description = "matter.visiGFP.description" as const;
  constructor() {
    super("GFP");
  }
}

export class RepressorA extends Protein {
  guiViews = [DrugA];
  displayName = "matter.ctrlRepressorA.name" as const;
  description = "matter.ctrlRepressorA.description" as const;
  constructor() {
    super("RepressorA");
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
  displayName = "matter.ctrlEL222.name" as const;
  description = "matter.ctrlEL222.description" as const;
  constructor() {
    super("EL222");
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
  displayName = "matter.ctrlPhyB.name" as const;
  description = "matter.ctrlPhyB.description" as const;
  constructor() {
    super("PhyB");
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
  displayName = "matter.ctrlPIF3.name" as const;
  description = "matter.ctrlPIF3.description" as const;
  constructor() {
    super("PIF3");
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
  displayName = "matter.metaRecombA.name" as const;
  description = "matter.metaRecombA.description" as const;
  constructor() {
    super("RecombinaseI");
  }
}

export class RecombinaseB extends Protein {
  stageSettings = [RecombinaseModifier];
  displayName = "matter.metaRecombB.name" as const;
  description = "matter.metaRecombB.description" as const;
  constructor() {
    super("RecombinaseII");
  }
}

export class KillSwitch extends Protein {
  stageSettings = [KillSwitchVue];
  displayName = "matter.metaKill.name" as const;
  description = "matter.metaKill.description" as const;
  constructor() {
    super("KillSwitch");
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

export const repressorNames = ["matter.ctrlRepressorA.name"] as const;
export const activatorNames = [
  "matter.ctrlEL222dim.name",
  "matter.ctrlPhyBPIF3.name",
] as const;
export const fluorescenceProteinNames = [
  "matter.visiMCherry.name",
  "matter.visiGFP.name",
] as const;
export const repressorPartsNames = ["matter.ctrlRepressorA.name"] as const;
export const activatorPartsNames = [
  "matter.ctrlEL222.name",
  "matter.ctrlPhyB.name",
  "matter.ctrlPIF3.name",
] as const;
export const recombinaseNames = [
  "matter.metaRecombA.name",
  "matter.metaRecombB.name",
] as const;
export const recombinaseSequenceNames = [
  "sequence.recogRecombA.name",
  "sequence.recogRecombB.name",
] as const;
