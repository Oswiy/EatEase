// EatEase-Restaurant/frontend/src/services/pollingService.js

const API_BASE_URL = "http://localhost:8000";

class RestaurantPollingService {
  constructor() {
    this.intervals = new Map();
    this.subscribers = new Map();
    this.pollingInterval = 15000; // 15 seconds (faster for owners)
    this.isTabActive = true;
  }

  // Subscribe to restaurant updates
  subscribe(restaurantId, callback) {
    console.log(`🏪 [Owner Polling] Subscribing to restaurant ${restaurantId}`);

    // Store callback
    if (!this.subscribers.has(restaurantId)) {
      this.subscribers.set(restaurantId, new Set());
    }
    this.subscribers.get(restaurantId).add(callback);

    // Start polling if not already started
    if (!this.intervals.has(restaurantId)) {
      this.startPolling(restaurantId);
    } else {
      console.log(`🏪 [Owner Polling] Using existing interval for ${restaurantId}`);
    }

    // Return unsubscribe function
    return () => this.unsubscribe(restaurantId, callback);
  }

  // Unsubscribe from restaurant updates
  unsubscribe(restaurantId, callback) {
    if (this.subscribers.has(restaurantId)) {
      const callbacks = this.subscribers.get(restaurantId);
      callbacks.delete(callback);

      // If no more subscribers, stop polling
      if (callbacks.size === 0) {
        this.stopPolling(restaurantId);
        this.subscribers.delete(restaurantId);
      }
    }
  }

  // Start polling for a restaurant
  startPolling(restaurantId) {
    console.log(`⏱️ [Owner Polling] Setting up 15s interval for ${restaurantId}`);

    // Clear any existing interval first
    this.stopPolling(restaurantId);

    // Create the interval
    const intervalId = setInterval(() => {
      if (this.isTabActive) {
        console.log(`🔄 [Owner Polling] Interval tick for ${restaurantId}`);
        this.fetchRestaurantStatus(restaurantId);
      }
    }, this.pollingInterval);

    this.intervals.set(restaurantId, intervalId);
    
    // Fetch immediately
    console.log(`🔍 [Owner Polling] Initial fetch for ${restaurantId}`);
    this.fetchRestaurantStatus(restaurantId);
  }

  // Stop polling for a restaurant
  stopPolling(restaurantId) {
    if (this.intervals.has(restaurantId)) {
      console.log(`⏹️ [Owner Polling] Stopping interval for ${restaurantId}`);
      clearInterval(this.intervals.get(restaurantId));
      this.intervals.delete(restaurantId);
    }
  }

  // Fetch restaurant status from API
  async fetchRestaurantStatus(restaurantId) {
    try {
      console.log(`🔍 [Owner Polling] Fetching status for ${restaurantId}`);
      
      const response = await fetch(
        `${API_BASE_URL}/api/restaurants/${restaurantId}/status`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.restaurant) {
          console.log(`✅ [Owner Polling] Update for ${restaurantId}:`, 
            data.restaurant.crowd_status, 
            `(${data.restaurant.current_occupancy}/${data.restaurant.max_capacity})`
          );
          this.notifySubscribers(restaurantId, data.restaurant);
        }
      }
    } catch (error) {
      console.error(`❌ [Owner Polling] Error fetching ${restaurantId}:`, error);
    }
  }

  // Notify all subscribers of a restaurant
  notifySubscribers(restaurantId, restaurantData) {
    if (this.subscribers.has(restaurantId)) {
      const callbacks = this.subscribers.get(restaurantId);
      console.log(`📢 [Owner Polling] Notifying ${callbacks.size} subscribers for ${restaurantId}`);
      callbacks.forEach((callback) => {
        try {
          callback(restaurantData);
        } catch (error) {
          console.error("Error in subscriber callback:", error);
        }
      });
    }
  }

  // Pause polling when tab inactive
  pausePolling() {
    console.log("⏸️ [Owner Polling] Pausing all intervals");
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
  }

  // Resume polling when tab active
  resumePolling() {
    console.log("▶️ [Owner Polling] Resuming all intervals");
    this.subscribers.forEach((callbacks, restaurantId) => {
      if (callbacks.size > 0) {
        this.startPolling(restaurantId);
      }
    });
  }

  // Manual refresh (can be called from UI)
  async refreshRestaurant(restaurantId) {
    await this.fetchRestaurantStatus(restaurantId);
  }
}

// Export singleton instance
const pollingService = new RestaurantPollingService();

// Add tab visibility handling
if (typeof document !== 'undefined') {
  document.addEventListener("visibilitychange", () => {
    pollingService.isTabActive = !document.hidden;
    if (!pollingService.isTabActive) {
      pollingService.pausePolling();
    } else {
      pollingService.resumePolling();
    }
  });
}

export default pollingService;