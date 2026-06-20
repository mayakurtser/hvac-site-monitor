import '@testing-library/jest-dom';

// Highcharts probes `CSS.supports()` when its module is first evaluated, and
// jsdom doesn't implement it. Importing anything from the components barrel
// pulls in Highcharts (via TempTrend), so polyfill it for every test.
type CssLike = { supports: (property: string, value?: string) => boolean };
const globalWithCss = globalThis as unknown as { CSS?: CssLike };
if (!globalWithCss.CSS) {
  globalWithCss.CSS = { supports: () => false };
} else if (typeof globalWithCss.CSS.supports !== 'function') {
  globalWithCss.CSS.supports = () => false;
}
