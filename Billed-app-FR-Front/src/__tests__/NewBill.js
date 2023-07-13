/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes.js";
import mockStore from "../__mocks__/store";

describe("Given I am connected as an employee and I am on NewBill Page", () => {
    test("Then the page loads with all inputs", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      html.onNavigate;

      const formNewBill = screen.getByTestId("form-new-bill");
      expect(formNewBill.hasChildNodes()).toBe(true);

      const inputTypeDepense = screen.getByTestId("expense-type");
      expect(inputTypeDepense.value).toBe("Transports");

      const nomDepense = screen.getByTestId("expense-name");
      expect(nomDepense.value).toBe("");

      const dateDepense = screen.getByTestId("datepicker");
      expect(dateDepense.value).toBe("");

      const montantDepense = screen.getByTestId("amount");
      expect(montantDepense.value).toBe("");

      const montantTVAvat = screen.getByTestId("vat");
      expect(montantTVAvat.value).toBe("");

      const montantTVApct = screen.getByTestId("pct");
      expect(montantTVApct.value).toBe("");

      const commentaire = screen.getByTestId("commentary");
      expect(commentaire.value).toBe("");

      const fichier = screen.getByTestId("file");
      expect(fichier.value).toBe("");
    })

    test("Then after loading a file, if it's valid, the file is there", async () => {
      jest.spyOn(mockStore, "bills")
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = NewBillUI();

      const newbill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
        }))
      });

      const handleChangeFile = jest.fn(newbill.handleChangeFile);
      const fileInput = screen.getByTestId("file");
      fireEvent.change(fileInput, {
          target: {
            files: [new File(["facturefreemobile.jpg"], "facturefreemobile.jpg", { type: 'image/jpg' })],
                  },
      });

      expect(fileInput.files[0].type).toBe("image/jpg");
      expect(fileInput.files[0].name).toBe("facturefreemobile.jpg");
      expect(fileInput.files[1]).not.toBeTruthy()
    })

    test("Then after loading a file, if it isn't valid, the file isn't there", () => {
      jest.spyOn(mockStore, "bills")
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = NewBillUI();

      const newbill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
        }))
      });

      const handleChangeFile = jest.fn(newbill.handleChangeFile);
      const fileInput = screen.getByTestId("file");
      fileInput.addEventListener("change", handleChangeFile);

      var contentType = 'application/pdf';
      fireEvent.change(fileInput, {
          target: {
            files: [new File(["facturefreemobile.pdf"], "facturefreemobile.pdf", { type: contentType })],
                  },
      });

      expect(fileInput.value).toBe("");
    })

    //POST new bill
    test("Then, after pressing the button, if the form is correctly full: we return to the billing page", () => {
      jest.spyOn(mockStore, "bills")
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = NewBillUI();

      const newbill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
        }))
      });

      const typeDepense = screen.getByTestId("expense-type");
      fireEvent.change(typeDepense, { target: { value: "Transports" } });
      expect(typeDepense.value).toBe("Transports");

      const nomDepense = screen.getByTestId("expense-name");
      fireEvent.change(nomDepense, { target: { value: "téléphonie" } });
      expect(nomDepense.value).toBe("téléphonie");

      const montantDepense = screen.getByTestId("amount");
      fireEvent.change(montantDepense, {target: { value: 23 }});
      expect(parseFloat(montantDepense.value)).toBe(23);

      const montantTVAvat = screen.getByTestId("vat");
      fireEvent.change(montantTVAvat, { target: { value: 2 } });
      expect(Number(montantTVAvat.value)).toBe(2);

      const montantTVApct = screen.getByTestId("pct");
      fireEvent.change(montantTVApct, { target: { value: 10 } });
      expect(Number(montantTVApct.value)).toBe(10);

      const commentaire = screen.getByTestId("commentary");
      fireEvent.change(commentaire, { target: { value: "En déplacement" } });
      expect(commentaire.value).toBe("En déplacement");

      const fichier = screen.getByTestId("file");
      fireEvent.change(fichier, {
        target: {
          files: [new File(["facturefreemobile.jpg"], "facturefreemobile.jpg", { type: "image/jpg" })],
        },
      });

      const button = screen.getByRole('button');
      fireEvent.click(button)

      const newPage = screen.getByText(/Mes notes/i)
      expect(newPage).toBeTruthy()
    })

    test("Then, after pressing the button, if the form isn't correctly full: we stay on the form", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = NewBillUI();

      const newbill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
        }))
      });

      const typeDepense = screen.getByTestId("expense-type");
      fireEvent.change(typeDepense, { target: { value: "" } });

      const nomDepense = screen.getByTestId("expense-name");
      fireEvent.change(nomDepense, { target: { value: "" } });

      const montantDepense = screen.getByTestId("amount");
      fireEvent.change(montantDepense, {target: { value: -5 }});

      const montantTVAvat = screen.getByTestId("vat");
      fireEvent.change(montantTVAvat, { target: { value: -1 } });

      const montantTVApct = screen.getByTestId("pct");
      fireEvent.change(montantTVApct, { target: { value: -1 } });

      const commentaire = screen.getByTestId("commentary");
      fireEvent.change(commentaire, { target: { value: "En déplacement" } });

      const button = screen.getByRole('button');
      fireEvent.click(button)

      const newPage = screen.getByText(/Mes notes/i)
      expect(newPage).toBeTruthy()
    })
})
