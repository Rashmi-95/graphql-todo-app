var expect = chai.expect
var should = chai.should()

todos = {
  1: { description: 'd1', status: true },
  3: { description: 'd2', status: false },
  600: { description: 'd3', status: false },
  100: { description: 'd4', status: true }
}
const listWithTrueStatus = {
  1: { description: 'd1', status: true },
  1030: { description: 'd4', status: true }
}
const listWithFalseStatus = {
  3: { description: 'd2', status: false },
  600: { description: 'd3', status: false }
}

describe('Filter Object with Status Functionality', function () {
  it('should return object with status true, when status passed is true', function () {
    expect(filterTodo(true)).to.be.an(listWithTrueStatus)
  })

  it('should return object with status false, when status passed is false', function () {
    expect(JSON.stringify(filterTodo(false))).to.equal(JSON.stringify(listWithFalseStatus))
  })

  it('should return empty object, when empty todo is passed', function () {
    todos = {}
    expect(JSON.stringify(filterTodo(false))).to.equal(JSON.stringify({}))
  })

  it('should return invalid Status, when number 1 is passed', function () {
    expect(filterTodo(1)).to.equal('Invalid Status')
  })

  it('should return invalid Status, when string is passed', function () {
    expect(filterTodo('false')).to.equal('Invalid Status')
  })

  it('should return invalid Status, when object value is passed', function () {
    expect(filterTodo({ status: true })).to.equal('Invalid Status')
  })
})

describe('Escape HTML Special characters', function () {
  it('should return eascaped string when a string with special character is passed', function () {
    const scriptString = '<script>alert("hey");</script>'
    expect(escapeHtml(scriptString)).to.equal('&lt;script&gt;alert(&quot;hey&quot;);&lt;&#x2F;script&gt;')
  })
  it('show return same string when special characters are not a part of string', function () {
    const scriptString = 'Hello!'
    expect(escapeHtml(scriptString)).to.be.equal('Hello!')
  })
})

describe('Read Functionality', function () {
  it('should all the task, when get method is called', function (done) {
    read((data) => {
      expect((data instanceof Array)).to.be.equal(true)
      done()
    })
  })
})

describe('Write Functionality', function () {
  it('should id of the task, when post method is called', function (done) {
    const description = 'new todo'
    addItem(description, (data) => {
      expect(Number.isInteger(Number(data))).to.be.equal(true)
      done()
    })
  })
  addItem('new todo', ()=>{})
  it('should return Description is not a string, when non string description is passed', function (done) {
    const description = 200
    addItem(description, (data) => {
      expect(data).to.be.equal('Description is not a string')
      done()
    })
  })
})

describe('check-all items in list Functionality', function () {
  it('should return "All task are updated", when a status "true" is passed to check-all the items in list', function (done) {
    checkall(false, (xhr) => {
      expect(xhr.responseText).to.be.equal('All task are updated')
      done()
    })
  })

  it('should return "All task are updated", when a status "false" is passed to uncheck-all the items in list', function (done) {
    checkall(true, (xhr) => {
      expect(xhr.responseText).to.be.equal('All task are updated')
      done()
    })
  })

  it('should return "All task are updated", when a Number 1 (true) is passed', function (done) {
    checkall(1, (xhr) => {
      expect(xhr.responseText).to.be.equal(`All task are updated`)
      done()
    })
  })

  it('should return invalid input for type boolean, when a non bool value is passed', function (done) {
    const invalidStatus = 'hi'
    checkall(invalidStatus, (xhr) => {
      expect(xhr.responseJSON.message).to.be.equal(`invalid input syntax for type boolean: "${invalidStatus}"`)
      done()
    })
  })

  it('should return invalid input for type boolean, when undefined variable is passed', function (done) {
    let invalidStatus
    checkall(invalidStatus, (xhr) => {
      expect(xhr.responseJSON.message).to.be.equal(`invalid input syntax for type boolean: "${invalidStatus}"`)
      done()
    })
  })
})

describe('check particular items in list Functionality', function () {
  it('should return task updated status, when a valid id and true status is passed', function (done) {
    id = Object.keys(todos)[0]
    updateStatus(id, true, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} has been updated`)
      done()
    })
  })
  it('should return task updated status, when a valid id and false status is passed', function (done) {
    id = Object.keys(todos)[0]
    updateStatus(id, false, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} has been updated`)
      done()
    })
  })
  it('should return task updated status, when a valid id and status number 1 (true) is passed', function (done) {
    id = Object.keys(todos)[0]
    updateStatus(id, 1, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} has been updated`)
      done()
    })
  })
  it('should return invalid status, when a valid id and invalid status variable are passed', function (done) {
    id = Object.keys(todos)[0], invalidStatus = 'hi'
    updateStatus(id, invalidStatus, (xhr) => {
      expect(xhr.responseJSON.message).to.be.equal(`invalid input syntax for type boolean: "${invalidStatus}"`)
      done()
    })
  })
  it('should return task with id doesnt exist, when a invalid id and status variable are passed', function (done) {
    const id = 900
    updateStatus(id, true, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} doesnt exist to update`)
      done()
    })
  })

  it('should return task with id is not a number, when a string id and valid status  are passed', function (done) {
    const id = 'abc'
    updateStatus(id, true, (xhr) => {
      expect(xhr).to.be.equal(`Task id is not a number`)
      done()
    })
  })
})

describe('change Description of particular items in list Functionality', function () {
  it('should return task updated, when a valid id and string description is passed', function (done) {
    const id = Object.keys(todos)[0]
    updateDescription(id, 'new description', (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} has been updated`)
      done()
    })
  })
  it('should return task with id is not a number, when a non Number id and valid description are passed', function (done) {
    const id = 'abc'
    updateDescription(id, 'todotask', (xhr) => {
      expect(xhr).to.be.equal(`Task id is not a number`)
      done()
    })
  })

  it('should return task updated, when a valid id and number description are passed', function (done) {
    const id = Object.keys(todos)[0], description = 123
    updateDescription(id, description, (xhr) => {
      expect(xhr).to.be.equal(`Description is not a string`)
      done()
    })
  })
  it('should return invalid description, when a valid id and non string description  are passed', function (done) {
    const id = Object.keys(todos)[0], description = { description: 'hi' }
    updateDescription(id, description, (xhr) => {
      expect(xhr).to.be.equal(`Description is not a string`)
      done()
    })
  })
  it('should return task with id doesnt exist, when a invalid id and valid description are passed', function (done) {
    const id = 900
    updateDescription(id, 'todotask', (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id=${id} doesnt exist to update`)
      done()
    })
  })
})

describe('delete particular items in list Functionality', function () {
  it('should return the task is deleted, when valid id is passed is called', function (done) {
    id = Object.keys(todos)[0]
    deleteItem(id, (xhr) => {
      expect(xhr.responseText).to.be.equal('The task has been deleted')
      done()
    })
  })
  it('should return invalid task to delete when invalid id is passed ', function (done) {
    const id = 444
    deleteItem(id, (xhr) => {
      expect(xhr.responseText).to.be.equal(`The task with id =${id} doesnt exist to delete`)
      done()
    })
  })
  it('should return error in deleting task when non Number id is passed ', function (done) {
    const id = 'abc '
    deleteItem(id, (xhr) => {
      expect(xhr).to.be.equal('Task id is not a number')
      done()
    })
  })
})

describe('delete all checked items in list Functionality', function () {
  it('should return the task are deleted, when function is called', function (done) {
    deleteCompleted((xhr) => {
      expect(xhr.responseText).to.be.equal('The completed task(s) is/are deleted')
      done()
    })
  })

  it('should return no task to delete when no function is called', function (done) {
    deleteCompleted((xhr) => {
      expect(xhr.responseText).to.be.equal('No task to delete')
      done()
    })
  })
})

