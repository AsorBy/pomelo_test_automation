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
    const bookedBodyText = 'Your appointment is confirmed as follows';
    const reminderBodyText = 'This is a reminder for your upcoming appointment';
    const currentDate = new Date()
    const testData = [
        {
            daysBefore: 1, //24h reminder
            bodyText: bookedBodyText,
            subject: bookedSubject
        },
        {
            daysBefore: 1, //24h reminder
            bodyText: reminderBodyText,
            subject: reminderSubject
        },
        {
            daysBefore: 2, //48h reminder
            bodyText: bookedBodyText,
            subject: bookedSubject
        },
        {
            daysBefore: 2, //48h reminder
            bodyText: reminderBodyText,
            subject: reminderSubject
        },
        {
            daysBefore: 3, //72h reminder
            bodyText: bookedBodyText,
            subject: bookedSubject
        },{
            daysBefore: 3, //72h reminder
            bodyText: reminderBodyText,
            subject: reminderSubject
        }
    ]

    beforeEach(() => {
        cy.visit("");
        cy.log("WHEN: User fills out the patient form");
        app.patientInformationPage.fillInFormByPatientData(patient);
        cy.log("And: User search available appointment");
        app.patientInformationPage.reasonForVisitModal.searchForAvailabilitiesByCriteria(consultationType, postalCode)
    });

    testData.forEach((data) => {
        it("Reminder - email notification", () => {
            cy.log(`When: User select timeslot for appointment by ${data.daysBefore}  and select first provider`);
            app.appointmentSelectionPage.setAppointmentByDaysBefore(data.daysBefore);
            cy.log('And: User clicks "Book this appointment"');
            app.reviewAndBookPage.bookThisAppointmentButton.click();
            cy.log("Then: Confirmation of appointment is displayed");
            app.confirmationPage.confirmationMessage.should("be.visible");

            cy.task("gmail:getMessagesWithBody", {
                from: sender,
                to: patientOne.email,
                subject: data.subject,
                bodyText: data.bodyText,
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
        })
    })

});

