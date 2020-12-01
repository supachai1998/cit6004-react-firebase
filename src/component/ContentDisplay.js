import React, { useState, useDispatch } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import moment from "moment";
import { config } from "../firebase/config";

const ContentDisplay = ({
  content,
  firebase,
  query,
  displayAll,
  setcontent,

}) => {
  const [edit_date, setedit_date] = useState(content.date);
  const [edit_code, setedit_code] = useState(content.code);
  const [edit_name, setedit_name] = useState(content.name);
  const [edit_detail, setedit_detail] = useState(content.detail);
  const [plants, setplants] = useState([]);
  const [show, setShow] = useState(false);
  const [option, setoption] = useState(null);


  React.useEffect(async () => {
    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
    query_plants();
    setcontent([])
    query()
  }, []);
  const query_plants = () => {
    const userRef = firebase.database().ref("plants");
    let newQuery = [];
    userRef.on("value", (snapshot) => {
      snapshot.forEach((data) => {
        const dataVal = data.val();
        newQuery.push({
          id: data.key,
          name_th: dataVal.name_th,
          his_qry : new Date()
        });
      });
      // console.log(newQuery)
      setplants(newQuery);
    });

    // console.log(content)
  };
  const handleSubmit = (id) =>edit_date && edit_detail && edit_code ? update(id) : console.log("false");

  const update = (id) => {
    firebase
      .database()
      .ref("history")
      .child(id)
      .update({
        code: edit_code,
        date: edit_date,
        detail: edit_detail,
        his_update : new Date()
      })
      .then(() => {
        setoption(null);
        
      })
  };
  const handleDel = (key,status) => {
    key
      ? firebase
          .database()
          .ref("history")
          .child(key)
          .update({
            status: status,
            his_update : new Date()
          })
          .then(() => {
            setShow(false)
          })
      : console.log("false");
  };
  return (
    <>
      {content.status || displayAll  ? (
        <tr>
          <td>
            {!option ? (
              moment(edit_date).format("DD-MM-YYYY")
            ) : (
              <Form.Control
                type="date"
                defaultValue={edit_date}
                onChange={({ target: { value } }) => {
                  setedit_date(value);
                }}
              />
            )}
          </td>
          <td>
            {!option ? (
              edit_code
            ) : (
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control
                  as="select"
                  onChange={({ target: { value } }) => {
                    setedit_code(value);
                  }}
                >
                  {plants &&
                    plants.map(({ id, name_th }) =>
                      edit_code == id ? (
                        <option selected key={id} defaultValue={id}>
                          {name_th}
                        </option>
                      ) : (
                        <option key={id} value={id}>
                          {name_th}
                        </option>
                      )
                    )}
                </Form.Control>
              </Form.Group>
            )}
          </td>
          <td>{edit_name}</td>
          <td className="w-25">
            {!option ? (
              edit_detail
            ) : (
              <Form.Control
                type="textarea"
                as="textarea"
                rows={4}
                stype={{ format: "dd/mm/yyyy" }}
                defaultValue={edit_detail}
                format="dd/mm/yyyy"
                onChange={({ target: { value } }) => {
                  setedit_detail(value);
                }}
              />
            )}
          </td>
          <td className="align-items-center justify-content-center">
            {!option ? (
              <>
                <Button className="btn-warning" onClick={() => setoption(true)}>
                  edit
                </Button>
                {content.status ? <Button
                  className="btn-danger"
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  delete
                </Button> : 
                <Button
                  className="btn-info"
                  onClick={() => {
                    handleDel(content.id,true);
                  }}
                >
                  undo
                </Button>
              }
              </>
            ) : (
              <>
                <Button
                  className="btn-success"
                  onClick={() => {
                    handleSubmit(content.id);
                  }}
                >
                  Save
                </Button>
                <Button className="btn-danger" disabled>
                  delete
                </Button>
              </>
            )}
          </td>

          {question(
            edit_date,
            edit_name,
            edit_code,
            handleDel,
            content.id,
            show,
            setShow
          )}
        </tr>
      ) : (
        <></>
      )}
    </>
  );
};

export default ContentDisplay;

const question = (
  edit_date,
  edit_name,
  edit_code,
  handleDel,
  id,
  show,
  setShow
) => {
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>
            {moment(edit_date).format("DD-MM-YYYY")} , {edit_name}({edit_code}){" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณต้องการจะลบใช่หรือไม่</Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            ไม่ใช่
          </Button>
          <Button variant="danger" onClick={() => handleDel(id,false)}>
            ใช่
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
