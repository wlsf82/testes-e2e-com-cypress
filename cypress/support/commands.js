Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
})

Cypress.Commands.add('login', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD'),
  { cacheSession = true } = {}
) => {
  const login = () => {
    cy.visit('/login')
    cy.get('#email').type(username)
    cy.get('#password').type(password, { log: false })
    cy.contains('button', 'Login').click()
    cy.contains('h1', 'Your Notes').should('be.visible')
  }

  if (cacheSession) {
    cy.session([username, password], login)
  } else {
    login()
  }
})

const attachFileHandler = () => cy.get('#file').attachFile('example.json')

Cypress.Commands.add('createNote', (note, attachFile = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(note)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Create').click()

  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, newValue, attachFile = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')

  cy.contains('.list-group-item', note).click()
  cy.wait('@getNote')

  cy.get('#content')
    .clear()
    .type(newValue)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', note).should('not.exist')
  cy.contains('.list-group-item', newValue).should('be.visible')
})

Cypress.Commands.add('deleteNote', note => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()

  cy.contains('.list-group-item', note).should('not.exist')
})