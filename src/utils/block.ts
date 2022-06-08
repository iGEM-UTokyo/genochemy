import {
  DrugRepressiblePromoter,
  OperonMessengerRNA,
  Promoter,
  Protein,
  Repressor,
  T7Promoter,
} from "./matter";

export type BlockTypes = "promoter" | "visibility" | "terminator";
export type BlockNames =
  | "T7 promoter"
  | "Drug Repressible Promoter"
  | "mCherry"
  | "Repressor"
  | "CYC1 Terminator";
export type BlockWithUUID = Block & { uuid: string };
export type Vector2 = [number, number];
export abstract class Block {
  abstract type: BlockTypes;
  abstract name: BlockNames;
  abstract width: number;
  uuid?: string;
  constructor(args: Pick<Block, "uuid">) {
    this.uuid = args.uuid;
  }
}

export abstract class PromoterBlock extends Block {
  type: "promoter" = "promoter";
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
  type: "visibility" = "visibility";
  constructor(args: Pick<Block, "uuid">) {
    super({
      uuid: args.uuid,
    });
  }
}

export abstract class TerminatorBlock extends Block {
  type: "terminator" = "terminator";
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
  name: "T7 promoter" = "T7 promoter";
  promoter = new T7Promoter();
  width = 184;
  constructor() {
    super({});
  }
}

export class DrugRepressiblePromoterBlock extends PromoterBlock {
  name: "Drug Repressible Promoter" = "Drug Repressible Promoter";
  promoter = new DrugRepressiblePromoter();
  width = 184;
  constructor() {
    super({});
  }
}

export class MCherryBlock extends VisibilityBlock {
  name: "mCherry" = "mCherry";
  width = 184;
  constructor() {
    super({});
  }
}

export class RepressorBlock extends VisibilityBlock {
  name: "Repressor" = "Repressor";
  width = 184;
  get ProteinClass(): ProteinImpl {
    return Repressor;
  }
  constructor() {
    super({});
  }
}

export class CYC1TerminatorBlock extends TerminatorBlock {
  name: "CYC1 Terminator" = "CYC1 Terminator";
  width = 184;
  constructor() {
    super({});
  }
}
