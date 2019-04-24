const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}
const escapeHtml = string => String(string).replace(/[&<>"'`=/]/g, s => entityMap[s])
let todos = {}

window.onscroll = function () {
  (pageYOffset >= 200) ? $('#scrollUp').fadeIn() : $('#scrollUp').fadeOut()
}

function checkall(checkStatus, testcallback) {
  // console.log('ckeckAll')
  let query = `updateAllTaskStatus(status:${checkStatus})`;
  callGraphql('mutation', query).then(result => {
    if (result.data.updateTask === todos.length) {
      for (let key in todos) {
        todos[key].status = checkStatus
      }
      render()
      testcallback(result)
    }
  }).catch(errorThrown => {
    rrender()
    testcallback(errorThrown)
  });
}

function deleteCompleted(testcallback) {
  // console.log('deleteCompleted')deleteAllCompletedTask
  let query = `deleteAllCompletedTask`;
  callGraphql('mutation', query).then(result => {
    if (result.data.updateTask === todos.length) {
      for (let key in todos) {
        if (todos[key].status === true) {
          delete todos[key]
        }
      }
      render()
      testcallback(xhr)
    }
  }).catch(errorThrown => {
    rrender()
    testcallback(errorThrown)
  });
}

function updateStatus(id, status, testcallback) {
  // console.log('updateStatus', id, status)
  if (isNaN(id)) {
    testcallback('Task id is not a number')
    return 0
  }
  let query = `updateTask(id:${id},status:${status})`;
  callGraphql('mutation', query).then(result => {
    if (result.data.updateTask === 1) {
      todos[id].status = status
      render()
      testcallback(result)
    }
  }).catch(errorThrown => {
    rrender()
    testcallback(errorThrown)
  });
}

function updateDescription(id, updateDescription, testcallback) {
  // console.log('updateDescription')
  if (isNaN(id)) {
    testcallback('Task id is not a number')
    return 0
  }
  if (typeof updateDescription !== 'string') {
    testcallback('Description is not a string')
    return 0
  }
  let query = `updateTask(id:${id},description:"${escapeHtml(updateDescription)}")`;
  callGraphql('mutation', query).then(result => {
    if (result.data.updateTask === 1) {
      todos[id].description = updateDescription
      render()
      testcallback(result)
    }
  }).catch(errorThrown => {
    rrender()
    testcallback(errorThrown)
  });
}

function deleteItem(id, testcallback) {
  // console.log('deleteItem')
  if (isNaN(id)) {
    testcallback('Task id is not a number')
    return 0
  }
  let query = `deleteTask(id:${id})`;
  callGraphql('mutation', query).then(result => {
    if (result.data.deleteTask === 1) {
      delete todos[id]
      render()
      testcallback(xhr)
    }
  }).catch(errorThrown => {
    render()
    testcallback(errorThrown)
  });
}

function filterTodo(status) {
  // console.log('getActiveList')
  if (status === true || status === false) {
    let filteredList = {}
    for (let key in todos) {
      if (todos[key].status === status) {
        filteredList[key] = todos[key]
      }
    }
    return filteredList
  } else {
    return 'Invalid Status'
  }
}

function getDomList() {
  let domList = '<ul class="todo-list">'
  let checked
  for (let key in todos) {
    let description = escapeHtml(todos[key].description)
    checked = (todos[key].status === true) ? 'checked' : ''
    domList += createLi(key, description, checked)
    if (todos[key].status === false) {
      $('.toggle-all').prop('checked', false)
    }
  }
  domList += '</ul>'
  return domList
}

function addItem(content, testcallback) {
  // console.log('addItem')
  if (typeof content !== 'string') {
    testcallback('Description is not a string')
    return 0
  }
  let query = `createTask(description:"${content}",status:false){id}`;
  callGraphql('mutation', query).then(result => {
    let data = result.data.createTask.id;
    todos[data] = { 'description': escapeHtml(content), 'status': false }
    $('.new-todo').val('')
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow')
    render()
    testcallback(data)
  })
}

function createLi(id, description, checked = '') {
  // console.log('createLi')
  const className = (checked === '') ? 'active' : 'completed'
  return `<li id="${id}" class ="${className}">
      <div class="view">
      <input class ="toggle" type="checkbox" id="todo-checkbox-${id}" ${checked}>
      <label id="todo-label-${id}">${description}</label>
      <input id="todo-edit-textbox-${id}" class="edit" type="text" name="editableText">
      <button id="todo-button-${id}" class="destroy"></button>
      </div>
      
      </li>`
}

function itemFunctionality() {
  // console.log('itemFunctionality')
  $('.destroy').click(function () {
    deleteItem($(this).closest('li').attr('id'), testcallback)
  })

  $('.toggle').change(function () {
    const id = $(this).closest('li').attr('id');
    (this.checked) ? updateStatus(id, true, testcallback) : updateStatus(id, false, testcallback)
  })

  $('li').dblclick(function () {
    const value = $(this).find('label').hide().text()
    $(this).find('.toggle').hide()
    $(this).find('.destroy').hide()
    $(this).find('.edit').show().focus().val(value)
  })

  $('.edit').focusout(function () {
    // console.log('focusout')
    const changedContent = $(this).hide().val()
    if (changedContent === '') {
      deleteItem($(this).closest('li').attr('id'), testcallback)
    } else {
      const originalContent = $(this).prev().text()
      if (changedContent !== originalContent) {
        updateDescription($(this).closest('li').attr('id'), changedContent, testcallback)
      } else {
        $(this).prev().show()
        $(this).closest('li').find('.toggle').show()
      }
    }
  })

  $('.edit').keyup(function (event) {
    if (event.which === 13) {
      $(this).focusout()
    } else if (event.which === 27) {
      // console.log('esc')
      $(this).off('focusout').hide()
      $(this).prev().show()
    }
  })
}

function listFunctionality() {
  // console.log('listFunctionality')
  $('.header .new-todo').keyup(function (event) {
    const content = $('.new-todo').val()
    if (event.keyCode === 13 && content !== '') {
      addItem(content, testcallback)
    } else {
      $('html, body').animate({ scrollTop: 0 }, 50)
    }
  })

  $('.toggle-all').change(function () {
    const status = this.checked
    const toggle = (status) ? 'check' : 'uncheck'
    const r = confirm(`Are you u want to ${toggle} all items?`)
    if (r === true) {
      $('.toggle').prop('checked', status)
      checkall(status, testcallback)
    } else {
      $('.toggle-all').prop('checked', !this.checked)
    }
  })

  $('.clear-completed').click(() => deleteCompleted(testcallback))

  $(window).on('hashchange', () => filterList())

  $('#scrollUp').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 800)
    return false
  })
}

function showActiveCount() {
  // console.log('showActiveCount')
  const activeList = filterTodo(false)
  const activeListCount = Object.keys(activeList).length
  const itemString = (activeListCount === 1) ? 'item' : 'items'
  $('.todo-count').text(`${activeListCount} ${itemString} left`);
  (activeListCount === 0) ? $('.toggle-all').prop('checked', true) : $('.toggle-all').prop('checked', false)
}

function showClearComplete() {
  // console.log('showClearComplete')
  const completedList = filterTodo(true);
  (Object.keys(completedList).length === 0) ? $('.clear-completed').hide() : $('.clear-completed').show()
}

function hideWhenNoList() {
  // console.log('hideWhenNoList')
  if (Object.keys(todos).length === 0) {
    $('.footer').hide()
    $('.toggle-all').hide()
  } else {
    $('.footer').show()
    $('.toggle-all').show()
  }
}

function filterList() {
  // console.log('filterList')
  const url = location.hash
  $('.filters a').prop('class', '')
  switch (url) {
    case '#/': $('a[href$="#/"').attr('class', 'selected')
      $('.todo-list li').show()
      break
    case '#/active': $('a[href$="#/active"]').attr('class', 'selected')
      $('.todo-list .active').show()
      $('.todo-list .completed').hide()
      break
    case '#/completed': $('a[href$="#/completed" ]').attr('class', 'selected')
      $('.todo-list .active').hide()
      $('.todo-list .completed').show()
      break
    default: $('a[href$="#/"').attr('class', 'selected')
      $('.todo-list li').show()
  }
}

function render() {
  // console.log(todos)
  // console.log('render')
  const domList = getDomList()
  $('.main').html(domList)
  $('.editTextbox').hide()
  showActiveCount()
  showClearComplete()
  hideWhenNoList()
  filterList()
  itemFunctionality()
}

function callGraphql(queryType, query) {
  return $.ajax({
    url: `/graphql/`,
    type: 'POST',
    contentType: "application/json",
    data: JSON.stringify({ query: `${queryType}{${query}}` }),
  })
}

function read(testcallback) {
  let string = 'allTask{id,description,status}';
  callGraphql('query', string).then(result => {
    let data = result.data.allTask;
    data.forEach(function (item) {
      todos[item.id] = item
    })
    render()
    listFunctionality()
    testcallback(data)
  });
}

function testcallback() {
  // just to use for testcase
}

$(document).ready(function () {
  read(testcallback)
})
