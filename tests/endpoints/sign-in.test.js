import { PrismaClient, Prisma } from '@prisma/client'
import request from "supertest"
import app from "../../app.js"

async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}

describe("POST /sign-in", () => {
  const auth = {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyMiwibmFtZSI6ImhlbGxvIiwiZW1haWwiOiJhMTBAYS5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCRycHNCVVdjYmFrSkFQUmJWd3ZjdHBPRG9lUXhVMzBaczFpTHo3MWx2NGxFUk5ObG1sSFE5YSJ9LCJpYXQiOjE2ODY3MjQwMjJ9.dXa0KK4N5N8glN2IgitsU8kq9nlk6AM_X0600vjOTYk"
  }

  beforeAll(async () => {
    await cleanupDatabase()

  })

  afterAll(async () => {
    await cleanupDatabase()
  })

  it("with valid data should return the access token", async () => {
    const response = await request(app)
        .post("/sign-in")
        .send(auth)
        .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyMiwibmFtZSI6ImhlbGxvIiwiZW1haWwiOiJhMTBAYS5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCRycHNCVVdjYmFrSkFQUmJWd3ZjdHBPRG9lUXhVMzBaczFpTHo3MWx2NGxFUk5ObG1sSFE5YSJ9LCJpYXQiOjE2ODY3MzA0NzJ9.2rVpK7FrK0YXCi5HtYQj7rfX8Wef3S2WcfabvDkmjlA");
  });
})