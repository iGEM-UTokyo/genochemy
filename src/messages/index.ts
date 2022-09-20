import ja from "./ja";
import en from "./en";

export type MatterMessages = { name: string; description: string };
export type BlockMessages = { displayName: string; description: string };
export interface Messages {
  matter: {
    promT7: MatterMessages;
    promReprRepressorADrugA: MatterMessages;
    promActivEL222dim: MatterMessages;
    promActivPhyBPIF3: MatterMessages;
    visiMCherry: MatterMessages;
    visiGFP: MatterMessages;
    ctrlRepressorA: MatterMessages;
    ctrlEL222: MatterMessages;
    ctrlPhyB: MatterMessages;
    ctrlPIF3: MatterMessages;
    ctrlEL222dim: MatterMessages;
    ctrlPhyBPIF3: MatterMessages;
    metaRecombA: MatterMessages;
    metaRecombB: MatterMessages;
    seqRecogRecombA: MatterMessages;
    seqRecogRecombB: MatterMessages;
    metaKill: MatterMessages;
  };
  block: {
    promConst1: BlockMessages;
    promRepressor: BlockMessages;
    promActivator: BlockMessages;
    visiFluorescence: BlockMessages;
    ctrlRepressor: BlockMessages;
    ctrlActivator: BlockMessages;
    term1: BlockMessages;
    // todo
    metaRecomb: BlockMessages;
    seqRecogRecomb: BlockMessages;
    metaKill: BlockMessages;
  };
  tutorial: {
    tutorial: string;
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    "6": string;
    "7": string;
    "8": string;
    "9": string;
    "10": string;
    "11": string;
    "12": string;
  };
  tabs: {
    tutorial: string;
    protein: string;
    rna: string;
    questions: string;
    load: string;
  };
  runner: {
    drugA: string;
    redLight: string;
    blueLight: string;
  };
  view: {
    show: string;
    hide: string;
  };
  questions: {
    question: string;
    showAnswer: string;
    image: string;
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    "6": string;
    "7": string;
    "8": string;
    "9": string;
  };
  load: {
    loadUTokyo2022Project: string;
  };
  twitterShare: string;
}

type A<T> = {
  [K in keyof T]: T[K] extends string
    ? K
    : C<B<T[K]> extends string ? B<T[K]> : "", K extends string ? K : "">;
};
type B<T> = A<T>[keyof A<T>];
type C<T extends string, K extends string> = `${K}.${T}`;
export type MessagesAddresses = B<Messages>;

const messages = {
  ja,
  en,
};

export default messages;
