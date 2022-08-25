export class ConfirmationPage {

    get cancelAppointmentButton() {
        return cy.contains('cancel your appointment')
    }

    get confirmationMessage() {
        cy.wait(1000)
        return cy.get('span p').contains('Your appointment has been booked!')
    }

}