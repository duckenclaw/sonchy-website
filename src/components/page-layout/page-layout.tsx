import type { ReactNode } from 'react';

import Header from '@/components/header/header';
import type { HeaderVariant } from '@/components/header/header';
import { useBodyClass } from '@/hooks/use-body-class';

interface AppShellProps {
  /** Title shown in the header plaque. */
  title: string;
  /** Which plaque artwork the header uses. Defaults to the pink main plaque. */
  headerVariant?: HeaderVariant;
  /** Class added to <body> while the page is mounted (background artwork). */
  bodyClass?: string;
  /**
   * Pages that print their own title on small screens hide the header there
   * instead of stacking two titles.
   */
  headerDesktopOnly?: boolean;
  children: ReactNode;
}

/** Scroll container plus header — everything a routed page has in common. */
export function AppShell({
  title,
  headerVariant,
  bodyClass,
  headerDesktopOnly = false,
  children,
}: AppShellProps) {
  useBodyClass(bodyClass);

  const header = <Header title={title} variant={headerVariant} />;

  return (
    <div className="app">
      {headerDesktopOnly ? <div className="header-desktop-only">{header}</div> : header}
      {children}
    </div>
  );
}

interface PageLayoutProps extends AppShellProps {
  /** Name of the page; drives the `.page-<name>` style hook. */
  name: string;
}

/**
 * AppShell plus the centered content column that most pages use.
 * See styles/layout.css for the `.page` / `.page-inner` contract.
 */
function PageLayout({ name, children, ...shell }: PageLayoutProps) {
  return (
    <AppShell {...shell}>
      <div className={`page page-${name}`}>
        <div className="page-inner">{children}</div>
      </div>
    </AppShell>
  );
}

export default PageLayout;
