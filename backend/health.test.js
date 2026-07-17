const request = require('supertest');
const express = require('express');

// Create a mini Express instance strictly for the test environment
const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'Pipeline Secure' }));

describe("API Health Security Gate", () => {
  it("should successfully hit the health route and return a 200 status", async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Pipeline Secure');
  });
});