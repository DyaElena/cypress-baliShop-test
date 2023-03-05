describe("Sign in tests", () => {
  beforeEach("open website", () => {
    cy.visit("https://balifoodstore.com/en/login?back=my-account");
    cy.get(".notification_cookie-accept").click();
  });

  function enterDate(name, password) {
    cy.get('[placeholder="Email"]').type(name);
    cy.get('[placeholder="Password"]').type(password);
    cy.get("#submit-login").click();
  }

  it("verify successful login", () => {
    enterDate("luzefegy@finews.biz", "itsmeHello1!");
    cy.url().should("contain", "my-account");
  });

  it("verify unsuccessful login with wrong password and registered email", () => {
    enterDate("luzefegy@finews.biz", "itsmeHello");
    cy.get(".help-block").should("contain", "Authentication failed."); // not good UI (user doesn't know why it failed)
  });

  it("verify unsuccessful login with unregistered email", () => {
    enterDate("luz@finews.biz", "itsmeHello1!");
    cy.get(".help-block").should("contain", "Authentication failed."); // not good UI (user doesn't know why it failed)
  });

  it.only("verify unsuccessful login with blank password", () => {
    cy.get('[placeholder="Email"]').type("luz@finews.biz");
    cy.get("#submit-login").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Please fill in this field.`); // requires to click on agree
    });
  });

  it.only("verify unsuccessful login with blank email", () => {
    enterDate(" ", "itsmeHello1!");
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

  it("verify forgot password functionality", () => {
    cy.get(".forgot-password").click();
    cy.get("#email").type("luzefegy@finews.biz");
    cy.contains("Send").click();
    cy.contains(
      "If this email address has been registered in our shop, you will receive a link to reset your password"
    ).should("be.visible");
  });
});
