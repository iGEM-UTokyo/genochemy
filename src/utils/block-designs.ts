import * as Block from "./block";

export interface BlockDesignDetail {
  imageSrc: string
  blockClass: Block.FinalBlock
  // 接続場所など
}
export const blockDesignDetails: { [K in Block.BlockNames]: BlockDesignDetail } = {
  'T7 promoter': {
    imageSrc: '/blocks/promoter.svg',
    blockClass: Block.T7PromoterBlock
  },
  'mCherry': {
    imageSrc: '/blocks/visible.svg',
    blockClass: Block.MCherryBlock
  },
  'CYC1 Terminator': {
    imageSrc: '/blocks/terminator.svg',
    blockClass: Block.CYC1TerminatorBlock
  },
}
