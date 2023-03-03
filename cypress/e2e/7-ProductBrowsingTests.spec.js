describe("Product browsing tests", () => {
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

  it("verify home page", () => {
    cy.get("h1").should("contain", "Your account");
  });

  it("verify nav bar", () => {
    cy.get(".anav-top").eq(0).find("li").should("have.length", 8);
  });

  it("verify search results", () => {
    const searchFor = ["Cheese", "Eggs", "Gelato", "Keto"]; // search works poorly on this website. For most categories includes from result

    searchFor.forEach((searchName) => {
      cy.get(".search-open-btn").click();
      cy.get("form[class='search-form open']").should("be.visible");
      cy.get('[placeholder="Search"]').clear().type(searchName);
      cy.get(".center_wrapper > button.hidden-sm-down").click();

      cy.get('[class="h3 product-title"]').each((item) => {
        cy.wrap(item).should("contain", searchName);
      });
    });
  });

  it("verify that different tastes of juices can be selected and added to the cart + verify total price", () => {
    let prices = [];

    cy.get(".search-open-btn").click();
    cy.get("form[class='search-form open']").should("be.visible");
    cy.get('[placeholder="Search"]').clear().type("juice");
    cy.get(".center_wrapper > button.hidden-sm-down").click();
    cy.get('[class="h3 product-title"]').eq(0).click();
    cy.get("h1").should("contain", "Fresh Vegetable Juice Mixed (250ml)");

    cy.get("#group_22 > li").eq(0).click();
    cy.get(".product-cover > img").should(
      "have.attr",
      "src",
      "https://balifoodstore.com/449-large_default/fresh-vegetable-juice-mixed-250ml.jpg"
    );
    cy.get(".current-price > span").should("have.attr", "content", "38000");
    cy.get(".current-price > span")
      .eq(0)
      .invoke("attr", "content")
      .then((price) => {
        prices.push(parseFloat(price));
      });

    cy.contains("Add to cart").click();
    cy.get(".product-line-info .value").should("contain", "Green Veggs & Bam");
    cy.get(".sb-close-btn").click();

    cy.get("#group_22 > li").eq(1).click();
    cy.get(".product-cover > img").should(
      "have.attr",
      "src",
      "https://balifoodstore.com/450-large_default/fresh-vegetable-juice-mixed-250ml.jpg"
    );
    cy.get(".current-price > span").should("have.attr", "content", "38000");
    cy.get(".current-price > span")
      .eq(0)
      .invoke("attr", "content")
      .then((price) => {
        prices.push(parseFloat(price));
      });
    cy.contains("Add to cart").click();
    cy.get(".product-line-info .value").eq(1).should("contain", "Holy Greens");
    cy.get(".sb-close-btn").click();

    cy.get("#group_22 > li").eq(2).click();
    cy.get(".product-cover > img").should(
      "have.attr",
      "src",
      "https://balifoodstore.com/447-large_default/fresh-vegetable-juice-mixed-250ml.jpg"
    );
    cy.get(".current-price > span").should("have.attr", "content", "40000");
    cy.get(".current-price > span")
      .eq(0)
      .invoke("attr", "content")
      .then((price) => {
        prices.push(parseFloat(price));
      });
    cy.contains("Add to cart").click();
    cy.get(".product-line-info .value").eq(2).should("contain", "Re-Start");
    cy.get(".sb-close-btn").click();

    cy.get("#group_22 > li").eq(3).click();
    cy.get(".product-cover > img").should(
      "have.attr",
      "src",
      "https://balifoodstore.com/448-large_default/fresh-vegetable-juice-mixed-250ml.jpg"
    );
    cy.get(".current-price > span").should("have.attr", "content", "53000");
    cy.get(".current-price > span")
      .eq(0)
      .invoke("attr", "content")
      .then((price) => {
        prices.push(parseFloat(price));
      });
    cy.contains("Add to cart").click();
    cy.get(".product-line-info .value").eq(3).should("contain", "Celery Juice");
    cy.get(".cart-action a").eq(1).click({ force: true });

    cy.get(".cart-items .cart-item")
      .its("length")
      .then((cartItemsNumber) => {
        cy.get("#card-subtotal-products > .label").should(
          "contain",
          cartItemsNumber
        );
      });

    cy.get("#card-subtotal-products > .value")
      .invoke("text")
      .then((text) => {
        const price = +text.slice(2).replace(",", "");
        const expectedPrice = prices.reduce((acc, cur) => acc + cur, 0);
        expect(price).to.equal(expectedPrice);
      });
  });

  it("verify add to favourites", () => {
    cy.contains("Veggies & Fruits").click();

    cy.get("[data-id-product='1']").find(".product-title").click();
    cy.get('[class="an_wishlist-mini js-an_wishlist-container"]').eq(0).click();
    cy.get(".breadcrumb li").eq(2).click();
    cy.get("[data-id-product='289']").find(".product-title").click();
    cy.get('[class="an_wishlist-mini js-an_wishlist-container"]').eq(0).click();
    cy.get(".js-an_wishlist-nav-count").should("contain", "2");
    cy.get("#_desktop_an_wishlist-nav").click();
    cy.get("[class='products row']")
      .and("contain", "Broccoli")
      .and("contain", "Basil Italian (100gr)");
  });

  it("verify that out of stock product cannot be added to the cart", () => {
    cy.contains("Dairy & Eggs").click();
    cy.get("h1").should("contain", "Dairy & Eggs");
    cy.get('[data-id-product="164"]').click();
    cy.get("#product-availability").should("contain", "Out of Stock");
    cy.contains("Add to cart").should("be.disabled");
    cy.contains("Notify me when available").should("be.visible").click();
    cy.get('article[class="alert alert-info"]').should("be.visible");
  });

  it("verify price change when change product weight", () => {
    const weight = ["250 gr", "500 gr", "1 kg"];
    const broccoli = ["Rp19,500", "Rp29,500", "Rp48,000"];
    const weightValues = ["366", "367"];
    cy.contains("Veggies & Fruits").click();

    weight.forEach((value, index) => {
      cy.get(".product-prices-block").eq(0).should("contain", broccoli[index]);
      cy.get('[class="an_productattributes-dropdown-toggler"]')
        .eq(0)
        .should("contain", value);

      if (index < 2) {
        cy.get('[class="an_productattributes-dropdown-toggler"]').eq(0).click();
        cy.get(`[data-value="${weightValues[index]}"]`).eq(0).click();
        cy.get(".js-an_productattributes-filter-option").eq(0);
      }
    });
  });

  it("verify product name and correct picture over all pages in chosen category", () => {
    cy.contains("Veggies & Fruits").click();
    cy.get(".pagination")
      .find("li")
      .eq(4)
      .invoke("text")
      .then((text) => {
        console.log(text);
        let i = 0;
        const number = parseInt(text);
        while (i < number - 1) {
          cy.get('[class="h3 product-title"]').each((title, titleIndex) => {
            cy.wrap(title)
              .invoke("text")
              .then((text) => {
                const actualText = text.trim();
                cy.get("article img")
                  .eq(titleIndex)
                  .should("have.attr", "alt", actualText);
              });
          });
          cy.get(".pagination").find(".next").click();
          i++;
        }
      });
  });

  it.only("clear cart", () => {
    cy.visit("https://balifoodstore.com/en/cart?action=show");

    cy.get('[class="cart-overview js-cart"]')
      .its("length")
      .then((length) => {
        if (length > 0) {
          cy.get(".cart-items > li >.product-line-grid").each((li) => {
            cy.wrap(li).find(".remove-from-cart").click();
          });
        } else {
          return;
        }
      });
  });
});
