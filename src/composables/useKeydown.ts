import { onBeforeUnmount } from 'vue'

interface KeyCombos {
  key: string;
  fn: () => void;
}

const useKeydown = (keyCombos: KeyCombos[]) => {
  const onKeydown = (event: KeyboardEvent) => {
    const kc = keyCombos.find(kc => kc.key === event.key)
    if (kc) {
      kc.fn()
    }
  }

  window.addEventListener('keydown', onKeydown)
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
  })
}

export default useKeydown
