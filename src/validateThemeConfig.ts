import type { ThemeConfigValidationContext } from '@docusaurus/types';
import type { DocFindThemeConfig } from './index';

export function validateThemeConfig({
  themeConfig,
}: ThemeConfigValidationContext<DocFindThemeConfig>): DocFindThemeConfig {
  const docfind = themeConfig.docfind;
  if (docfind !== undefined && typeof docfind !== 'object') {
    throw new Error(
      '[docfind] themeConfig.docfind must be an object if provided.',
    );
  }
  // Pass-through; validation is intentionally lightweight.
  return themeConfig;
}
