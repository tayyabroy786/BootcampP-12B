// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require("faunadb"),
  q = faunadb.query;
const handler = async (event) => {
  try {
    const reqObj = JSON.parse(event.body);
    let client = new faunadb.Client({
      secret: "fnAEEN83W5ACAYwSx_t6kWJ0KQendQiY0A9CRNcF",
    });

    const result = await client.query(
      q.Update(q.Ref(q.Collection("FirstCrud"), reqObj.id), {
        data: { title: reqObj.title },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
