import React from 'react';

/**
 * Loading skeleton for the chat thread pane only — shown while switching between
 * candidates (the conversation list stays put). Reuses the shared `.ej-sk*`
 * classes so it lines up with the real thread layout.
 */

const Sk = ({ w, h = 12, r = 6, className = '', style = {} }) => (
  <span
    className={`ej-sk ${className}`}
    style={{ width: w, height: h, borderRadius: r, ...style }}
    aria-hidden="true"
  />
);

// Alternating-aligned bubbles so it reads like a real conversation loading in.
const BUBBLES = [
  { w: 210, side: 'flex-start' },
  { w: 300, side: 'flex-start' },
  { w: 250, side: 'flex-end' },
  { w: 170, side: 'flex-end' },
  { w: 320, side: 'flex-start' },
  { w: 230, side: 'flex-end' },
];

const ThreadSkeleton = () => (
  <div
    className="ej-msg-thread ej-sk-thread"
    aria-busy="true"
    aria-label="Loading conversation"
  >
    <div className="ej-sk-thead">
      <Sk w={36} h={36} r={999} />
      <div className="ej-sk-thead__lines">
        <Sk w={220} h={13} />
        <Sk w={130} h={10} />
      </div>
    </div>

    <div className="ej-sk-tbody">
      {BUBBLES.map((b, i) => (
        <Sk key={i} w={b.w} h={46} r={14} style={{ alignSelf: b.side }} />
      ))}
    </div>

    <div className="ej-sk-composer">
      <Sk w="100%" h={72} r={8} />
      <div className="ej-sk-composer__bar">
        <Sk w={150} h={20} />
        <Sk w={96} h={36} r={8} style={{ marginLeft: 'auto' }} />
      </div>
    </div>
  </div>
);

export default ThreadSkeleton;
