const fs = require('fs')
const TimeSlot = require('./TimeSlot')
const DataSchema = require('./schemas/data.schema')

class Calendar {
  constructor (data, date, duration) {
    try {
      const validatedData = DataSchema.parse(data)
      this.slots = this._parseSlots(validatedData.slots, date)
      this.sessions = this._parseSlots(validatedData.sessions, date)
      this.durationAfter = validatedData.durationAfter
      this.durationBefore = validatedData.durationBefore
      this.duration = duration
    } catch (error) {
      console.error(error.errors)
    }
  }

  getAvailableSlots () {
    try {
      const slotsWithNoConflicts = this._getSlotsWithNoConflicts()
      return this._filterSlots(slotsWithNoConflicts)
    } catch (error) {
      console.error(error.message)
    }
  }

  _parseSlots (slots, date) {
    return slots[date]?.map(slot => {
      return new TimeSlot(slot.start, slot.end, date)
    })
  }

  _getSlotsWithNoConflicts () {
    const slotsWithNoConflicts = []

    for (const slot of this.slots) {
      let noConflicts = true

      for (const session of this.sessions) {
        if (noConflicts && slot.conflictsWith(session)) {
          const splittedSlots = slot.splitSlot(session)
          if (splittedSlots.length > 0) {
            slotsWithNoConflicts.push(...splittedSlots)
          }
          noConflicts = false
        }
      }
      if (noConflicts) {
        slotsWithNoConflicts.push(slot)
      }
    }
    return slotsWithNoConflicts
  }

  _filterSlots (availableSlots) {
    const filteredSlots = []
    for (const slot of availableSlots) {
      if (slot.fits(this.duration, this.durationBefore, this.durationAfter)) {
        const allotedSlot = slot.getAllotedSlot(this.duration, this.durationBefore, this.durationAfter)
        filteredSlots.push(allotedSlot)
      }
    }
    return filteredSlots
  }
}

class CalendarLoader {
  loadCalendar (id) {
    try {
      const rawdata = fs.readFileSync('./calendars/calendar.' + id + '.json')
      const data = JSON.parse(rawdata)
      return data
    } catch (error) {
      console.error(error.message)
    }
  }
}

module.exports = { CalendarLoader, Calendar }
