/* global describe, it */
require('dotenv').config()

const bugfixes = require('bugfixes')

const expect = require('chai').expect

const API = require('../')

const payLoad = {
  version: process.env.TEST_VERSION,
  application: process.env.TEST_APPLICATION,
  account: process.env.TEST_ACCOUNT
}

describe('API Tests', () => {
  it('should save log', (done) => {
    let api = new API()
    api.version = payLoad.version
    api.application = payLoad.application
    api.account = payLoad.account
    api.level = bugfixes.LOG
    api.save((error, result) => {
      if (error) {
        done(Error(error))
      }

      expect(result).to.be.an('object')
      expect(result).to.have.property('result')
      expect(result.result).to.be.equal('created')

      payLoad.id = result._id

      done()
    })
  })

  it('should get logs for application', (done) => {
    let api = new API()
    api.application = payLoad.application
    api.account = payLoad.account
    api.list((error, result) => {
      if (error) {
        done(Error(error))
      }

      expect(result).to.be.an('array')
      expect(result).to.have.lengthOf.least(1)

      let resultObj = result[0]
      expect(resultObj).to.have.property('_source')

      let resultSource = resultObj._source
      expect(resultSource).to.have.property('application')
      expect(resultSource.application).to.be.equal(payLoad.application)

      done()
    })
  })

  it('should get logs for a version of an application', (done) => {
    let api = new API()
    api.application = payLoad.application
    api.account = payLoad.account
    api.version = payLoad.version
    api.listVersion((error, result) => {
      if (error) {
        done(Error(error))
      }

      expect(result).to.be.an('array')
      expect(result).to.have.lengthOf.least(1)

      let resultObj = result[0]
      expect(resultObj).to.have.property('_source')

      let resultSource = resultObj._source
      expect(resultSource).to.have.property('application')
      expect(resultSource.application).to.be.equal(payLoad.application)

      done()
    })
  })

  it('should get specific log', (done) => {
    let api = new API()
    api.account = payLoad.account
    api.id = payLoad.id
    api.get((error, result) => {
      if (error) {
        done(Error(error))
      }

      expect(result).to.be.an('object')
      expect(result).to.have.property('_source')

      let resultSource = result._source
      expect(resultSource).to.have.property('application')
      expect(resultSource.application).to.be.equal(payLoad.application)

      done()
    })
  })
})