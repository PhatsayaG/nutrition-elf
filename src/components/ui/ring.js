// src/components/ui/ring.js
/**
 * 這是為了確保你的介面在按鈕點擊或輸入時，
 * 能正確顯示跟 Base44 一樣美觀的環狀光暈樣式。
 */
export default function addRingStyles({ addUtilities }) {
  addUtilities({
    '.ring-offset-background': {
      '--tw-ring-offset-width': '2px',
      '--tw-ring-offset-color': 'hsl(var(--background))',
    },
  })
}