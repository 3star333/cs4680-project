declare module 'zustand' {
  // minimal shim for dev environment when types aren't installed
  type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void
  type GetState<T> = () => T
  export default function create<T>(fn: (set: SetState<T>, get: GetState<T>) => T): any
}

declare module 'zustand/middleware' {
  export function persist<TState>(fn: any, opts?: any): any
}
