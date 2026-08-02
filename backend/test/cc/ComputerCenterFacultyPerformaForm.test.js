const { renderComputerCenterFacultyPerformaPdf } = require("../../src/forms/cc/ComputerCenterFacultyPerformaForm");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

describe("ComputerCenterFacultyPerformaForm", () => {
  it("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterFacultyPerformaPdf(doc, { responses: {} })).not.toThrow();
  });

  it("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterFacultyPerformaPdf(doc, { responses: undefined })).not.toThrow();
  });

  it("renders without throwing when submission itself is missing", () => {
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterFacultyPerformaPdf(doc, {})).not.toThrow();
  });

  it("renders the form title and header text", () => {
    const { doc } = createMockDoc();
    renderComputerCenterFacultyPerformaPdf(doc, { responses: {} });
    expect(hasText(doc, "Performa for Faculty Home Page")).toBe(true);
    expect(hasText(doc, "Photograph / send through email")).toBe(true);
  });

  it("renders all user-facing response fields", () => {
    const responses = {
      name: "Dr. Shresth Kumar",
      designation: "Assistant Professor",
      department: "Computer Science and Engineering",
      phoneOffice: "+91 612 302 8000",
      iitpEmailId: "skumar@iitp.ac.in",
      personalWebpage: "https://home.iitp.ac.in/~skumar",
      researchAreas: "Machine Learning, Computer Vision",
      otherInterests: "Chess, Photography",
      coursesTaught: "CS303 Algorithms, CS101 Programming",
      noOfPhDStudents: "5",
      professionalExperience: "8 years of teaching and research",
      awardsHonours: "Best Paper Award 2023",
      memberOfProfessionalBodies: "IEEE, ACM",
      books: "Introduction to Machine Learning",
      publications: "25 research papers",
      presentations: "10 invited talks",
    };
    const { doc } = createMockDoc();
    renderComputerCenterFacultyPerformaPdf(doc, { responses });

    for (const value of Object.values(responses)) {
      expect(hasText(doc, value)).toBe(true);
    }
  });

  it("renders highest academic qualification rows from a JSON string", () => {
    const responses = {
      highestAcademicQualification: JSON.stringify([
        { degree: "Ph.D.", subject: "Computer Science", university: "IIT Delhi", year: "2018" },
        { degree: "M.Tech", subject: "AI", university: "IIT Kanpur", year: "2012" },
      ]),
    };
    const { doc } = createMockDoc();
    renderComputerCenterFacultyPerformaPdf(doc, { responses });

    expect(hasText(doc, "Highest Academic")).toBe(true);
    expect(hasText(doc, "Qualification")).toBe(true);
    expect(hasText(doc, "Degree")).toBe(true);
    expect(hasText(doc, "Subject")).toBe(true);
    expect(hasText(doc, "University Institute")).toBe(true);
    expect(hasText(doc, "Year")).toBe(true);
    expect(hasText(doc, "Ph.D.")).toBe(true);
    expect(hasText(doc, "IIT Delhi")).toBe(true);
    expect(hasText(doc, "2018")).toBe(true);
    expect(hasText(doc, "IIT Kanpur")).toBe(true);
  });

  it("handles a malformed highestAcademicQualification JSON string without crashing", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterFacultyPerformaPdf(doc, {
        responses: { highestAcademicQualification: "not-json{{{" },
      })
    ).not.toThrow();
  });

  it("renders date-like values without crashing and keeps the raw ISO string", () => {
    const responses = {
      phoneOffice: "2025-04-01T00:00:00.000Z",
      designation: "2025-04-01T00:00:00.000Z",
    };
    const { doc } = createMockDoc();
    renderComputerCenterFacultyPerformaPdf(doc, { responses });

    expect(hasText(doc, "2025-04-01T00:00:00.000Z")).toBe(true);
  });

  it("does not crash with invalid or empty date values", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterFacultyPerformaPdf(doc, {
        responses: {
          phoneOffice: "not-a-date",
          iitpEmailId: "2025-13-45T99:99:99.000Z",
          designation: "",
        },
      })
    ).not.toThrow();
  });

  it("supports a Map-based responses object", () => {
    const responses = new Map([
      ["name", "Dr. Map User"],
      ["designation", "Professor"],
      ["department", "Electrical Engineering"],
      ["phoneOffice", "0612-302-0000"],
      ["iitpEmailId", "mapuser@iitp.ac.in"],
      ["personalWebpage", "https://home.iitp.ac.in/~mapuser"],
      ["researchAreas", "Signal Processing"],
      ["otherInterests", "Music"],
      ["coursesTaught", "EE201 Circuits"],
      ["noOfPhDStudents", "3"],
      ["professionalExperience", "12 years"],
      ["awardsHonours", "IEEE Fellow"],
      ["memberOfProfessionalBodies", "IEEE"],
      ["books", "Digital Signal Processing"],
      ["publications", "40 papers"],
      ["presentations", "5 talks"],
    ]);
    const { doc } = createMockDoc();
    renderComputerCenterFacultyPerformaPdf(doc, { responses });

    expect(hasText(doc, "Dr. Map User")).toBe(true);
    expect(hasText(doc, "Professor")).toBe(true);
    expect(hasText(doc, "mapuser@iitp.ac.in")).toBe(true);
    expect(hasText(doc, "40 papers")).toBe(true);
  });

  it("defaults missing fields to empty strings without 'undefined' text", () => {
    const { doc } = createMockDoc();
    renderComputerCenterFacultyPerformaPdf(doc, { responses: {} });

    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
  });

  it("renders without throwing when a photo buffer is provided", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterFacultyPerformaPdf(doc, {
        responses: { name: "Photo Owner" },
        photo: { data: Buffer.from([0xff, 0xd8, 0xff, 0xe0]), contentType: "image/jpeg" },
      })
    ).not.toThrow();
  });

  it("renders without throwing when photo data is empty", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterFacultyPerformaPdf(doc, {
        responses: {},
        photo: { data: Buffer.alloc(0), contentType: "image/jpeg" },
      })
    ).not.toThrow();
  });
});
