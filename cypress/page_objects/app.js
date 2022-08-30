import {PatientInformationPage} from "./patientInformationPage"
import {AppointmentSelectionPage} from "./appointmentSelectionPage";
import {ReviewAndBookPage} from "./reviewAndBookPage";
import {ConfirmationPage} from "./confirmationPage";
import {AppointmentCancellationPage} from "./appointmentCancellationPage";

export class App {
    patientInformationPage
    appointmentSelectionPage
    reviewAndBookPage
    confirmationPage
    appointmentCancellationPage

    constructor() {
        this.patientInformationPage = new PatientInformationPage();
        this.appointmentSelectionPage = new AppointmentSelectionPage();
        this.reviewAndBookPage = new ReviewAndBookPage();
        this.confirmationPage = new ConfirmationPage();
        this.appointmentCancellationPage = new AppointmentCancellationPage();
    }

    selectLanguage(language){
        cy.get('button[name="language-select"]').click()
        cy.get('li[role = "menuitem"]').contains(language).click()
    }

    getDateWithChanges(addDate=0) {
        let date = new Date();
        date.setDate(date.getDate() + addDate);
        const newDate = date.toISOString();
        return newDate.replace(0, 10);
    }

    getUrlsFromEmail(email) {
        let decodedBody = Buffer.from(email.parts[0].body.data, "base64").toString("utf-8").replaceAll('amp;', '')
        const extractUrls = require("extract-urls");
        return extractUrls(decodedBody)
    }
}