import ja from "./ja";

export type MatterMessages = { name: string; description: string };
export type BlockMessages = { displayName: string; description: string };
export interface Messages {
  matter: {
    promT7: MatterMessages;
    promReprRepressorADrugA: MatterMessages;
    promActivEL222dim: MatterMessages;
  };
  block: {
    promConst1: BlockMessages;
    promReprRepressorADrugA: BlockMessages;
    promActivEL222dim: BlockMessages;
    promActivPhyBPIF3: BlockMessages;
    visiMCherry: BlockMessages;
    visiGFP: BlockMessages;
    ctrlRepressorA: BlockMessages;
    ctrlEL222: BlockMessages;
    ctrlPhyB: BlockMessages;
    ctrlPIF3: BlockMessages;
    term1: BlockMessages;
    // todo
    metaRecomb1: BlockMessages;
    metaRecomb2: BlockMessages;
    seqRecogRecomb1: BlockMessages;
    seqRecogRecomb2: BlockMessages;
    metaKill: BlockMessages;
  };
}

const messages = {
  ja,
};

export default messages;
