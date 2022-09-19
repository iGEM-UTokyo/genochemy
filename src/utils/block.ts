import {
  activatorNames,
  activatorPartsNames,
  DrugRepressiblePromoter,
  EL222,
  EL222ActivatedPromoter,
  fluorescenceProteinNames,
  GFP,
  KillSwitch,
  mCherry,
  PhyB,
  PhyBPIF3ActivatedPromoter,
  PIF3,
  Promoter,
  Protein,
  RecombinaseA,
  RecombinaseB,
  recombinaseNames,
  recombinaseSequenceNames,
  RepressorA,
  repressorNames,
  repressorPartsNames,
  T7Promoter,
} from "./matter";
import { v4 as uuidv4 } from "uuid";
import { MessagesAddresses } from "@/messages";

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
  displayName: MessagesAddresses | "";
  bottomAnchor: number;
  description: MessagesAddresses | "";
  marginLeft: number;
  marginRight: number;
  constructor({
    width,
    height,
    imageSrc,
    displayName,
    bottomAnchor,
    description,
    marginLeft,
    marginRight,
  }: {
    width: number;
    height: number;
    imageSrc: string;
    displayName?: MessagesAddresses;
    bottomAnchor?: number;
    description?: MessagesAddresses;
    marginLeft?: number;
    marginRight?: number;
  }) {
    this.width = width;
    this.height = height;
    this.imageSrc = imageSrc;
    this.displayName = displayName ?? "";
    this.bottomAnchor = bottomAnchor ?? 0;
    this.description = description ?? "";
    this.marginLeft = marginLeft ?? 0;
    this.marginRight = marginRight ?? 0;
  }
}
export abstract class Block {
  abstract type: BlockTypes;
  abstract name: string;
  abstract design: BlockDesign;
  abstract uniqueName: MessagesAddresses | "";
  abstract params: null | {
    [key: string]: { list: readonly string[]; value: string };
  };
  uuid?: string;
  constructor(args: Pick<Block, "uuid">) {
    this.uuid = args.uuid;
  }
}

export abstract class PromoterBlock extends Block {
  type = "promoter" as const;
  abstract getPromoter(): Promoter;
  constructor(args: Pick<Block, "uuid">) {
    super({
      uuid: args.uuid,
    });
  }
}

export abstract class CodingBlock extends Block {
  abstract getProtein(): Protein;
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

export class ConstPromoterBlock extends PromoterBlock {
  name = "T7 promoter" as const;
  uniqueName = "block.promConst1.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "block.promConst1.displayName",
    description: "block.promConst1.description",
  });
  getPromoter() {
    return new T7Promoter();
  }
  params = null;
  constructor() {
    super({});
  }
}

export class RepressiblePromoterBlock extends PromoterBlock {
  name = "Drug Repressible Promoter" as const;
  uniqueName = "block.promRepressor.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "block.promRepressor.displayName",
    description: "block.promRepressor.description",
  });
  params: {
    repressor: {
      value: typeof repressorNames[number];
      list: typeof repressorNames;
    };
  } = {
    repressor: { value: "matter.ctrlRepressorA.name", list: repressorNames },
  };
  getPromoter() {
    switch (this.params.repressor.value) {
      case "matter.ctrlRepressorA.name":
        return new DrugRepressiblePromoter();
    }
  }
  constructor() {
    super({});
  }
}

export class InduciblePromoterBlock extends PromoterBlock {
  name = "EL222 Activated Promoter" as const;
  uniqueName = "block.promActivator.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 82.65,
    imageSrc: "/blocks/promoter.svg",
    displayName: "block.promActivator.displayName",
    description: "block.promActivator.description",
  });
  params: {
    activator: {
      value: typeof activatorNames[number];
      list: typeof activatorNames;
    };
  } = {
    activator: { value: "matter.ctrlEL222dim.name", list: activatorNames },
  };
  getPromoter() {
    switch (this.params.activator.value) {
      case "matter.ctrlEL222dim.name":
        return new EL222ActivatedPromoter();
      case "matter.ctrlPhyBPIF3.name":
        return new PhyBPIF3ActivatedPromoter();
    }
  }
  constructor() {
    super({});
  }
}

// export class PhyBPIF3ActivatedPromoterBlock extends PromoterBlock {
//   name = "PhyB-PIF3 Activated Promoter" as const;
//   uniqueName = "prom-activ-PhyBPIF3" as const;
//   design = new BlockDesign({
//     width: 184,
//     height: 82.65,
//     imageSrc: "/blocks/promoter.svg",
//     displayName: "block.promActivPhyBPIF3.displayName",
//     description: "block.promActivPhyBPIF3.description",
//   });
//   promoter = new PhyBPIF3ActivatedPromoter();
//   constructor() {
//     super({});
//   }
// }

export class FluorescenceBlock extends VisibilityBlock {
  name = "mCherry" as const;
  uniqueName = "block.visiFluorescence.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/visible.svg",
    displayName: "block.visiFluorescence.displayName",
    description: "block.visiFluorescence.description",
    marginRight: 20,
  });
  params: {
    protein: {
      value: typeof fluorescenceProteinNames[number];
      list: typeof fluorescenceProteinNames;
    };
  } = {
    protein: { value: "matter.visiGFP.name", list: fluorescenceProteinNames },
  };
  getProtein() {
    if (this.params.protein.value === "matter.visiGFP.name") {
      return new GFP();
    } else {
      return new mCherry();
    }
  }
  constructor() {
    super({});
  }
}

// export class GFPBlock extends VisibilityBlock {
//   name = "GFP" as const;
//   uniqueName = "visi-GFP" as const;
//   design = new BlockDesign({
//     width: 184,
//     height: 30,
//     imageSrc: "/blocks/visible.svg",
//     displayName: "block.visiGFP.displayName",
//     description: "block.visiGFP.description",
//   });
//   get ProteinClass(): ProteinImpl {
//     return GFP;
//   }
//   constructor() {
//     super({});
//   }
// }

export class RepressorBlock extends VisibilityBlock {
  name = "RepressorA" as const;
  uniqueName = "block.ctrlRepressor.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "block.ctrlRepressor.displayName",
    description: "block.ctrlRepressor.description",
    marginRight: 20,
  });
  params: {
    repressor: {
      value: typeof repressorPartsNames[number];
      list: typeof repressorPartsNames;
    };
  } = {
    repressor: {
      value: "matter.ctrlRepressorA.name",
      list: repressorPartsNames,
    },
  };
  getProtein() {
    return new RepressorA();
  }
  constructor() {
    super({});
  }
}

export class ActivatorBlock extends VisibilityBlock {
  name = "EL222" as const;
  uniqueName = "block.ctrlActivator.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/control.svg",
    displayName: "block.ctrlActivator.displayName",
    description: "block.ctrlActivator.description",
    marginRight: 20,
  });
  params: {
    activator: {
      value: typeof activatorPartsNames[number];
      list: typeof activatorPartsNames;
    };
  } = {
    activator: {
      value: "matter.ctrlEL222.name",
      list: activatorPartsNames,
    },
  };
  getProtein() {
    switch (this.params.activator.value) {
      case "matter.ctrlEL222.name":
        return new EL222();
      case "matter.ctrlPhyB.name":
        return new PhyB();
      case "matter.ctrlPIF3.name":
        return new PIF3();
    }
  }
  constructor() {
    super({});
  }
}

// export class PhyBBlock extends VisibilityBlock {
//   name = "PhyB" as const;
//   uniqueName = "ctrl-PhyB" as const;
//   design = new BlockDesign({
//     width: 184,
//     height: 30,
//     imageSrc: "/blocks/control.svg",
//     displayName: "block.ctrlPhyB.displayName",
//     description: "block.ctrlPhyB.description",
//   });
//   get ProteinClass(): ProteinImpl {
//     return PhyB;
//   }
//   constructor() {
//     super({});
//   }
// }

// export class PIF3Block extends VisibilityBlock {
//   name = "PIF3" as const;
//   uniqueName = "ctrl-PIF3" as const;
//   design = new BlockDesign({
//     width: 184,
//     height: 30,
//     imageSrc: "/blocks/control.svg",
//     displayName: "block.ctrlPIF3.displayName",
//     description: "block.ctrlPIF3.description",
//   });
//   get ProteinClass(): ProteinImpl {
//     return PIF3;
//   }
//   constructor() {
//     super({});
//   }
// }

export class CYC1TerminatorBlock extends TerminatorBlock {
  name = "CYC1 Terminator" as const;
  uniqueName = "block.term1.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 77.65,
    imageSrc: "/blocks/terminator.svg",
    displayName: "block.term1.displayName",
    description: "block.term1.description",
  });
  params = null;
  constructor() {
    super({});
  }
}

export class WrapHeadBlock extends Block {
  type = "wrap-head" as const;
  name = "Wrap Head" as const;
  uniqueName = "" as const;
  design = new BlockDesign({
    width: 27,
    height: 30,
    imageSrc: "/blocks/wrap-head.svg",
  });
  params = null;
  uuid = uuidv4(); // todo
  constructor(public connectTo: string) {
    super({});
  }
}

export class WrapTailBlock extends Block {
  type = "wrap-tail" as const;
  name = "Wrap Tail" as const;
  uniqueName = "" as const;
  design = new BlockDesign({
    width: 20,
    height: 30,
    imageSrc: "/blocks/wrap-tail.svg",
  });
  params = null;
  uuid = uuidv4(); // todo
  constructor(public connectTo: string) {
    super({});
  }
}

export class RecombinaseBlock extends MetaModifierBlock {
  name = "RecombinaseI" as const;
  uniqueName = "block.metaRecomb.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/meta.svg",
    displayName: "block.metaRecomb.displayName",
    description: "block.metaRecomb.description",
    marginRight: 20,
  });
  params: {
    recombinase: {
      value: typeof recombinaseNames[number];
      list: typeof recombinaseNames;
    };
  } = {
    recombinase: {
      value: "matter.metaRecombA.name",
      list: recombinaseNames,
    },
  };
  getProtein() {
    switch (this.params.recombinase.value) {
      case "matter.metaRecombA.name":
        return new RecombinaseA();
      case "matter.metaRecombB.name":
        return new RecombinaseB();
    }
  }
  constructor() {
    super({});
  }
}

// export class RecombinaseBBlock extends MetaModifierBlock {
//   name = "RecombinaseII" as const;
//   uniqueName = "meta-recomb2" as const;
//   design = new BlockDesign({
//     width: 184,
//     height: 30,
//     imageSrc: "/blocks/meta.svg",
//     displayName: "block.metaRecomb2.displayName",
//     description: "block.metaRecomb2.description",
//   });
//   get ProteinClass(): ProteinImpl {
//     return RecombinaseB;
//   }
//   constructor() {
//     super({});
//   }
// }

export class RecombinaseRecognitionSeqBlock extends SpecialSequenceBlock {
  name = "RecombinaseI Recognition Seq." as const;
  uniqueName = "block.seqRecogRecomb.displayName" as const;
  design = new BlockDesign({
    width: 131,
    height: 90,
    imageSrc: "/blocks/recombinase-recognition-seq.svg",
    displayName: "block.seqRecogRecomb.displayName",
    description: "block.seqRecogRecomb.description",
    bottomAnchor: 30,
  });
  params: {
    recombinase: {
      value: typeof recombinaseSequenceNames[number];
      list: typeof recombinaseSequenceNames;
    };
  } = {
    recombinase: {
      value: "matter.seqRecogRecombA.name",
      list: recombinaseSequenceNames,
    },
  };
  constructor() {
    super({});
  }
}

// export class RecombinaseBRecognitionSeqBlock extends SpecialSequenceBlock {
//   name = "RecombinaseII Recognition Seq." as const;
//   uniqueName = "seq-recog-recomb2" as const;
//   design = new BlockDesign({
//     width: 131,
//     height: 90,
//     imageSrc: "/blocks/recombinase-recognition-seq.svg",
//     displayName: "block.seqRecogRecomb2.displayName",
//     description: "block.seqRecogRecomb2.description",
//     bottomAnchor: 30,
//   });
//   constructor() {
//     super({});
//   }
// }

export class KillSwitchBlock extends MetaModifierBlock {
  name = "KillSwitch" as const;
  uniqueName = "block.metaKill.displayName" as const;
  design = new BlockDesign({
    width: 184,
    height: 30,
    imageSrc: "/blocks/meta.svg",
    displayName: "block.metaKill.displayName",
    description: "block.metaKill.description",
    marginRight: 20,
  });
  params = null;
  getProtein() {
    return new KillSwitch();
  }
  constructor() {
    super({});
  }
}

export const allFinalBlockClasses: FinalBlock[] = [
  ConstPromoterBlock,
  RepressiblePromoterBlock,
  InduciblePromoterBlock,
  // PhyBPIF3ActivatedPromoterBlock,
  FluorescenceBlock,
  // GFPBlock,
  RepressorBlock,
  ActivatorBlock,
  // PhyBBlock,
  // PIF3Block,
  CYC1TerminatorBlock,
  RecombinaseBlock,
  RecombinaseRecognitionSeqBlock,
  // RecombinaseBBlock,
  // RecombinaseBRecognitionSeqBlock,
  KillSwitchBlock,
];

export function uniqueNameToBlockV1(uniqueName: string): Block {
  switch (uniqueName) {
    case "prom-const-1":
      return new ConstPromoterBlock();
    case "prom-repr-RepressorADrugA": {
      const block = new RepressiblePromoterBlock();
      block.params.repressor.value = "matter.ctrlRepressorA.name";
      return block;
    }
    case "prom-activ-EL222dim": {
      const block = new InduciblePromoterBlock();
      block.params.activator.value = "matter.ctrlEL222dim.name";
      return block;
    }
    case "prom-activ-PhyBPIF3": {
      const block = new InduciblePromoterBlock();
      block.params.activator.value = "matter.ctrlPhyBPIF3.name";
      return block;
    }
    case "visi-mCherry": {
      const block = new FluorescenceBlock();
      block.params.protein.value = "matter.visiMCherry.name";
      return block;
    }
    case "visi-GFP": {
      const block = new FluorescenceBlock();
      block.params.protein.value = "matter.visiGFP.name";
      return block;
    }
    case "ctrl-RepressorA": {
      const block = new RepressorBlock();
      block.params.repressor.value = "matter.ctrlRepressorA.name";
      return block;
    }
    case "ctrl-EL222": {
      const block = new ActivatorBlock();
      block.params.activator.value = "matter.ctrlEL222.name";
      return block;
    }
    case "ctrl-PhyB": {
      const block = new ActivatorBlock();
      block.params.activator.value = "matter.ctrlPhyB.name";
      return block;
    }
    case "ctrl-PIF3": {
      const block = new ActivatorBlock();
      block.params.activator.value = "matter.ctrlPIF3.name";
      return block;
    }
    case "term-1":
      return new CYC1TerminatorBlock();
    // todo
    case "meta-recomb1": {
      const block = new RecombinaseBlock();
      block.params.recombinase.value = "matter.metaRecombA.name";
      return block;
    }
    case "meta-recomb2": {
      const block = new RecombinaseBlock();
      block.params.recombinase.value = "matter.metaRecombB.name";
      return block;
    }
    case "seq-recog-recomb1": {
      const block = new RecombinaseRecognitionSeqBlock();
      block.params.recombinase.value = "matter.metaRecombA.name";
      return block;
    }
    case "seq-recog-recomb2": {
      const block = new RecombinaseRecognitionSeqBlock();
      block.params.recombinase.value = "matter.metaRecombB.name";
      return block;
    }
    case "meta-kill":
      return new KillSwitchBlock();
    default:
      throw new Error(`invalid unique name: ${uniqueName}`);
  }
}

export function uniqueNameToBlockV2(uniqueName: MessagesAddresses): Block {
  switch (uniqueName) {
    case "block.promConst1.displayName":
      return new ConstPromoterBlock();
    case "block.promRepressor.displayName":
      return new RepressiblePromoterBlock();
    case "block.promActivator.displayName":
      return new InduciblePromoterBlock();
    case "block.visiFluorescence.displayName":
      return new FluorescenceBlock();
    case "block.ctrlRepressor.displayName":
      return new RepressorBlock();
    case "block.ctrlActivator.displayName":
      return new ActivatorBlock();
    case "block.term1.displayName":
      return new CYC1TerminatorBlock();
    // todo
    case "block.metaRecomb.displayName":
      return new RecombinaseBlock();
    case "block.seqRecogRecomb.displayName":
      return new RecombinaseRecognitionSeqBlock();
    case "block.metaKill.displayName":
      return new KillSwitchBlock();
    default:
      throw new Error(`invalid unique name: ${uniqueName}`);
  }
}
