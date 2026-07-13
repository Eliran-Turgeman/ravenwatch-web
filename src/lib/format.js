export function formatPercent(value, digits = 1) {
  return Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : "n/a";
}

export function formatMetric(metric, key) {
  if (!metric || metric.expected_count === 0) {
    return "n/a";
  }

  return formatPercent(metric[key]);
}

export function formatCurrency(value) {
  return Number.isFinite(value) ? `$${value.toFixed(3)}` : "n/a";
}

export function formatInteger(value) {
  return Number.isFinite(value) ? new Intl.NumberFormat("en-US").format(value) : "n/a";
}

export function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds)) {
    return "n/a";
  }

  const totalSeconds = Math.round(milliseconds / 1000);
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
