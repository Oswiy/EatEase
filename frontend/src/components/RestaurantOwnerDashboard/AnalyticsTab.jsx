import React, { useState, useEffect } from "react";
import "./AnalyticsTab.css";
import { BASE_URL } from "../../config";

// ── Helpers ──────────────────────────────────────────────────────────────────
const DAY_LABELS   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_LABELS  = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatTime(ts) {
  if (!ts) return "–";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SourceBadges({ sensorCount, manualCount }) {
  return (
    <div className="source-badges">
      <div className="source-badge source-badge--sensor">
        <span className="source-badge__dot" />
        ESP32 Sensor · {sensorCount} readings
      </div>
      <div className="source-badge source-badge--manual">
        <span className="source-badge__dot" />
        Manual · {manualCount} updates
      </div>
    </div>
  );
}

function KpiGrid({ occ, reviews, sensorCount }) {
  return (
    <div className="kpi-cards">
      <div className="kpi-card kpi-card--gold">
        <div className="kpi-content">
          <div className="kpi-label">Avg Occupancy</div>
          <h3>{occ.average || 0}%</h3>
          <div className="kpi-comparison">
            <span>Peak: {occ.peak || 0}%</span>
            <span>Low: {occ.low || 0}%</span>
          </div>
        </div>
      </div>
      <div className="kpi-card kpi-card--green">
        <div className="kpi-content">
          <div className="kpi-label">Current</div>
          <h3>{occ.current || 0}%</h3>
          <p>live reading</p>
        </div>
      </div>
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-content">
          <div className="kpi-label">Avg Rating</div>
          <h3>{reviews.average || "–"}</h3>
          <p>{reviews.total || 0} reviews</p>
        </div>
      </div>
      <div className="kpi-card kpi-card--orange">
        <div className="kpi-content">
          <div className="kpi-label">Sensor Reads</div>
          <h3>{sensorCount}</h3>
          <p>ESP32 button presses</p>
        </div>
      </div>
    </div>
  );
}

function OccupancyChart({ data, labels, range }) {
  const max = Math.max(...data, 1);
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Occupancy Trend</h3>
        <span className="chart-tag">{range.toUpperCase()}</span>
      </div>
      {data.length === 0 ? (
        <div className="no-chart-data"><p>No occupancy data for this period</p></div>
      ) : (
        <div className="simple-chart">
          {data.map((v, i) => (
            <div className="chart-bar" key={i}>
              <div
                className="bar-fill"
                style={{ height: `${Math.max((v / max) * 100, 2)}%` }}
                title={`${v}%`}
              />
              <span className="bar-label">{labels[i] || `#${i + 1}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PeakHours({ peaks }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Peak Hours</h3>
        <span className="chart-tag">AVG OCC.</span>
      </div>
      {peaks.length === 0 ? (
        <div className="no-peak-data"><p>No peak hour data yet</p></div>
      ) : (
        <div className="peak-hours-list">
          {peaks.map((p, i) => (
            <div className="peak-hour-item" key={i}>
              <span className="peak-hour-time">{p.hour}</span>
              <div className="peak-hour-bar">
                <div className="peak-bar-fill" style={{ width: `${p.occupancy}%` }} />
              </div>
              <span className="peak-hour-percent">{p.occupancy}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CrowdBreakdown({ breakdown }) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;
  const items = [
    { key: "green",  label: "Low",  pct: Math.round(((breakdown.green  || 0) / total) * 100) },
    { key: "yellow", label: "Mod",  pct: Math.round(((breakdown.yellow || 0) / total) * 100) },
    { key: "orange", label: "Busy", pct: Math.round(((breakdown.orange || 0) / total) * 100) },
    { key: "red",    label: "Full", pct: Math.round(((breakdown.red    || 0) / total) * 100) },
  ];
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Crowd Distribution</h3>
        <span className="chart-tag">ALL TIME</span>
      </div>
      <div className="crowd-pills">
        {items.map(it => (
          <div className={`crowd-pill crowd-pill--${it.key}`} key={it.key}>
            <span className="crowd-pill__dot" />
            {it.label} · {it.pct}%
          </div>
        ))}
      </div>
      <div className="crowd-stacked-bar">
        {items.filter(it => it.pct > 0).map(it => (
          <div
            key={it.key}
            className={`crowd-stacked-bar__seg crowd-stacked-bar__seg--${it.key}`}
            style={{ width: `${it.pct}%` }}
            title={`${it.label}: ${it.pct}%`}
          />
        ))}
      </div>
      <div className="crowd-total">
        Based on {Object.values(breakdown).reduce((a, b) => a + b, 0)} sensor readings
      </div>
    </div>
  );
}

function RecentActivity({ logs }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>Recent IoT Activity</h3>
        <span className="chart-tag">LAST 10</span>
      </div>
      {logs.length === 0 ? (
        <div className="no-chart-data"><p>No sensor events recorded yet</p></div>
      ) : (
        <div className="activity-log">
          {logs.map((log, i) => {
            const isEntry  = log.notes?.toLowerCase().includes("entry");
            const isExit   = log.notes?.toLowerCase().includes("exit");
            const isSensor = log.source_type === "sensor";
            const typeKey  = isEntry ? "entry" : isExit ? "exit" : "manual";
            const icon     = isEntry ? "▲" : isExit ? "▼" : "●";
            const label    = isSensor ? (log.sensor_id || "sensor") : "manual";
            return (
              <div className="activity-row" key={i}>
                <span className={`activity-icon activity-icon--${typeKey}`}>{icon}</span>
                <span className="activity-label">{label}</span>
                <span className="activity-count">{log.occupancy_count} pax</span>
                <span className="activity-time">{formatTime(log.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InsightsCard({ summary, avgOccupancy, sensorCount }) {
  const items = [];
  if (summary?.best_day && summary.best_day !== "No data yet")
    items.push({ icon: "📅", text: `Busiest day: ${summary.best_day}` });
  if (sensorCount > 0)
    items.push({ icon: "🔌", text: `${sensorCount} ESP32 sensor readings logged this period` });
  if (avgOccupancy > 75)
    items.push({ icon: "🔥", text: "High demand — consider marketing off-peak slots" });
  else if (avgOccupancy > 0 && avgOccupancy < 40)
    items.push({ icon: "📣", text: "Low traffic — a promotional campaign could help" });
  if (summary?.recommendations)
    summary.recommendations.forEach(r => items.push({ icon: "💡", text: r }));
  if (items.length === 0)
    items.push({ icon: "📊", text: "Keep logging occupancy to generate insights" });

  return (
    <div className="insights-section">
      <div className="insights-card">
        <h3>Insights &amp; Recommendations</h3>
        <div className="insights-list">
          {items.map((it, i) => (
            <div className="insight-item" key={i}>
              <span className="insight-item__icon">{it.icon}</span>
              <span className="insight-item__text">{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const AnalyticsTab = ({ restaurantId, isPremium }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange]     = useState("week");

  useEffect(() => {
    if (!isPremium || !restaurantId) return;
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    fetch(`${BASE_URL}/api/restaurants/${restaurantId}/analytics?range=${range}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(r => (r.ok ? r.json() : null))
      .then(json => setData(json?.success ? json.analytics : null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [restaurantId, isPremium, range]);

  if (!restaurantId) {
    return <div className="error-message">Error: No restaurant ID provided</div>;
  }

  // ── Locked ───────────────────────────────────────────────────────────────
  if (!isPremium) {
    return (
      <div className="analytics-premium-locked">
        <div className="premium-locked-content">
          <div className="premium-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 -960 960 960" width="50" fill="gray">
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
            </svg>
          </div>
          <h3>Premium Analytics Locked</h3>
          <p>Upgrade to Premium to unlock your full dashboard — powered by real-time ESP32 sensor data.</p>
          <div className="features-list">
            <ul>
              <li className="feature-text">Live ESP32 occupancy tracking</li>
              <li className="feature-text">Peak hours &amp; crowd distribution</li>
              <li className="feature-text">Sensor vs manual breakdown</li>
              <li className="feature-text">Recent IoT activity log</li>
              <li className="feature-text">Personalised recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  // ── No Data ──────────────────────────────────────────────────────────────
  if (!data?.occupancy?.has_data) {
    return (
      <div className="analytics-empty-state">
        <div className="empty-icon">📡</div>
        <h3>Waiting for Data</h3>
        <p>
          Your analytics dashboard will populate once your ESP32 sensors start
          sending data, or after you manually update occupancy.
        </p>
        <div className="empty-tips">
          <p><strong>To get started:</strong></p>
          <ol>
            <li>Flash the entry &amp; exit ESP32 firmware</li>
            <li>Connect devices to your WiFi</li>
            <li>Press the buttons — data appears here instantly</li>
            <li><strong>Or:</strong> update occupancy manually from the Overview tab</li>
          </ol>
        </div>
        <p className="empty-note">
          Analytics data is collected automatically via IoT sensors or manual updates.
        </p>
      </div>
    );
  }

  // ── Render Dashboard ─────────────────────────────────────────────────────
  const occ         = data.occupancy      || {};
  const peaks       = data.peakHours      || [];
  const reviews     = data.reviews        || {};
  const summary     = data.summary        || {};
  const breakdown   = data.crowdBreakdown || {};
  const recentLogs  = data.recentLogs     || [];
  const sensorCount = data.sensorCount    || 0;
  const manualCount = data.manualCount    || 0;

  const chartData =
    range === "week"  ? (occ.daily   || []) :
    range === "month" ? (occ.weekly  || []) :
                        (occ.monthly || []);
  const chartLabels =
    range === "week"  ? DAY_LABELS :
    range === "month" ? WEEK_LABELS :
                        MONTH_LABELS;

  return (
    <div className="analytics-tab">

      <div className="analytics-header">
        <div>
          <h2>Restaurant Analytics</h2>
          <p className="analytics-subtitle">{occ.total_logs || 0} total logs · IoT + manual</p>
        </div>
        <div className="time-range-selector">
          {["week", "month", "year"].map(r => (
            <button
              key={r}
              className={`time-btn ${range === r ? "active" : ""}`}
              onClick={() => setRange(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <SourceBadges sensorCount={sensorCount} manualCount={manualCount} />
      <KpiGrid occ={occ} reviews={reviews} sensorCount={sensorCount} />

      <div className="charts-section">
        <OccupancyChart
          data={chartData.slice(0, chartLabels.length)}
          labels={chartLabels}
          range={range}
        />
        <PeakHours peaks={peaks} />
      </div>

      <div className="charts-section charts-section--equal">
        <CrowdBreakdown breakdown={breakdown} />
        <RecentActivity logs={recentLogs} />
      </div>

      <InsightsCard
        summary={summary}
        avgOccupancy={occ.average || 0}
        sensorCount={sensorCount}
      />

      <div className="data-info">
        <p>
          <small>
            Analytics based on {occ.total_logs || 0} occupancy logs.
            ESP32 sensor data is logged in real time.
          </small>
        </p>
      </div>
    </div>
  );
};

export default AnalyticsTab;