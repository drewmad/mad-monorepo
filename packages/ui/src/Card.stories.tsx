import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardTitle } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card
};
export default meta;

export const Default: StoryObj<typeof Card> = {
  render: () => (
    <Card>
      <CardContent>
        <CardTitle>Card title</CardTitle>
        Body content
      </CardContent>
    </Card>
  )
};
