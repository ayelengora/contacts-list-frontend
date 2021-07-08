class ContactsAdapter {
  constructor() {
    this.baseUrl = "http://localhost:3000/api/v1/contacts"
  }

  getContacts() {
    return fetch(this.baseUrl).then(res => res.json())
  }

  createContact(body) {
    const contactCreateParams =  {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
    return fetch(this.baseUrl, contactCreateParams).then(res =>  res.json())
  }

  deleteContact(contactId) {
    const contactDeleteParams = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }
    return fetch(`${this.baseUrl}/${contactId}`, contactDeleteParams).then(res =>
      res.json()
    )
  }

  
  updateContact(body, id) {
    const contactUpdateParams = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify(  body  )
    }
    return fetch(`${this.baseUrl}/${id}`, contactUpdateParams).then(res => res.json())
  }

    getContactHistory(contactId) {
    const contactHistoryParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    return fetch(`${this.baseUrl}/${contactId}/contact_history`, contactHistoryParams).then(res =>
      res.json()
    )
  }
}