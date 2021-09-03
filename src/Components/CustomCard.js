import React, { Component } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import firebase from "firebase";

class CustomCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.data,
      edit: false,
      tempName: props.data.name,
      tempPrice: props.data.price,
      uploading: false,
    };

    const timeRef = new Date("August 30, 2020 00:00:00");
    const diffRef = timeRef.getTime();
    this.diffRef = diffRef;

    //Refs
    this.fileForm = React.createRef();

    //Binds
    this.toggleEdit = this.toggleEdit.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.autoPriceChange = this.autoPriceChange.bind(this);

    this.autoPriceChange();
  }

  toggleEdit() {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  }

  onFormChange(event) {
    const value = event.target.value;
    const name = event.target.id;

    this.setState({ [name]: value });
  }

  async submitEdit(event) {
    event.preventDefault();
    const { edit, tempName, tempPrice } = this.state;

    if (tempName !== this.state.item.name && tempName !== "") {
      const item = this.state.item;
      item.name = tempName;
      await this.setState({ item: item });
    }

    if (tempPrice !== this.state.item.price && tempPrice !== "") {
      const item = this.state.item;
      console.log("ITEM! ", item);
      const now = (Date.now() - this.diffRef).toString();
      console.log("price", item.priceHistory);
      item.priceHistory[now] = this.state.item.price;

      item.price = tempPrice;

      await this.setState({ item: item });
    }

    //Handle file upload
    if (this.fileForm.current.files[0]) {
      const file = this.fileForm.current.files[0];
      const photoRef = firebase.storage().ref("item_images/" + file.name);
      photoRef.put(file);

      let link;
      await photoRef.getDownloadURL().then((url) => {
        link = url;
      });

      const item = this.state.item;
      item.imageLink = link;
      await this.setState({ item: item });
    }

    const newItem = JSON.parse(JSON.stringify(this.state.item));
    this.props.handleItemChange(newItem);
    await this.setState({
      tempName: this.state.item.name,
      tempPrice: this.state.item.price,
      edit: !edit,
    });
  }

  autoPriceChange() {
    //Sets a new price within 5% of the last price, intended to be run once per hour per item in order to establish a price history to plot
    setInterval(async () => {
      const item = this.state.item;

      if (item.docID !== "additem") {
        const numPrice = parseFloat(this.state.item.price);
        const range = numPrice * 0.05;
        const newPrice =
          Math.floor(100 * (numPrice + Math.random() * 2 * range - range)) /
          100;

        const now = (Date.now() - this.diffRef).toString();
        item.priceHistory[now] = this.state.item.price;
        item.price = newPrice;

        await this.setState({ item: item });
        const newItem = JSON.parse(JSON.stringify(item));
        this.props.handleItemChange(newItem);
        await this.setState({
          tempName: this.state.item.name,
          tempPrice: this.state.item.price,
        });
      }
    }, 1800000);
  }

  render() {
    return (
      <Card
        className="card"
        key={this.state.item.docID}
        style={{ width: "18rem", margin: "1rem" }}
        bg="light"
        text="dark"
      >
        <Card.Body>
          <Card.Header>
            <Image
              style={{ maxHeight: 100, maxWidth: 100 }}
              src={this.state.item.imageLink}
              rounded={true}
            />
          </Card.Header>
          <Card.Title>
            {this.state.edit ? <></> : <h>{this.state.item.name}</h>}
          </Card.Title>
          <Card.Text>
            {this.state.edit ? <></> : <h>${this.state.item.price}</h>}
          </Card.Text>
          <div>
            {this.state.edit ? (
              <Form autoComplete="off" onSubmit={this.submitEdit}>
                <Form.Control
                  id="tempName"
                  type="text"
                  onFocus={(event) => {
                    event.target.select();
                  }}
                  value={this.state.tempName}
                  onChange={this.onFormChange}
                />
                <div style={{ flexDirection: "row" }}>
                  <p style={{ width: 10, display: "inline-block" }}>$</p>
                  <Form.Control
                    id="tempPrice"
                    type="text"
                    placeholder="0.00"
                    style={{ width: 100, margin: 20, display: "inline-block" }}
                    value={this.state.tempPrice}
                    onChange={this.onFormChange}
                  />
                </div>

                <div style={{ height: "1rem" }}></div>
                <label
                  className="form-control-file"
                  style={{ marginBottom: 10 }}
                >
                  Upload a photo of this item
                </label>
                <Form.File
                  ref={this.fileForm}
                  class="form-control-file"
                  onChange={() => this.setState({ uploading: true })}
                />
                <div style={{ height: "1rem" }}></div>
                <Button
                  type="button"
                  onClick={this.submitEdit}
                  variant="secondary"
                >
                  Save
                </Button>
              </Form>
            ) : (
              <></>
            )}
            <ToggleButton
              checked={this.state.edit}
              variant="primary"
              type="checkbox"
              onChange={this.toggleEdit}
            >
              {this.state.edit ? <h>Undo</h> : <h>Edit</h>}
            </ToggleButton>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default CustomCard;
