import * as Block from "./block";

export type BlockDesignDetail = {
  imageSrc: string;
  displayName?: string;
  // 接続場所など
} & (
  | {
      blockClass: Block.FinalBlock;
      invisibleInTray?: false;
    }
  | {
      blockClass: { new (...args: any[]): Block.Block };
      invisibleInTray: true;
    }
);
export const blockDesignDetails: {
  [K in Block.BlockNames]: BlockDesignDetail;
} = {
  "T7 promoter": {
    imageSrc: "/blocks/promoter.svg",
    blockClass: Block.T7PromoterBlock,
    displayName: "常時発現",
  },
  "Drug Repressible Promoter": {
    imageSrc: "/blocks/promoter.svg",
    blockClass: Block.DrugRepressiblePromoterBlock,
    displayName: "リプレッサーA結合",
  },
  "EL222 Activated Promoter": {
    imageSrc: "/blocks/promoter.svg",
    blockClass: Block.EL222ActivatedPromoterBlock,
    displayName: "青アクチベータ結合",
  },
  mCherry: {
    imageSrc: "/blocks/visible.svg",
    blockClass: Block.MCherryBlock,
  },
  GFP: {
    imageSrc: "/blocks/visible.svg",
    blockClass: Block.GFPBlock,
  },
  RepressorA: {
    imageSrc: "/blocks/control.svg",
    blockClass: Block.RepressorBlock,
    displayName: "リプレッサーA",
  },
  EL222: {
    imageSrc: "/blocks/control.svg",
    blockClass: Block.EL222Block,
    displayName: "青色アクチベーター",
  },
  "CYC1 Terminator": {
    imageSrc: "/blocks/terminator.svg",
    blockClass: Block.CYC1TerminatorBlock,
    displayName: "ターミネーター",
  },
  "Wrap Head": {
    imageSrc: "/blocks/wrap-head.svg",
    blockClass: Block.WrapHeadBlock,
    displayName: "",
    invisibleInTray: true,
  },
  "Wrap Tail": {
    imageSrc: "/blocks/wrap-tail.svg",
    blockClass: Block.WrapTailBlock,
    displayName: "",
    invisibleInTray: true,
  },
};
