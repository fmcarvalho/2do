'use strict'

const fs = require('fs/promises')

const DEFAULT_PATH = './data/'

let dataPath = DEFAULT_PATH

module.exports = {
    changePath,
    getAll,
    getTask,
    readTask,
    deleteTask,
    saveTask
}

/**
 * @param {String} p New path to store tasks files.
 */
function changePath(p) {
    dataPath = p
}

/**
 * @param {String} username
 * @returns {Promise.<Array.<Task>>}
 */
function getAll(username) {
    return fs
        .readdir(dataPath)
        .then(files => Promise.all(files
            .filter(f => f.includes(username))
            .map(f => readTask(f))))
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<Task>} Fulfills with the Task object for given id
 */
 function getTask(username, id) {
    return fs
        .readdir(dataPath)
        .then(files => readTask(findTask(files, username, id)))
}

/**
 * @param {Array<String>} files
 * @param {String} username
 * @param {String} id Task id
 * @returns String
 */
function findTask(files, username, id) {
    files = files.filter(f => f.includes(username))
    if(files.length == 0) throw Error('No tasks for ' + username) 
    files = files.filter(f => f.includes(id))
    if(files.length == 0) throw Error('No task with id ' + id) 
    return files[0]
}

/**
 * @param {String} file 
 * @returns {Task} instance representing a Task
 */
function readTask(file) {
    return fs
        .readFile(dataPath + file)
        .then(data => {
            const task = JSON.parse(data)
            task.dueDate = new Date(task.dueDate)
            return task
        })
}

/**
 * @param {String} username
 * @param {String} id Task id
 * @returns {Promise.<undefined>} Fulfills with `undefined` upon success.
 */
function deleteTask(username, id) {
    return fs
        .readdir(dataPath)
        .then(files => files.filter(f => f.includes(id)))
        .then(files => fs.unlink(dataPath + findTask(files, username, id)))
}

/**
 * @typedef Task
 * @type {Object}
 * @property {String} id Unique Id
 * @property {Date} due Number of days to due task
 * @property {String} title 
 * @property {String} description
 */
/**
 * @returns {Task}
 */
function newTask(due, title, description) {
    const dt = new Date()
    dt.setDate(dt.getDate() + due)
    return {
        id: Math.random().toString(36).substr(2), 
        dueDate: dt, 
        title, 
        description}
}

/**
 * @param {String} username
 * @param {Number} due Number of days to task due.
 * @param {String} title 
 * @param {String} descriptions
 * @returns {Promise.<Task>} Fulfills with the new Task after save on disk.
 */
function saveTask(username, due, title, description) {     
    const task = new newTask(due, title, description)
    const file = `task-${username}-${task.id}-${task.title}.json`
    return fs
        .writeFile(dataPath + file, JSON.stringify(task))
        .then(() => task)
}
