class Contact {
  constructor(contactJSON) {
    this.body = contactJSON.attributes
    this.id = contactJSON.id
  }

  renderShow() {
    return `<h3>${this.body.first_name}</h3>
            <h5>Last Name: ${this.body.last_name}</h5>
            <h5>Email: ${this.body.email}</h5>
            <h5>Phone number:: ${this.body.phone_number}</h5>

    
    `
  }

  render() {
    return `<li data-contactid='${this.id}' data-props='${JSON.stringify(
      this
    )}' class='contact-element'><a class="show-link" href='#''>${
      this.body.first_name
    }</a> <button data-action='edit-contact'>Edit</button> <i data-action='delete-contact' class="em em-scream_cat"></i></li>`
  }
}