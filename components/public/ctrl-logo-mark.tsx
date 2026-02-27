type CtrlLogoMarkTone = 'blue' | 'light';
type CtrlLogoMarkSize = 'sm' | 'md' | 'lg';

type CtrlLogoMarkProps = {
  readonly tone?: CtrlLogoMarkTone;
  readonly size?: CtrlLogoMarkSize;
  readonly className?: string;
};

function getToneClassName(tone: CtrlLogoMarkTone): string {
  return tone === 'light' ? 'ctrl-logo-mark--light' : 'ctrl-logo-mark--blue';
}

function getSizeClassName(size: CtrlLogoMarkSize): string {
  switch (size) {
    case 'sm':
      return 'ctrl-logo-mark--sm';
    case 'lg':
      return 'ctrl-logo-mark--lg';
    default:
      return 'ctrl-logo-mark--md';
  }
}

export function CtrlLogoMark({ tone = 'blue', size = 'md', className }: CtrlLogoMarkProps) {
  const toneClassName = getToneClassName(tone);
  const sizeClassName = getSizeClassName(size);
  const composedClassName = className
    ? `ctrl-logo-mark ${toneClassName} ${sizeClassName} ${className}`
    : `ctrl-logo-mark ${toneClassName} ${sizeClassName}`;

  return <span className={composedClassName}>CTRL+</span>;
}
