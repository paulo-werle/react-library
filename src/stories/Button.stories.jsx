import React from 'react';
import { Button } from '../components';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {}
};

const ComponentTemplate = (args) => <Button {...args} />;
export const Component = ComponentTemplate.bind({});
Component.args = {};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// More on args: https://storybook.js.org/docs/react/writing-stories/args
// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
