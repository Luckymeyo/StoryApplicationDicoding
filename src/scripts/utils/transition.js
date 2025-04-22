export function transitionHelper({ skipTransition = false, updateDOM }) {
  if (skipTransition || !document.startViewTransition) {
    const done = Promise.resolve(updateDOM());
    return { ready: Promise.reject('unsupported'), updateCallbackDone: done, finished: done };
  }
  return document.startViewTransition(updateDOM);
}
