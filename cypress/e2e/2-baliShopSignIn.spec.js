describe("Log in ", () => {
  beforeEach("open website", () => {
    cy.visit("https://balifoodstore.com/en/login?back=my-account");
    cy.get(".notification_cookie-accept").click();
  });

  it("verify successful login", () => {
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get("#submit-login").click();
    cy.url().should("contain", "my-account");
  });

  it("verify unsuccessful login with wrong password and registered email", () => {
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1");
    cy.get("#submit-login").click();
    cy.get(".help-block").should("contain", "Authentication failed."); // not good UI (user doesn't know why it failed)
  });

  it("verify unsuccessful login with unregistered email", () => {
    cy.get('[placeholder="Email"]').type("luzef@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1");
    cy.get("#submit-login").click();
    cy.get(".help-block").should("contain", "Authentication failed."); // not good UI (user doesn't know why it failed)
  });

  it("verify unsuccessful login with blank password", () => {
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get("#submit-login").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Please fill in this field.`); // requires to click on agree
    });
  });

  it("verify unsuccessful login with blank email", () => {
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get("#submit-login").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Please fill in this field.`); // requires to click on agree
    });
  });

  it("verify show password button", () => {
    cy.get('[placeholder="Email"]').type("luzef@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1");
    cy.get('[data-action="show-password"]').click();
    cy.get('[placeholder="Password"]').should("have.attr", "type", "text");
  });
});
