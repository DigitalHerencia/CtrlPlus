import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('design token and tailwind v4 contract', () => {
  const projectRoot = resolve(__dirname, '../..');
  const globalsCss = readFileSync(resolve(projectRoot, 'app/globals.css'), 'utf8');
  const tokens = JSON.parse(
    readFileSync(resolve(projectRoot, '.codex/docs/61-design-tokens.json'), 'utf8')
  ) as {
    tailwindV4: {
      sources: string[];
      themeTokens: Record<string, string>;
    };
  };

  it('keeps Tailwind v4 CSS-first directives in app/globals.css', () => {
    expect(globalsCss).toContain('@import "tailwindcss";');

    for (const source of tokens.tailwindV4.sources) {
      expect(globalsCss).toContain(`@source "${source}";`);
    }
  });

  it('declares all required design tokens inside @theme', () => {
    for (const cssVariableName of Object.values(tokens.tailwindV4.themeTokens)) {
      expect(globalsCss).toContain(`${cssVariableName}:`);
    }
  });

  it('keeps global shell styling aligned with flat-color visual constraints', () => {
    expect(globalsCss).not.toContain('linear-gradient');
    expect(globalsCss).not.toContain('radial-gradient');
    expect(globalsCss).not.toContain('box-shadow');
    expect(globalsCss).not.toContain("'Georgia'");
    expect(globalsCss).not.toContain('Times New Roman');
  });
});


