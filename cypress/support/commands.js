// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getMessagesWithBody", (from, to, subject, bodyText) => {
    cy.task("gmail:getMessagesWithBody", {
        from: from,
        to: to,
        subject: subject,
        include_body: true,
        bodyText: bodyText,
        after: after
    }).then(response => {
        expect(response).not.to.equal(null);
        return response;
    });
});

Cypress.Commands.add('getEmailBody', (from, to, subject) => {
    cy.task('gmail:get-messages', {
        to: to,
        options: {
            from: from,
            subject: subject,
            include_body: true
        }
    }).then(response => {
        expect(response).to.be.not.empty
        console.log(response)
        return response;
    });
});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
})