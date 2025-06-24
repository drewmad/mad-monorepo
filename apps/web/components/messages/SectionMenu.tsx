'use client';

import { Dropdown, DropdownItem, IconButton } from '@ui';
import type { FC } from 'react';

interface SectionMenuProps {
  onCreate: () => void;
  onManage: () => void;
  className?: string;
}

export const SectionMenu: FC<SectionMenuProps> = ({ onCreate, onManage, className }) => (
  <Dropdown
    openOnHover
    align="right"
    className={className}
    trigger={
      <IconButton
        variant="ghost"
        size="sm"
        aria-label="Section actions"
        className="focus:outline-none"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </IconButton>
    }
  >
    <DropdownItem onClick={onCreate}>Create channel</DropdownItem>
    <DropdownItem onClick={onManage}>Manage channels</DropdownItem>
  </Dropdown>
);

