// true on phones / small touch screens. Used to keep the 3D scenes light on mobile
// (no mouse-hover colour effects, no scroll-triggered 3D travel, lower pixel ratio).
export default function isMobile() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)').matches
}
