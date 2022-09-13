import {
  DrugRepressiblePromoter,
  EL222,
  EL222ActivatedPromoter,
  GFP,
  KillSwitch,
  mCherry,
  OperonMessengerRNA,
  PhyB,
  PhyBPIF3ActivatedPromoter,
  PIF3,
  Promoter,
  Protein,
  RecombinaseA,
  RecombinaseB,
  RepressorA,
  T7Promoter,
} from "./matter";
import { v4 as uuidv4 } from "uuid";

export type BlockTypes =
  | "promoter"
  | "visibility"
  | "terminator"
  | "meta"
  | "special-seq"
  | "wrap-head"
  | "wrap-tail";
export type BlockNames =
  | "T7 promoter"
  | "Drug Repressible Promoter"
  | "EL222 Activated Promoter"
  | "mCherry"
  | "GFP"
  | "RepressorA"
  | "EL222"
  | "CYC1 Terminator"
  | "Wrap Head"
  | "Wrap Tail";
export type BlockWithUUID = Block & { uuid: string };
export type Vector2 = [number, number];
export class BlockDesign {
  width: number;
  height: number;
  imageSrc: string;
  displayName: string;
  bottomAnchor: number;
  description: string;
  constructor({
    width,
    height,
    imageSrc,
    displayName,
    bottomAnchor,
    description,
  }: {
    width: number;
    height: number;
    imageSrc: string;
    displayName?: string;
    bottomAnchor?: number;
    description?: string;
  }) {
    this.width = width;
    this.height = height;
    this.imageSrc = imageSrc;
    this.displayName = displayName ?? "";
    this.bottomAnchor = bottomAnchor ?? 0;
    this.description = description ?? "";
  }
}
export abstract class Block {
  abstract type: BlockTypes;
  abstract name: string;
  abstract design: BlockDesign;
  abstract uniqueName: string;
  uuid?: string;
  constructor(args: Pick<Block, "uuid">) {
    this.uuid = args.uuid;
  }
}

export abstract class PromoterBlock extends Block {
  type = "promoter" as const;
  abstract get promoter(): Promoter;
  constructor(args: Pick<Block, "uuid">) {
    super({
      uuid: args.uuid,
    });
  }
}

export abstract class CodingBlock extends Block {
  get ProteinClass(): ProteinImpl {
    return Protein;
  }
}
export abstract class VisibilityBlock extends CodingBlock {
  type = "visibility" as const;
  constructor(args: Pick<Block, "uuid">) {
    super({
      uuid: args.uuid,
    });
  }
}

export abstract class TerminatorBlock extends Block {
  type = "terminator" as const;
  constructor(args: Pick<Block, "uuid">) {
    super({
      uuid: args.uuid,
    });
  }
}

export abstract class MetaModifierBlock extends CodingBlock {
  type = "meta" as const;
  constructor(args: Pick<Block, "uuid">) {
    super({
      uuid: args.uuid,
    });
  }
}

export abstract class SpecialSequenceBlock extends Block {
  type = "special-seq" as const;
  constructor(args: Pick<Block, "uuid">) {
    super({
      uuid: args.uuid,
    });
  }
}

export type FinalBlock = {
  new (): Block;
};

export type ProteinImpl = {
  new (_name: string, messengerRNAs: OperonMessengerRNA[]): Protein;
};

export class T7PromoterBlock extends PromoterBlock {
  name = "T7 promoter" as const;
  uniqueName = "prom-const-1" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "block.promConst1.displayName",
    description: "block.promConst1.description",
  });
  promoter = new T7Promoter();
  constructor() {
    super({});
  }
}

export class DrugRepressiblePromoterBlock extends PromoterBlock {
  name = "Drug Repressible Promoter" as const;
  uniqueName = "prom-repr-RepressorADrugA" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "block.promReprRepressorADrugA.displayName",
    description: "block.promReprRepressorADrugA.description",
  });
  promoter = new DrugRepressiblePromoter();
  constructor() {
    super({});
  }
}

export class EL222ActivatedPromoterBlock extends PromoterBlock {
  name = "EL222 Activated Promoter" as const;
  uniqueName = "prom-activ-EL222dim" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "block.promActivEL222dim.displayName",
    description: "block.promActivEL222dim.description",
  });
  promoter = new EL222ActivatedPromoter();
  constructor() {
    super({});
  }
}

export class PhyBPIF3ActivatedPromoterBlock extends PromoterBlock {
  name = "PhyB-PIF3 Activated Promoter" as const;
  uniqueName = "prom-activ-PhyBPIF3" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "block.promActivPhyBPIF3.displayName",
    description: "block.promActivPhyBPIF3.description",
  });
  promoter = new PhyBPIF3ActivatedPromoter();
  constructor() {
    super({});
  }
}

export class MCherryBlock extends VisibilityBlock {
  name = "mCherry" as const;
  uniqueName = "visi-mCherry" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/visible.svg",
    displayName: "block.visiMCherry.displayName",
    description: "block.visiMCherry.description",
  });
  get ProteinClass(): ProteinImpl {
    return mCherry;
  }
  constructor() {
    super({});
  }
}

export class GFPBlock extends VisibilityBlock {
  name = "GFP" as const;
  uniqueName = "visi-GFP" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/visible.svg",
    displayName: "block.visiGFP.displayName",
    description: "block.visiGFP.description",
  });
  get ProteinClass(): ProteinImpl {
    return GFP;
  }
  constructor() {
    super({});
  }
}

export class RepressorBlock extends VisibilityBlock {
  name = "RepressorA" as const;
  uniqueName = "ctrl-RepressorA" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "block.ctrlRepressorA.displayName",
    description: "block.ctrlRepressorA.description",
  });
  get ProteinClass(): ProteinImpl {
    return RepressorA;
  }
  constructor() {
    super({});
  }
}

export class EL222Block extends VisibilityBlock {
  name = "EL222" as const;
  uniqueName = "ctrl-EL222" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "block.ctrlEL222.displayName",
    description: "block.ctrlEL222.description",
  });
  get ProteinClass(): ProteinImpl {
    return EL222;
  }
  constructor() {
    super({});
  }
}

export class PhyBBlock extends VisibilityBlock {
  name = "PhyB" as const;
  uniqueName = "ctrl-PhyB" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "block.ctrlPhyB.displayName",
    description: "block.ctrlPhyB.description",
  });
  get ProteinClass(): ProteinImpl {
    return PhyB;
  }
  constructor() {
    super({});
  }
}

export class PIF3Block extends VisibilityBlock {
  name = "PIF3" as const;
  uniqueName = "ctrl-PIF3" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "block.ctrlPIF3.displayName",
    description: "block.ctrlPIF3.description",
  });
  get ProteinClass(): ProteinImpl {
    return PIF3;
  }
  constructor() {
    super({});
  }
}

export class CYC1TerminatorBlock extends TerminatorBlock {
  name = "CYC1 Terminator" as const;
  uniqueName = "term-1" as const;
  design = new BlockDesign({
    width: 184,
    height: 77.65,
    imageSrc: "/blocks/terminator.svg",
    displayName: "block.term1.displayName",
    description: "block.term1.description",
  });
  constructor() {
    super({});
  }
}

export class WrapHeadBlock extends Block {
  type = "wrap-head" as const;
  name = "Wrap Head" as const;
  uniqueName = "wrap-head" as const;
  design = new BlockDesign({
    width: 27,
    height: 30,
    imageSrc: "/blocks/wrap-head.svg",
  });
  uuid = uuidv4(); // todo
  constructor(public connectTo: string) {
    super({});
  }
}

export class WrapTailBlock extends Block {
  type = "wrap-tail" as const;
  name = "Wrap Tail" as const;
  uniqueName = "wrap-tail" as const;
  design = new BlockDesign({
    width: 20,
    height: 30,
    imageSrc: "/blocks/wrap-tail.svg",
  });
  uuid = uuidv4(); // todo
  constructor(public connectTo: string) {
    super({});
  }
}

export class RecombinaseABlock extends MetaModifierBlock {
  name = "RecombinaseI" as const;
  uniqueName = "meta-recomb1" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/meta.svg",
    displayName: "block.metaRecomb1.displayName",
    description: "block.metaRecomb1.description",
  });
  get ProteinClass(): ProteinImpl {
    return RecombinaseA;
  }
  constructor() {
    super({});
  }
}

export class RecombinaseBBlock extends MetaModifierBlock {
  name = "RecombinaseII" as const;
  uniqueName = "meta-recomb2" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/meta.svg",
    displayName: "block.metaRecomb2.displayName",
    description: "block.metaRecomb2.description",
  });
  get ProteinClass(): ProteinImpl {
    return RecombinaseB;
  }
  constructor() {
    super({});
  }
}

export class RecombinaseARecognitionSeqBlock extends SpecialSequenceBlock {
  name = "RecombinaseI Recognition Seq." as const;
  uniqueName = "seq-recog-recomb1" as const;
  design = new BlockDesign({
    width: 131,
    height: 90,
    imageSrc: "/blocks/recombinase-recognition-seq.svg",
    displayName: "block.seqRecogRecomb1.displayName",
    description: "block.seqRecogRecomb1.description",
    bottomAnchor: 30,
  });
  constructor() {
    super({});
  }
}

export class RecombinaseBRecognitionSeqBlock extends SpecialSequenceBlock {
  name = "RecombinaseII Recognition Seq." as const;
  uniqueName = "seq-recog-recomb2" as const;
  design = new BlockDesign({
    width: 131,
    height: 90,
    imageSrc: "/blocks/recombinase-recognition-seq.svg",
    displayName: "block.seqRecogRecomb2.displayName",
    description: "block.seqRecogRecomb2.description",
    bottomAnchor: 30,
  });
  constructor() {
    super({});
  }
}

export class KillSwitchBlock extends MetaModifierBlock {
  name = "KillSwitch" as const;
  uniqueName = "meta-kill" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/meta.svg",
    displayName: "block.metaKill.displayName",
    description: "block.metaKill.description",
  });
  get ProteinClass(): ProteinImpl {
    return KillSwitch;
  }
  constructor() {
    super({});
  }
}

export const allFinalBlockClasses: FinalBlock[] = [
  T7PromoterBlock,
  DrugRepressiblePromoterBlock,
  EL222ActivatedPromoterBlock,
  PhyBPIF3ActivatedPromoterBlock,
  MCherryBlock,
  GFPBlock,
  RepressorBlock,
  EL222Block,
  PhyBBlock,
  PIF3Block,
  CYC1TerminatorBlock,
  RecombinaseABlock,
  RecombinaseARecognitionSeqBlock,
  RecombinaseBBlock,
  RecombinaseBRecognitionSeqBlock,
  KillSwitchBlock,
];

export function uniqueNameToBlock(uniqueName: string): Block {
  switch (uniqueName) {
    case "prom-const-1":
      return new T7PromoterBlock();
    case "prom-repr-RepressorADrugA":
      return new DrugRepressiblePromoterBlock();
    case "prom-activ-EL222dim":
      return new EL222ActivatedPromoterBlock();
    case "prom-activ-PhyBPIF3":
      return new PhyBPIF3ActivatedPromoterBlock();
    case "visi-mCherry":
      return new MCherryBlock();
    case "visi-GFP":
      return new GFPBlock();
    case "ctrl-RepressorA":
      return new RepressorBlock();
    case "ctrl-EL222":
      return new EL222Block();
    case "ctrl-PhyB":
      return new PhyBBlock();
    case "ctrl-PIF3":
      return new PIF3Block();
    case "term-1":
      return new CYC1TerminatorBlock();
    // todo
    case "meta-recomb1":
      return new RecombinaseABlock();
    case "meta-recomb2":
      return new RecombinaseBBlock();
    case "seq-recog-recomb1":
      return new RecombinaseARecognitionSeqBlock();
    case "seq-recog-recomb2":
      return new RecombinaseBRecognitionSeqBlock();
    case "meta-kill":
      return new KillSwitchBlock();
    default:
      throw new Error(`invalid unique name: ${uniqueName}`);
  }
}
