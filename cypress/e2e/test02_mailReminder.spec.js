import { App } from "../page_objects/app";
import patientOne from "../fixtures/patientOne.json";

const app = new App();

describe("Email notifications", () => {
    const expectedConsultationType = "Urgent Consultation";
    const symptomsText = "123Test%";
    const postalCode = "G1K1G3";
    const patient = "patientOne";
    const sender = "booking@pomelohealth.com";
    const bookedSubject = "Appointment Access - Your appointment has been booked";
    const reminderSubject = "Appointment Access - Reminder";
    const currentDate = new Date()

    beforeEach(() => {
        cy.visit("");
        cy.log("WHEN: User fills out the patient form");
        app.patientInformationPage.fillInFormByPatientData(patient);
        cy.log("AND: Click agreement checkbox and continue button");
        app.patientInformationPage.agreementCheckbox.click();
        cy.intercept("POST", "hub/GetAppointmentTypeGroups").as("getAppointment");
        app.patientInformationPage.continueButton.click();
        cy.wait("@getAppointment");
        cy.log("Then: Modal page for choosing the reason for visit is open and contains patient name");
        app.patientInformationPage.reasonForVisitModal
            .getPageLabel(patientOne.firstName)
            .should("be.visible");

        cy.log("When: User selects reason for visit in dropdown");
        app.patientInformationPage.reasonForVisitModal.reasonForVisitDropdown.click();
        app.patientInformationPage.reasonForVisitModal.scrollBar
            .contains(expectedConsultationType)
            .click();
        app.patientInformationPage.reasonForVisitModal.postalCodeInput.type(postalCode);
        cy.log("And: User selects date in datePicker and clicks search");
        app.patientInformationPage.reasonForVisitModal.searchButton.click();
        cy.log("Then: Appointment selection page is open");
        app.appointmentSelectionPage.pageLabel.should("be.visible");
    });

    it("Reminder - email notification", () => {
        cy.log("When: User select timespot for appointment and provider");
        app.appointmentSelectionPage.setAppoinmentByDaysAfter(2);
        cy.log("Then: Review and book page is open");
        app.reviewAndBookPage.pageLabel.should("be.visible");
        cy.log('When: User fills in the symptom description field and click "Book this appointment"');
        app.reviewAndBookPage.describeSimptomsTextBox
            .type(symptomsText)
            .should("have.value", symptomsText);
        app.reviewAndBookPage.bookThisAppointmentButton.click();
        cy.log("Then: Confirmation of appointment is displayed");
        app.confirmationPage.confirmationMessage.should("be.visible");

        cy.task("gmail:getMessagesWithBody", {
            from: sender,
            to: patientOne.email,
            subject: bookedSubject,
            bodyText: 'Hello Joseph!',
            include_body: true,
            after: currentDate
        }).then(email => {
            const url1 = app.getUrlsFromEmail(email)[4]
            cy.visit(url1);
            app.patientInformationPage.pageLabel.should("be.visible");

            const url2 = app.getUrlsFromEmail(email)[3]
            cy.intercept("POST", "/hub/GetAppointment").as("getAppointment");
            cy.visit(url2);
            cy.wait("@getAppointment").its("response.statusCode").should("eq", 200);
            app.appointmentCancellationPage.confirmCancelAppointmentButton.should("be.visible");
        })

        cy.task("gmail:getMessagesWithBody", {
            from: sender,
            to: patientOne.email,
            subject: reminderSubject,
            bodyText: 'This is a reminder for your upcoming appointment',
            include_body: true,
            after: currentDate
        }).then(email => {
            debugger
            const url1 = app.getUrlsFromEmail(email)[4]
            cy.visit(url1);
            app.patientInformationPage.pageLabel.should("be.visible");

            const url2 = app.getUrlsFromEmail(email)[3]
            cy.intercept("POST", "/hub/GetAppointment").as("getAppointment");
            cy.visit(url2);
            cy.wait("@getAppointment").its("response.statusCode").should("eq", 200);
            app.appointmentCancellationPage.confirmCancelAppointmentButton.should("be.visible");
        })
    })
});

