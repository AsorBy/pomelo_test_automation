export class AppointmentSelectionPage {

    setAppoinmentByNumber(number) {
        cy.intercept('POST','/events/preprod').as('event');
        this.getTimeslotByNumber(number).click({force: true});
        cy.wait('@event');
        this.firstProvider.click();
        cy.url().should('contain', '/review');
    }

    setAppointmentByDaysBefore(daysBefore) {
        const date = new Date();
        let newDate = new Date(date.setDate(date.getDate() + daysBefore))
        let appointmentDayOfWeek = newDate.toDateString().slice(0,3)
        let appointmentDay = addZeroBefore(newDate.getDate())
        cy.intercept('POST','/events/preprod').as('event');
        this.getTimeslotByDay(appointmentDayOfWeek, appointmentDay).click()
        cy.wait('@event');
        this.firstProvider.click();
        cy.url().should('contain', '/review');

        function addZeroBefore(n) {
            return (n < 10 ? '0' : '') + n;
        }
    }

    get nextAvailablities() {        
        return cy.get('button[name="next-availabilities"]').should('be.visible');
    }

    getTimeslotByDay(dayOfWeek, day) {
        return cy.get(`p[aria-label *= "availability on ${dayOfWeek + " " +  day}"]`).first();
    }


    getTimeslotByNumber(number) {
        return cy.get('div[class=mt-2] p').should('be.visible').eq(number);
    }

    get firstProvider() {
        return cy.get('button[name="select-appointment"]').should('be.visible').first();
    }    
    
    get pageLabel() {
        return cy.contains('Appointment selection');
    }
}