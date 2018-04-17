const elasticsearch = require('elasticsearch')
const bugfixes = require('bugfixes')

const bugfunctions = bugfixes.functions
const elasticClient = new elasticsearch.Client({
  hosts: [
    process.env.ELASTIC_HOST
  ]
})

class API {
  set message (message) {
    this._message = message
  }
  get message () {
    return this._message
  }

  set level (level) {
    this._level = level
  }
  get level () {
    return this._level
  }

  set account (account) {
    this._account = account
  }
  get account () {
    return this._account
  }

  set application (application) {
    this._application = application
  }
  get application () {
    return this._application
  }

  set id (id) {
    this._id = id
  }
  get id () {
    return this._id
  }

  set version (version) {
    this._version = version
  }
  get version () {
    return this._version
  }

  save (callback) {
    let createObject = {
      index: this.account,
      type: 'BugFixes',
      id: new Date().getTime(),
      body: {
        application: this.application,
        version: this.version,
        message: this.message,
        level: this.level
      }
    }

    elasticClient.create(createObject, (error, result) => {
      if (error) {
        return callback(error)
      }

      return callback(null, result)
    })
  }

  get (callback) {
    let getObject = {
      index: this.account,
      type: 'BugFixes',
      id: this.id
    }

    elasticClient.get(getObject, (error, result) => {
      if (error) {
        return callback(error)
      }

      return callback(null, result)
    })
  }

  list (callback) {
    let listObject = {
      index: this.account,
      type: 'BugFixes',
      body: {
        query: {
          match: {
            application: this.application
          }
        }
      }
    }

    elasticClient.search(listObject, (error, result) => {
      if (error) {
        return callback(error)
      }

      if (result.hits.total >= 1) {
        return callback(null, result.hits.hits)
      } else {
        return callback(null, [])
      }
    })
  }

  listVersion (callback) {
    let listObject = {
      index: this.account,
      type: 'BugFixes',
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  application: this.application
                }
              },
              {
                match: {
                  version: this.version
                }
              }
            ]
          }
        }
      }
    }

    elasticClient.search(listObject, (error, result) => {
      if (error) {
        return callback(error)
      }

      if (result.hits.total >= 1) {
        return callback(null, result.hits.hits)
      } else {
        return callback(null, [])
      }
    })
  }
}

module.exports = API