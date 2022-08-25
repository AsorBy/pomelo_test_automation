export class AppointmentCancellationPage {

    get confirmCancelAppointmentButton() {
        return cy.contains('button','Yes, cancel this appointment')
    }

    get backToHomePageButton() {
        return cy.get('button[aria-label="Back to homepage"]')
    }
    
    get cancelationMessage() {
        cy.wait(2000)
        return cy.get('span p').contains('Your appointment has been cancelled!')
    }

}