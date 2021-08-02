import React from 'react';

import TodoBlock from './todo-block';

export default {
    title: `src\\components\\todo-block\\todo-block-stories.js`,
    component: TodoBlock,
};

export const Template = (args) => <TodoBlock {...args} />;

export const Default = Template.bind({});
Default.args = {

};
