import { defineStore } from "pinia";
import { computed, reactive, readonly, Ref, ref } from "vue";
import {
  Block,
  BlockWithUUID,
  CodingBlock,
  PromoterBlock,
  TerminatorBlock,
  Vector2,
  WrapHeadBlock,
  WrapTailBlock,
} from "./utils/block";
import { Snake } from "./utils/snake";
import { v4 as uuidv4 } from "uuid";
import {
  Actor,
  Degrader,
  MatterEquations,
  OperonMessengerRNA,
  PromoterActor,
  Protein,
} from "./utils/matter";
import Runner, { factoryEmptyFunction } from "./utils/runner";

function setUUID(block: Block, uuid: string): asserts block is BlockWithUUID {
  block.uuid = uuid;
}
export type Snakes = Record<string, Snake>;
export const useStore = defineStore("main", () => {
  const snakes = ref<Snakes>({});
  const beforePlaySnakes = ref<Snakes>({});
  const currentRunner = ref<Runner | null>(null);
  const draggingSnake = ref<Snake | null>(null);
  const addTempBlock = (block: Block, anchorTail: Vector2) => {
    setUUID(block, uuidv4());
    const snakeUUID = uuidv4();
    draggingSnake.value = new Snake({
      uuid: snakeUUID,
      blocks: [block],
      anchorTail,
      fromTray: true,
      grabbingBlockUUID: block.uuid,
    });
  };
  const clearDraggingSnake = () => {
    draggingSnake.value = null;
  };
  const addSnake = (snake: Snake) => {
    snakes.value[snake.uuid] = snake;
  };
  const updateSnake = (snake: Snake) => {
    if (!snakes.value[snake.uuid]) {
      console.error(`snake uuid is invalid: ${snake.uuid}`);
      return;
    }
    snakes.value[snake.uuid] = snake;
  };
  const mergeToTail = (toUUID: string) => {
    if (!draggingSnake.value) {
      console.error("draggingSnake is null");
      return;
    }
    if (!snakes.value[toUUID]) {
      console.error(`snake uuid is invalid: ${toUUID}`);
      return;
    }
    if (draggingSnake.value.isTailCovered) {
      for (const snake of Object.values(snakes.value)) {
        const head = snake.blocks[snake.blocks.length - 1];
        if (
          head instanceof WrapTailBlock &&
          head.connectTo === draggingSnake.value.uuid
        ) {
          head.connectTo = toUUID;
        }
      }
    }
    snakes.value[toUUID].appendToTail(draggingSnake.value);
    delete snakes.value[draggingSnake.value.uuid];
    draggingSnake.value = null;
  };
  const mergeToHead = (toUUID: string) => {
    if (!draggingSnake.value) {
      console.error("draggingSnake is null");
      return;
    }
    if (!snakes.value[toUUID]) {
      console.error(`snake uuid is invalid: ${toUUID}`);
      return;
    }
    if (draggingSnake.value.isHeadCovered) {
      for (const snake of Object.values(snakes.value)) {
        const tail = snake.blocks[0];
        if (
          tail instanceof WrapHeadBlock &&
          tail.connectTo === draggingSnake.value.uuid
        ) {
          tail.connectTo = toUUID;
        }
      }
    }
    snakes.value[toUUID].appendToHead(draggingSnake.value);
    delete snakes.value[draggingSnake.value.uuid];
    draggingSnake.value = null;
  };
  const splitHead = (snakeUUID: string, blockUUID: string, shift = false) => {
    if (!snakes.value[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const newSnake = snakes.value[snakeUUID].splitHead(blockUUID);
    if (newSnake) {
      if (newSnake.isHeadCovered) {
        for (const snake of Object.values(snakes.value)) {
          const tail = snake.blocks[0];
          if (tail instanceof WrapHeadBlock && tail.connectTo === snakeUUID) {
            tail.connectTo = newSnake.uuid;
          }
        }
      }
      if (shift) {
        newSnake.anchorTail[0] += 5;
      }
      snakes.value[newSnake.uuid] = newSnake;
    }
  };
  const splitTail = (snakeUUID: string, blockUUID: string, shift = false) => {
    if (!snakes.value[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const newSnake = snakes.value[snakeUUID].splitTail(blockUUID);
    if (newSnake) {
      if (newSnake.isTailCovered) {
        for (const snake of Object.values(snakes.value)) {
          const head = snake.blocks[snake.blocks.length - 1];
          if (head instanceof WrapTailBlock && head.connectTo === snakeUUID) {
            head.connectTo = newSnake.uuid;
          }
        }
      }
      if (shift) {
        newSnake.anchorTail[0] -= 5;
      }
      snakes.value[newSnake.uuid] = newSnake;
    }
  };
  const deleteSnake = (snakeUUID: string) => {
    if (!snakes.value[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    delete snakes.value[snakeUUID];
  };
  const wrapSnake = (snakeUUID: string, border: { before: string }) => {
    if (!snakes.value[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const head = snakes.value[snakeUUID].wrap(border);
    if (!head) return;
    snakes.value[head.uuid] = head;
  };
  const cutSnake = (snakeUUID: string, cutFrom: number, cutTo: number) => {
    if (!snakes.value[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    const currentSnake = snakes.value[snakeUUID];
    const anchorTail: Vector2 = [
      currentSnake.getBlockBoundary(currentSnake.blocks[cutFrom].uuid)?.tailX ??
        0,
      currentSnake.anchorTail[1] + 100,
    ];
    const cutBlocks = snakes.value[snakeUUID].blocks.splice(
      cutFrom,
      cutTo - cutFrom
    );
    const newSnakeUUID = uuidv4();
    const tail = new WrapHeadBlock(newSnakeUUID);
    const head = new WrapTailBlock(newSnakeUUID);
    snakes.value[newSnakeUUID] = new Snake({
      uuid: newSnakeUUID,
      blocks: [tail, ...cutBlocks, head],
      anchorTail,
    });
  };
  const recombineTwoSnakes = (
    snakeUUID1: string,
    snakeUUID2: string,
    cutIndex1: number,
    cutIndex2: number
  ) => {
    if (!snakes.value[snakeUUID1]) {
      console.error(`snake uuid is invalid: ${snakeUUID1}`);
      return;
    }
    if (!snakes.value[snakeUUID2]) {
      console.error(`snake uuid is invalid: ${snakeUUID2}`);
      return;
    }
    const tail1 = snakes.value[snakeUUID1].blocks.splice(cutIndex1);
    const tail2 = snakes.value[snakeUUID2].blocks.splice(cutIndex2);
    snakes.value[snakeUUID1].blocks.push(...tail2);
    snakes.value[snakeUUID2].blocks.push(...tail1);
  };
  const setGrabbing = (snakeUUID: string, blockUUID: string) => {
    if (!snakes.value[snakeUUID]) {
      console.error(`snake uuid is invalid: ${snakeUUID}`);
      return;
    }
    draggingSnake.value = Snake.copy(snakes.value[snakeUUID]);
    draggingSnake.value.grabbingBlockUUID = blockUUID;
    snakes.value[snakeUUID].visible = false;
  };
  const operonMessengerRNAs = computed(() => {
    const mRNAs: Record<string, OperonMessengerRNA> = {};
    for (const snake of Object.values(snakes.value)) {
      if (snake.isTailCovered) continue;
      let promoterBlock: PromoterBlock | null = null;
      let codingBlocks: CodingBlock[] = [];
      const blocks = [...snake.blocks];
      let currentSnake = snake;
      let headBlock = currentSnake.blocks[currentSnake.blocks.length - 1];
      while (headBlock instanceof WrapTailBlock) {
        currentSnake = snakes.value[headBlock.connectTo];
        blocks.push(...currentSnake.blocks);
        headBlock = currentSnake.blocks[currentSnake.blocks.length - 1];
      }
      for (const block of blocks) {
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
          codingBlocks = [];
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
    beforePlaySnakes.value = {};
    for (const snake of Object.values(snakes.value)) {
      beforePlaySnakes.value[snake.uuid] = Snake.copy(snake);
    }
    const actors: Actor[] = [];
    for (const mRNA of operonMessengerRNAs.value) {
      for (const promoter of mRNA.promoters) {
        actors.push(new PromoterActor(promoter, mRNA));
      }
      actors.push(mRNA);
    }
    actors.push(...proteins.value);
    actors.push(new Degrader());
    const matterEquations: MatterEquations = {};
    for (const actor of actors) {
      actor.buildDE(matterEquations);
    }
    console.log(matterEquations);
    currentRunner.value = new Runner(matterEquations, 0.1);
    for (const output of registeredOutputs) {
      runnerOutputs.value[output] = currentRunner.value.variables[output] || 0;
      runnerOutputDefaults[output] = currentRunner.value.variables[output] || 0;
    }
    for (const input of registeredInputs) {
      if (typeof runnerInputs.value[input] !== "undefined") {
        currentRunner.value.variables[input] = runnerInputs.value[input];
        if (!currentRunner.value.equations[input]) {
          currentRunner.value.equations[input] = factoryEmptyFunction();
        }
      } else {
        if (typeof currentRunner.value.variables[input] === "undefined") {
          currentRunner.value.variables[input] = 0;
          if (!currentRunner.value.equations[input]) {
            currentRunner.value.equations[input] = factoryEmptyFunction();
          }
        }
        runnerInputs.value[input] = currentRunner.value.variables[input];
      }
    }
    const tick = () => {
      if (!currentRunner.value) return;
      for (const input of registeredInputs) {
        currentRunner.value.variables[input] = runnerInputs.value[input];
      }
      currentRunner.value.next();
      for (const output of registeredOutputs) {
        runnerOutputs.value[output] =
          currentRunner.value.variables[output] || 0;
      }
      animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);
    isRunning.value = true;
  };
  const updateRunner = () => {
    if (!currentRunner.value) {
      run();
      return;
    }
    const actors: Actor[] = [];
    for (const mRNA of operonMessengerRNAs.value) {
      for (const promoter of mRNA.promoters) {
        actors.push(new PromoterActor(promoter, mRNA));
      }
      actors.push(mRNA);
    }
    actors.push(...proteins.value);
    actors.push(new Degrader());
    const matterEquations: MatterEquations = {};
    for (const existMatterName of currentRunner.value.matterNames) {
      matterEquations[existMatterName] = [];
    }
    for (const actor of actors) {
      actor.buildDE(matterEquations);
    }
    console.log(matterEquations);
    currentRunner.value.updateEquations(matterEquations);
  };
  const stop = () => {
    snakes.value = {};
    for (const snake of Object.values(beforePlaySnakes.value)) {
      snakes.value[snake.uuid] = snake;
    }
    beforePlaySnakes.value = {};
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
  const kill = () => {
    if (isRunning.value && currentRunner.value) {
      currentRunner.value.kill();
    }
  };
  return {
    snakes: readonly(snakes),
    draggingSnake,
    addTempBlock,
    clearDraggingSnake,
    addSnake,
    updateSnake,
    mergeToTail,
    mergeToHead,
    splitHead,
    splitTail,
    deleteSnake,
    wrapSnake,
    cutSnake,
    recombineTwoSnakes,
    setGrabbing,
    operonMessengerRNAs,
    proteins,
    registerOutput,
    UnregisterOutput,
    registerInput,
    UnregisterInput,
    run,
    updateRunner,
    stop,
    isRunning,
    currentRunner,
    runnerOutputs,
    runnerInputs: readonly(runnerInputs),
    updateRunnerInput,
    kill,
  };
});
