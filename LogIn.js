/// <reference types="cypress"/>

describe("Signup Test", () => {
  let randomString = Math.random().toString(36).substring(2);
  const email = "Auto_email" + randomString + "@gmail.com";
  const password = "Password1";
  const securityPass = "Mother's maiden name?";

  describe("UI test", () => {
    beforeEach(() => {
      cy.log("Email: " + email);
      cy.log("Password: " + password);
      cy.visit("http://localhost:3000/#/");
      cy.get(".close-dialog").click();
      cy.get("#navbarAccount").contains("Account").click();
      cy.get("#navbarLoginButton > span").click();
    });

    it("Test valid signup", () => {
      cy.get("#newCustomerLink")
        .contains("Not yet a customer?")
        .click({ force: true });
      cy.get("#emailControl").type(email);
      cy.get("#passwordControl").type(password);
      cy.get("#repeatPasswordControl").type(password);
      cy.get('[role = "combobox"]').click();
      cy.get(".mat-option-text").contains(securityPass).click();
      cy.get("#securityAnswerControl").type("Tenchu").click();
      cy.get("#registerButton").click();
      cy.get('[aria-hidden="true"]')
        .contains("Registration")
        .should(
          "have.text",
          "Registration completed successfully. You can now log in."
        );
    });

    it("Test valid login", () => {
      cy.get("#email").type(email);
      cy.get("#password").type(password);
      cy.get("#loginButton").click();
      cy.get(".fa-layers-counter").contains(0);
    });
  });
  describe("API test", () => {
    const credentialUser = {
      email: "Auto_emailk5agcjsxwjp@gmail.com",
      password: "Password1",
    };
    it("login via API", () => {
      cy.request(
        "POST",
        "http://localhost:3000/rest/user/login",
        credentialUser
      ).then((response) => {
        expect(response.status).eq(200);
      });
    });

    it("Login via Token", () => {
      cy.request(
        "POST",
        "http://localhost:3000/rest/user/login",
        credentialUser
      )
        .its("body")
        .then((body) => {
          const token = body.authentication.token;
          cy.wrap(token).as("userToken");
          //cy.log('@userToken');

          const userToken = cy.get("@userToken");
          cy.visit("http://localhost:3000/", {
            onBeforeLoad(browser) {
              browser.localStorage.setItem("token", userToken);
            },
          });

          cy.get(".close-dialog").click();
          cy.get(".fa-layers-counter").contains(0);
        });
    });
  });
});
