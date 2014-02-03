var url = 'http://localhost:9999/examples/todomvc/?test=1',
    wd = require('webdriverjs')

require('whipcream')(wd)

describe('todomvc', function () {
    
    var browser

    before(function (done) {
        browser = wd
            .remote({
                desiredCapabilities: {
                    browserName: process.env.WD_BROWSER || 'chrome'
                }
            })
            .init()
            .url(url)
            .waitFor('#todoapp', 1000, done)
    })

    after(function (done) {
        browser.end(done)
    })
    
    it('initialization', function (done) {
        browser
            .$('#main').should.not.be.visible
            .$('#footer').should.not.be.visible
            .$('#filters .selected')
                .should.have.count(1)
                .should.have.property('textContent', 'All')
            .call(done)
    })

    it('create new todo', function (done) {
        browser
            .$('#new-todo').type('test1').enter()
            .$('.todo').should.have.count(1)
            .$('.todo .edit').should.not.be.visible
            .$('.todo label').should.have.text('test1')
            .$('#todo-count strong').should.have.text('1')
            .$('.todo .toggle').should.not.be.checked
            .$('#main').should.be.visible
            .$('#footer').should.be.visible
            .$('#clear-completed').should.not.be.visible
            .$('#new-todo').should.have.value('')
            .call(done)
    })

    it('create another todo', function (done) {
        browser
            .$('#new-todo').type('test2').enter()
            .$('.todo').should.have.count(2)
            .$('.todo label').should.have.text('test2')
            .$('#todo-count strong').should.have.text(2)
            .call(done)
    })

    it('toggle a todo', function (done) {
        browser
            .click('.todo .toggle')
            .$('.todo.completed').should.have.count(1)
            .$('.todo:first-child').should.have.class('completed')
            .call(done)
    })

    it('create more todos', function (done) {
        browser
            .$('#new-todo').type('test3').enter()
            .$('.todo').should.have.count(3)
            .$('.todo label').should.have.text('test3')
            .$('#todo-count strong').should.have.text(2)
            .$('#new-todo')
                .type('test4').enter()
                .type('test5').enter()
            .$('.todo').should.have.count(5)
            .$('#todo-count strong').should.have.text(4)
            .call(done)
    })

    it('toggle more todos', function (done) {
        browser
            .click('.todo:nth-child(1) .toggle')
            .click('.todo:nth-child(2) .toggle')
            .$('.todo.completed').should.have.count(3)
            .$('#clear-completed').should.have.text('Remove Completed (3)')
            .$('#todo-count strong').should.have.text(2)
            .call(done)
    })

    it('remove a completed todo', function (done) {
        browser
            .moveToObject('.todo:nth-child(1)')
            .click('.todo:nth-child(1) .destroy')
            .$('.todo').should.have.count(4)
            .$('.todo.completed').should.have.count(2)
            .$('#clear-completed').should.have.text('Remove Completed (2)')
            .$('#todo-count strong').should.have.text(2)
            .call(done)
    })

    it('remove an incomplete todo', function (done) {
        browser
            .moveToObject('.todo:nth-child(2)')
            .click('.todo:nth-child(2) .destroy')
            .$('.todo').should.have.count(3)
            .$('.todo.completed').should.have.count(2)
            .$('#clear-completed').should.have.text('Remove Completed (2)')
            .$('#todo-count strong').should.have.text(1)
            .call(done)
    })

    it('remove all completed todos', function (done) {
        browser
            .click('#clear-completed')
            .$('.todo').should.have.count(1)
            .$('.todo label').should.have.text('test1')
            .$('.todo.completed').should.have.count(0)
            .$('#todo-count strong').should.have.text(1)
            .$('#clear-completed').should.not.be.visible
            .call(done)
    })

    it('filter active todos', function (done) {
        browser
            // create two more items
            .$('#new-todo')
                .type('test').enter()
                .type('test').enter()
            .click('.todo:nth-child(1) .toggle')
            .click('.todo:nth-child(2) .toggle')
            // click 'active' filter
            .click('#filters li:nth-child(2) a')
            .$('.todo').should.have.count(1)
            .$('.todo.completed').should.have.count(0)
            .call(done)
    })

    it('add item with active filter', function (done) {
        browser
            .$('#new-todo').type('test').enter()
            .$('.todo').should.have.count(2)
            .call(done)
    })

    it('filter completed todos', function (done) {
        browser
            .click('#filters li:nth-child(3) a')
            .$('.todo').should.have.count(2)
            .$('.todo.completed').should.have.count(2)
            .call(done)
    })

    it('filter active on page load', function (done) {
        browser
            .url(url + '#/active')
            .waitFor('#todoapp', 1000)
            .$('.todo').should.have.count(2)
            .$('.todo.completed').should.have.count(0)
            .$('#clear-completed').should.have.text('Remove Completed (2)')
            .$('#todo-count strong').should.have.text(2)
            .call(done)
    })

    it('filter completed on page load', function (done) {
        browser
            .url(url + '#/completed')
            .waitFor('#todoapp', 1000)
            .$('.todo').should.have.count(2)
            .$('.todo.completed').should.have.count(2)
            .$('#clear-completed').should.have.text('Remove Completed (2)')
            .$('#todo-count strong').should.have.text(2)
            .call(done)
    })

    it('toggle todo when filter is on', function (done) {
        browser
            .click('.todo .toggle')
            .$('.todo').should.have.count(1)
            .click('#filters li:nth-child(2) a')
            .$('.todo').should.have.count(3)
            .click('.todo .toggle')
            .$('.todo').should.have.count(2)
            .call(done)
    })

    it('edit by blur', function (done) {
        browser
            .click('#filters li:nth-child(1) a')
            .doubleClick('.todo label')
            .$('.todo.editing').should.have.count(1)
            .$('.todo .edit').should.be.focused
            .$('.todo .edit').type('edited!')
            .click('body') // lose focus
            .$('.todo.editing').should.have.count(0)
            .$('.todo label').should.have.text('edited!')
            .call(done)
    })

    it('edit by enter', function (done) {
        browser
            .doubleClick('.todo label')
            .$('.todo .edit').type('edited again!').enter()
            .$('.todo.editing').should.have.count(0)
            .$('.todo label').should.have.text('edited again!')
            .call(done)
    })

    it('cancel edit', function (done) {
        browser
            .doubleClick('.todo label')
            .$('.todo .edit').type('cancel test').key('Escape')
            .$('.todo.editing').should.have.count(0)
            .$('.todo label').should.have.text('edited again!')
            .call(done)
    })

    it('empty edit remove', function (done) {
        browser
            .doubleClick('.todo label')
            .$('.todo .edit').type(' ').enter()
            .$('.todo').should.have.count(3)
            .call(done)
    })

    it('toggle all', function (done) {
        browser
            .click('#toggle-all')
            .$('.todo.completed').should.have.count(3)
            .click('#toggle-all')
            .$('.todo:not(.completed)').should.have.count(3)
            .call(done)
    })

})