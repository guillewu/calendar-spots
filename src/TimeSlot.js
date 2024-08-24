const moment = require('moment')

class TimeSlot {
  constructor (start, end, date) {
    this.start = moment.utc(`${date} ${start}`, 'DD-MM-YYYY HH:mm', true).valueOf()
    this.end = moment.utc(`${date} ${end}`, 'DD-MM-YYYY HH:mm', true).valueOf()
  }

  _formatToHHmm (unixTimestampMs) {
    return moment.utc(unixTimestampMs).format('HH:mm')
  }

  _formatToDDMMYYYY (unixTimestampMs) {
    return moment.utc(unixTimestampMs).format('DD-MM-YYYY')
  }

  conflictsWith (otherSlot) {
    return (otherSlot.start <= this.end && otherSlot.end >= this.start)
  }

  splitSlot (otherSlot) {
    const slots = []
    if (otherSlot.start > this.start) {
      slots.push(new TimeSlot(this._formatToHHmm(this.start), this._formatToHHmm(otherSlot.start), this._formatToDDMMYYYY(this.start)))
    }
    if (otherSlot.end < this.end) {
      slots.push(new TimeSlot(this._formatToHHmm(otherSlot.end), this._formatToHHmm(this.end), this._formatToDDMMYYYY(this.end)))
    }
    return slots
  }

  fits (duration, durationBefore, durationAfter) {
    const clientEnd = moment(this.start).add(duration + durationBefore + durationAfter, 'minutes').valueOf()
    return clientEnd <= this.end
  }

  getAllotedSlot (duration, durationBefore, durationAfter) {
    const startHour = moment(this.start).toDate()
    const endHour = moment(this.start).add(duration + durationBefore + durationAfter, 'minutes').toDate()
    const clientStartHour = moment(this.start).add(durationBefore, 'minutes').toDate()
    const clientEndHour = moment(this.start).add(durationBefore + duration, 'minutes').toDate()
    return { startHour, endHour, clientStartHour, clientEndHour }
  }
}

module.exports = TimeSlot
