const { renderStructuredTemplatePdf } = require("../../src/forms/generic/renderStructuredTemplatePdf");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const render = (submission) => {
  const { doc, texts } = createMockDoc();
  renderStructuredTemplatePdf(doc, submission);
  return { doc, texts };
};

describe("renderStructuredTemplatePdf", () => {
  test("renders without throwing when submission is {}", () => {
    expect(() => render({})).not.toThrow();
  });

  test("renders when template.fields is an empty array", () => {
    expect(() => render({ template: { fields: [] } })).not.toThrow();
  });

  test("renders text, textarea, date and number field values", () => {
    const submission = {
      template: {
        title: "Sample Form",
        fields: [
          { name: "name", label: "Full Name", type: "text" },
          { name: "bio", label: "Biography", type: "textarea" },
          { name: "birthday", label: "Birthday", type: "date" },
          { name: "age", label: "Age", type: "number" },
        ],
      },
      responses: {
        name: "Alice",
        bio: "Loves hiking",
        birthday: "2025-04-01T00:00:00.000Z",
        age: 30,
      },
    };

    const { doc } = render(submission);

    expect(hasText(doc, "Full Name:")).toBe(true);
    expect(hasText(doc, "Alice")).toBe(true);
    expect(hasText(doc, "Biography:")).toBe(true);
    expect(hasText(doc, "Loves hiking")).toBe(true);
    expect(hasText(doc, "Birthday:")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "Age:")).toBe(true);
    expect(hasText(doc, "30")).toBe(true);
  });

  test("renders '-' for empty field values", () => {
    const submission = {
      template: {
        fields: [
          { name: "nickname", label: "Nickname", type: "text" },
          { name: "emptyDate", label: "Empty Date", type: "date" },
        ],
      },
      responses: {},
    };

    const { doc } = render(submission);
    const text = getAllText(doc);

    expect(text).toContain("Nickname:\n -");
    expect(text).toContain("Empty Date:\n -");
  });

  test("renders radio and dropdown string values", () => {
    const submission = {
      template: {
        fields: [
          { name: "gender", label: "Gender", type: "radio" },
          { name: "course", label: "Course", type: "dropdown" },
        ],
      },
      responses: { gender: "Female", course: "B.Tech" },
    };

    const { doc } = render(submission);
    const text = getAllText(doc);

    expect(text).toContain("Gender:\n Female");
    expect(text).toContain("Course:\n B.Tech");
  });

  test("joins array response values with a comma", () => {
    const submission = {
      template: {
        fields: [{ name: "hobbies", label: "Hobbies", type: "text" }],
      },
      responses: { hobbies: ["a", "b"] },
    };

    const { doc } = render(submission);

    expect(hasText(doc, "Hobbies:")).toBe(true);
    expect(getAllText(doc)).toContain("Hobbies:\n a, b");
  });

  test("flattens object response values into a space-joined string", () => {
    const submission = {
      template: {
        fields: [{ name: "address", label: "Address", type: "text" }],
      },
      responses: { address: { street: "Main St", city: "Patna" } },
    };

    const { doc } = render(submission);

    expect(hasText(doc, "Address:")).toBe(true);
    expect(getAllText(doc)).toContain("Address:\n Main St Patna");
  });

  test("renders section headings and does not repeat them for consecutive fields in the same section", () => {
    const submission = {
      template: {
        fields: [
          { name: "a", label: "A", type: "text", section: "Personal" },
          { name: "b", label: "B", type: "text", section: "Personal" },
          { name: "c", label: "C", type: "text", section: "Education" },
          { name: "d", label: "D", type: "text", section: "Education" },
        ],
      },
      responses: { a: "1", b: "2", c: "3", d: "4" },
    };

    const { doc } = render(submission);
    const text = getAllText(doc);

    expect(text.includes("Personal")).toBe(true);
    expect(text.includes("Education")).toBe(true);
    expect(text.split("Personal").length - 1).toBe(1);
    expect(text.split("Education").length - 1).toBe(1);
  });

  test("table field renders header labels and row cell values", () => {
    const submission = {
      template: {
        fields: [
          {
            name: "subjects",
            label: "Subjects",
            type: "table",
            columns: [
              { name: "subject", label: "Subject", type: "text" },
              { name: "marks", label: "Marks", type: "number" },
            ],
          },
        ],
      },
      responses: {
        subjects: [
          { subject: "Maths", marks: 90 },
          { subject: "Physics", marks: 85 },
        ],
      },
    };

    const { doc } = render(submission);

    expect(hasText(doc, "Subject")).toBe(true);
    expect(hasText(doc, "Marks")).toBe(true);
    expect(hasText(doc, "Maths")).toBe(true);
    expect(hasText(doc, "90")).toBe(true);
    expect(hasText(doc, "Physics")).toBe(true);
    expect(hasText(doc, "85")).toBe(true);
  });

  test("table field with empty rows still draws the header without crashing", () => {
    const submission = {
      template: {
        fields: [
          {
            name: "items",
            label: "Items",
            type: "table",
            columns: [{ name: "item", label: "Item", type: "text" }],
          },
        ],
      },
      responses: { items: [] },
    };

    expect(() => render(submission)).not.toThrow();
    const { doc } = render(submission);
    expect(hasText(doc, "Item")).toBe(true);
  });

  test("table field with empty columns array does not crash", () => {
    const submission = {
      template: {
        fields: [{ name: "items", label: "Items", type: "table", columns: [] }],
      },
      responses: { items: [{ item: "x" }] },
    };

    expect(() => render(submission)).not.toThrow();
  });

  test("renders title, description, submitted by, submitted at and status lines", () => {
    const submission = {
      template: {
        title: "Hostel Application",
        description: "For the academic year",
        fields: [{ name: "q", label: "Q", type: "text" }],
      },
      submittedBy: { name: "Ravi Kumar" },
      createdAt: "2025-04-01T10:30:00.000Z",
      status: "Approved",
      responses: { q: "yes" },
    };

    const { doc } = render(submission);

    expect(hasText(doc, "Hostel Application")).toBe(true);
    expect(hasText(doc, "For the academic year")).toBe(true);
    expect(hasText(doc, "Submitted by: Ravi Kumar")).toBe(true);
    expect(hasText(doc, "Submitted at:")).toBe(true);
    expect(hasText(doc, "Status: Approved")).toBe(true);
  });

  test("supports Map-based responses", () => {
    const submission = {
      template: {
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "age", label: "Age", type: "number" },
        ],
      },
      responses: new Map([
        ["name", "Bob"],
        ["age", 42],
      ]),
    };

    const { doc } = render(submission);
    const text = getAllText(doc);

    expect(text).toContain("Name:\n Bob");
    expect(text).toContain("Age:\n 42");
  });

  test("never renders undefined, null or NaN text", () => {
    const submission = {
      template: {
        title: "Edge Cases",
        fields: [
          { name: "missing", label: "Missing", type: "text" },
          { name: "weirdDate", label: "Weird Date", type: "date" },
        ],
      },
      responses: { weirdDate: "not-a-date" },
    };

    const { doc } = render(submission);
    const text = getAllText(doc);

    expect(text).not.toContain("undefined");
    expect(text).not.toContain("null");
    expect(text).not.toContain("NaN");
  });
});
