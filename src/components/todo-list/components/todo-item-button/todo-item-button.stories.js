import React from 'react';

import Button from './todo-item-button.tsx';

export default {
    title: `Components\\todo-item-button`,
    component: Button,
};

export const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
    onClick: console.log,
    done: false,
};

export const Done = Template.bind({});
Done.args = {
    onClick: console.log,
    done: true,
};
