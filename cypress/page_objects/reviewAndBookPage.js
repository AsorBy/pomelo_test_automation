/* eslint-disable no-undef */
export class ReviewAndBookPage {
  restartTimer() {
    this.restartButton.click();
    cy.contains('p', 'Restart timer');
    this.restartSmallButton.should('be.visible').click();
  }

  get bookThisAppointmentButton() {
    return cy.get('button[data-test-id="book-appt-btn"]');
  }

  get selectDifferentAppointmentButton() {
    return cy.contains('button', 'Select a different appointment');
  }

  get describeSimptomsTextBox() {
    return cy.get('textarea[placeholder="Describe your symptoms"]');
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
    this.timer.then((time1) => {
      this.restartTimer();
      cy.wait(2000);
      this.timer.then((time2) => {
        expect(time1).not.equals(time2);
      });
    });
  }
}
