const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require('dotenv').config()
const user = require("./routes/user");
const checklist = require("./routes/checklist");
const order = require("./routes/order");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

console.log(process.env.PORT);
// PORT
const PORT = process.env.PORT || 4000;


const swaggerOptions = {
  swaggerDefinition: {
  openapi: "3.0.0",
  info: {
    title: "Assignment",
    version: "1.0.0",
    description: "Procurement System",
  },
  servers: [
    {
      url: "http://localhost:4000",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "apiKey",
        name: "token",
        scheme: "bearer",
        in: "header",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
},
apis: ["index.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/**
 * @swagger
 * /user/login:
 *   post:
 *     parameters:
 *      - in: body
 *        name: catchphrase
 *        description: New catchphrase
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: Login Succesfully
 */


// Routes
/**
 * @swagger
 * /user/profile:
 *  get:
 *    security:              # <--- ADD THIS
 *      - bearerAuth: []     # <--- ADD THIS
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */

// Routes
/**
 * @swagger
 * /user/list:
 *  get:
 *    security:              # <--- ADD THIS
 *      - bearerAuth: []     # <--- ADD THIS
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */



/**
 * @swagger
 * /user/edit/{id}:
 *   put:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The User ID.
 *      - in: body
 *        name: ttttttttttttttt
 *        description: Update user
 *        schema:
 *          type: object
 *          properties:
 *            role:
 *              type: number
 *     responses:
 *       201:
 *         description: Created
 */


// Routes
/**
 * @swagger
 * /checklist/list:
 *  get:
 *    security:              # <--- ADD THIS
 *      - bearerAuth: []     # <--- ADD THIS
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /checklist/{id}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The catchphrase ID.
 *     description: Get a catchphrase by id
 *     responses:
 *       200:
 *         description: Returns the requested catachphrase
 */

/**
 * @swagger
 * /checklist/{id}:
 *   put:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The User ID.
 *      - in: body
 *        name: ttttttttttttttt
 *        description: Update user
 *        schema:
 *          type: object
 *          properties:
 *            role:
 *              type: number
 *     responses:
 *       201:
 *         description: Created
 */

// Routes
/**
 * @swagger
 * /order/list:
 *  get:
 *    security:              # <--- ADD THIS
 *      - bearerAuth: []     # <--- ADD THIS
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The catchphrase ID.
 *     description: Get a catchphrase by id
 *     responses:
 *       200:
 *         description: Returns the requested catachphrase
 */

/**
 * @swagger
 * /order/{id}:
 *   put:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The User ID.
 *      - in: body
 *        name: ttttttttttttttt
 *        description: Update user
 *        schema:
 *          type: object
 *          properties:
 *            role:
 *              type: number
 *     responses:
 *       201:
 *         description: Created
 */


// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */

app.use("/user", user);
app.use("/checklist", checklist);
app.use("/order", order);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
