class Contacts {
  constructor() {
    this.contacts = []
    this.initBindingsAndEventListeners()
    this.adapter = new ContactsAdapter()
    this.fetchAndLoadContacts()
    this.currentActiveContact = {}
  }

  initBindingsAndEventListeners() {
    this.contactsForm = document.getElementById('new-contact-form')
    this.contactFirstName = document.getElementById('new-contact-first-name')
    this.contactLastName = document.getElementById('new-contact-last-name')
    this.contactEmail = document.getElementById('new-contact-email')
    this.contactPhoneNumber = document.getElementById('new-contact-phone-number')
    this.contactSubmit = document.getElementById('submit')
    this.contactsNode = document.getElementById('contacts-container')
    this.contactsForm.addEventListener('submit',this.handleSubmitForm.bind(this))
    this.contactsNode.addEventListener('click',this.handleEventContact.bind(this))
    this.contactDetails = document.getElementById("contact-details")
    this.contactEdits = document.getElementById("contact-history")
    this.errorUpdateMessage = document.querySelector(".error_update_message")
  }

  fetchAndLoadContacts() {
    this.adapter.getContacts()
    .then( contactsJSON => contactsJSON["data"].forEach( contact => this.contacts.push( new Contact(contact) )))
      .then( this.showContactList.bind(this) )
      .catch( (error) => console.log(error) )
  }

  handleSubmitForm() {
    event.preventDefault()
    if (this.contactSubmit.value === "Save contact") {     
      const body = {"first_name": this.contactFirstName.value, "last_name": this.contactLastName.value,
      "email": this.contactEmail.value, "phone_number": this.contactPhoneNumber.value}
        this.adapter.createContact(body)
        .then( ({data}) => this.contacts.push(new Contact(data)) )
        .then( () => {
            this.contactsForm.querySelectorAll(".form-control").forEach(el =>  el.value = "")
            this.showContactList()    
          }
        )
    } else if (this.contactSubmit.value == "Update Contact") {
      const body = {"first_name": this.contactFirstName.value, "last_name": this.contactLastName.value,
      "email": this.contactEmail.value, "phone_number": this.contactPhoneNumber.value}
      const id = this.currentActiveContact["id"]
      const index = this.contacts.findIndex( contact =>  contact.id == id)
      if (this.detectFormChanges(body)) {
        this.adapter.updateContact(body, id)
        .then( ({data}) => {
          this.contacts[index] = new Contact(data)
          this.contactsForm.querySelectorAll(".form-control").forEach(el =>  el.value = "")
          this.contactSubmit.value = "Save contact"
          this.showContactList()
          this.errorUpdateMessage.classList.remove("active")
        })
      } else {
        this.errorUpdateMessage.classList.add("active")
      }
    }
  }

  detectFormChanges(body) {
    if(body.first_name != this.currentActiveContact.body.first_name || body.last_name != this.currentActiveContact.body.last_name
    || body.email != this.currentActiveContact.body.email || body.phone_number != this.currentActiveContact.body.phone_number) {
      return true
    } else {
      return false
    }
  }

  handleEventContact() {
    if (event.target.dataset.action === 'delete-contact') {
      const contactId = event.target.parentElement.dataset.contactid
      this.adapter.deleteContact(contactId)
      .then( resp => this.removeDeletedContact(resp) )
    } else if (event.target.classList.contains('show-link')) {
      const contactId = event.target.parentElement.dataset.contactid
      const contactClicked = this.contacts.filter( contact => contact.id == contactId )
      this.showSelectedContact(contactClicked)
      this.contactHistory = document.getElementById("contact-history-button")
      this.contactHistory.addEventListener('click',() => {
        const contactEditedHistory = []
        this.adapter.getContactHistory(contactId).then(res => {
          res["body"].forEach((edited, index) => {
            if (index > 0) {
              const dataString = edited["object"] 
              const dataObject = this.parseEditedData(dataString)
              contactEditedHistory.push(dataObject)
            }}
            )
            this.showContactHistory(contactEditedHistory)
            })
      })
    } else if (event.target.dataset.action === 'edit-contact') {
      const contactId = event.target.parentElement.dataset.contactid
      const contactClicked = this.contacts.filter( contact => contact.id === contactId )
      this.currentActiveContact = contactClicked[0]
      this.contactFirstName.value = this.currentActiveContact["body"]["first_name"]
      this.contactLastName.value = this.currentActiveContact["body"]["last_name"]
      this.contactEmail.value = this.currentActiveContact["body"]["email"]
      this.contactPhoneNumber.value = this.currentActiveContact["body"]["phone_number"]
      this.contactSubmit.value = "Update Contact"
    }
  }

  parseEditedData(string) {
    const firstname = "first_name: "
    const lastname = "last_name: "
    const ph = "phone_number: "
    const em = "email: "
    const created = "created_at: "
    const updated = "updated_at: "
    let first_name, last_name, email, phone, created_at, updated_at
    let p_f, p_l, p_e, p_p, p_c, p_u
    p_f = string.indexOf(firstname)
    p_l = string.indexOf(lastname)
    p_p = string.indexOf(ph)
    p_e = string.indexOf(em)
    p_c = string.indexOf(created)
    p_u = string.indexOf(updated)
    first_name = string.slice(p_f + firstname.length, p_l - 1)
    last_name = string.slice(p_l + lastname.length, p_p - 1)
    phone = string.slice(p_p + ph.length, p_e - 1)
    email = string.slice(p_e + em.length, p_c - 1)
    created_at = string.slice(p_c + created.length, p_u - 1)
    updated_at = string.slice(p_u + updated.length, p_u + updated.length + 19)
    return {first_name, last_name, phone, email, created_at, updated_at}
  }

  removeDeletedContact(deleteResponse) {
    this.contacts = this.contacts.filter( contact => contact.id !== deleteResponse.data.id )
    this.showContactList()
    this.contactDetails.innerHTML = ""
  }

  showSelectedContact(selectedContact) {
    this.contactDetails.innerHTML = selectedContact[0].renderShow()
  }

  contactsHTML() {
    return this.contacts.map( contact => contact.render() ).join('')
  }

  showContactList() {
    this.contactsNode.innerHTML = `<ul>${this.contactsHTML()}</ul>`
  }

  renderContactHistory(contactEditedHistory){
    return contactEditedHistory.map( contactVersion => { return `
      <tr>
        <td>${contactVersion.updated_at}</th>
        <td>${contactVersion.first_name}</td>
        <td>${contactVersion.last_name}</td>
        <td>${contactVersion.email}</td>
        <td>${contactVersion.phone}</td>
      </tr>`
    }).join('')
  }

  showContactHistory(contactEditedHistory) {  
    this.contactEdits.innerHTML = `
    <table class="table">
      <thead>
        <tr class="bg-info">
          <th scope="col">Edited at</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone</th>
        </tr>
      </thead>
      <tbody>
        ${this.renderContactHistory(contactEditedHistory)}
      </tbody>
    </table> `
  }
}