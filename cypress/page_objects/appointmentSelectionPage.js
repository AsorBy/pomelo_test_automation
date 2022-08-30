export class AppointmentSelectionPage {

    setAppoinment() {
        // cy.intercept('POST','/events/preprod').as('event') ;
        // this.nextAvailablities.click({force: true});
        // cy.wait('@event');
        cy.intercept('POST','/events/preprod').as('event');
        this.firstTimeslot.click({force: true});
        cy.wait('@event');
        this.firstProvider.click();
        cy.url().should('contain', '/review');
    }

    setAppoinmentByDaysAfter(daysAfter) {
        const date = new Date();
        let newDate = new Date(date.setDate(date.getDate() + daysAfter))
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
        return cy.get(`p[aria-label *= "availability on ${dayOfWeek + " " +  day}"]`).first()
    }


    get firstTimeslot() {
        return cy.get('div[class=mt-2] p').should('be.visible').first();
    }

    get firstProvider() {
        return cy.get('button[name="select-appointment"]').should('be.visible').first();
    }    
    
    get pageLabel() {
        return cy.contains('Appointment selection');
    }
}