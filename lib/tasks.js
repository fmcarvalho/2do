'use strict'

const fs = require('fs/promises')

const DEFAULT_PATH = './data/'

let path = DEFAULT_PATH

module.exports = {
    changePath,
    saveDummies,
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
    path = p
}

function saveDummies() {
    saveTask(7, 'swim-mile', 'Achieve 1 mile swimming open water.')
    saveTask(3, 'pi-workout', 'Complete the first workout of Web Dev course.')
    saveTask(20, 'peaa', 'Finish the book of Patterns of Enterprise Application Architecture by Martin Fowler.')
}

/**
 * @returns {Promise.<Array.<Task>>}
 */
function getAll() {
    return fs
        .readdir(path)
        .then(files => files.map(f => readTask(f)))
        .then(prms => Promise.all(prms))
}

/**
 * @param {String} id Task id
 * @returns {Promise.<Task>} Fulfills with the Task object for given id
 */
 function getTask(id) {
    return fs
        .readdir(path)
        .then(files => files.filter(f => f.includes(id)))
        .then(files => { 
            if(files.length == 0) throw Error('No task with id ' + id) 
            else return readTask(files[0])
        })
}


/**
 * @param {String} file 
 * @returns {Task} instance representing a Task
 */
function readTask(file) {
    return fs
        .readFile(path + file)
        .then(data => {
            const task = JSON.parse(data)
            task.dueDate = new Date(task.dueDate)
            return task
        })
}

/**
 * @param {String} id Task id
 * @returns {Promise.<undefined>} Fulfills with `undefined` upon success.
 */
function deleteTask(id) {
    return fs
        .readdir(path)
        .then(files => files.filter(f => f.includes(id)))
        .then(files => { 
            if(files.length == 0) throw Error('No task with id ' + id) 
            else return files[0]
        })
        .then(file => fs.unlink(path + file))
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
 * @param {Number} due Number of days to task due.
 * @param {String} title 
 * @param {String} descriptions
 * @returns {Promise.{Task}} Fulfills with the new Task after save on disk.
 */
function saveTask(due, title, description) {     
    const task = new newTask(due, title, description)
    const path = `task-${task.id}-${task.title}.json`
    return fs
        .writeFile(path, JSON.stringify(task))
        .then(() => task)
}
