// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require("faunadb"),
  q = faunadb.query;
const handler = async (event) => {
  try {
    var client = new faunadb.Client({
      secret: "fnAEEN83W5ACAYwSx_t6kWJ0KQendQiY0A9CRNcF",
    });
    var result = await client.query(
      // q.Get(q.Ref(q.Collection("FirstCrud"), "287806439297122823"))
      q.Map(
        q.Paginate(q.Documents(q.Collection("FirstCrud"))),
        q.Lambda((x) => q.Get(x))
      )
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
