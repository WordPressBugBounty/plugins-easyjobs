import { __ } from '@wordpress/i18n';
import React from 'react';

// Loading-state placeholder that mirrors the candidate grid card / list row
// layout so the page doesn't jump when real data arrives.
const range = (count) => Array.from({ length: count });

// Placeholder pagination row: info (left) · pages (center) · per-page (right),
// matching the real .c-pager grid.
const PagerSkeleton = () => (
  <div className="c-pager">
    <span className="sk sk-pg-info" />
    <div className="pg-center">
      <span className="sk sk-pg-nums" />
    </div>
    <span className="sk sk-pg-size" />
  </div>
);

const CandidateSkeleton = ({ view = 'grid', count = 20 }) => {
  if (view === 'list') {
    return (
      <>
        <div className="c-list-card surface">
          <div className="tbl-scroll">
            <table className="ltbl">
              <thead>
                <tr>
                  <th>{__('Name', 'easyjobs')}</th>
                  <th>{__('Job Applied', 'easyjobs')}</th>
                  <th>{__('Status', 'easyjobs')}</th>
                  <th>{__('Rating', 'easyjobs')}</th>
                  <th>{__('Applied', 'easyjobs')}</th>
                  <th>{__('Activity', 'easyjobs')}</th>
                  <th className="right">{__('Actions', 'easyjobs')}</th>
                </tr>
              </thead>
              <tbody>
                {range(count).map((_, i) => (
                  <tr className="l-row" key={i}>
                    <td>
                      <div className="l-name">
                        <span className="sk sk-av-sm" />
                        <span className="sk sk-line" style={{ width: 120 }} />
                      </div>
                    </td>
                    <td>
                      <span className="sk sk-line" style={{ width: 180 }} />
                    </td>
                    <td>
                      <span className="sk sk-pill" />
                    </td>
                    <td>
                      <span className="sk sk-line" style={{ width: 72 }} />
                    </td>
                    <td>
                      <span className="sk sk-line" style={{ width: 56 }} />
                    </td>
                    <td>
                      <span className="sk sk-line" style={{ width: 22 }} />
                    </td>
                    <td>
                      <div className="row-acts">
                        <span className="sk sk-line" style={{ width: 84 }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <PagerSkeleton />
      </>
    );
  }

  return (
    <>
      <div className="c-grid">
        {range(count).map((_, i) => (
          <div className="c-card is-skeleton" key={i}>
            <div className="c-top">
              <span className="sk sk-pill" />
              <div className="sk-icons">
                <span className="sk sk-ic" />
                <span className="sk sk-ic" />
              </div>
            </div>
            <span className="sk sk-av" />
            <span className="sk sk-line sk-name" />
            <span className="sk sk-line sk-role" />
            <span className="sk sk-line sk-role2" />
            <span className="sk sk-line sk-stars" />
            <span className="sk sk-line sk-time" />
          </div>
        ))}
      </div>
      <PagerSkeleton />
    </>
  );
};

export default CandidateSkeleton;
