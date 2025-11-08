// Created by Kien AI (leejungkiin@gmail.com)
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'heroui-native';

const MAX_TOASTS = 4;
const DEFAULT_DURATION = 4200;

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type ToastPlacement = 'top' | 'bottom';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  id?: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
  icon?: React.ReactNode;
  canClose?: boolean;
}

interface ToastEntry extends Required<Omit<ToastOptions, 'id'>> {
  id: string;
  createdAt: number;
}

interface ToastContextValue {
  showToast: (toast: ToastOptions) => string;
  dismissToast: (toastId: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  placement?: ToastPlacement;
  offset?: number;
}

export function ToastProvider({ children, placement = 'top', offset = 16 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    ({ id, title, message, variant = 'default', duration = DEFAULT_DURATION, action, icon, canClose = true }: ToastOptions) => {
      const toastId = id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const entry: ToastEntry = {
        id: toastId,
        title,
        message,
        variant,
        duration,
        action,
        icon,
        canClose,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        const next = [...prev.filter((item) => item.id !== toastId), entry];
        if (next.length > MAX_TOASTS) {
          if (placement === 'top') {
            next.shift();
          } else {
            next.splice(0, next.length - MAX_TOASTS);
          }
        }
        return next;
      });

      return toastId;
    },
    [placement],
  );

  const contextValue = useMemo<ToastContextValue>(
    () => ({ showToast, dismissToast, dismissAll }),
    [dismissAll, dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} placement={placement} offset={offset} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastViewportProps {
  toasts: ToastEntry[];
  placement: ToastPlacement;
  offset: number;
  onDismiss: (id: string) => void;
}

function ToastViewport({ toasts, placement, offset, onDismiss }: ToastViewportProps) {
  const stack = placement === 'bottom' ? toasts : [...toasts].reverse();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.viewport,
        placement === 'top' ? { top: offset } : { bottom: offset },
      ]}
    >
      <View style={[styles.toastStack, placement === 'bottom' ? { flexDirection: 'column-reverse' } : null]}>
        {stack.map((toast) => (
          <ToastCard key={toast.id} toast={toast} placement={placement} onDismiss={onDismiss} />
        ))}
      </View>
    </View>
  );
}

interface ToastCardProps {
  toast: ToastEntry;
  placement: ToastPlacement;
  onDismiss: (id: string) => void;
}

function ToastCard({ toast, placement, onDismiss }: ToastCardProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const { id, title, message, variant, duration, action, icon, canClose } = toast;

  const translate = useRef(new Animated.Value(placement === 'top' ? -50 : 50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const palette = useMemo(() => getVariantPalette(variant, colors, isDark), [variant, colors, isDark]);

  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translate, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    if (duration > 0) {
      timeoutRef.current = setTimeout(() => handleDismiss('timeout'), duration);
    }

    return () => {
      clearTimeoutRef();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = useCallback(
    (reason: 'timeout' | 'manual') => {
      clearTimeoutRef();
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: placement === 'top' ? -50 : 50,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          onDismiss(id);
        }
      });
    },
    [id, onDismiss, opacity, placement, translate],
  );

  const handlePressAction = () => {
    action?.onPress();
    handleDismiss('manual');
  };

  const webBlurStyle = Platform.OS === 'web' ? ({ backdropFilter: 'blur(12px)' } as Record<string, unknown>) : null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          transform: [{ translateY: translate }],
          opacity,
        },
        webBlurStyle,
      ]}
    >
      <View style={styles.toastContent}>
        <View style={[styles.iconSlot, { backgroundColor: palette.iconBackground }]}>{icon ?? palette.icon}</View>
        <View style={styles.textBlock}>
          <Text style={[styles.toastTitle, { color: palette.foreground }]}>{title}</Text>
          {message ? <Text style={[styles.toastMessage, { color: palette.description }]}>{message}</Text> : null}
        </View>
      </View>

      <View style={styles.toastActions}>
        {action ? (
          <Pressable onPress={handlePressAction} style={[styles.actionButton, { backgroundColor: palette.foreground }]}>
            <Text style={[styles.actionLabel, { color: palette.onForeground }]}>{action.label}</Text>
          </Pressable>
        ) : null}

        {canClose ? (
          <Pressable accessibilityLabel="Dismiss toast" onPress={() => handleDismiss('manual')} style={styles.closeButton}>
            <Text style={[styles.closeLabel, { color: palette.description }]}>✕</Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

type ThemeColors = {
  accent: string;
  [key: string]: string;
};

function getVariantPalette(variant: ToastVariant, colors: ThemeColors, isDark: boolean) {
  const iconSize = 16;

  const base = {
    default: {
      background: isDark ? 'rgba(30,41,59,0.88)' : 'rgba(255,255,255,0.9)',
      border: isDark ? 'rgba(148,163,184,0.32)' : 'rgba(148,163,184,0.36)',
      foreground: colors.accent ?? '#4f46e5',
      onForeground: '#0f172a',
      description: isDark ? '#cbd5f5' : '#475569',
      iconBackground: isDark ? 'rgba(99,102,241,0.28)' : 'rgba(79,70,229,0.14)',
      icon: <Text style={{ color: colors.accent ?? '#4f46e5', fontSize: iconSize }}>✶</Text>,
    },
    success: {
      background: isDark ? 'rgba(22,163,74,0.2)' : 'rgba(34,197,94,0.12)',
      border: isDark ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.3)',
      foreground: '#16a34a',
      onForeground: '#f8fafc',
      description: isDark ? '#dcfce7' : '#14532d',
      iconBackground: isDark ? 'rgba(34,197,94,0.28)' : 'rgba(34,197,94,0.16)',
      icon: <Text style={{ color: '#16a34a', fontSize: iconSize }}>✔︎</Text>,
    },
    warning: {
      background: isDark ? 'rgba(217,119,6,0.24)' : 'rgba(253,224,71,0.18)',
      border: isDark ? 'rgba(217,119,6,0.4)' : 'rgba(217,119,6,0.34)',
      foreground: '#d97706',
      onForeground: '#0f172a',
      description: isDark ? '#fde68a' : '#78350f',
      iconBackground: isDark ? 'rgba(217,119,6,0.32)' : 'rgba(217,119,6,0.2)',
      icon: <Text style={{ color: '#d97706', fontSize: iconSize }}>!</Text>,
    },
    danger: {
      background: isDark ? 'rgba(220,38,38,0.25)' : 'rgba(248,113,113,0.16)',
      border: isDark ? 'rgba(220,38,38,0.45)' : 'rgba(220,38,38,0.36)',
      foreground: '#dc2626',
      onForeground: '#f8fafc',
      description: isDark ? '#fecaca' : '#7f1d1d',
      iconBackground: isDark ? 'rgba(220,38,38,0.28)' : 'rgba(220,38,38,0.18)',
      icon: <Text style={{ color: '#dc2626', fontSize: iconSize }}>!</Text>,
    },
    info: {
      background: isDark ? 'rgba(37,99,235,0.25)' : 'rgba(96,165,250,0.18)',
      border: isDark ? 'rgba(37,99,235,0.4)' : 'rgba(37,99,235,0.32)',
      foreground: '#2563eb',
      onForeground: '#f8fafc',
      description: isDark ? '#bfdbfe' : '#1e3a8a',
      iconBackground: isDark ? 'rgba(37,99,235,0.32)' : 'rgba(37,99,235,0.18)',
      icon: <Text style={{ color: '#2563eb', fontSize: iconSize }}>ℹ︎</Text>,
    },
  } as const;

  return base[variant];
}

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  toastStack: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 16,
    gap: 12,
    pointerEvents: 'box-none',
  },
  toast: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  toastContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconSlot: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  toastTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  toastMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  toastActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  closeButton: {
    padding: 6,
    borderRadius: 999,
  },
  closeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});


