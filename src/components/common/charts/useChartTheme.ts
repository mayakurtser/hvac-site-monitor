import { useEffect, useMemo, useState } from 'react';

export interface ChartTheme {
  brand: string;
  brandFillTop: string;
  brandFillBottom: string;
  gridLine: string;
  mutedText: string;
  surface: string;
  text: string;
  blue: string;
  gray: string;
}

// Highcharts paints colors as SVG attributes, where `var(--*)` tokens don't
// resolve — so resolve them to concrete values (the probe also picks up the
// dark-theme overrides).
function resolve(varName: string, alpha = 1): string {
  const probe = document.createElement('span');
  probe.style.color = `var(${varName})`;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color;
  probe.remove();
  if (alpha === 1) return rgb;
  const channels = rgb.match(/\d+(\.\d+)?/g);
  return channels ? `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha})` : rgb;
}

export function useChartTheme(): ChartTheme {
  const [version, setVersion] = useState(0);

  // Re-resolve when the dark-mode toggle flips `data-theme`.
  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return useMemo<ChartTheme>(
    () => ({
      brand: resolve('--brand-600'),
      brandFillTop: resolve('--brand-500', 0.3),
      brandFillBottom: resolve('--brand-500', 0),
      gridLine: resolve('--border-primary'),
      mutedText: resolve('--text-quaternary'),
      surface: resolve('--bg-primary'),
      text: resolve('--text-primary'),
      blue: resolve('--blue-500'),
      gray: resolve('--gray-400'),
    }),
    [version],
  );
}
