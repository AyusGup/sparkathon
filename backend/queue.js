const { v4: uuidv4 } = require('uuid');

class QueueManager {
  constructor() {
    this.queues = {};
  }

  // Create a queue for a specific kiosk
  createQueue(kioskId) {
    if (!this.queues[kioskId]) {
      this.queues[kioskId] = [];
    }
  }

  // Add a customer to the queue
  addCustomer(kioskId) {
    const ticket = {
      id: uuidv4(),
      addedAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes buffer time
    };
    this.queues[kioskId].push(ticket);
    return ticket;
  }

  // Remove expired tickets from the queue
  removeExpiredTickets(kioskId) {
    const now = Date.now();
    this.queues[kioskId] = this.queues[kioskId].filter(ticket => ticket.expiresAt > now);
  }

  // Get the first 10 tickets in the queue
  getFirst10Tickets(kioskId) {
    this.removeExpiredTickets(kioskId);
    return this.queues[kioskId].slice(0, 10);
  }

  // Remove a customer by their ID
  removeCustomerById(kioskId, customerId) {
    this.queues[kioskId] = this.queues[kioskId].filter(ticket => ticket.id !== customerId);
    return this.queues[kioskId].slice(0, 10);
  }
}

module.exports = new QueueManager();
