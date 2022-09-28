/* eslint-disable no-undef */
export class ReviewAndBookPage {
  restartTimer() {
    this.restartButton.click();
    cy.intercept('/hub/RenewAvailability').as("renewAvailability");
    cy.contains('p', 'Restart timer');
    this.restartSmallButton.should('be.visible').click();
    cy.wait('@renewAvailability');
  }

  get bookThisAppointmentButton() {
    return cy.get('button[data-test-id="book-appt-btn"]');
  }

  get selectDifferentAppointmentButton() {
    return cy.contains('button', 'Select a different appointment');
  }

  get restartButton() {
    return cy.get('button').contains('Restart');
  }

  get restartSmallButton() {
    return cy.get('.pom-btn__small').contains('Restart');
  }

  get pageLabel() {
    return cy.contains('Review and book');
  }

  get timer() {
    return cy.get("time[role = 'timer']");
  }

  checkTimer() {
    cy.wait(2000);
    this.timer
        .invoke('text')
        .then((time1) => {
      this.restartTimer();
      this.timer
          .invoke('text')
          .should((time2) => {
        expect(parseInt(time1.replace('3:',''))).to.be.lessThan(parseInt(time2.replace('3:','')));
        debugger
      });
    });
  }
}
