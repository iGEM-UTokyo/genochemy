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
import Runner, { factoryEmptyFunction } from "./utils/runner";

function setUUID(block: Block, uuid: string): asserts block is BlockWithUUID {
  block.uuid = uuid;
}
export type Snakes = Record<string, Snake>;
export const useStore = defineStore("main", () => {
  const snakes: Snakes = reactive({});
  const newSnake = ref<Snake | null>(null);
  const grabbing = ref(false);
  const addTempBlock = (block: Block, anchorTail: Vector2) => {
    setUUID(block, uuidv4());
    const snakeUUID = uuidv4();
    newSnake.value = new Snake({
      uuid: snakeUUID,
      blocks: [block],
      anchorTail,
      fromTray: true,
    });
  };
  const clearTempBlock = () => {
    newSnake.value = null;
  };
  const addSnake = (snake: Snake) => {
    snakes[snake.uuid] = snake;
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
  const splitHead = (snakeUUID: string, blockUUID: string, shift = false) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const newSnake = snakes[snakeUUID].splitHead(blockUUID);
    if (newSnake) {
      if (shift) {
        newSnake.anchorTail[0] += 5;
      }
      snakes[newSnake.uuid] = newSnake;
    }
  };
  const splitTail = (snakeUUID: string, blockUUID: string, shift = false) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const newSnake = snakes[snakeUUID].splitTail(blockUUID);
    if (newSnake) {
      if (shift) {
        newSnake.anchorTail[0] -= 5;
      }
      snakes[newSnake.uuid] = newSnake;
    }
  };
  const deleteSnake = (snakeUUID: string) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    delete snakes[snakeUUID];
  };
  const wrapSnake = (snakeUUID: string, border: { before: string }) => {
    if (!snakes[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const head = snakes[snakeUUID].wrap(border);
    if (!head) return;
    snakes[head.uuid] = head;
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
  const registeredOutputs: string[] = [];
  const registerOutput = (variable: string) => {
    // Duplicate outputs are allowed (for the use of unregisteration when unmounted)
    registeredOutputs.push(variable);
  };
  const UnregisterOutput = (variable: string) => {
    const index = registeredOutputs.indexOf(variable);
    if (index !== -1) {
      registeredOutputs.splice(index, 1);
    }
  };
  const registeredInputs: string[] = [];
  const registerInput = (variable: string) => {
    // Duplicate inputs are allowed (for the use of unregisteration when unmounted)
    registeredInputs.push(variable);
  };
  const UnregisterInput = (variable: string) => {
    const index = registeredInputs.indexOf(variable);
    if (index !== -1) {
      registeredInputs.splice(index, 1);
    }
  };
  let animationFrame: null | number = null;
  const isRunning = ref(false);
  const run = () => {
    if (isRunning.value) {
      stop();
    }
    const equations = [
      ...operonMessengerRNAs.value.map((mRNA) => mRNA.buildDE()).flat(),
      ...proteins.value.map((protein) => protein.buildDE()).flat(),
    ];
    console.log(equations);
    const runner = new Runner(equations, 0.1);
    for (const output of registeredOutputs) {
      runnerOutputs.value[output] = runner.variables[output] || 0;
      runnerOutputDefaults[output] = runner.variables[output] || 0;
    }
    for (const input of registeredInputs) {
      if (typeof runnerInputs.value[input] !== "undefined") {
        runner.variables[input] = runnerInputs.value[input];
        if (!runner.equations[input]) {
          runner.equations[input] = factoryEmptyFunction();
        }
      } else {
        if (typeof runner.variables[input] === "undefined") {
          runner.variables[input] = 0;
          if (!runner.equations[input]) {
            runner.equations[input] = factoryEmptyFunction();
          }
        }
        runnerInputs.value[input] = runner.variables[input];
      }
    }
    const tick = () => {
      for (const input of registeredInputs) {
        runner.variables[input] = runnerInputs.value[input];
      }
      runner.next();
      for (const output of registeredOutputs) {
        runnerOutputs.value[output] = runner.variables[output] || 0;
      }
      animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);
    isRunning.value = true;
  };
  const stop = () => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;

      for (const output of registeredOutputs) {
        runnerOutputs.value[output] = runnerOutputDefaults[output];
      }
    }
    isRunning.value = false;
  };
  const runnerOutputs: Ref<Record<string, number>> = ref({});
  const runnerOutputDefaults: Record<string, number> = {};
  const runnerInputs: Ref<Record<string, number>> = ref({});
  const updateRunnerInput = (input: string, value: number) => {
    runnerInputs.value[input] = value;
  };
  return {
    snakes: readonly(snakes),
    newSnake,
    addTempBlock,
    clearTempBlock,
    addSnake,
    updateSnake,
    mergeToTail,
    mergeToHead,
    splitHead,
    splitTail,
    deleteSnake,
    wrapSnake,
    operonMessengerRNAs,
    proteins,
    registerOutput,
    UnregisterOutput,
    registerInput,
    UnregisterInput,
    run,
    stop,
    isRunning,
    runnerOutputs,
    runnerInputs: readonly(runnerInputs),
    updateRunnerInput,
  };
});
