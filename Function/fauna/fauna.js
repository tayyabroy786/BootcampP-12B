// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require("faunadb"),
  q = faunadb.query;
const handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    let reqObj = JSON.parse(event.body);
    // const subject = event.queryStringParameters.name || "Nikal";
    let client = new faunadb.Client({
      secret: "fnAEEN83W5ACAYwSx_t6kWJ0KQendQiY0A9CRNcF",
    });
    let result = await client.query(
      // q.Get(q.Ref(q.Collection("FirstCrud"), "287806439297122823"))
      q.Create(q.Collection("FirstCrud"), { data: { title: reqObj.title } })
    );
    console.log("Entry Created and Inserted in Container: " + result.ref.id);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `${result.ref.id}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
// fnAD_y6preACAaDQnx2pN5-atCam10WZVEeSiUah
