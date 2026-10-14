import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop,
} from 'recharts';

var METRIC_COLORS = {
  visitors: '#4F46E5',
  unique: '#0EA5E9',
  actions: '#10B981',
  applied: '#F59E0B',
  pending: '#A855F7',
};

var SERIES_KEY_MAP = {
  visitors: 'visitors',
  unique_visitors: 'unique',
  performed_actions: 'actions',
  candidates_applied: 'applied',
  candidates_pending: 'pending',
};

function toKey(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '_');
}

// "04 Jun, 2026" → "4 Jun"  |  "2026-06-04" → "Jun 4"  |  anything else → as-is
function shortDate(str) {
  if (!str) return str;
  var m = str.match(/^(\d+)\s+([A-Za-z]+)/);
  if (m) return parseInt(m[1], 10) + ' ' + m[2];
  return str;
}

function transformData(chartData, categories) {
  if (!chartData || !chartData.length || !categories || !categories.length)
    return [];
  return categories.map(function (label, i) {
    var row = { label: label };
    chartData.forEach(function (series) {
      var key = toKey(series.name);
      row[key] = series.data[i] !== undefined ? series.data[i] : 0;
    });
    return row;
  });
}

var CustomTooltip = function (props) {
  var active = props.active;
  var payload = props.payload;
  var label = props.label;
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="ej-chart-tooltip">
      <div className="ej-chart-tt-date">{shortDate(label)}</div>
      {payload.map(function (entry) {
        return (
          <div key={entry.dataKey} className="ej-chart-tt-row">
            <span>
              <i style={{ background: entry.color }} />
              {entry.name}
            </span>
            <b className="tnum">{entry.value}</b>
          </div>
        );
      })}
    </div>
  );
};

var AnalyticsChart = function (props) {
  var chartData = props.chartData;
  var categories = props.categories;
  var activeMetrics = props.activeMetrics;

  var data = transformData(chartData, categories);
  if (!data.length) return null;

  // Only render metric keys that are both active and actually present in data
  var metricKeys = Object.keys(METRIC_COLORS).filter(function (metricKey) {
    if (!activeMetrics.has(metricKey)) return false;
    var dataKey = Object.keys(SERIES_KEY_MAP).find(function (k) {
      return SERIES_KEY_MAP[k] === metricKey;
    });
    return dataKey && data[0] && data[0][dataKey] !== undefined;
  });

  return (
    <div className="ej-chart-wrap">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 18, right: 14, left: 0, bottom: 10 }}
        >
          <defs>
            {metricKeys.map(function (metricKey) {
              var color = METRIC_COLORS[metricKey];
              return (
                <linearGradient
                  key={metricKey}
                  id={'grad-' + metricKey}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid
            strokeDasharray="3 4"
            vertical={false}
            stroke="#EFEFF0"
          />
          <XAxis
            dataKey="label"
            tickFormatter={shortDate}
            tick={{ fill: '#6E7079', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9698A1', fontSize: 10.5, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            content={React.createElement(CustomTooltip)}
            cursor={{
              stroke: '#0A0A0A',
              strokeOpacity: 0.18,
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
          />
          {metricKeys.map(function (metricKey) {
            var dataKey = Object.keys(SERIES_KEY_MAP).find(function (k) {
              return SERIES_KEY_MAP[k] === metricKey;
            });
            var color = METRIC_COLORS[metricKey];
            return (
              <Area
                key={metricKey}
                type="monotone"
                dataKey={dataKey}
                name={dataKey.replace(/_/g, ' ')}
                stroke={color}
                strokeWidth={2}
                fill={'url(#grad-' + metricKey + ')'}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#fff',
                  stroke: color,
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
