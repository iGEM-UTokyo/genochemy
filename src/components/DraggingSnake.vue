<template>
  <div class="snake" :style="style">
    <svg
      :width="props.modelValue.width"
      :height="props.modelValue.height + props.modelValue.bottomAnchor"
    >
      <g :transform="`translate(0, ${props.modelValue.height})`">
        <Block
          v-for="[x, block] in blockWithPosition"
          :key="block.uuid"
          :block="block"
          :x="x"
          :y="0"
        />
      </g>
    </svg>
    <teleport to=".program-inner-back">
      <BindGuide
        v-if="currentBindInfo !== null"
        :positions="currentBindInfo.bindGuide"
      />
      <WrapConnector v-if="tailWrapInfo !== null" :positions="tailWrapInfo" />
      <WrapConnector v-if="tailHeadInfo !== null" :positions="tailHeadInfo" />
    </teleport>
    <teleport to=".tray">
      <transition name="delete-zone-transition" :appear="true">
        <div
          :class="{ 'delete-zone': true, active: isActiveDeleteZone }"
          v-if="showDeleteZone"
        >
          <font-awesome-icon icon="trash" />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { overlap, Snake } from "@/utils/snake";
import { useStore } from "../store";
import Block from "@/components/Block.vue";
import BindGuide from "@/components/BindGuide.vue";
import WrapConnector from "./WrapConnector.vue";
import {
  Ref,
  ref,
  defineProps,
  defineEmits,
  computed,
  StyleValue,
  ComputedRef,
  inject,
} from "vue";
import {
  BlockWithUUID,
  Vector2,
  WrapHeadBlock,
  WrapTailBlock,
} from "@/utils/block";
import { DeepReadonly } from "@/utils/deep-readonly";
import {
  getAbsolutePositionKey,
  getFixedPositionKey,
  willBeDeletedKey,
} from "./Program.vue";

const { addSnake, mergeToHead, mergeToTail, clearDraggingSnake, snakes } =
  useStore();

const props = defineProps<{
  modelValue: DeepReadonly<Snake>;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: DeepReadonly<Snake>): void;
}>();

const blockWithPosition = computed<[number, BlockWithUUID][]>(() => {
  let accumulatedX = 0;
  return props.modelValue.blocks.map((block) => {
    const result: [number, BlockWithUUID] = [accumulatedX, block];
    accumulatedX += block.design.width - overlap;
    return result;
  });
});

const getFixedPosition = inject(getFixedPositionKey);
const getAbsolutePosition = inject(getAbsolutePositionKey);
const willBeDeleted = inject(willBeDeletedKey);

const isActiveDeleteZone = ref(false);
const showDeleteZone = computed(() => !props.modelValue.fromTray);

// non-reactive. updated on mousedown
let tailAnchors: { pos: Readonly<Vector2>; uuid: string }[] = [];
// non-reactive. updated on mousedown
let headAnchors: { pos: Readonly<Vector2>; uuid: string }[] = [];
const down = () => {
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
  window.addEventListener("touchmove", touchmove);
  window.addEventListener("touchend", touchend);
  tailAnchors = [];
  headAnchors = [];
  for (let snake of Object.values(snakes)) {
    if (!snake.isTailCovered) {
      tailAnchors.push({ pos: snake.anchorTail, uuid: snake.uuid });
    }
    if (!snake.isHeadCovered) {
      headAnchors.push({ pos: snake.anchorNext, uuid: snake.uuid });
    }
  }
  if (props.modelValue.isTailCovered) {
    headAnchors = [];
  }
  if (props.modelValue.isHeadCovered) {
    tailAnchors = [];
  }
};

const tailWrapInfo = computed<DeepReadonly<[Vector2, Vector2]> | null>(() => {
  const tail = props.modelValue.blocks[0];
  if (tail instanceof WrapHeadBlock) {
    if (tail.connectTo === props.modelValue.uuid) {
      return [props.modelValue.anchorNext, props.modelValue.anchorTail];
    }
    if (snakes[tail.connectTo]?.visible) {
      return [snakes[tail.connectTo].anchorNext, props.modelValue.anchorTail];
    }
  }
  return null;
});

const tailHeadInfo = computed<DeepReadonly<[Vector2, Vector2]> | null>(() => {
  const head = props.modelValue.blocks[props.modelValue.blocks.length - 1];
  if (head instanceof WrapTailBlock) {
    if (snakes[head.connectTo]?.visible) {
      return [props.modelValue.anchorNext, snakes[head.connectTo].anchorTail];
    }
  }
  return null;
});

const anchorTail = computed(() => props.modelValue.anchorTail ?? 0);
const style: ComputedRef<StyleValue> = computed(() => {
  const absolutePosition: Vector2 = [
    anchorTail.value[0],
    anchorTail.value[1] - props.modelValue.height,
  ];
  if (!getFixedPosition) {
    throw new Error("Injected getFixedPosition is undefined.");
  }
  const fixedPosition = getFixedPosition(absolutePosition);
  return {
    position: "fixed",
    top: `${fixedPosition[1]}px`,
    left: `${fixedPosition[0]}px`,
  };
});

const currentBindInfo: Ref<{
  bindGuide: [Readonly<Vector2>, Readonly<Vector2>];
  toUUID: string;
  mode: "head" | "tail";
} | null> = ref(null);
const mousemove = (event: MouseEvent) => {
  move(event.movementX, event.movementY, event.shiftKey);
};
let previousTouch: Touch | null = null;
const touchmove = (event: TouchEvent) => {
  event.preventDefault();
  if (previousTouch) {
    move(
      event.touches[0].clientX - previousTouch.clientX,
      event.touches[0].clientY - previousTouch.clientY,
      event.shiftKey
    );
  }
  previousTouch = event.touches[0];
  return false;
};
const move = (movementX: number, movementY: number, shiftKey = false) => {
  const newSnake = Snake.copy(props.modelValue);
  newSnake.anchorTail[0] += movementX;
  newSnake.anchorTail[1] += movementY;
  emit("update:modelValue", newSnake);
  let hasSet = false;
  const _head = props.modelValue.anchorNext;
  for (let tailAnchor of tailAnchors) {
    if (tailAnchor.uuid === props.modelValue.uuid) continue;
    const distance =
      (tailAnchor.pos[0] - _head[0]) ** 2 + (tailAnchor.pos[1] - _head[1]) ** 2;
    if (distance <= 50 ** 2) {
      currentBindInfo.value = {
        bindGuide: [_head, tailAnchor.pos],
        toUUID: tailAnchor.uuid,
        mode: "tail",
      };
      hasSet = true;
    }
  }
  const _tail: DeepReadonly<Vector2> = anchorTail.value;
  for (let headAnchor of headAnchors) {
    if (headAnchor.uuid === props.modelValue.uuid) continue;
    const distance =
      (headAnchor.pos[0] - _tail[0]) ** 2 + (headAnchor.pos[1] - _tail[1]) ** 2;
    if (distance <= 50 ** 2) {
      currentBindInfo.value = {
        bindGuide: [headAnchor.pos, _tail],
        toUUID: headAnchor.uuid,
        mode: "head",
      };
      hasSet = true;
    }
  }
  if (!hasSet) {
    currentBindInfo.value = null;
  }
  if (!willBeDeleted || !getFixedPosition) {
    throw new Error("Injected willBeDeleted or getFixedPosition is undefined.");
  }
  isActiveDeleteZone.value =
    !props.modelValue.fromTray && willBeDeleted(getFixedPosition(_tail));
};
const mouseup = () => {
  up();
};
const touchend = () => {
  up();
};
const up = () => {
  window.removeEventListener("mousemove", mousemove);
  window.removeEventListener("mouseup", mouseup);
  window.removeEventListener("touchmove", touchmove);
  window.removeEventListener("touchend", touchend);
  previousTouch = null;

  if (
    willBeDeleted &&
    getFixedPosition &&
    willBeDeleted(getFixedPosition(props.modelValue.anchorTail))
  ) {
    clearDraggingSnake();
    return;
  }
  if (currentBindInfo.value !== null) {
    if (currentBindInfo.value.mode === "head") {
      mergeToHead(currentBindInfo.value.toUUID);
    } else {
      mergeToTail(currentBindInfo.value.toUUID);
    }
    currentBindInfo.value = null;
  } else {
    const newSnake = Snake.copy(props.modelValue);
    newSnake.fromTray = false;
    addSnake(newSnake);
    clearDraggingSnake();
  }
};

if (!getAbsolutePosition) {
  throw new Error("Injected getAbsolutePosition is undefined.");
}
if (props.modelValue.fromTray) {
  const newSnake = Snake.copy(props.modelValue);
  newSnake.anchorTail = getAbsolutePosition(props.modelValue.anchorTail);
  emit("update:modelValue", newSnake);
}
down();
</script>

<style scoped>
.snake {
  position: absolute;
  display: flex;
  align-items: flex-end;
  z-index: 99;
  touch-action: none;
}

.delete-zone {
  transition: all 0.3s;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #aaaaaa55;
  font-size: 30px;
}
.delete-zone.active {
  background-color: #d5000055;
}
.delete-zone-transition-enter-from,
.delete-zone-transition-leave-to {
  opacity: 0;
}
.delete-zone-transition-enter-to,
.delete-zone-transition-leave-from {
  opacity: 1;
}
</style>
