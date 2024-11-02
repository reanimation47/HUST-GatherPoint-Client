declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
/**
 * Lock scrolling of the element.
 *
 * @see https://vueuse.org/useScrollLock
 * @param element
 */
export declare function useScrollLock(
  element: MaybeRefOrGetter<
    HTMLElement | SVGElement | Window | Document | null | undefined
  >,
  initialState?: boolean,
): WritableComputedRef<boolean, boolean>