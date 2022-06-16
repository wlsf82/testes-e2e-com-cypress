it('CRUDs a note', () => {
  const faker = require('faker')
  const noteDescription = faker.lorem.words(4)

  cy.intercept('GET', '**/notes').as('getNotes')
  cy.login()

  cy.createNote(noteDescription)
  cy.wait('@getNotes')

  const updatedNoteDescription = faker.lorem.words(4)
  const attachFile = true

  cy.editNote(noteDescription, updatedNoteDescription, attachFile)
  cy.wait('@getNotes')

  cy.deleteNote(updatedNoteDescription)
  cy.wait('@getNotes')
})