class Contacts {
  constructor() {
    this.contacts = []
    this.initBindingsAndEventListeners()
    this.adapter = new ContactsAdapter()
    this.fetchAndLoadContacts()
  }

  initBindingsAndEventListeners() {
    this.contactsForm = document.getElementById('new-contact-form')
    this.contactFirstName = document.getElementById('new-contact-first-name')
    this.contactLastName = document.getElementById('new-contact-last-name')
    this.contactEmail = document.getElementById('new-contact-email')
    this.contactPhoneNumber = document.getElementById('new-contact-phone-number')

    this.contactsNode = document.getElementById('contacts-container')
    this.contactsForm.addEventListener('submit',this.handleAddContact.bind(this))
    this.contactsNode.addEventListener('click',this.handleDeleteContact.bind(this))
  }

  fetchAndLoadContacts() {
    this.adapter.getContacts()
    // .then( contactsJSON => console.log(contactsJSON["data"]))
    .then( contactsJSON => contactsJSON["data"].forEach( contact => this.contacts.push( new Contact(contact) )))
      .then( this.render.bind(this) )
      .catch( (error) => console.log(error) )
  }

  handleAddContact() {
    event.preventDefault()
    const body = {"first_name": this.contactFirstName.value, "last_name": this.contactLastName.value, "email": this.contactEmail.value, "phone_number": this.contactPhoneNumber.value}
    this.adapter.createContact(body)
    .then( ({data}) => this.contacts.push(new Contact(data)) )
    .then( () => {
        this.contactsForm.querySelectorAll("[type='text']").forEach(el =>  el.value = "")
        this.render()    
      }
    )
  }

  handleDeleteContact() {
    if (event.target.dataset.action === 'delete-contact' && event.target.parentElement.classList.contains("contact-element")) {
      const contactId = event.target.parentElement.dataset.contactid
      this.adapter.deleteContact(contactId)
      .then( resp => this.removeDeletedContact(resp) )
    }
  }

  removeDeletedContact(deleteResponse) {
    console.log(deleteResponse.data)
    console.log(this.contacts[0].id)
    console.log(deleteResponse.data.id)
    this.contacts = this.contacts.filter( contact => contact.id !== deleteResponse.data.id )
    this.render()
  }

  contactsHTML() {
    console.log(this.contacts);
    return this.contacts.map( contact => contact.render() ).join('')
  }

  render() {
    this.contactsNode.innerHTML = `<ul>${this.contactsHTML()}</ul>`
  }
}