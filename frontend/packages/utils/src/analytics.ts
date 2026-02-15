/**
 * PropFlow Analytics Tracking
 * Client-side event tracking for user behavior analysis
 */

const TRACKING_EVENTS = {
  // Auth events
  AUTH_OTP_REQUESTED: 'auth:otp_requested',
  AUTH_OTP_SENT: 'auth:otp_sent',
  AUTH_OTP_VERIFIED: 'auth:otp_verified',
  AUTH_LOGOUT: 'auth:logout',

  // Property flow events
  PROPERTY_TYPE_SELECTED: 'property:type_selected',
  PROPERTY_DETAILS_SAVED: 'property:details_saved',
  PROPERTY_LOCATION_CAPTURED: 'property:location_captured',
  PROPERTY_PHOTO_CAPTURED: 'property:photo_captured',
  PROPERTY_PHOTO_REJECTED: 'property:photo_rejected',
  PROPERTY_SUBMITTED: 'property:submitted',

  // Review events
  REVIEW_STARTED: 'review:started',
  REVIEW_APPROVED: 'review:approved',
  REVIEW_FOLLOW_UP: 'review:follow_up',
  REVIEW_REJECTED: 'review:rejected',

  // Drop-off events
  SCREEN_VIEWED: 'screen:viewed',
  SCREEN_EXITED: 'screen:exited',
  ERROR_OCCURRED: 'error:occurred',

  // Notification events
  NOTIFICATION_SENT: 'notification:sent',
  NOTIFICATION_CLICKED: 'notification:clicked',
} as const;

interface TrackingEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

class AnalyticsTracker {
  private events: TrackingEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private enabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadPersistedEvents();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string | undefined) {
    this.userId = userId;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  track(eventName: string, properties?: Record<string, unknown>) {
    if (!this.enabled) return;

    const event: TrackingEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.events.push(event);
    this.persistEvents();

    // Send to analytics endpoint
    this.sendEvent(event);
  }

  trackScreenView(screenName: string, properties?: Record<string, unknown>) {
    this.track(TRACKING_EVENTS.SCREEN_VIEWED, {
      screen: screenName,
      ...properties,
    });
  }

  trackScreenExit(screenName: string, durationMs: number) {
    this.track(TRACKING_EVENTS.SCREEN_EXITED, {
      screen: screenName,
      duration_ms: durationMs,
    });
  }

  trackError(errorType: string, errorMessage: string, screen?: string) {
    this.track(TRACKING_EVENTS.ERROR_OCCURRED, {
      error_type: errorType,
      error_message: errorMessage,
      screen,
    });
  }

  private async sendEvent(event: TrackingEvent) {
    try {
      // Batch send events periodically
      if (this.events.length >= 10) {
        await this.flush();
      }
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // In production, send to analytics API
      console.log('Flushing analytics events:', eventsToSend.length);

      // await fetch('/api/v1/analytics/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events: eventsToSend }),
      // });
    } catch (error) {
      // Re-add events on failure
      this.events = [...eventsToSend, ...this.events];
      console.error('Failed to flush analytics:', error);
    }
  }

  private persistEvents() {
    try {
      const key = `propflow_analytics_${this.sessionId}`;
      localStorage.setItem(key, JSON.stringify(this.events.slice(-50)));
    } catch {
      // Ignore persistence errors
    }
  }

  private loadPersistedEvents() {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('propflow_analytics_'));

      keys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          const events = JSON.parse(data);
          // Send old events and clear
          events.forEach((event: TrackingEvent) => this.sendEvent(event));
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore load errors
    }
  }

  getEvents(): TrackingEvent[] {
    return [...this.events];
  }
}

export const analytics = new AnalyticsTracker();
export { TRACKING_EVENTS };
