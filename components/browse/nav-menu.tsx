import { useMemo } from "preact/hooks";
import type { ComponentChildren } from "preact";

import type { BrowseFilter } from "../../constants/browse.ts";

function buildNavLink(origin: string, path: BrowseFilter): string {
  return `${origin}/browse/${path}`;
}

export default function ({
  url,
}: {
  url: URL;
}) {
  const allLink = useMemo(() => buildNavLink(url.origin, "all"), [url]);
  const numberLink = useMemo(() => buildNavLink(url.origin, "numbers"), [url]);
  const aToELink = useMemo(() => buildNavLink(url.origin, "a_e"), [url]);
  const fToJLink = useMemo(() => buildNavLink(url.origin, "f_j"), [url]);
  const kToOLink = useMemo(() => buildNavLink(url.origin, "k_o"), [url]);
  const pToTLink = useMemo(() => buildNavLink(url.origin, "p_t"), [url]);
  const uToZLink = useMemo(() => buildNavLink(url.origin, "u_z"), [url]);

  const orderedLinks = useMemo(() => {
    return new Map([
      ["all", allLink],
      ["0-9", numberLink],
      ["a-e", aToELink],
      ["f-j", fToJLink],
      ["k-o", kToOLink],
      ["p-t", pToTLink],
      ["u-z", uToZLink],
    ]);
  }, [
    allLink,
    numberLink,
    aToELink,
    fToJLink,
    kToOLink,
    pToTLink,
    uToZLink,
  ]);

  return (
    <nav class="browse-nav-menu">
      <ul class="browse-nav-menu__list">
        {Array.from(orderedLinks.entries()).map(([name, link]) => (
          <li class="browse-nav-menu__list__item" key={link}>
            <NavLink url={link} isActive={url.href === link}>{name}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavLink({
  url,
  isActive,
  children,
}: {
  url: string;
  isActive: boolean;
  children: ComponentChildren;
}) {
  return (
    <a href={url}>
      {isActive ? <strong>{children}</strong> : children}
    </a>
  );
}
