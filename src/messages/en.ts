import { Messages } from ".";

const en: Messages = {
  matter: {
    promT7: {
      name: "Constitutive promoter",
      description: "Always expresses the downstream gene at a certain rate.",
    },
    promReprRepressorADrugA: {
      name: "Repressor A-binding promoter",
      description:
        "Represses transcription of the downstream gene when an activated repressor A binds.",
    },
    promActivEL222dim: {
      name: "Blue-light-sensor inducing promoter",
      description:
        "Induces transcription of the downstream gene when the blue-light-sensor dimer binds.",
    },
    promActivPhyBPIF3: {
      name: "Red-light-sensor ab inducing promoter",
      description:
        "Induces transcription of the downstream gene when heterodimer of red-light-sensors a and b binds.",
    },
    visiGFP: {
      name: "GFP",
      description: "Emits green fluorescence.",
    },
    visiMCherry: {
      name: "mCherry",
      description: "Emits red fluorescence.",
    },
    ctrlRepressorA: {
      name: "Repressor A",
      description:
        "Inhibits transcription of the downstream gene of repressor A-binding promoter when activated, bound to drug A.",
    },
    ctrlEL222: {
      name: "Blue-light-sensor",
      description: "Dimers are formed when blue light is shone.",
    },
    ctrlPhyB: {
      name: "Red-light-sensor a",
      description:
        "Forms a heterodimer with red-light-sensor b when red light is shone.",
    },
    ctrlPIF3: {
      name: "Red-light-sensor b", //"赤センサーb"
      description:
        "Forms a heterodimer with red-light-sensor a when red light is shone.",
    },
    ctrlEL222dim: {
      name: "Blue-light-sensor dimer",
      description: "Blue-light-sensor dimerized by blue light.",
    },
    ctrlPhyBPIF3: {
      name: "Red-light-sensor ab",
      description: "Red-light-sensor a and b hetero-dimerized by red light.",
    },
    metaRecombA: {
      name: "Recombinase I",
      description:
        "Cuts out the sequence sandwiched between recognition sequences I.",
    },
    metaRecombB: {
      name: "Recombinase II",
      description:
        "Cuts out the sequence sandwiched between recognition sequences II.",
    },
    metaKill: {
      name: "Kill Switch",
      description: "Kills target organism.",
    },
  },
  sequence: {
    recogRecombA: {
      name: "I",
      description: "Sequence recognized by Recombinase I.",
    },
    recogRecombB: {
      name: "II",
      description: "Sequence recognized by Recombinase II.",
    },
    term1: {
      name: "Terminator",
      description:
        "Transcription is terminated. Downstream blocks will not be transcribed.",
    },
  },
  block: {
    promConst1: {
      displayName: "Constitutive",
      description: "Always expresses the downstream gene at a certain rate.",
    },
    promRepressor: {
      displayName: "<repressor,> repressed",
      description:
        "Represses transcription of the downstream gene when an activated repressor binds.",
    },
    promActivator: {
      displayName: "<activator,> activated",
      description:
        "Promotes transcription of the downstream gene when an enabled activator binds.",
    },
    visiFluorescence: {
      displayName: "<protein,Fluorescence Protein> gene",
      description: "Protein which emits fluorescence.",
    },
    ctrlRepressor: {
      displayName: "<repressor,Repressor> gene",
      description:
        "Inhibits transcription of the downstream gene of specific promoters.",
    },
    ctrlActivator: {
      displayName: "<activator,Activator> gene",
      description:
        "Induces transcription of the downstream gene of specific promoters.",
    },
    term1: {
      displayName: "Terminator",
      description:
        "Transcription is terminated. Downstream blocks will not be transcribed.",
    },
    metaRecomb: {
      displayName: "<recombinase,Recombinase> gene",
      description:
        "Cuts out the sequence sandwiched between recognition sequences.",
    },
    seqRecogRecomb: {
      displayName: "Recognition Sequence <recombinase,>",
      description: "Sequence recognized by recombinase.",
    },
    metaKill: {
      displayName: "Kill Switch",
      description: "Kills target organism.",
    },
  },
  tutorial: {
    tutorial: "Tutorial",
    "1": `Genochemy is a software that allows users to experience genetic circuit design and synthetic biology by programming an original microorganism, Genomy.
It has the same level of differential equation simulation as modeling in genetic circuit design, while employing an intuitive UI for visual programming.`,
    "2": `The Genochemy application has four domains.
The nucleotide sequence tray (lower left), the program (upper left), the Genochemy Lab (upper right), and the Info tabs and Run button (lower right).`,
    "3": `The nucleotide sequence tray has sequence blocks, each representing a sequence with a specific role: promoter, protein coding region, terminator, etc.
Promoter blocks are blue with arrow-shaped appendages.
Protein coding regions are shown by elongated rectangles.
Terminators are red and have T-shaped appendages.`,
    "4": `In the program domain, you can combine sequence blocks to create genetic circuits.`,
    "5": `In the Genochemy Lab, environment parameters can be controlled before and during the simulation. The fluorescence intensity of Genomy can also be observed here.`,
    "6": `The Information tab consists of five tabs: Tutorial, Protein, RNA, Questions, and Load.
The Tutorial tab allows users to take tutorials on Genochemy.
The Protein and RNA tabs display information on proteins and mRNAs produced in Genomy. You can also view graphs showing changes in fluorescent protein production over time. 
The Questions tab provides several genetic circuit quizzes.
From the Load tab, you can load sequences that mimic iGEM projects. Currently, you can load the project "Optopass" from iGEM UTokyo 2022.`,
    "7": `Let's check out the flow of Genochemy operations.
The figure above shows the basic flow.`,
    "8": `First, drag and drop the block from the tray to the program domain.
You can combine two blocks by bringing the one you are moving closer to the one already in the program domain.
If you want to detach a particular block from the others in the program, double-click on it.
Blocks that are no longer needed can be dragged and dropped back into the tray.`,
    "9": `By joining the blocks together, you can build a genetic circuit any way you like!
A standard gene consists of a promoter, protein coding region, and terminator in this order. As a test, let's connect "Constitutive promoter", "GFP" and "Terminator" in this order.
After completing the circuit construction, click the "Run" button. The simulation will start.`,
    "10": `In the Lab domain, you can adjust three parameters: the amount of drug A and the presence or absence of red and blue light irradiation, respectively.
The circuit created on the previous page does not depend on drug A or the light, so the parameters will not make any difference in this case, but this is a factor that becomes important when the circuit becomes more complex.`,
    "11": `After pressing the Run button and adjusting the environment, the next step is to observe and evaluate the results of the experiment.
The Genomy in the Lab roughly shows you the amount and type of fluorescent protein expression.
As mentioned before, the Protein and RNA tabs provide information about the substances being produced and the expression amount of the fluorescent proteins.`,
    "12": `Now, let's practice designing a genetic circuit by working through the questions on the Questions tab!
The questions are presented with simple illustrations.
For some of the questions, you can view a model answer by clicking the 'Show Answer' button. You can also try to make alternative solutions.`,
  },
  tabs: {
    tutorial: "Tutorial",
    protein: "Protein",
    rna: "RNA",
    questions: "Questions",
    load: "Load",
  },
  runner: {
    drugA: "Drug A",
    redLight: "Red light",
    blueLight: "Blue light",
  },
  view: {
    show: "Show",
    hide: "Hide",
    run: "Run",
    stop: "Stop",
  },
  questions: {
    question: "Questions",
    showAnswer: "Show Answer",
    image: "Image",
    "1": "Green Creature",
    "2": "Blue makes green",
    "3": "Killer Light",
    "4": "Drug Addict",
    "5": "NAND Gate",
    "6": "Short Temper",
    "7": "Blue makes infinitely green",
    "8": "Green to Red",
    "9": "Optopass Mini",
  },
  load: {
    loadUTokyo2022Project: "Load the UTokyo 2022 project",
  },
  twitterShare: "I made a genetic circuit on Genochemy!",
  vDNA: {
    title: "Show vDNA",
    description:
      "It shows how a block is transformed into a DNA sequence (vDNA, Virtual DNA) consisting of A(a), T(t), G(g), and C(c). The DNA sequence is for Genomy, but the motif is the gene sequence of a real organism.",
    whatThisMeans: "Learn the meaning of the sequence",
    howUsed: "How the sequence is used",
    whatThisMeansDescription:
      "The sequences in each block are not random, but are inspired by the sequences of real organisms; use tools such as BLAST to decipher the meaning of the sequences.",
    howUsedDescription:
      "In actual synthetic biology, the DNA sequence like this can be ordered from a company, which will synthesize the entire sequence as an actual DNA molecule. The DNA molecules received can be put into the organism to make the genetic circuit work in the organism.",
  },
};

export default en;
