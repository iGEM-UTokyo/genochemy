export type DeepReadonly<T extends object> = {
  readonly [K in keyof T]: T[K] extends (Record<string, unknown> | any[])
    ? DeepReadonly<T[K]>
    : T[K]
}
