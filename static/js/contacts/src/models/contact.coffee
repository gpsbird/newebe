### Model for a single Contact
###

class Contact extends Backbone.Model

  ##  Url where contacts lives.
  url: '/platform/contacts/'

  ## Constructor initialize its field from a javascript raw object.
  ## Fields:
  ## url : contact URL.
  ## state : contact request state.
  constructor: (contact) ->
    super

    @set('url', contact.url)
    @id = contact.slug + "/"
    if contact.state
      @set('state', contact.state)


  getUrl: ->
    @get('url')

  getState: ->
    @get('state')

  setState: (state) ->
    @set('state', state)

  # Send a delete request to services backend then remove contact row from
  # contact view.
  delete: ->
    @url = '/platform/contacts/' + @id
    @destroy()
    @view.remove()

  saveToDb: ->
    @url = '/platform/contacts/' + @id
    @save(null,
      success: (model, response) ->
        model.setState("Trusted")
        model.view.refresh("Trusted")
        true
      error: (model, response) ->
        model.setState("Error")
        model.view.refresh("Error")
        true
    )
    @url

  # Contact is considered as new if no state is set.
  isNew: ->
    !@getState()

    

### Model for a Micro Post collection
###

class ContactCollection extends Backbone.Collection
  model: Contact

  ## Url where contacts lives.
  url: '/platform/contacts/'

  ## Collection sorting is based on contact URI.
  comparator: (contact) ->
    contact.getUrl()

  ## Select which field from backend response to use for parsing to populate  
  ## collection.
  parse: (response) ->
    response.rows


