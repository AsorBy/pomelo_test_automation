import { PatientInformationPage } from "../page_objects/patientInformationPage"
import { AppointmentSelectionPage } from "./appointmentSelectionPage";
import { ReviewAndBookPage } from "./reviewAndBookPage";
import { ConfirmationPage } from "./confirmationPage";
import { AppointmentCancellationPage } from "./appointmentCancellationPage";

export class App {
    partientInformationPage
    appointmentSelectionPage
    reviewAndBookPage
    confirmationPage
    appointmentCancellationPage

    constructor() {
        this.partientInformationPage = new PatientInformationPage();
        this.appointmentSelectionPage = new AppointmentSelectionPage();
        this.reviewAndBookPage = new ReviewAndBookPage();
        this.confirmationPage = new ConfirmationPage();
        this.appointmentCancellationPage = new AppointmentCancellationPage();
    }

    getDateWithChanges(addDate=0) {
        let date = new Date();
        date.setDate(date.getDate() + addDate);
        const newDate = date.toISOString()
        return newDate.replace(0, 10)
    }
}