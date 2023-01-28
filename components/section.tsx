import type { ComponentChildren } from 'preact';

type Props = {
  children: ComponentChildren;
}

export default function Section({ children }: Props) {
  return (
    <section class="page-section">
      {children}
    </section>
  )
}
