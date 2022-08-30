export class AppointmentCancellationPage {

    get confirmCancelAppointmentButton() {
        return cy.get('button[data-test-id = "cancel-appt-btn"]');
    }

    get backToHomePageButton() {
        return cy.get('button[aria-label="Back to homepage"]');
    }
    
    get cancellationMessage() {
        return cy.contains('Your appointment has been cancelled!');
    }

}