class Contact {
  constructor(contactJSON) {
    this.body = contactJSON.attributes
    this.id = contactJSON.id
  }

  renderShow() {
    return `
    <div class="card border-info mb-2 mt-5 shadow p-3 bg-white rounded" style="max-width: 24rem;">
      <div class="card-header bg-info text-light text-center"><h3>${this.body.first_name}</h3></div>
      <div class="card-body text-info">
        <p class="card-text text-dark">Last Name: ${this.body.last_name} </br>
        Email: ${this.body.email}</br>
        Phone number: ${this.body.phone_number}</p>
      </div>
      <div class="card-footer bg-transparent border-info text-center">
        <button data-action='contact-history' id="contact-history-button" class="btn btn-danger text-light">History edits </button>
      </div>
    </div>`
  }

  render() {
    return ` 
    <li data-contactid='${this.id}' data-props='${JSON.stringify(this)}' class="contact-element list-group-item list-group-item-light shadow p-3 bg-white rounded">
    <a class="show-link" href='#'>${ this.body.first_name}  ${this.body.last_name}</a> <i data-action='delete-contact' class="em em-x"></i>
      <button class="edit-button btn btn-info" data-action='edit-contact'>Edit</button> </li> `
  }
}