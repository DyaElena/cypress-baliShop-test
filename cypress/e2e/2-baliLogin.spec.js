describe("Login", () => {
  beforeEach("Login", () => {
    cy.visit("https://balifoodstore.com/en/login?back=my-account");
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get("#submit-login").click();

    cy.url().should("contain", "/my-account");
  });

  it("home page", () => {
    cy.get("h1").should("contain", "Your account");
  });

  function totalPrice() {
    const productPrice = document
      .getElementsByClassName("current-price")[0]
      .innerText.slice(2);
    const quantity = document
      .getElementsByClassName("js-cart-line-product-quantity form-control")
      .item(0).value;
    const totalPriceCalculated = productPrice * quantity;
    const totalPriceDisplayed = document
      .getElementsByClassName("price-total")[1]
      .innerHTML.slice(2);
    return totalPriceCalculated, totalPriceDisplayed;
  }

  it("verify nav", () => {
    cy.get(".anav-top").eq(0).find("li").should("have.length", 8);
  });

  it.only("order broccoli", () => {
    cy.contains("Veggies & Fruits").click();
    cy.contains("Broccoli").click({ force: true });
    cy.wait(5000);
    cy.contains("Add to cart").eq(0).click();
    cy.contains("Veggies & Fruits").click();
    //cy.get(".an_wishlist-icon").eq(0).click();
    cy.contains("Shopping Cart").click();

    cy.contains("Proceed to checkout").click({ force: true });
    cy.url().should("contain", "/cart?action=show");
    cy.contains("+").click();

    cy.get(".product-price").should("eq", totalPrice.totalPriceCalculated);
  });
});
