export default {
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
  },
  getBoardNames (state) {
    return state.boards.map(board => board.name)
  }
}
