import { JsonFormat } from "./importer";

interface Question {
  name: string;
  imgs: string[];
  answer: JsonFormat;
}

const questions: Question[] = [
  {
    name: "Green Creature",
    imgs: ["Question1.png"],
    answer: [],
  },
  {
    name: "Blue makes green",
    imgs: ["Question2.png"],
    answer: [],
  },
  {
    name: "Killer Light",
    imgs: ["Question2.5.png"],
    answer: [],
  },
  {
    name: "Drug Addict",
    imgs: ["Question3.png"],
    answer: [],
  },
  {
    name: "NAND Gate",
    imgs: ["Question4-1.png", "Question4-2.png"],
    answer: [],
  },
  {
    name: "Short Temper",
    imgs: ["Question5.png"],
    answer: [],
  },
  {
    name: "Blue makes infinitely green",
    imgs: ["Question6.png"],
    answer: [],
  },
  {
    name: "Optopass",
    imgs: ["Question7.png"],
    answer: [
      {
        blocks: [
          "prom-const-1",
          "ctrl-EL222",
          "ctrl-PhyB",
          "ctrl-PIF3",
          "term-1",
        ],
      },
      {
        blocks: [
          "prom-activ-EL222dim",
          "seq-recog-recomb2",
          "meta-recomb1",
          "term-1",
          "seq-recog-recomb2",
          "visi-GFP",
          "term-1",
        ],
      },
      {
        blocks: [
          "prom-activ-PhyBPIF3",
          "seq-recog-recomb1",
          "meta-kill",
          "term-1",
          "seq-recog-recomb1",
          "meta-recomb2",
          "term-1",
        ],
      },
    ],
  },
];

export default questions;
