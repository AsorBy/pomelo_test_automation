import { App } from "../page_objects/app";
import patientOne from "../fixtures/patientOne.json";

const app = new App();

describe('empty spec', () => {
  const patient = "patientOne";
  it('test', () => {
    // cy.visit('')
    // cy.intercept('POST','/events/preprod', (req) => {})
    //     .as('event')
    // app.patientInformationPage.fillInFormByPatientData(patient);
    //
    // cy.wait('@event').then((interception) => {
    //   expect(interception.response.statusCode).to.eq(200)
    //   let requestJSON = interception.request.body.split('&').reduce((json, value) => { json[value.split('=')[0]] = value.split('=')[1]; return json; }, {});
    //   cy.log(requestJSON['session_id'])
    //   cy.log(requestJSON['event_name'])
      cy.task("DATABASE", {
        sql: `SELECT * FROM events_log_preprod`
      }).then((result) => {
        expect(result.rowCount).to.eq(1);
      });
    // })
  })
})