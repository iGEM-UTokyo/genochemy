import { MessagesAddresses } from "@/messages";
import {
  CodingBlock,
  PromoterBlock,
  RecombinaseRecognitionSeqBlock,
  TerminatorBlock,
} from "./block";
import { DeepReadonly } from "./deep-readonly";
import { Snake } from "./snake";

const vDNA: { [K in MessagesAddresses]?: string } = {
  "matter.promT7.name":
    "caacttcttttctttttttttcttttctctctcccccgttgttgtctcaccatatccgcaatgacaaaaaaatgatggaagacactaaaggaaaaaattaacgacaaagacagcaccaacagatgtcgttgttccagagctgatgaggggtatctcgaagcacacgaaactttttccttccttcattcacgcacactactctctaatgagcaacggtatacggccttccttccagttacttgaatttgaaataaaaaaaagtttgctgtcttgctatcaagtataaatagacctgcaattattaatcttttgtttcctcgtcattgttctcgttccctttcttccttgtttctttttctgcacaatatttcaagctataccaagcatacaatcaactatctcatataca",
  "matter.promReprRepressorADrugA.name": "cgaactagttaactagtacgc",
  "matter.promActivEL222dim.name":
    "gtatttgtgtttgtgtgtctatagaagtatagtaatttatgctgcaaaggtcctaatgtataaggaaagaatatttagagaaaagaagaaaacaagagttttatatacatacagagcacatgcatgccatatgatcatgtgtcgtcgcacacatatatatatgcctgtagtgtcagcactctagacatggactaaaggctagctactagtagcgaacgcaagctgaagcgggtaagctgccacagcaattaatgcacaacatttaacctacattcttccttatcggat",
  "matter.promActivPhyBPIF3.name":
    "tctataagatcttgtgtgcgctagctctataagatcttgtgtgcgctagctctataagatcttgtgtgcgctagctctataagatcttgtgtgccctagggcatgtgctctgtatgtatataaaactcttgttttcttcttttctctaaatattctttccttatacattaggtcctttgtagcataaattactatacttctatagacacgcaaacacaaatacacacactaaattaata",
  "matter.visiMCherry.name":
    "ATGGCAACTAGCGGCATGGTTAGTAAAGGAGAAGAAAATAACATGGCAATCATTAAGGAGTTCATGAGATTCAAAGTTCACATGGAAGGTTCTGTAAATGGACATGAATTTGAAATAGAAGGTGAAGGAGAAGGAAGGCCTTATGAAGGAACCCAAACCGCGAAGCTAAAAGTTACTAAGGGTGGCCCATTACCATTTGCATGGGATATCCTTAGCCCTCAATTCATGTATGGGTCAAAGGCTTATGTCAAGCACCCCGCCGACATTCCAGACTATCTAAAGTTATCTTTTCCCGAAGGGTTTAAGTGGGAGCGTGTGATGAACTTCGAAGACGGTGGCGTGGTAACAGTGACTCAGGATTCGTCCCTGCAAGATGGTGAATTTATCTACAAAGTCAAATTAAGAGGAACTAACTTTCCATCTGACGGCCCGGTTATGCAAAAAAAGACAATGGGCTGGGAGGCCTCCTCAGAACGAATGTACCCTGAAGATGGTGCCTTGAAGGGTGAGATTAAACAAAGATTGAAATTGAAAGATGGTGGACATTATGACGCTGAGGTTAAAACGACATACAAAGCTAAGAAACCTGTCCAGCTCCCAGGTGCTTACAATGTAAATATAAAACTTGATATTACATCACATAATGAAGATTATACGATAGTTGAACAATACGAAAGGGCTGAGGGGAGACATAGTACTGGTGGCATGGATGAACTATACAAAGGTTCTGGTACCGCATAATAA",
  "matter.visiGFP.name":
    "ATGCGTAAAGGAGAAGAACTTTTCACTGGAGTTGTCCCAATTCTTGTTGAATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCGGTTATGGTGTTCAATGCTTTGCGAGATACCCAGATCATATGAAACAGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAAAGAACTATATTTTTCAAAGATGACGGGAACTACAAGACACGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATAGAATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTTGGACACAAATTGGAATACAACTATAACTCACACAATGTATACATCATGGCAGACAAACAAAAGAATGGAATCAAAGTTAACTTCAAAATTAGACACAACATTGAAGATGGAAGCGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCCACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGAGAGACCACATGGTCCTTCTTGAGTTTGTAACAGCTGCTGGGATTACACATGGCATGGATGAACTATACAAATAATAA",
  "matter.ctrlRepressorA.name":
    "ATGGCCCAACAATCACCCTATTCAGCAGCGATGGCAGAACAGCGTCACCAGGAGTGGTTACGTTTTGTCGACCTGCTTAAGAATGCCTACCAAAACGATCTCCATTTACCGTTGTTAAACCTGATGCTGACGCCAGATGAGCGCGAAGCGTTGGGGACTCGCGTGCGTATTGTCGAAGAGCTGTTGCGCGGCGAAATGAGCCAGCGTGAGTTAAAAAATGAACTCGGCGCAGGCATCGCGACGATTACGCGTGGATCTAACAGCCTGAAAGCCGCGCCCGTCGAGCTGCGCCAGTGGCTGGAAGAGGTGTTGCTGAAAAGCGATTGA",
  "matter.ctrlEL222.name":
    "ATGGGCCCGAAAAAAAAGAGAAAAGTAGCCCCACCAACGGACGTTTCACTTGGTGACGAATTACATTTAGACGGTGAGGATGTAGCTATGGCACATGCCGATGCTCTTGATGATTTTGATCTGGACATGTTAGGTGATGGGGATTCTCCCGGCCCCGGATTTACACCACATGATTCTGCTCCGTATGGCGCGTTGGACATGGCAGATTTCGAATTTGAACAGATGTTTACTGATGCACTTGGTATCGACGAATATGGAGGTGAATTCGGAGCAGATGATACTAGAGTTGAAGTCCAACCTCCAGCCCAATGGGTATTGGATTTGATCGAGGCCTCACCCATAGCAAGTGTTGTTAGTGATCCCAGATTGGCTGATAATCCTTTGATTGCTATCAACCAGGCCTTTACCGATCTAACTGGGTATTCTGAGGAAGAATGTGTTGGTCGTAATTGTAGATTTTTGGCAGGATCTGGTACTGAACCCTGGCTAACAGATAAGATCCGTCAAGGTGTTCGTGAGCATAAACCCGTGTTGGTTGAGATTTTGAATTACAAAAAGGATGGTACTCCTTTTCGTAATGCAGTTTTGGTGGCACCAATCTATGATGACGATGATGAATTACTATACTTCCTTGGTAGCCAAGTGGAAGTGGATGACGATCAACCGAACATGGGCATGGCCCGTAGAGAACGTGCTGCGGAGATGTTAAAAACTCTTTCACCACGTCAATTAGAAGTCACAACTCTGGTTGCATCAGGCCTAAGAAATAAAGAAGTGGCTGCCAGACTGGGTCTTTCAGAAAAAACTGTCAAAATGCACAGAGGTTTGGTAATGGAAAAATTAAACTTAAAAACGAGTGCAGATTTAGTTAGAATTGCCGTAGAAGCAGGTATTTAA",
  "matter.ctrlPhyB.name":
    "ATGGATCCCATTCGTTCGCGCACACCAAGTCCTGCCCGCGAGCTTCTGCCCGGACCCCAACCCGATGGGGTTCAGCCGACTGCAGATCGTGGGGTGTCTCCGCCTGCCGGCGGCCCCCTGGATGGCTTGCCCGCTCGGCGGACGATGTCCCGGACCCGGCTGCCATCTCCCCCTGCCCCCTCACCTGCGTTCTCGGCGGGCAGCTTCAGTGACCTGTTACGTCAGTTCGATCCGTCACTTTTTAATACATCGCTTTTTGATTCATTGCCTCCCTTCGGCGCTCACCATACAGAGGCTGCCACAGGCGAGTGGGATGAGGTGCAATCGGGTCTGCGGGCAGCCGACGCCCCCCCACCCACCATGCGCGTGGCTGTCACTGCCGCGCGGCCGCCGCGCGCCAAGCCGGCGCCGCGACGACGTGCTGCGCAACCCTCCGACGCTTCGCCGGCCGCGCAGGTGGATCTACGCACGCTCGGCTACAGCCAGCAGCAACAGGAGAAGATCAAACCGAAGGTTCGTTCGACAGTGGCGCAGCACCACGAGGCACTGGTCGGCCATGGGTTTACACACGCGCACATCGTTGCGCTCAGCCAACACCCGGCAGCGTTAGGGACCGTCGCTGTCAAGTATCAGGACATGATCGCAGCGTTGCCAGAGGCGACACACGAAGCGATCGTTGGCGTCGGCAAACAGTGGTCCGGCGCACGCGCTCTGGAGGCCTTGCTCACGGTGGCGGGAGAGTTGAGAGGTCCACCGTTACAGTTGGACACAGGCCAACTTCTCAAGATTGCAAAACGTGGCGGCGTGACCGCAGTGGAGGCAGTGCATGCATGGCGCAATGCACTGACGGGTGCCCCCCTGAACCTTACGCGGTCTTCCCGGGAAGACCCACCCCAGCAGGTGGTGGCCATCGCCAGCCACGACGGCGGCAGGCCGGCGCTGGAGAGCATTGTTGCCCAGTTATCTCGCCCTGATCCGGCGTTGGCCGCGTTGACCAACGACCACCTCGTCGCCTTGGCCTGCCTCGGCGGACGTCCTGCGCTGGATGCAGTGAAAAAGGGATTGCCGCACGCGCCGGCCTTGATCAAAAGAACCAATCGCCGTATTCCCGAACGCACATCCCATCGCGTTGCCGACCACGCGCAAGTGGTTCGCGTGCTGGGTTTTTTCCAGTGCCACTCCCACCCAGCGCAAGCATTTGATGACGCCATGACGCAGTTCGGGATGAGCAGGCACGGGTTGTTACAGCTCTTTCGCAGAGTGGGCGTCACCGAACTCGAAGCCCGCAGTGGAACGCTCCCCCCAGCCTCGCAGCGTTGGGACCGTATCCTCCAGGCATCAGGGATGAAAAGGGCCAAACCGTCCCCTACTTCAACTCAAACGCCGGATCAGGCGTCTTTGCATGCATTCGCCGATTCGCTGGAGCGTGACCTTGATGCGCCTAGCCCAATGCACGAGGGAGATCAGACGCGGGCAAGCAGCCGTAAACGGTCCCGATCGGATCGTGCTGTCACCGGTGGTTCCGGACGGGCTGACGCATTGGACGATTTTGATCTGGATATGCTGGGAAGTGACGCCCTCGATGATTTTGACCTTGACATGCTTGGTTCGGATGCCCTTGATGACTTTGACCTCGACATGCTCGGCAGTGACGCCCTTGATGATTTCGACCTGGACATGCTGATTAACTCTAGAAGGCCATTAAAGCGTAAGAAATAG",
  "matter.ctrlPIF3.name":
    "ATGCATCACCATCACCATCACATGGATCCCATTCGTTCGCGCACACCAAGTCCTGCCCGCGAGCTTCTGCCCGGACCCCAACCCGATGGGGTTCAGCCGACTGCAGATCGTGGGGTGTCTCCGCCTGCCGGCGGCCCCCTGGATGGCTTGCCCGCTCGGCGGACGATGTCCCGGACCCGGCTGCCATCTCCCCCTGCCCCCTCACCTGCGTTCTCGGCGGGCAGCTTCAGTGACCTGTTACGTCAGTTCGATCCGTCACTTTTTAATACATCGCTTTTTGATTCATTGCCTCCCTTCGGCGCTCACCATACAGAGGCTGCCACAGGCGAGTGGGATGAGGTGCAATCGGGTCTGCGGGCAGCCGACGCCCCCCCACCCACCATGCGCGTGGCTGTCACTGCCGCGCGGCCGCCGCGCGCCAAGCCGGCGCCGCGACGACGTGCTGCGCAACCCTCCGACGCTTCGCCGGCCGCGCAGGTGGATCTACGCACGCTCGGCTACAGCCAGCAGCAACAGGAGAAGATCAAACCGAAGGTTCGTTCGACAGTGGCGCAGCACCACGAGGCACTGGTCGGCCATGGGTTTACACACGCGCACATCGTTGCGCTCAGCCAACACCCGGCAGCGTTAGGGACCGTCGCTGTCAAGTATCAGGACATGATCGCAGCGTTGCCAGAGGCGACACACGAAGCGATCGTTGGCGTCGGCAAACAGTGGTCCGGCGCACGCGCTCTGGAGGCCTTGCTCACGGTGGCGGGAGAGTTGAGAGGTCCACCGTTACAGTTGGACACAGGCCAACTTCTCAAGATTGCAAAACGTGGCGGCGTGACCGCAGTGGAGGCAGTGCATGCATGGCGCAATGCACTGACGGGTGCCCCCCTGAACCTTACGCGGTCTTCCCGGGAAGACCCACCCCAGCAGGTGGTGGCCATCGCCAGCCACGACGGCGGCAGGCCGGCGCTGGAGAGCATTGTTGCCCAGTTATCTCGCCCTGATCCGGCGTTGGCCGCGTTGACCAACGACCACCTCGTCGCCTTGGCCTGCCTCGGCGGACGTCCTGCGCTGGATGCAGTGAAAAAGGGATTGCCGCACGCGCCGGCCTTGATCAAAAGAACCAATCGCCGTATTCCCGAACGCACATCCCATCGCGTTGCCGACCACGCGCAAGTGGTTCGCGTGCTGGGTTTTTTCCAGTGCCACTCCCACCCAGCGCAAGCATTTGATGACGCCATGACGCAGTTCGGGATGAGCAGGCACGGGTTGTTACAGCTCTTTCGCAGAGTGGGCGTCACCGAACTCGAAGCCCGCAGTGGAACGCTCCCCCCAGCCTCGCAGCGTTGGGACCGTATCCTCCAGGCATCAGGGATGAAAAGGGCCAAACCGTCCCCTACTTCAACTCAAACGCCGGATCAGGCGTCTTTGCATGCATTCGCCGATTCGCTGGAGCGTGACCTTGATGCGCCTAGCCCAATGCACGAGGGAGATCAGACGCGGGCAAGCAGCCGTAAACGGTCCCGATCGGATCGTGCTGTCACCGGTAGGCCATTAAAGCGTAAGAAAATGGTTTCCGGAGTCGGGGGTAGTGGCGGTGGCCGTGGCGGTGGCCGTGGCGGAGAAGAAGAACCGTCGTCAAGTCACACTCCTAATAACCGAAGAGGAGGAGAACAAGCTCAATCGTCGGGAACGAAATCTCTCAGACCAAGAAGCAACACTGAATCAATGAGCAAAGCAATTCAACAGTACACCGTCGACGCAAGACTCCACGCCGTTTTCGAACAATCCGGCGAATCAGGGAAATCATTCGACTACTCACAATCACTCAAAACGACGACGTACGGTTCCTCTGTACCTGAGCAACAGATCACAGCTTATCTCTCTCGAATCCAGCGAGGTGGTTACATTCAGCCTTTCGGATGTATGATCGCCGTCGATGAATCCAGTTTCCGGATCATCGGTTACAGTGAAAACGCCAGAGAAATGTTAGGGATTATGCCTCAATCTGTTCCTACTCTTGAGAAACCTGAGATTCTAGCTATGGGAACTGATGTGAGATCTTTGTTCACTTCTTCGAGCTCGATTCTACTCGAGCGTGCTTTCGTTGCTCGAGAGATTACCTTGTTAAATCCGGTTTGGATACATTCCAAGAATACTGGTAAACCGTTTTACGCCATTCTTCATAGGATTGATGTTGGTGTTGTTATTGATTTAGAGCCAGCTAGAACTGAAGATCCTGCGCTTTCTATTGCTGGTGCTGTTCAATCGCAGAAACTCGCGGTTCGTGCGATTTCTCAGTTACAGGCTCTTCCTGGTGGAGATATTAAGCTTTTGTGTGACACTGTCGTGGAAAGTGTGAGGGACTTGACTGGTTATGATCGTGTTATGGTTTATAAGTTTCATGAAGATGAGCATGGAGAAGTTGTAGCTGAGAGTAAACGAGATGATTTAGAGCCTTATATTGGACTGCATTATCCTGCTACTGATATTCCTCAAGCGTCAAGGTTCTTGTTTAAGCAGAACCGTGTCCGAATGATAGTAGATTGCAATGCCACACCTGTTCTTGTGGTCCAGGACGATAGGCTAACTCAGTCTATGTGCTTGGTTGGTTCTACTCTTAGGGCTCCTCATGGTTGTCACTCTCAGTATATGGCTAACATGGGATCTATTGCGTCTTTAGCAATGGCGGTTATAATCAATGGAAATGAAGATGATGGGAGCAATGTAGCTAGTGGAAGAAGCTCGATGAGGCTTTGGGGTTTGGTTGTTTGCCATCACACTTCTTCTCGCTGCATACCGTTTCCGCTAAGGTATGCTTGTGAGTTTTTGATGCAGGCTTTCGGTTTACAGTTAAACATGGAATTGCAGTTAGCTTTGCAAATGTCAGAGAAACGCGTTTTGAGAACGCAGACACTGTTATGTGATATGCTTCTGCGTGACTCGCCTGCTGGAATTGTTACACAGAGTCCCAGTATCATGGACTTAGTGAAATGTGACGGTGCAGCATTTCTTTACCACGGGAAGTATTACCCGTTGGGTGTTGCTCCTAGTGAAGTTCAGATAAAAGATGTTGTGGAGTGGTTGCTTGCGAATCATGCGGATTCAACCGGATTAAGCACTGATAGTTTAGGCGATGCGGGGTATCCCGGTGCAGCTGCGTTAGGGGATGCTGTGTGCGGTATGGCAGTTGCATATATCACAAAAAGAGACTTTCTTTTTTGGTTTCGATCTCACACTGCGAAAGAAATCAAATGGGGAGGCGCTAAGCATCATCCGGAGGATAAAGATGATGGGCAACGAATGCATCCTCGTTCGTCCTTTCAGGCTTTTCTTGAAGTTGTTAAGAGCCGGAGTCAGCCATGGGAAACTGCGGAAATGGATGCGATTCACTCGCTCCAGCTTATTCTGAGAGACTCTTTTAAAGAATCTTAG",
  "matter.metaRecombA.name":
    "ATGTCCAACCTGCTGACTGTGCACCAAAACCTGCCTGCCCTCCCTGTGGATGCCACCTCTGATGAAGTCAGGAAGAACCTGATGGACATGTTCAGGGACAGGCAGGCCTTCTCTGAACACACCTGGAAGATGCTCCTGTCTGTGTGCAGATCCTGGGCTGCCTGGTGCAAGCTGAACAACAGGAAATGGTTCCCTGCTGAACCTGAGGATGTGAGGGACTACCTCCTGTACCTGCAAGCCAGAGGCCTGGCTGTGAAGACCATCCAACAGCACCTGGGCCAGCTCAACATGCTGCACAGGAGATCTGGCCTGCCTCGCCCTTCTGACTCCAATGCTGTGTCCCTGGTGATGAGGAGAATCAGAAAGGAGAATGTGGATGCTGGGGAGAGAGCCAAGCAGGCCCTGGCCTTTGAACGCACTGACTTTGACCAAGTCAGATCCCTGATGGAGAACTCTGACAGATGCCAGGACATCAGGAACCTGGCCTTCCTGGGCATTGCCTACAACACCCTGCTGCGCATTGCCGAAATTGCCAGAATCAGAGTGAAGGACATCTCCCGCACCGATGGTGGGAGAATGCTGATCCACATTGGCAGGACCAAGACCCTGGTGTCCACAGCTGGTGTGGAGAAGGCCCTGTCCCTGGGGGTTACCAAGCTGGTGGAGAGATGGATCTCTGTGTCTGGTGTGGCTGATGACCCCAACAACTACCTGTTCTGCCGGGTCAGAAAGAATGGTGTGGCTGCCCCTTCTGCCACCTCCCAACTGTCCACCCGGGCCCTGGAAGGGATCTTTGAGGCCACCCACCGCCTGATCTATGGTGCCAAGGATGACTCTGGGCAGAGATACCTGGCCTGGTCTGGCCACTCTGCCAGAGTGGGTGCTGCCAGGGACATGGCCAGGGCTGGTGTGTCCATCCCTGAAATCATGCAGGCTGGTGGCTGGACCAATGTGAACATTGTGATGAACTACATCAGAAACCTGGACTCTGAGACTGGGGCCATGGTGAGGCTGCTCGAAGATGGGGACTGA",
  "matter.metaRecombB.name":
    "ATGCCTAAGAAGAAGAGGAAGGTTTACCCATACGATGTTCCAGATTACGCTGGATCCTCTGAGCTGATTATTAGTGGTTCATCTGGTGGATTCCTGCGAAACATCGGCAAAGAGTATCAGGAGGCCGCTGAAAACTTCATGAGGTTTATGAATGACCAGGGGGCGTACGCTCCTAACACTTTGAGGGATTTGAGGTTGGTCTTTCATAGCTGGGCCAGATGGTGCCATGCTCGGCAGCTTGCATGGTTTCCAATTAGTCCTGAAATGGCACGCGAATACTTTCTTCAGTTGCACGATGCAGACCTGGCCTCCACTACCATCGACAAGCACTATGCTATGCTTAATATGCTTCTGTCCCACTGCGGACTGCCACCCTTGTCCGACGACAAGTCAGTGAGTCTTGCCATGAGAAGAATTAGAAGAGAAGCCGCAACCGAAAAGGGTGAGAGGACAGGACAGGCAATCCCCCTGCGCTGGGACGACCTGAAGCTGCTGGATGTGCTGCTCAGCAGGAGCGAGCGGCTGGTCGACCTGCGCAACAGGGCTTTCCTGTTCGTAGCCTATAACACCCTCATGAGAATGTCTGAAATATCACGCATCAGGGTTGGGGACTTGGATCAGACAGGAGACACAGTGACCCTGCACATCAGTCACACTAAGACAATCACCACAGCTGCGGGCCTTGACAAAGTGCTCTCCCGGCGAACCACAGCAGTGCTCAATGACTGGCTGGACGTCAGTGGGCTTAGAGAACATCCAGACGCTGTGCTCTTCCCACCTATACACCGGTCAAACAAAGCCCGCATTACTACCACGCCCCTGACCGCCCCTGCCATGGAGAAGATTTTCAGTGATGCCTGGGTGCTGCTGAACAAACGGGACGCCACCCCCAATAAAGGGAGGTATAGGACCTGGACCGGCCATTCCGCCAGGGTGGGTGCCGCAATAGACATGGCCGAGAAACAGGTGTCTATGGTCGAGATTATGCAGGAAGGGACATGGAAGAAGCCTGAAACACTGATGCGGTATCTCAGAAGGGGCGGAGTGTCCGTGGGAGCCAATTCTCGACTGATGGATAGCTGA",
  "matter.metaKill.name":
    "ATGGACGGCTCTGGTGAACAACCCAGAGGTGGCGGTCCAACATCCAGTGAGCAAATTATGAAGACGGGGGCTCTACTTCTACAGGGTTTTATCCAGGATCGTGCTGGGCGTATGGGGGGCGAGGCCCCAGAGTTAGCTCTAGACCCCGTCCCCCAGGATGCCAGTACGAAGAAGCTTTCCGAGTGTCTAAAAAGAATCGGGGATGAACTTGACTCCAATATGGAGTTGCAGAGAATGATTGCTGCGGTTGACACAGATTCTCCGAGAGAAGTGTTTTTCAGGGTAGCAGCAGACATGTTTTCCGATGGAAACTTCAATTGGGGGCGTGTAGTCGCGCTTTTTTATTTTGCTAGTAAGTTGGTGCTGAAAGCTCTGTGTACCAAGGTGCCCGAGCTTATAAGGACGATTATGGGATGGACATTGGATTTTCTACGTGAAAGGCTATTGGGATGGATACAAGATCAAGGCGGGTGGGACGGTCTATTAAGCTATTTCGGCACACCAACATGGCAGACGGTAACAATCTTCGTGGCCGGAGTGCTGACTGCGGCCCTAACTATATGGAAAAAAATGGGGTGA",
  "sequence.recogRecombA.name": "ataacttcgtataatgtatgctatacgaagttat",
  "sequence.recogRecombB.name": "taactttaaataatgccaattatttaaagtta",
  "sequence.term1.name":
    "catcatgtaattagttatgtcacgcttacattcacgccctccccccacatccgctctaaccgaaaaggaaggagttagacaacctgaagtctaggtccctatttatttttttatagttatgttagtattaagaacgttatttatatttcaaatttttcttttttttctgtacagacgcgtgtacgcatgtaacattatactgaaaaccttgcttgagaaggttttgggacgctcgaaggctttaatttgc",
};

export default vDNA;

type Annotation = { label: string; from: number; to: number };

export type VDNA = {
  vDNA: string;
  annotations: Annotation[];
};

export function toVDNAs(snakes: DeepReadonly<Snake>[]): VDNA[] {
  return snakes.map((snake) => {
    const vDNAFragments: string[] = [];
    const annotations: Annotation[] = [];
    let accumulatedLength = 0;
    for (const block of snake.blocks) {
      let name: MessagesAddresses | "" = "";
      if (block instanceof PromoterBlock) {
        name = block.getPromoter().name;
      } else if (block instanceof CodingBlock) {
        name = block.getProtein().displayName;
      } else if (block instanceof RecombinaseRecognitionSeqBlock) {
        name = block.params.recombinase.value;
      } else if (block instanceof TerminatorBlock) {
        name = "sequence.term1.name";
      }
      if (name === "" || !vDNA[name])
        throw new Error("The name of promoter is invalid");
      const _vDNA = vDNA[name];
      if (_vDNA) {
        vDNAFragments.push(_vDNA);
        annotations.push({
          label: name,
          from: accumulatedLength,
          to: accumulatedLength + _vDNA.length,
        });
        accumulatedLength += _vDNA.length;
      }
    }
    return { vDNA: vDNAFragments.join(""), annotations };
  });
}
