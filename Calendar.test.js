const moment = require('moment')
const { CalendarLoader, Calendar } = require('./src/Calendar')
const OldCalendar = require('./src/OldCalendar')
const assert = require('assert')

const loader = new CalendarLoader()

describe('getAvailableSpot', function () {
  it('Should get 1 available spots of calendar 1', function () {
    // const data = loader.loadCalendar(1)
    // const calendar = new Calendar(data, '10-04-2023', 30)
    // const result = calendar.getAvailableSlots()
    const result = OldCalendar.getAvailableSpots(1, '10-04-2023', 30)
    assert.ok(result)
    console.log({ result })
    assert.equal(result.length, 1)
    assert.equal(result[0].startHour.valueOf(), moment.utc('2023-04-10T16:00:00.000Z').valueOf())
    assert.equal(result[0].endHour.valueOf(), moment.utc('2023-04-10T16:50:00.000Z').valueOf())
  })
})

describe('getAvailableSpot', function () {
  it('Should get 1 available spots of calendar 2', function () {
    const data = loader.loadCalendar(2)
    const calendar = new Calendar(data, '13-04-2023', 25)
    const result = calendar.getAvailableSlots()
    assert.ok(result)
    assert.equal(result.length, 1)
    assert.equal(result[0].startHour.valueOf(), moment.utc('2023-04-13T18:00:00.000Z').valueOf())
    assert.equal(result[0].endHour.valueOf(), moment.utc('2023-04-13T18:25:00.000Z').valueOf())
  })
})

describe('getAvailableSpot', function () {
  it('Should get no available spots of calendar 3', function () {
    const data = loader.loadCalendar(3)
    const calendar = new Calendar(data, '16-04-2023', 25)
    const result = calendar.getAvailableSlots()
    assert.ok(result)
    assert.equal(result.length, 0)
  })
})

describe('getAvailableSpot', function () {
  it('Should get 1 available spots of calendar 4', function () {
    const data = loader.loadCalendar(4)
    const calendar = new Calendar(data, '10-04-2023', 30)
    const result = calendar.getAvailableSlots()
    assert.ok(result)
    assert.equal(result.length, 2)
    assert.equal(result[0].startHour.valueOf(), moment.utc('2023-04-10T16:00:00.000Z').valueOf())
    assert.equal(result[0].clientStartHour.valueOf(), moment.utc('2023-04-10T16:05:00.000Z').valueOf())
    assert.equal(result[0].clientEndHour.valueOf(), moment.utc('2023-04-10T16:35:00.000Z').valueOf())
    assert.equal(result[0].endHour.valueOf(), moment.utc('2023-04-10T16:45:00.000Z').valueOf())

    assert.equal(result[1].startHour.valueOf(), moment.utc('2023-04-10T19:10:00.000Z').valueOf())
    assert.equal(result[1].clientStartHour.valueOf(), moment.utc('2023-04-10T19:15:00.000Z').valueOf())
    assert.equal(result[1].clientEndHour.valueOf(), moment.utc('2023-04-10T19:45:00.000Z').valueOf())
    assert.equal(result[1].endHour.valueOf(), moment.utc('2023-04-10T19:55:00.000Z').valueOf())
  })
})
