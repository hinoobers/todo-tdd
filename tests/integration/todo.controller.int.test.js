const request = require('supertest');
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpoint = "/todos/";
let firstTodo, newTodoId;
const testData = {
    title: "Make integration test for PUT",
    done: true
};
const notExistingTodoId = "5f1216dd46a9c73dd932be26";

describe(endpoint, () => {
    it("POST " + endpoint, async () => {
        const response = await request(app)
            .post(endpoint)
            .send(newTodo);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
        newTodoId = response.body._id;
    });
    it("should return error 500 on malformed data with POST" + endpoint, async() => {
        const response = await request(app).post(endpoint).send({title: "Missing done property"});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message: "Todo validation failed: done: Path `done` is required."
        })
    })
    test("GET " + endpoint, async () => {
        const response = await request(app).get(endpoint);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    });
    test("GET by ID " + endpoint + ":todoId", async () => {
        const response = await request(app).get(endpoint + firstTodo._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    });
    test("GET todoby id doesn't exist" + endpoint + ":todoId", async () => {
        const response = await request(app).get(endpoint + notExistingTodoId);
        expect(response.statusCode).toBe(404);
    });
    it("PUT " + endpoint, async () => {
        const response = await request(app).put(endpoint + firstTodo._id).send(testData);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });
    it("should return 404 on PUT " + endpoint, async () => {
        const res = await request(app).put(endpoint + notExistingTodoId).send(testData);
        expect(res.statusCode).toBe(404);
    });
    it("HTTP DELETE", async () => {
        const res = await request(app).delete(endpoint + newTodoId).send();
        expect(res.statusCode).toBe(200)
        expect(res.body.title).toBe(testData.title)
        expect(res.body.done).toBe(testData.done)
    })
    test("HTTP delete 404", async () =>{
        const res = await request(app).delete(endpoint + notExistingTodoId).send();
        expect(res.statusCode).toBe(404);
    }, 60000)
});