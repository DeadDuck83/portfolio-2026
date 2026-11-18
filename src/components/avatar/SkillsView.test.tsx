import { describe, it, expect, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkillsView from './SkillsView';
import { SKILL_GROUPS } from './skills';

describe('SkillsView', () => {
  it('shows every skill as a dialog, focuses Close, and closes on Escape', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onClose = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SkillsView onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: "Derek's skills" });
    for (const g of SKILL_GROUPS) for (const it of g.items) expect(dialog).toHaveTextContent(it.label);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.keyboard('{Escape}');
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
