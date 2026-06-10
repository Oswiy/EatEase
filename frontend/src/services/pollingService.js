import API_CONFIG from "../config";

class PollingService {
  constructor() {
    this.intervals = new Map();
    this.subscribers = new Map();
    this.pollingInterval = API_CONFIG.POLLING_INTERVAL || 30000; // ← use config
    this.isTabActive = true;

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        this.isTabActive = !document.hidden;
        if (!this.isTabActive) {
          this.pausePolling();
        } else {
          this.resumePolling();
        }
      });
    }
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

    // Fetch immediately on first subscribe only
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

  pausePolling() {
    this.intervals.forEach((intervalId) => clearInterval(intervalId));
    this.intervals.clear();
  }

  resumePolling() {
    // ← NO immediate fetch on resume, just restart intervals
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

  async fetchRestaurantStatus(restaurantId) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}/status`,
        { headers: { "Cache-Control": "no-cache" } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.restaurant) {
          this.notifySubscribers(restaurantId, data.restaurant);
        }
      }
    } catch (error) {
      // silent fail — polling should never crash the app
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
}

export default new PollingService();