type PreviewRenderProps = {
  readonly html: string;
};

export function PreviewRender({ html }: PreviewRenderProps) {
  return (
    <section
      aria-label='Visualizer preview'
      className='rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
