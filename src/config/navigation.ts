export interface NavItem {
  label: string
  href: `#${string}`
  /** Section ids that mark this item as active while in view. */
  sections: string[]
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '#top', sections: ['top'] },
  { label: 'Collection', href: '#collection', sections: ['collection', 'shop', 'campaign'] },
  { label: 'About', href: '#about', sections: ['about'] },
  { label: 'Contact', href: '#contact', sections: ['contact'] },
]

export const sectionIds = navItems.flatMap((item) => item.sections)
