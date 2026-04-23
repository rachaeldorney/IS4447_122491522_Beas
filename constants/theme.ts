import { Platform } from 'react-native';

const tintColorLight = '#EC4899';
const tintColorDark = '#F9A8D4';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFF0F7',
    tint: tintColorLight,
    icon: '#831843',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
  text: '#F9A8D4',
  background: '#1A0A10',
  tint: '#F9A8D4',
  icon: '#F9A8D4',
  tabIconDefault: '#9BA1A6',
  tabIconSelected: '#F9A8D4',
},
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
