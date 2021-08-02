import React from 'react';

import Header from './header.tsx';

export default {
    title: `Components\\todo-list\\components`,
    component: Header,
};

export const Template = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {children: 'Title'};

export const Monday = Template.bind({});
Monday.args = {children: 'Monday'};

export const LongText = Template.bind({});
LongText.args = {children: 'Lorem ipsum dolor sit amet'};
