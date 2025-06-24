import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarMenuItem } from '../../apps/web/components/sidebar/SidebarMenuItem';
import { Folder } from 'lucide-react';
import '@testing-library/jest-dom';

describe('SidebarMenuItem', () => {
  it('reveals submenu on hover', () => {
    const { container } = render(
      <SidebarMenuItem
        href="/dashboard"
        label="Projects"
        icon={Folder}
        expanded={true}
        subItems={[{ label: 'Sub item', href: '/dashboard/sub' }]}
      />
    );

    expect(screen.queryByText('Sub item')).not.toBeInTheDocument();

    fireEvent.mouseEnter(container.firstChild as HTMLElement);

    expect(screen.getByText('Sub item')).toBeInTheDocument();
  });
});

