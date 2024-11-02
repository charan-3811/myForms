const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const uri=process.env.MONGO_URI
const app = express();
const PORT = process.env.PORT || 4000

const corsOptions = {
    origin: '*',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let users;
let forms;

//mongodb connection
async function connect() {
    try {
        const client = await MongoClient.connect(
            uri
        );
        const myDB = client.db("FORMS");
        users = myDB.collection("users");
        forms = myDB.collection('Forms');
        console.log("Connected to the database");
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

connect().then();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get("/",async (req,res)=>{
    res.send(`server running`)
})

//signup
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).send('Missing required fields');
            return;
        }

        const existingUser = await users.findOne({ email: email });

        if (existingUser) {
            res.status(409).send('User already exists');
            return;
        }

        const result = await users.insertOne({
            name: name,
            email: email,
            password: password,
        });

        if (result.acknowledged) {
            res.send('Added successfully');
        } else {
            res.status(500).send('Failed to add user');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            res.status(400).send('Missing required fields');
            return;
        }

        const existingUser = await users.findOne({ email: email });

        if (existingUser) {
            if (existingUser.password === password) {
                res.status(200).send('successful');
            } else {
                res.status(401).send('wrong details');
            }
        } else {
            res.status(404).send("User doesn't exist");
        }
    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
});

//all forms of a user
app.get("/forms/:user", async (req, res) => {
    try {
        const userEmail = req.params.user;
        const userForms = await forms.find({ email: userEmail }).toArray();

        if (userForms.length > 0) {
            res.status(200).send(userForms);
        } else {
            res.status(404).send("No forms found for this user");
        }
    } catch (e) {

        res.status(500).send("Internal Server Error");
    }
});

//newForm saving
app.post("/newForm", async (req, res) => {
    try {
        const { user, title, description, sections } = req.body;

        const newForm = {
            _id: new ObjectId(),
            email: user,
            title: title,
            description: description,
            sections: sections,
        };

        const response = await forms.insertOne(newForm);

        if (response.acknowledged) {
            res.status(200).send(response.insertedId);
        } else {
            res.status(500).send("Failed to add form");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

//get the form
app.get("/form/:id", async (req, res) => {
    try {
        const { id} = req.params;
        console.log(id)
        const form = await forms.findOne({ _id: new ObjectId(id)});

        if (form) {
            res.status(200).send(form);
            console.log(form)
        } else {
            res.status(404).send("Form not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

//save the responses for a form


app.post("/form/:id/response", async (req, res) => {
    try {
        const { id } = req.params;
        const { responses, email } = req.body; // Expecting an array of responses and user email

        const form = await forms.findOne({ _id: new ObjectId(id) });

        if (!form) {
            res.status(404).send("Form not found");
            return;
        }

        // Create a new response object to be pushed into the form
        const newResponse = {
            email: email,
            answers: responses
        };

        const updateResponse = await forms.updateOne(
            { _id: new ObjectId(id) },
            { $push: { responses: newResponse } }
        );

        if (updateResponse.modifiedCount > 0) {
            res.status(200).send("Response submitted successfully");
        } else {
            res.status(500).send("Failed to submit response");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

//delete the form


app.delete(`/deleteForm/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const response = await forms.deleteOne({ _id: new ObjectId(id) });
        console.log(response)
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Form deleted successfully" });
        } else {
            res.status(404).json({ error: "Form not found" });
        }
    } catch (error) {
        console.error("Error deleting form:", error);
        res.status(500).json({ error: "Failed to delete form" });
    }
});



//update the form

app.post("/updateForm", async (req, res) => {
    try {
        console.log(req.body)
        const response = await forms.findOneAndUpdate(
            { _id: new ObjectId(req.body.id) },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    sections: req.body.sections
                }
            },
            { new: true }
        );

        if (response) {
            res.status(200).json({ message: 'Form updated successfully', updatedForm: response });
        } else {
            res.status(404).json({ message: 'Form not found' });
        }
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
