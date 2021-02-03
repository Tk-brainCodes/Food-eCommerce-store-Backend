const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("sk_test_51IGZ6EJWDBULoxk2uuMjRPuLbFPQElMNi3CQOmzEJidtfrNHx9FdckquwutTLyEYWQUOWsYLGaBACOQGQel7xbX900Wa9ONOEP");
const uuid = require("uuid");

const app = express(); //make express app

app.use(express.json()); //json middleware
app.use(cors()); //cors middleware

app.get("/", (req, res) => {
    res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
});

//make request to /checkout
app.post("/checkout", async (req, res) => {
    console.log("Request:", req.body); //receive request on body

    let errors;
    let status;

    try {

        const { product, token } = req.body;
       
        //create customer
        const customer = await stripe.customer.create({
            email: token.email,
            source: token.id
        });

        const idempotency_key = uuid();

        //create charge
        const charge = await stripe.charge.create({
            amount: getTotalSum * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchased ${cart.length} Products`,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        },
            {
                idempotency_key
            }
        );
        console.log("Charge:", { charge });
        status = "success";
    }
    catch (error) {
        console.error("Error:", error);
        status = "failure"
    }
    res.json({ errors, status });
});
let port = 8080;
app.listen(port, () => {
    console.log("Listening on port", port);
})