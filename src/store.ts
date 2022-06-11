import { defineStore } from "pinia";
import { computed, isReadonly, reactive, readonly, Ref, ref, watch } from "vue";
import {
  Block,
  BlockWithUUID,
  CodingBlock,
  PromoterBlock,
  TerminatorBlock,
  Vector2,
} from "./utils/block";
import { Snake } from "./utils/snake";
import { v4 as uuidv4 } from "uuid";
import { OperonMessengerRNA, Promoter, Protein } from "./utils/matter";
import Runner from "./utils/runner";

function setUUID(block: Block, uuid: string): asserts block is BlockWithUUID {
  block.uuid = uuid;
}
export type Snakes = Record<string, Snake>;
export const useStore = defineStore("main", () => {
  const snakes: Snakes = reactive({});
  const grabbing = ref(false);
  const addBlock = (block: Block, anchorTail: Vector2) => {
    setUUID(block, uuidv4());
    const snakeUUID = uuidv4();
    snakes[snakeUUID] = new Snake({
      uuid: snakeUUID,
      blocks: [block],
      anchorTail,
      fromTray: true,
    });
  };
  const updateSnake = (snake: Snake) => {
    if (!snakes[snake.uuid]) {
      console.error(`snake uuid is invalid: ${snake.uuid}`);
      return;
    }
    snakes[snake.uuid] = snake;
  };
  const mergeToTail = (snakeUUID: string, toUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    if (!snakes[toUUID]) {
      console.error(`snake uuid is invalid: ${toUUID}`);
      return;
    }
    snakes[toUUID].appendToTail(snakes[snakeUUID]);
    delete snakes[snakeUUID];
  };
  const mergeToHead = (snakeUUID: string, toUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    if (!snakes[toUUID]) {
      console.error(`snake uuid is invalid: ${toUUID}`);
      return;
    }
    snakes[toUUID].appendToHead(snakes[snakeUUID]);
    delete snakes[snakeUUID];
  };
  const splitHead = (snakeUUID: string, blockUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const newSnake = snakes[snakeUUID].splitHead(blockUUID);
    if (newSnake) {
      snakes[newSnake.uuid] = newSnake;
    }
  };
  const splitTail = (snakeUUID: string, blockUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const newSnake = snakes[snakeUUID].splitTail(blockUUID);
    if (newSnake) {
      snakes[newSnake.uuid] = newSnake;
    }
  };
  const grabStart = (grabbingBlock: BlockWithUUID) => {
    grabbing.value = true;
  };
  const grabEnd = () => {
    grabbing.value = false;
  };
  const operonMessengerRNAs = computed(() => {
    const mRNAs: Record<string, OperonMessengerRNA> = {};
    for (const snake of Object.values(snakes)) {
      let promoterBlock: PromoterBlock | null = null;
      let codingBlocks: CodingBlock[] = [];
      for (const block of snake.blocks) {
        if (block instanceof PromoterBlock) {
          promoterBlock = block;
          codingBlocks = []; // todo
        } else if (block instanceof TerminatorBlock) {
          if (promoterBlock !== null && codingBlocks.length > 0) {
            const newMessengerRNA = new OperonMessengerRNA(
              [promoterBlock.promoter],
              codingBlocks
            );
            if (!mRNAs[newMessengerRNA.name]) {
              mRNAs[newMessengerRNA.name] = newMessengerRNA;
            } else {
              mRNAs[newMessengerRNA.name].promoters.push(
                promoterBlock.promoter
              );
            }
          }
          promoterBlock = null;
        } else if (block instanceof CodingBlock) {
          codingBlocks.push(block);
        }
      }
    }
    return Object.values(mRNAs);
  });
  const proteins = computed(() => {
    const proteins: Record<string, Protein> = {};
    for (const mRNA of operonMessengerRNAs.value) {
      for (const block of mRNA.codingBlocks) {
        if (!proteins[block.name]) {
          proteins[block.name] = new block.ProteinClass(block.name, [mRNA]);
        } else {
          proteins[block.name].messengerRNAs.push(mRNA);
        }
      }
    }
    return Object.values(proteins);
  });
  let animationFrame: null | number = null;
  const run = () => {
    const equations = [
      ...operonMessengerRNAs.value.map((mRNA) => mRNA.buildDE()).flat(),
      ...proteins.value.map((protein) => protein.buildDE()).flat(),
    ];
    console.log(equations);
    const runner = new Runner(equations, 0.1);
    const tick = () => {
      if (typeof runner.variables["drug"] !== "undefined") {
        runner.variables["drug"] = drug.value;
      }
      runner.next();
      runnerOutputs.lightEmission = runner.variables["protein-mCherry"];
      animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;

      runnerOutputs["lightEmission"] = 0;
      // for (const property of Object.keys(runnerOutputDefaults)) {
      //   runnerOutputs[property] = runnerOutputDefaults[property]
      // }
    }
  };
  const runnerOutputDefaults = {
    lightEmission: 0,
  };
  const runnerOutputs = reactive(runnerOutputDefaults);
  const drug = ref(0);
  const updateDrug = (_drug: number) => {
    drug.value = _drug;
  };
  return {
    snakes: readonly(snakes),
    addBlock,
    updateSnake,
    mergeToTail,
    mergeToHead,
    splitHead,
    splitTail,
    operonMessengerRNAs,
    proteins,
    run,
    stop,
    runnerOutputs,
    updateDrug,
    drug,
  };
});
