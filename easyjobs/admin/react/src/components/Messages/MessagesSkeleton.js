import React from 'react';

/**
 * Loading skeleton that mirrors the real Messages layout (top bar, conversation
 * list, chat thread + composer). Shown while data loads — mirrors the Vue
 * reference's ConversationLoader. Reuses the real layout classes so the skeleton
 * lines up exactly with the loaded UI.
 */

const Sk = ({ w, h = 12, r = 6, className = '', style = {} }) => (
  <span
    className={`ej-sk ${className}`}
    style={{ width: w, height: h, borderRadius: r, ...style }}
    aria-hidden="true"
  />
);

const MessagesSkeleton = () => {
  const rows = Array.from({ length: 8 });
  const bubbles = Array.from({ length: 6 });

  return (
    <section
      className="ej-messages ej-messages--loading"
      aria-busy="true"
      aria-label="Loading messages"
    >
      {/* Top bar */}
      <div className="ej-msg-topbar">
        <div className="ej-msg-topbar__left">
          <Sk w={130} h={20} />
          <Sk w={84} h={34} r={999} />
        </div>
        <div className="ej-msg-topbar__options">
          <Sk w={44} h={44} r={999} />
          <Sk w={250} h={40} r={20} />
          <Sk w={92} h={34} r={999} style={{ marginLeft: 'auto' }} />
        </div>
      </div>

      {/* Body: list + thread */}
      <div className="ej-msg-body">
        <div className="ej-msg-list ej-sk-list">
          {rows.map((_, i) => (
            <div className="ej-sk-row" key={i}>
              <Sk w={40} h={40} r={999} />
              <div className="ej-sk-row__lines">
                <div className="ej-sk-row__top">
                  <Sk w="55%" h={11} />
                  <Sk w={32} h={9} />
                </div>
                <Sk w="70%" h={10} />
                <Sk w="45%" h={10} />
              </div>
            </div>
          ))}
        </div>

        <div className="ej-msg-thread ej-sk-thread">
          <div className="ej-sk-thead">
            <Sk w={36} h={36} r={999} />
            <div className="ej-sk-thead__lines">
              <Sk w={220} h={13} />
              <Sk w={130} h={10} />
            </div>
          </div>

          <div className="ej-sk-tbody">
            {bubbles.map((_, i) => (
              <Sk key={i} w={i % 2 ? 320 : 270} h={40} r={999} />
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
      </div>
    </section>
  );
};

export default MessagesSkeleton;
