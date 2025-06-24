import { render, screen, fireEvent } from '@testing-library/react';
import { SectionMenu } from '../../apps/web/components/messages/SectionMenu';
import '@testing-library/jest-dom';

describe('SectionMenu', () => {
  it('shows menu on hover', async () => {
    render(
      <SectionMenu onCreate={() => {}} onManage={() => {}} />
    );

    const button = screen.getByRole('button', { name: /section actions/i });
    expect(screen.queryByText(/create channel/i)).not.toBeInTheDocument();
    fireEvent.mouseEnter(button);
    expect(await screen.findByText(/create channel/i)).toBeInTheDocument();
    fireEvent.mouseLeave(button);
    expect(screen.queryByText(/create channel/i)).not.toBeInTheDocument();
  });

  it('shows menu on focus', async () => {
    render(
      <SectionMenu onCreate={() => {}} onManage={() => {}} />
    );

    const button = screen.getByRole('button', { name: /section actions/i });
    expect(screen.queryByText(/manage channels/i)).not.toBeInTheDocument();
    fireEvent.focus(button);
    expect(await screen.findByText(/manage channels/i)).toBeInTheDocument();
  });
});
