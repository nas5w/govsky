import { generateTree } from "./generateTree";

describe("generateTree", () => {
  test("generates an empty tree", () => {
    expect(generateTree([], [".gov", ".mil"])).toEqual([
      {
        children: [],
        id: 0,
        metadata: { displayName: null, childCount: 0 },
        name: "",
        parent: null,
      },
    ]);
  });

  test("generates a simple tree", () => {
    expect(
      generateTree(
        [
          {
            domain: ".gov",
            data: [{ did: "abc", handle: "test.gov", displayName: null }],
          },
          {
            domain: ".gov",
            data: [{ did: "def", handle: "1.test.gov", displayName: null }],
          },
          {
            domain: ".gov",
            data: [{ did: "ghi", handle: "2.test.gov", displayName: null }],
          },
        ],
        [".gov", ".mil"]
      )
    ).toEqual([
      {
        children: [1, 3, 5],
        id: 0,
        metadata: { displayName: null, childCount: 3 },
        name: "",
        parent: null,
      },
      {
        children: [2],
        id: 1,
        metadata: { displayName: null, handle: "test.gov", childCount: 1 },
        name: "test.gov",
        parent: 0,
      },
      {
        children: [],
        id: 2,
        metadata: { displayName: null, handle: "test.gov", childCount: 0 },
        name: " test.gov",
        parent: 1,
      },
      {
        children: [4],
        id: 3,
        metadata: { displayName: null, childCount: 1 },
        name: "test.gov",
        parent: 0,
      },
      {
        children: [],
        id: 4,
        metadata: { displayName: null, handle: "1.test.gov", childCount: 0 },
        name: "1.test.gov",
        parent: 3,
      },
      {
        children: [6],
        id: 5,
        metadata: { displayName: null, childCount: 1 },
        name: "test.gov",
        parent: 0,
      },
      {
        children: [],
        id: 6,
        metadata: { displayName: null, handle: "2.test.gov", childCount: 0 },
        name: "2.test.gov",
        parent: 5,
      },
    ]);
  });

  test("generates a multi-domain tree", () => {
    expect(
      generateTree(
        [
          {
            domain: ".gov",
            data: [{ did: "abc", handle: "test.gov", displayName: null }],
          },
          {
            domain: ".gov",
            data: [{ did: "def", handle: "1.test.gov", displayName: null }],
          },
          {
            domain: ".gov",
            data: [{ did: "ghi", handle: "2.test.gov", displayName: null }],
          },
          {
            domain: ".mil",
            data: [{ did: "jkl", handle: "thing.mil", displayName: null }],
          },
          {
            domain: ".mil",
            data: [{ did: "mno", handle: "thing2.mil", displayName: null }],
          },
          {
            domain: ".mil",
            data: [{ did: "pqr", handle: "1.thing.mil", displayName: null }],
          },
        ],
        [".gov", ".mil"]
      )
    ).toEqual([
      {
        children: [1, 3, 5, 7, 9, 11],
        id: 0,
        metadata: { displayName: null, childCount: 6 },
        name: "",
        parent: null,
      },
      {
        children: [2],
        id: 1,
        metadata: { displayName: null, handle: "test.gov", childCount: 1 },
        name: "test.gov",
        parent: 0,
      },
      {
        children: [],
        id: 2,
        metadata: { displayName: null, handle: "test.gov", childCount: 0 },
        name: " test.gov",
        parent: 1,
      },
      {
        children: [4],
        id: 3,
        metadata: { displayName: null, childCount: 1 },
        name: "test.gov",
        parent: 0,
      },
      {
        children: [],
        id: 4,
        metadata: { displayName: null, handle: "1.test.gov", childCount: 0 },
        name: "1.test.gov",
        parent: 3,
      },
      {
        children: [6],
        id: 5,
        metadata: { displayName: null, childCount: 1 },
        name: "test.gov",
        parent: 0,
      },
      {
        children: [],
        id: 6,
        metadata: { displayName: null, handle: "2.test.gov", childCount: 0 },
        name: "2.test.gov",
        parent: 5,
      },
      {
        children: [8],
        id: 7,
        metadata: { displayName: null, handle: "thing.mil", childCount: 1 },
        name: "thing.mil",
        parent: 0,
      },
      {
        children: [],
        id: 8,
        metadata: { displayName: null, handle: "thing.mil", childCount: 0 },
        name: " thing.mil",
        parent: 7,
      },
      {
        children: [10],
        id: 9,
        metadata: { displayName: null, handle: "thing2.mil", childCount: 1 },
        name: "thing2.mil",
        parent: 0,
      },
      {
        children: [],
        id: 10,
        metadata: { displayName: null, handle: "thing2.mil", childCount: 0 },
        name: " thing2.mil",
        parent: 9,
      },
      {
        children: [12],
        id: 11,
        metadata: { childCount: 1, displayName: null },
        name: "thing.mil",
        parent: 0,
      },
      {
        children: [],
        id: 12,
        metadata: { displayName: null, handle: "1.thing.mil", childCount: 0 },
        name: "1.thing.mil",
        parent: 11,
      },
    ]);
  });

  test("generates single, top-level domain tree", () => {
    expect(
      generateTree(
        [
          {
            domain: ".gov.je",
            data: [
              {
                displayName: "Government of Jersey",
                did: "did:plc:v2j2gtmmkgykrrfatiigrc36",
                handle: "gov.je",
              },
            ],
          },
        ],
        [".gov.je"]
      )
    ).toEqual([
      {
        children: [1],
        id: 0,
        metadata: { displayName: null, childCount: 1 },
        name: "",
        parent: null,
      },
      {
        id: 1,
        name: " gov.je",
        parent: 0,
        metadata: {
          displayName: "Government of Jersey",
          handle: "gov.je",
          childCount: 0,
        },
        children: [],
      },
    ]);
  });
});
