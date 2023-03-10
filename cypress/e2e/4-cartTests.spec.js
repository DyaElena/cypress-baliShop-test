describe("Cart tests", () => {
  beforeEach("Login", () => {
    cy.session("user-luzefegy@finews.biz", () => {
      cy.visit("https://balifoodstore.com/en/login?back=my-account");
      cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
      cy.get('[placeholder="Password"]').type("itsmeHello1!");
      cy.get("#submit-login").click();
      cy.get(".notification_cookie-accept").click();
      cy.url().should("contain", "/my-account");

      cy.get('[aria-label="Logout dropdown"]').click();
      cy.get(".logout").should("contain", "Sign out");
    });

    cy.visit("https://balifoodstore.com/en/login?back=my-account");
  });

  it("verify if cart is empty when click on x(delete) before 'proceed to checkout'", () => {
    cy.contains("Veggies & Fruits").click();
    cy.get("[data-id-product='9']").find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="289"]').find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="11"]').find(".an_productattributes-add").click();
    cy.get("#js-cart-sidebar")
      .find(".cart-items")
      .find("li")
      .should("have.length", "3");
    cy.get("#js-cart-sidebar")
      .find(".cart-items")
      .find(".remove-from-cart")
      .click({ multiple: true });

    cy.get("#js-cart-sidebar").should(
      "contain",
      "There are no more items in your cart"
    );
  });

  it("verify if cart is empty when click on x(delete) in cart", () => {
    cy.contains("Veggies & Fruits").click();
    cy.get("[data-id-product='9']").find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="289"]').find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="11"]').find(".an_productattributes-add").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.get('[class="cart-overview js-cart"]')
      .find("li")
      .should("have.length", "3"); // check that all items were added to the cart
    cy.get(".cart-item").find(".remove-from-cart").eq(0).click();
    cy.get(".cart-item").find(".remove-from-cart").eq(1).click();
    cy.get(".cart-item").find(".remove-from-cart").eq(2).click();
    cy.get(".no-items").should("be.visible"); // check if cart is empty
  });

  it("verify increasing and decreasing amount of items in the cart", () => {
    cy.contains("Veggies & Fruits").click();
    cy.get("[data-id-product='9']").find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="289"]').find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="11"]').find(".an_productattributes-add").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.get('[class="cart-overview js-cart"]')
      .find("li")
      .should("have.length", "3"); // check that all items were added to the cart

    cy.get(".product-line-grid").eq(0).contains("+").click();
    cy.get(".product-line-grid").eq(1).contains("+").click();
    cy.get(".product-line-grid").eq(2).contains("+").click();
    cy.get("#card-subtotal-products").should("contain", "6 items");
    cy.get(".product-line-grid").eq(0).contains("-").click();
    cy.get(".product-line-grid").eq(1).contains("-").click();
    cy.wait(500);
    cy.get(".product-line-grid").eq(2).contains("-").click();
    cy.get("#card-subtotal-products").should("contain", "3 items");
  });

  it("verify that continue shopping button returns customer to catalog", () => {
    cy.get(".cart-text").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.contains("Continue shopping").click();
    cy.url().should("contain", "https://balifoodstore.com/en/");
  });

  it("verify that checkout button takes customer to checkout page", () => {
    cy.get(".cart-text").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.contains("Checkout").click();
    cy.url().should("contain", "https://balifoodstore.com/en/order");
  });

  it("verify correct delivery price in  checkout page (order less than 150.000 Rp)", () => {
    cy.get(".cart-text").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.contains("Checkout").click();
    cy.get("#cart-subtotal-shipping > .value")
      .invoke("text")
      .then((text) => {
        cy.wrap(text).should("be.equal", "Rp35,000");
      });
    cy.url().should("contain", "https://balifoodstore.com/en/order");
  });

  it("verify correct delivery price in  checkout page (order more than 150.000 Rp)", () => {
    cy.get(".cart-text").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.get(".product-line-grid").eq(0).contains("+").click().click().click();
    cy.get(".product-line-grid").eq(1).contains("+").click().click().click();
    cy.get(".product-line-grid").eq(2).contains("+").click().click().click();

    cy.contains("Checkout").click();
    cy.get("#cart-subtotal-shipping > .value")
      .invoke("text")
      .then((text) => {
        cy.wrap(text).should("be.equal", "Free");
      });
    cy.url().should("contain", "https://balifoodstore.com/en/order");
  });
});
