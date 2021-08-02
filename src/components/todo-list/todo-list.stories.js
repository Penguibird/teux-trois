import React from 'react';

import TodoList from './todo-list';
// import type { TodoListProps } from './todo-list'

export default {
    title: `Components\\todo-list`,
    component: TodoList,
};

const todos = [
    {
        id: 'firstTodo',
        done: false,
        text: '1 Lorem Ipsum dolor sit amet'
    },
    {
        id: 'SecondTodo',
        done: true,
        text: '2 dolor sit amet'
    },
    {
        id: 'ThirdTodo',
        done: false,
        text: '3 Titum sin sit amet'
    },
]

export const Template = (args) => <TodoList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    title: 'Monday',
    datetime: 'september 26, 2021',
    todos,
};

export const Thinner = Template.bind({});
Thinner.args = {
    title: 'Monday',
    datetime: 'september 26, 2021',
    todos,
    style: {
        maxWidth: '10em'
    }
};
