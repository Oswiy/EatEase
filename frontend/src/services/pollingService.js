import { BASE_URL } from "../config";

class RestaurantPollingService {
  constructor() {
    this.intervals = new Map();
    this.subscribers = new Map();
    this.pollingInterval = 30000; // 30 seconds — owners don't need 5s
    this.isTabActive = true;
  }

  subscribe(restaurantId, callback) {
    if (!this.subscribers.has(restaurantId)) {
      this.subscribers.set(restaurantId, new Set());
    }
    this.subscribers.get(restaurantId).add(callback);

    if (!this.intervals.has(restaurantId)) {
      this.startPolling(restaurantId);
    }

    return () => this.unsubscribe(restaurantId, callback);
  }

  unsubscribe(restaurantId, callback) {
    if (this.subscribers.has(restaurantId)) {
      const callbacks = this.subscribers.get(restaurantId);
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        this.stopPolling(restaurantId);
        this.subscribers.delete(restaurantId);
      }
    }
  }

  startPolling(restaurantId) {
    this.stopPolling(restaurantId);

    // Fetch immediately on first subscribe
    this.fetchRestaurantStatus(restaurantId);

    const intervalId = setInterval(() => {
      if (this.isTabActive) {
        this.fetchRestaurantStatus(restaurantId);
      }
    }, this.pollingInterval);

    this.intervals.set(restaurantId, intervalId);
  }

  stopPolling(restaurantId) {
    if (this.intervals.has(restaurantId)) {
      clearInterval(this.intervals.get(restaurantId));
      this.intervals.delete(restaurantId);
    }
  }

  async fetchRestaurantStatus(restaurantId) {
    try {
      const response = await fetch(
        `${BASE_URL}/api/restaurants/${restaurantId}/status`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.restaurant) {
          this.notifySubscribers(restaurantId, data.restaurant);
        }
      }
    } catch (error) {
      // silent fail
    }
  }

  notifySubscribers(restaurantId, restaurantData) {
    if (this.subscribers.has(restaurantId)) {
      this.subscribers.get(restaurantId).forEach((callback) => {
        try {
          callback(restaurantData);
        } catch (error) {
          console.error("Error in subscriber callback:", error);
        }
      });
    }
  }

  pausePolling() {
    this.intervals.forEach((intervalId) => clearInterval(intervalId));
    this.intervals.clear();
  }

  resumePolling() {
    // NO immediate fetch on resume — just restart intervals
    this.subscribers.forEach((callbacks, restaurantId) => {
      if (callbacks.size > 0) {
        const intervalId = setInterval(() => {
          if (this.isTabActive) {
            this.fetchRestaurantStatus(restaurantId);
          }
        }, this.pollingInterval);
        this.intervals.set(restaurantId, intervalId);
      }
    });
  }

  async refreshRestaurant(restaurantId) {
    await this.fetchRestaurantStatus(restaurantId);
  }
}

const pollingService = new RestaurantPollingService();

if (typeof document !== "undefined") {
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
