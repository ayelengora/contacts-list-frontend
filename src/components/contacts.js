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
    this.errorUpdateMessage = document.querySelector(".error_update_message")
  }

  fetchAndLoadContacts() {
    this.adapter.getContacts()
    // .then( contactsJSON => console.log(contactsJSON["data"]))
    .then( contactsJSON => contactsJSON["data"].forEach( contact => this.contacts.push( new Contact(contact) )))
      .then( this.render.bind(this) )
      .catch( (error) => console.log(error) )
  }

  handleSubmitForm() {
    event.preventDefault()
    if (this.contactSubmit.value === "Save contact") {     
      const body = {"first_name": this.contactFirstName.value, "last_name": this.contactLastName.value, "email": this.contactEmail.value, "phone_number": this.contactPhoneNumber.value}
      this.adapter.createContact(body)
      .then( ({data}) => this.contacts.push(new Contact(data)) )
      .then( () => {
          this.contactsForm.querySelectorAll(".form-input").forEach(el =>  el.value = "")
          this.render()    
        }
      )
    } else if (this.contactSubmit.value == "Update Contact") {
      const body = {"first_name": this.contactFirstName.value, "last_name": this.contactLastName.value, "email": this.contactEmail.value, "phone_number": this.contactPhoneNumber.value}
      const id = this.currentActiveContact["id"]
      const index = this.contacts.findIndex( contact =>  contact.id === id)        
      if (this.detectFormChanges(body)) {
        this.adapter.updateContact(body, id)
        .then( ({data}) => {
          this.contacts[index] = new Contact(data)
          this.contactsForm.querySelectorAll(".form-input").forEach(el =>  el.value = "")
          this.contactSubmit.value = "Save contact"
          this.render()    
        })
      } else {
        this.errorUpdateMessage.classList.add("active")
      }
    }
  }

  detectFormChanges(body) {
    if(body.first_name != this.currentActiveContact.body.first_name || body.last_name != this.currentActiveContact.body.last_name || body.email != this.currentActiveContact.body.email || body.phone_number != this.currentActiveContact.body.phone_number) {
      return true
    } else {
      return false
    }
  }

  handleEventContact() {
    if (event.target.dataset.action === 'delete-contact' && event.target.parentElement.classList.contains("contact-element")) {
      const contactId = event.target.parentElement.dataset.contactid
      this.adapter.deleteContact(contactId)
      .then( resp => this.removeDeletedContact(resp) )
    } else if (event.target.classList.contains('show-link') && event.target.parentElement.classList.contains("contact-element")) {
      const contactId = event.target.parentElement.dataset.contactid
      const contactClicked = this.contacts.filter( contact => contact.id == contactId )
      this.showSelectedContact(contactClicked)
    } else if (event.target.dataset.action === 'edit-contact' && event.target.parentElement.classList.contains("contact-element")) {
      const contactId = event.target.parentElement.dataset.contactid
      const contactClicked = this.contacts.filter( contact => contact.id == contactId )
      this.currentActiveContact = contactClicked[0]
      this.contactFirstName.value = this.currentActiveContact["body"]["first_name"]
      this.contactLastName.value = this.currentActiveContact["body"]["last_name"]
      this.contactEmail.value = this.currentActiveContact["body"]["email"]
      this.contactPhoneNumber.value = this.currentActiveContact["body"]["phone_number"]
      this.contactPhoneNumber.value = this.currentActiveContact["body"]["phone_number"]
      this.contactSubmit.value = "Update Contact"
    }
    
  }

  removeDeletedContact(deleteResponse) {
    this.contacts = this.contacts.filter( contact => contact.id !== deleteResponse.data.id )
    this.render()
    this.contactDetails.innerHTML = ""
  }

  showSelectedContact(selectedContact) {
    this.contactDetails.innerHTML = selectedContact[0].renderShow()
  }

  contactsHTML() {
    return this.contacts.map( contact => contact.render() ).join('')
  }

  render() {
    this.contactsNode.innerHTML = `<ul>${this.contactsHTML()}</ul>`
  }
}