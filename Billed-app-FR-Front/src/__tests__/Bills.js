/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from '@testing-library/user-event'

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    })

    test("Then the Bills array should appears", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      window.onNavigate(ROUTES_PATH.Bills)
      document.body.innerHTML = BillsUI({ data: bills })

      const tbody = screen.getByTestId('tbody')
      expect(tbody.hasChildNodes()).toBe(true);
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      
      expect(dates).toEqual(datesSorted)
    })

    test("Then I click on icon Eye, Then the bill's justificatif should appear", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      await waitFor(() => screen.queryAllByTestId('icon-eye'))
      const IconEye = screen.getAllByTestId("icon-eye")[1];
      $.fn.modal = jest.fn(() => modaleFile.classList.add("show"))
      const handleClick = jest.fn(IconEye.handleClick)
      IconEye.addEventListener('click', handleClick)
      userEvent.click(IconEye)

      expect(handleClick).toHaveBeenCalled()
    })

    test("Then I Click on newBill button, Then the form for new bill should appear", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      await waitFor(() => screen.queryAllByTestId('btn-new-bill'))
      const NewBillButton = screen.getAllByTestId("btn-new-bill")[0];
      const handleClick = jest.fn(NewBillButton.handleClick)
      NewBillButton.addEventListener('click', handleClick)
      userEvent.click(NewBillButton)

      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe("Error with API occurs", () => {
    test("Message error 404", async () => {

    })
  
    test("Message error 505", async () => {

    })
  })
})
