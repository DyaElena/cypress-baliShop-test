describe("Registration tests", () => {
  beforeEach("open website", () => {
    cy.visit("https://balifoodstore.com/en/login?create_account=1");
    cy.get(".notification_cookie-accept").click();
  });

  it("verify successful registration", () => {
    cy.contains("Mr.").click();
    cy.get("[name='firstname']").type("Carlos");
    cy.get("[name='lastname']").type("Miller");
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get('[name="psgdpr"]').click();
    cy.contains("Save").click();
    // cy.url().should("contain", "/MyAccount");
  });

  it("verify that error appears when first name is blank in registration", () => {
    cy.contains("Mr.").click();
    cy.get("[name='lastname']").type("Miller");
    cy.get('[placeholder="Email"]').type("luz@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get('[name="psgdpr"]').click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Please fill in this field.`); // requires to fill in first name
    });
  });

  it("verify that error appears when last name is blank in registration", () => {
    cy.contains("Mr.").click();
    cy.get("[name='firstname']").type("Carlos");
    cy.get('[placeholder="Email"]').type("luz@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get('[name="psgdpr"]').click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Please fill in this field.`); // requires to fill in last name
    });
  });

  it("verify that error appears when email is blank in registration", () => {
    cy.get("[name='firstname']").type("Carlos");
    cy.get("[name='lastname']").type("Miller");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get('[name="psgdpr"]').click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Please fill in this field.`); // requires to fill in email
    });
  });

  it("verify that error appears when password is blank in registration", () => {
    cy.get("[name='firstname']").type("Carlos");
    cy.get("[name='lastname']").type("Miller");
    cy.get('[placeholder="Email"]').type("luz@finews.biz");
    cy.get('[name="psgdpr"]').click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Please fill in this field.`); // requires to fill in password
    });
  });

  it("verify that error appears when agree to conditions in not clicked", () => {
    cy.get("[name='firstname']").type("Carlos");
    cy.get("[name='lastname']").type("Miller");
    cy.get('[placeholder="Email"]').type("luz@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Please tick this box if you want to proceed.`); // requires to click on agree
    });
  });

  it.only("verify that error appears if email is already registered", () => {
    cy.contains("Mr.").click();
    cy.get("[name='firstname']").type("Carlos");
    cy.get("[name='lastname']").type("Miller");
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get('[name="psgdpr"]').click();
    cy.contains("Save").click();
    cy.get(".help-block")
      .should("be.visible")
      .and(
        "contain",
        "The email is already used, please choose another one or sign in"
      );
  });
});
