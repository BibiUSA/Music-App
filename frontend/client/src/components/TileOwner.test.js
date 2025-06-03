import { it, describe, expect } from "vitest";

import TileOwner from "./TileOwner";

describe("postTimeTwo", () => {
  it("should return a string", () => {
    const TileOwnerData = { created_date: "2025-05-20T23:58:59.900Z" };
    const result = postTimeTwo();
    expect(result).toBeTypeOf("string");
  });
});
