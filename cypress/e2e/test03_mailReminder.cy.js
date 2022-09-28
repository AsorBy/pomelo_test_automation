import { App } from "../page_objects/app";
import patientOne from "../fixtures/patientOne.json";

const app = new App();

describe("Email notifications", () => {
    const consultationType = "Urgent Consultation";
    const postalCode = "J0B1M0";
    const patient = "patientOne";
    const sender = "booking@pomelohealth.com";
    const bookedSubject = "Appointment Access - Your appointment has been booked";
    const reminderSubject = "Appointment Access - Reminder";
    const bookedBodyText = "Your appointment is confirmed as follows";
    const reminderBodyText = "This is a reminder for your upcoming appointment";
    const currentDate = new Date()
    const testData = [
        {
            daysBefore: 1, //24h reminder
        },
        {
            daysBefore: 2, //48h reminder
        },
        {
            daysBefore: 3, //72h reminder
        }
    ]

    beforeEach(() => {
        cy.visit("");
        cy.log("WHEN: User fills out the patient form");
        app.patientInformationPage.fillInFormByPatientData(patient);
        cy.log("And: User search available appointment");
        app.patientInformationPage.reasonForVisitModal.searchForAvailabilitiesByCriteria(consultationType, postalCode);
    });

    testData.forEach((data) => {
        it("Reminder - email notification", () => {
            cy.log(`When: User select timeslot for appointment by ${data.daysBefore}  and select first provider`);
            app.appointmentSelectionPage.setAppointmentByDaysBefore(data.daysBefore);
            cy.log('And: User clicks "Book this appointment"');
            app.reviewAndBookPage.bookThisAppointmentButton.click();
            cy.log("Then: Confirmation of appointment is displayed");
            app.confirmationPage.confirmationMessage.should("be.visible");

            cy.log("When: User receives confirmation email message")
            cy.task("gmail:getMessagesWithBody", {
                from: sender,
                to: patientOne.email,
                subject: bookedSubject,
                bodyText: bookedBodyText,
                include_body: true,
                after: currentDate
            }).then(email => {
                cy.log("Then: The booking confirmation email contains a link to make a new appointment")
                const url1 = app.getUrlsFromEmail(email)[4]
                cy.visit(url1);
                app.patientInformationPage.pageLabel.should("be.visible");
                cy.log("And: The booking confirmation email contains a link to cancel the booking appointment")
                const url2 = app.getUrlsFromEmail(email)[3];
                cy.intercept("POST", "/hub/GetAppointment").as("getAppointment");
                cy.visit(url2);
                cy.wait("@getAppointment").its("response.statusCode").should("eq", 200);
                app.appointmentCancellationPage.confirmCancelAppointmentButton.should("be.visible");
            })
            cy.log("When: User receives reminder email message")
            cy.task("gmail:getMessagesWithBody", {
                from: sender,
                to: patientOne.email,
                subject: reminderSubject,
                bodyText: reminderBodyText,
                include_body: true,
                after: currentDate
            }).then(email => {
                cy.log("Then: The reminder email contains a link to make a new appointment")
                const url1 = app.getUrlsFromEmail(email)[4]
                cy.visit(url1);
                app.patientInformationPage.pageLabel.should("be.visible");
                cy.log("And: The reminder email contains a link to cancel the booking appointment")
                const url2 = app.getUrlsFromEmail(email)[3];
                cy.intercept("POST", "/hub/GetAppointment").as("getAppointment");
                cy.visit(url2);
                cy.wait("@getAppointment").its("response.statusCode").should("eq", 200);
                app.appointmentCancellationPage.confirmCancelAppointmentButton.should("be.visible");
            })
        })
    })

});

