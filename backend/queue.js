const { customAlphabet } = require('nanoid');

// Create a custom alphabet for numeric IDs (e.g., digits 0-9)
const generateNumericID = customAlphabet('0123456789', 5);

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
    const queueLength = this.queues[kioskId] ? this.queues[kioskId].length : 0;
    const bufferTimePerCustomer = 2 * 60 * 1000; // 2 minutes buffer time per customer
    const totalBufferTime = queueLength * bufferTimePerCustomer; // Total buffer time based on queue length
    
    const ticket = {
      id: generateNumericID(),
      addedAt: Date.now(),
      expiresAt: Date.now() + totalBufferTime // Expiration time calculated based on queue length
    };
    
    if (!this.queues[kioskId]) {
      this.queues[kioskId] = []; // Initialize queue if it doesn't exist
    }
    
    this.queues[kioskId].push(ticket);
    return ticket;
  }  

  // Get the first 10 tickets in the queue
  getFirst10Tickets(kioskId) {
    return this.queues[kioskId].slice(0, 10);
  }

  // Remove a customer by their ID
  removeCustomerById(kioskId, customerId) {
    this.queues[kioskId] = this.queues[kioskId].filter(ticket => ticket.id !== customerId);
    return this.queues[kioskId].slice(0, 10);
  }
}

module.exports = new QueueManager();