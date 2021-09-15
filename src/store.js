import Vue from 'vue'
import Vuex from 'vuex'
import defaultBoard from './default-board'
import { saveStatePlugin, uuid } from './utils'

Vue.use(Vuex)

const board = JSON.parse(localStorage.getItem('board')) || defaultBoard

export default new Vuex.Store({
  plugins: [saveStatePlugin],
  state: {
    board
  },
  getters: {
    getTask (state) {
      return (id) => {
        for (const column of state.board.columns) {
          for (const task of column.tasks) {
            if (task.id === id) {
              return task
            }
          }
        }
      }
    }
  },
  mutations: {
    CREATE_TASK (state, { tasks, name }) {
      tasks.push({
        name,
        freeze: false,
        id: uuid(),
        description: ''
      })
    },
    CREATE_COLUMN (state, { name }) {
      state.board.columns.push({
        name,
        tasks: []
      })
    },
    UPDATE_TASK (state, { task, key, value }) {
      task[key] = value
    },
    MOVE_TASK (state, { fromTasks, toTasks, fromTaskIndex, toTaskIndex, isBaseColumn = false }) {
      let taskToMove = fromTasks[fromTaskIndex]
      if (!isBaseColumn) taskToMove = fromTasks.splice(fromTaskIndex, 1)[0]
      toTasks.splice(toTaskIndex, 0, taskToMove)
    },
    MOVE_COLUMN (state, { fromColumnIndex, toColumnIndex, isBaseColumn = false }) {
      const columnList = state.board.columns
      if (isBaseColumn || columnList[toColumnIndex].freeze || columnList[fromColumnIndex].freeze) return
      const columnToMove = columnList.splice(fromColumnIndex, 1)[0]
      columnList.splice(toColumnIndex, 0, columnToMove)
    },
    REMOVE_TASK (state, { columnIndex, taskIndex }) {
      state.board.columns[columnIndex].tasks.splice(taskIndex, 1)
    },
    DELETE_COLUMN (state, { columnIndex }) {
      state.board.columns.splice(columnIndex, 1)
    }
  }
})
