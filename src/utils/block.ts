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
  constructor({
    width,
    height,
    imageSrc,
    displayName,
    bottomAnchor,
  }: {
    width: number;
    height: number;
    imageSrc: string;
    displayName?: string;
    bottomAnchor?: number;
  }) {
    this.width = width;
    this.height = height;
    this.imageSrc = imageSrc;
    this.displayName = displayName ?? "";
    this.bottomAnchor = bottomAnchor ?? 0;
  }
}
export abstract class Block {
  abstract type: BlockTypes;
  abstract name: string;
  abstract design: BlockDesign;
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
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "常時発現",
  });
  promoter = new T7Promoter();
  constructor() {
    super({});
  }
}

export class DrugRepressiblePromoterBlock extends PromoterBlock {
  name = "Drug Repressible Promoter" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "リプレッサーA結合",
  });
  promoter = new DrugRepressiblePromoter();
  constructor() {
    super({});
  }
}

export class EL222ActivatedPromoterBlock extends PromoterBlock {
  name = "EL222 Activated Promoter" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "EL222二量体結合",
  });
  promoter = new EL222ActivatedPromoter();
  constructor() {
    super({});
  }
}

export class PhyBPIF3ActivatedPromoterBlock extends PromoterBlock {
  name = "PhyB-PIF3 Activated Promoter" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "PhyB-PIF3結合",
  });
  promoter = new PhyBPIF3ActivatedPromoter();
  constructor() {
    super({});
  }
}

export class MCherryBlock extends VisibilityBlock {
  name = "mCherry" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/visible.svg",
    displayName: "mCherry",
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
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/visible.svg",
    displayName: "GFP",
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
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "リプレッサーA",
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
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "EL222",
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
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "PhyB",
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
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "PIF3",
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
  design = new BlockDesign({
    width: 184,
    height: 77.65,
    imageSrc: "/blocks/terminator.svg",
    displayName: "ターミネーター",
  });
  constructor() {
    super({});
  }
}

export class WrapHeadBlock extends Block {
  type = "wrap-head" as const;
  name = "Wrap Head" as const;
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
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/meta.svg",
    displayName: "リコンビナーゼⅠ",
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
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/meta.svg",
    displayName: "リコンビナーゼⅡ",
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
  design = new BlockDesign({
    width: 131,
    height: 90,
    imageSrc: "/blocks/recombinase-recognition-seq.svg",
    displayName: "認識配列Ⅰ",
    bottomAnchor: 30,
  });
  constructor() {
    super({});
  }
}

export class RecombinaseBRecognitionSeqBlock extends SpecialSequenceBlock {
  name = "RecombinaseII Recognition Seq." as const;
  design = new BlockDesign({
    width: 131,
    height: 90,
    imageSrc: "/blocks/recombinase-recognition-seq.svg",
    displayName: "認識配列Ⅱ",
    bottomAnchor: 30,
  });
  constructor() {
    super({});
  }
}

export class KillSwitchBlock extends MetaModifierBlock {
  name = "KillSwitch" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/meta.svg",
    displayName: "キルスイッチ",
  });
  get ProteinClass(): ProteinImpl {
    return KillSwitch;
  }
  constructor() {
    super({});
  }
}
