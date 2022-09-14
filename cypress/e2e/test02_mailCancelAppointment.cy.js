import { App } from "../page_objects/app";
import patientOne from "../fixtures/patientOne.json";

const app = new App();

describe("Email notifications", () => {
    const consultationType = "Urgent Consultation";
    const postalCode = "J0B1M0";
    const patient = "patientOne";
    const sender = "booking@pomelohealth.com";
    const emailSubject = "Appointment Access - Your appointment has been booked";
    const currentDate = new Date()

    beforeEach(() => {
        cy.visit("");
        cy.log("WHEN: User fills out the patient form");
        app.patientInformationPage.fillInFormByPatientData(patient);
        cy.log("And: User search available appointment");
        app.patientInformationPage.reasonForVisitModal.searchForAvailabilitiesByCriteria(consultationType, postalCode)
        cy.log("And: User select first timeslot for appointment and provider");
        app.appointmentSelectionPage.setAppoinmentByNumber(0);
        cy.log('When: User click "Book this appointment"');
        app.reviewAndBookPage.bookThisAppointmentButton.click();
        cy.log("Then: Confirmation of appointment is displayed");
        app.confirmationPage.confirmationMessage.should("be.visible");
    });

    it("Cancel appointment - email notification", () => {

        cy.log("When: User receives a cancellation email using gmail api");
        cy.task("gmail:getMessagesWithBody", {
            from: sender,
            to: patientOne.email,
            subject: emailSubject,
            include_body: true,
            bodyText: 'Cancel appointment',
            after: currentDate
        }).then(email => {
            debugger
            cy.log("And: Open the \"Cancel appointment\" link within the email");
            const url = app.getUrlsFromEmail(email)[3]
            cy.intercept("POST", "/hub/GetAppointment").as("getAppointment");
            cy.visit(url);
            cy.wait("@getAppointment").its("response.statusCode").should("eq", 200);
        })
        app.selectLanguage("English")
        app.appointmentCancellationPage.confirmCancelAppointmentButton.click();
        cy.wait("@event").its("response.statusCode").should("eq", 200);
        cy.log("Then: Message about cancel confirmation is displayed");
        app.appointmentCancellationPage.cancellationMessage.should("be.visible");
    })
});

