import * as Block from "./block";

export interface BlockDesignDetail {
  imageSrc: string
  blockClass: Block.FinalBlock
  displayName?: string
  // 接続場所など
}
export const blockDesignDetails: { [K in Block.BlockNames]: BlockDesignDetail } = {
  'T7 promoter': {
    imageSrc: '/blocks/promoter.svg',
    blockClass: Block.T7PromoterBlock,
    displayName: '常時発現'
  },
  'Drug Repressible Promoter': {
    imageSrc: '/blocks/promoter.svg',
    blockClass: Block.DrugRepressiblePromoterBlock,
    displayName: 'リプレッサーA結合'
  },
  'mCherry': {
    imageSrc: '/blocks/visible.svg',
    blockClass: Block.MCherryBlock
  },
  'Repressor': {
    imageSrc: '/blocks/visible.svg',
    blockClass: Block.RepressorBlock,
    displayName: 'リプレッサーA'
  },
  'CYC1 Terminator': {
    imageSrc: '/blocks/terminator.svg',
    blockClass: Block.CYC1TerminatorBlock,
    displayName: 'ターミネーター'
  },
}
