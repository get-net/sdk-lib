function example(name:string):string {
    return `Hello ${name}`
}

test("example test", () => {
    expect(example("Oleg")).toBe("Hello Oleg")
})