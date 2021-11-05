'use strict'

const tasks = require('./../lib/tasks')

tasks.changePath('./__tests__/data/')

test('Get all tasks', () => {
    return tasks
        .getAll()
        .then(tasks => expect(tasks.length).toBe(3))
})

test('Get a single tasks for given ID', () => {
    return tasks
        .getTask('uq20461wq2a')
        .then(tasks => expect(tasks.title).toBe('swim-mile'))
})

test('Get a unkown task', () => {
    const taskId = 'nsflhqohr2'
    return tasks
        .getTask(taskId)
        .then(tasks => { throw Error('Assertion failed. It should not succeed getting a task.') })
        .catch(err => expect(err.message).toBe('No task with id nsflhqohr2'))
})