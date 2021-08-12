import React from "react";
import axios from "axios";

import { render, cleanup, getByText, waitForElement, fireEvent, prettyDOM, getAllByTestId, getByPlaceholderText, getByAltText, waitForElementToBeRemoved, queryByText, getByDisplayValue } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
      
    fireEvent.click(getByText("Tuesday"));
       
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
      
  });

  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), { target: { value: "Lydia Miller-Jones"}});
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving..."));

    expect(getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  })

  it("loads data, cancels an interview, and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Confirm that the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the first appointment.
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments.find(id => queryByText(id, "Archie Cohen"));
    
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check the Confirm screen rendered by searching for text "Delete the appointment?"
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();
    
    // 5. Click the "Confirm" button
    fireEvent.click(getByText(appointment, "Confirm"))
    
    // 6. Check that the element with text "Deleting" is displayed
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();
    
    // 7. Check that the element with the "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"))
    
    // 8. Check that the DayListItem with the text "Monday" has the text "2 spots remaining"
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Confirm that the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the first appointment.
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments.find(id => queryByText(id, "Archie Cohen"));
    
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check the Edit form screen rendered by searching for Save button
    expect(getByText(appointment, "Save")).toBeInTheDocument();

    // 5. Confirm input text "Archie Cohen" is displayed.
    expect(getByDisplayValue(appointment, "Archie Cohen"));

    // 6. Confirm interviewer "Tori Malcolm" is displayed
    expect(getByText(appointment, "Tori Malcolm"));

    // 7. Confirm that new input text "Ryan Reynolds"
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), { target: { value: "Ryan Reynolds"}});

    // 8. Confirm new interviewer is chosen
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 9. Click the "Save" button
    fireEvent.click(getByText(appointment, "Save"))

    // 10. Confirm the status mode is diplayed by searching for text "Saving"
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 11. Wait for the "Saving" message to be removed
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving..."));
    
    // 12. Check that the updated student "Ryan Reynolds" text is displayed    
    expect(getByText(appointment, "Ryan Reynolds"));

    // 13. Check that the DayListItem with the text "Monday" has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    
  })
  
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointments = getAllByTestId(container, "appointment");
    
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), { target: { value: "Lydia Miller-Jones"}});
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving..."));

    expect(getByText(appointment, "Could not save appointment")).toBeInTheDocument();
    
    fireEvent.click(getByAltText(appointment, "Close"));

    getByAltText(appointment, "Add");
    
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Confirm that the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the first appointment.
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments.find(id => queryByText(id, "Archie Cohen"));
    
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check the Confirm screen rendered by searching for text "Delete the appointment?"
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();
    
    // 5. Click the "Confirm" button
    fireEvent.click(getByText(appointment, "Confirm"))
    
    // 6. Check that the element with text "Deleting" is displayed
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting..."));

    expect(getByText(appointment, "Could not delete appointment")).toBeInTheDocument();
    
    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByText(appointment, "Archie Cohen"));

    // 13. Check that the DayListItem with the text "Monday" has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

    console.log(prettyDOM(appointment))
  })
    
})
    

