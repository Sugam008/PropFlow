const ANALYTICS_KEY = 'propflow_analytics_events';
const SESSION_KEY = 'propflow_session_id';

export type FunnelStep =
  | 'welcome'
  | 'otp_request'
  | 'otp_verify'
  | 'property_type'
  | 'property_details'
  | 'location'
  | 'photo_capture'
  | 'photo_review'
  | 'submit'
  | 'status_tracking'
  | 'valuation_result';

export type DropOffReason =
  | 'back_button'
  | 'app_background'
  | 'network_error'
  | 'permission_denied'
  | 'timeout'
  | 'user_cancel'
  | 'unknown';

interface AnalyticsEvent {
  id: string;
  type: 'screen_view' | 'funnel_progress' | 'drop_off' | 'error' | 'interaction';
  step?: FunnelStep;
  timestamp: number;
  sessionId: string;
  metadata?: Record<string, unknown>;
}

class AnalyticsService {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.init();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  private init() {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      this.sessionId = storedSession;
    } else {
      localStorage.setItem(SESSION_KEY, this.sessionId);
    }

    this.flushInterval = setInterval(() => this.flush(), 30000);

    this.trackScreenView('welcome');
  }

  private createEvent(
    type: AnalyticsEvent['type'],
    step?: FunnelStep,
    metadata?: Record<string, unknown>,
  ): AnalyticsEvent {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      step,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metadata,
    };
  }

  trackScreenView(step: FunnelStep, metadata?: Record<string, unknown>) {
    const event = this.createEvent('screen_view', step, metadata);
    this.events.push(event);
    console.log(`[Analytics] Screen view: ${step}`);
  }

  trackFunnelProgress(step: FunnelStep, progress: number, metadata?: Record<string, unknown>) {
    const event = this.createEvent('funnel_progress', step, {
      progress,
      ...metadata,
    });
    this.events.push(event);
    console.log(`[Analytics] Funnel progress: ${step} (${progress}%)`);
  }

  trackDropOff(step: FunnelStep, reason: DropOffReason, metadata?: Record<string, unknown>) {
    const event = this.createEvent('drop_off', step, {
      reason,
      ...metadata,
    });
    this.events.push(event);
    console.log(`[Analytics] Drop-off at ${step}: ${reason}`);

    this.flush();
  }

  trackError(
    step: FunnelStep,
    errorType: string,
    errorMessage: string,
    metadata?: Record<string, unknown>,
  ) {
    const event = this.createEvent('error', step, {
      errorType,
      errorMessage,
      ...metadata,
    });
    this.events.push(event);
    console.log(`[Analytics] Error at ${step}: ${errorType}`);
  }

  trackInteraction(step: FunnelStep, action: string, metadata?: Record<string, unknown>) {
    const event = this.createEvent('interaction', step, {
      action,
      ...metadata,
    });
    this.events.push(event);
  }

  flush() {
    if (this.events.length === 0) return;

    try {
      const existingEvents = localStorage.getItem(ANALYTICS_KEY);
      const allEvents = existingEvents
        ? [...JSON.parse(existingEvents), ...this.events]
        : this.events;

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(allEvents));

      console.log(`[Analytics] Flushed ${this.events.length} events`);
      this.events = [];
    } catch (error) {
      console.error('[Analytics] Failed to flush events:', error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearEvents() {
    localStorage.removeItem(ANALYTICS_KEY);
    localStorage.removeItem(SESSION_KEY);
    this.events = [];
    this.sessionId = this.generateSessionId();
  }

  getSessionId(): string {
    return this.sessionId;
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

export const analytics = new AnalyticsService();
