import React, { useState } from "react";
import { config } from "../firebase/config";

import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const Management = ({ show, setshow, firebase,query }) => {
  const [plants, setplants] = useState([]);
  const [date, setdate] = useState("");
  const [code, setcode] = useState("");
  const [detail, setdetail] = useState("");
  const handleClose = () => {
    setshow(false);
    cls();
  };
  React.useEffect(() => {
    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
    query_plants();
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
        });
      });
      // console.log(newQuery)
      setplants(newQuery);
    });

    // console.log(content)
  };
  const insert = () => {
    firebase.database().ref("/history").push({
      date: date,
      code: code,
      detail: detail,
      his_add : new Date(),
      status:true,
    });
    handleClose();
    query()
  };
  const handleSubmit = () => {
    date && code && detail ? insert() : console.log("false");
  };
  const cls = () => {
    setdate("");
    setcode("");
    setdetail("");
  };
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>เพิ่มข้อมูลแปลงปลูก</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <p>วันที่</p>{" "}
              <Form.Control
                type="date"
                onChange={({ target: { value } }) => {
                  setdate(value);
                  // console.log(date)
                }}
              />
            </Col>
            <Col>
              <p>พืช</p>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control
                  as="select"
                  onChange={({ target: { value } }) => {
                    setcode(value);
                  }}
                >
                  <option>เลือกพืช</option>
                  {plants &&
                    plants.map(({ id, name_th }) => (
                      <option key={id} value={id}>
                        {name_th}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <p>รายละเอียดการจัดการแปลงปลูก</p>

          <Form.Control
            type="textarea"
            as="textarea"
            rows={3}
            stype={{ format: "dd/mm/yyyy" }}
            format="dd/mm/yyyy"
            onChange={({ target: { value } }) => {
              setdetail(value);
              // console.log(detail)
            }}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Management;


