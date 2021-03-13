import React, { useState, useEffect } from "react";
import "../style/AllTask.css";
import { Form, Formik, Field, ErrorMessage } from "formik";
import Layout from "../component/Layout";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Button, Grid } from "@material-ui/core";
import * as Yup from "yup";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 200,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
export default function Home() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [mydata, setData] = useState("Default Hello ");
  const [taskAll, setTaskall] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const [startUseffect, setUseEffect] = useState();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await readData();

      setTaskall(data);
      setUseEffect(false);
    };
    fetchData();
  }, [startUseffect]);

  const readData = async () => {
    return await fetch(`/.netlify/functions/taskall`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
  };
  console.log(mydata);
  const deleteTask = async (id) => {
    console.log(id);
    await fetch(`/.netlify/functions/deletetask`, {
      method: "DELETE",
      body: JSON.stringify(id),
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => `error here : ${error}`);
  };
  const updateTask = async (title, id) => {
    console.log(title);
    await fetch(`/.netlify/functions/updatetodo`, {
      method: "PUT",
      body: JSON.stringify({ id, title }),
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Formik
        initialValues={{ title: "" }}
        onSubmit={(values) => {
          updateTask(values.title, updateId);
          setUseEffect(true);
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Required"),
        })}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <Field
              as={TextField}
              variant="outlined"
              name="title"
              label="update Todo"
            />
            <ErrorMessage name="title" />
            <div style={{ marginTop: "20px" }}>
              <Button type="submit" color="secondary" variant="outlined">
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
  return (
    <div className="Main">
      <Layout>
        <h2>Serverless Crud App</h2>
        <Formik
          initialValues={{ title: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.title = "Required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            fetch(`/.netlify/functions/fauna`, {
              method: "post",
              body: JSON.stringify(values),
            })
              .then((response) => response.json())
              .then((data) => {
                setData(data);
                console.log("Data: " + JSON.stringify(data));
              });
            setUseEffect(true);
          }}
        >
          {({
            errors,
            touched,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Field
                as={TextField}
                color="primary"
                name="title"
                label="Create Task"
                variant="outlined"
              />

              <br />
              <br />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={{ padding: "10px" }}
              >
                Add
              </Button>
              {errors.title && touched.title && errors.title}
            </form>
          )}
        </Formik>
        <div>
          {taskAll.map((task, i) => {
            return (
              <div className="MaintaskList" key={i}>
                <Grid container spacing={2}>
                  <Grid item>
                    <p>{task.data.title}</p>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <button
                      onClick={async () => {
                        deleteTask(task.ref["@ref"].id);
                        setUseEffect(true);
                      }}
                      className="dltButton"
                    >
                      Delete
                    </button>

                    <button
                      className="updButton"
                      onClick={() => {
                        handleOpen();
                        setUpdateId(task.ref["@ref"].id);
                      }}
                    >
                      Update
                    </button>
                  </Grid>
                </Grid>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  {body}
                </Modal>
              </div>
            );
          })}
        </div>
      </Layout>
    </div>
  );
}
