export const TEMPLATE_STYLES = ['minimal', 'sport', 'luxury'] as const;

export type TemplateStyle = (typeof TEMPLATE_STYLES)[number];

export interface TemplatePreviewInput {
  readonly templateStyle: TemplateStyle;
  readonly wrapName: string;
  readonly primaryColor: string;
  readonly accentColor: string;
  readonly vehicleName: string;
}

export interface TemplatePreviewResult {
  readonly html: string;
  readonly svgDataUrl: string;
}

const TEMPLATE_CLASS_MAP: Readonly<Record<TemplateStyle, string>> = {
  minimal: 'template-minimal',
  sport: 'template-sport',
  luxury: 'template-luxury'
};

function toEscapedText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .trim();
}

function createPreviewSvg(input: TemplatePreviewInput): string {
  const wrapName = toEscapedText(input.wrapName);
  const vehicleName = toEscapedText(input.vehicleName);

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" role="img" aria-label="${wrapName} preview">
  <defs>
    <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="${input.primaryColor}" />
      <stop offset="100%" stop-color="${input.accentColor}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#bg)" />
  <rect x="80" y="150" width="800" height="240" rx="26" fill="rgba(0,0,0,0.25)" />
  <text x="120" y="260" fill="white" font-size="56" font-weight="700" font-family="Arial">${wrapName}</text>
  <text x="120" y="320" fill="white" font-size="30" font-family="Arial">${vehicleName}</text>
</svg>
`.trim();
}

function toDataUrl(svgMarkup: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`;
}

export function createTemplatePreview(input: TemplatePreviewInput): TemplatePreviewResult {
  const templateClass = TEMPLATE_CLASS_MAP[input.templateStyle];
  const escapedWrapName = toEscapedText(input.wrapName);
  const escapedVehicleName = toEscapedText(input.vehicleName);
  const svgMarkup = createPreviewSvg(input);

  return {
    html: [
      `<section class="template-preview ${templateClass}">`,
      `<header><h1>${escapedWrapName}</h1><p>${escapedVehicleName}</p></header>`,
      `<img alt="${escapedWrapName} preview" src="${toDataUrl(svgMarkup)}" />`,
      '</section>'
    ].join(''),
    svgDataUrl: toDataUrl(svgMarkup)
  };
}

