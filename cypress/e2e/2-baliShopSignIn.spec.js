describe("Registration", () => {
  beforeEach("Registration", () => {
    cy.visit("https://balifoodstore.com/en/login?create_account=1");
    cy.get(".notification_cookie-accept").click();
  });
});
