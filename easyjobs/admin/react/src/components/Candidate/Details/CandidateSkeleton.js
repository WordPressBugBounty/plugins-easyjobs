import React from 'react';

// Single shimmer block. Sizes are passed inline so the skeleton can mimic the
// real widths/heights without a class per placeholder.
const Sk = ({ w = '100%', h = 12, r = 6, style }) => (
  <span
    className="ejc-sk"
    style={{ width: w, height: h, borderRadius: r, ...style }}
  />
);

const Lines = ({ rows = ['100%', '90%', '80%'] }) => (
  <div className="ejc-sk-lines">
    {rows.map((w, i) => (
      <Sk key={i} w={w} h={12} />
    ))}
  </div>
);

/**
 * Loading skeleton for the candidate-details page — mirrors the real
 * `ejc-layout` (header card + tabs + panel on the left, info cards on the
 * right) so the page keeps its shape while data loads instead of flashing a
 * bare "Loading…" line.
 */
const CandidateSkeleton = () => (
  <div className="ejc-layout ejc-skeleton" aria-hidden="true">
    <div className="ejc-col-left">
      {/* Header card: avatar + name + status + tabs */}
      <div className="ejc-card ejc-sk-card">
        <div className="ejc-sk-hdr">
          <Sk w={72} h={72} r={18} />
          <div className="ejc-sk-hdr-info">
            <Sk w="52%" h={18} />
            <Sk w="34%" h={13} />
            <div className="ejc-sk-row">
              <Sk w={90} h={16} r={999} />
              <Sk w={116} h={16} r={999} />
            </div>
          </div>
          <Sk w={30} h={30} r={8} />
        </div>
        <div className="ejc-sk-tabs">
          {Array.from({ length: 5 }).map((_, i) => (
            <Sk key={i} w={i % 2 ? 96 : 74} h={14} />
          ))}
        </div>
      </div>

      {/* Active panel content */}
      <div className="ejc-card ejc-sk-card">
        <Sk w="38%" h={16} />
        <div className="ejc-sk-stats">
          {Array.from({ length: 3 }).map((_, i) => (
            <Sk key={i} w="100%" h={74} r={10} />
          ))}
        </div>
        <Lines rows={['100%', '94%', '97%', '68%']} />
      </div>
    </div>

    <aside className="ejc-col-right">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="ejc-card ejc-sk-card" key={i}>
          <Sk w="46%" h={15} />
          <Lines
            rows={
              i === 2 ? ['100%', '100%', '82%', '90%'] : ['100%', '86%', '92%']
            }
          />
        </div>
      ))}
    </aside>
  </div>
);

export default CandidateSkeleton;
