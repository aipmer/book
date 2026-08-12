import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * 使用 useSyncExternalStore 检测客户端 hydration，避免在 effect 中同步 setState
 * （React Compiler lint: set-state-in-effect）。
 */
const emptySubscribe = () => () => {};

export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true, // 客户端快照：已 hydration
    () => false // 服务端快照：静态渲染
  );

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
