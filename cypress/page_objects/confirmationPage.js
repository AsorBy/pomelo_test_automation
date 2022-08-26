export class ConfirmationPage {

    get cancelAppointmentButton() {
        return cy.contains('cancel your appointment')
    }

    get confirmationMessage() {
        return cy.contains('Your appointment has been booked!')
    }

}