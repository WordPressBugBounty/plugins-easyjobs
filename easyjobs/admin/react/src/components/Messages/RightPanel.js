import { __ } from '@wordpress/i18n';
import React from 'react';
import Icon from './icons';
import Avatar from './Avatar';
import FileCard from './FileCard';
import { notes as notesData } from './data';

const NoteItem = ({ note, depth = 0 }) => (
  <div className={`ej-msg-note-item ${depth > 0 ? 'is-reply' : ''}`}>
    <Avatar name={note.author} size={30} className="ej-msg-note-item__avatar" />
    <div className="ej-msg-note-item__main">
      <div className="ej-msg-note-item__head">
        <span className="ej-msg-note-item__author">{note.author}</span>
        {depth > 0 ? (
          <span className="ej-msg-note-item__when">· {note.time}</span>
        ) : null}
      </div>
      <p className="ej-msg-note-item__body">{note.body}</p>

      <div className="ej-msg-note-item__controls">
        <button type="button" className="ej-msg-link">
          {__('Reply', 'easyjobs')}
        </button>
        <button
          type="button"
          className="ej-msg-iconbtn ej-msg-iconbtn--sm"
          aria-label={__('Like', 'easyjobs')}
        >
          <Icon name="thumb" size={15} />
        </button>
        {note.reactions &&
          note.reactions.map((r, i) => (
            <span className="ej-msg-reaction" key={i}>
              {r.emoji} {r.count}
            </span>
          ))}
        <button
          type="button"
          className="ej-msg-iconbtn ej-msg-iconbtn--sm ej-msg-note-item__del"
          aria-label={__('Delete', 'easyjobs')}
        >
          <Icon name="trash" size={15} />
        </button>
      </div>

      {depth === 0 && note.time ? (
        <span className="ej-msg-note-item__time">{note.time}</span>
      ) : null}

      {note.replies && note.replies.length > 0 ? (
        <div className="ej-msg-note-item__replies">
          {note.replies.map((r) => (
            <NoteItem key={r.id} note={r} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  </div>
);

const Empty = ({ text }) => <div className="ej-msg-empty">{text}</div>;

const RightPanel = ({ panel, attachments, open }) => {
  const sideClass = `ej-msg-side ${open ? 'is-open' : ''}`;
  if (panel === 'files') {
    const files = Array.isArray(attachments) ? attachments : [];
    return (
      <aside className={sideClass}>
        <div className="ej-msg-side__head">
          <h3 className="ej-msg-side__title">{__('Files', 'easyjobs')}</h3>
          <p className="ej-msg-side__sub">
            {__('Showing newest first', 'easyjobs')}
          </p>
        </div>
        {files.length ? (
          <div className="ej-msg-files-list">
            {files.map((f, i) => (
              <FileCard
                key={f.id || i}
                url={f.attachment}
                name={f.media_name}
                size={f.media_size}
                variant="panel"
              />
            ))}
          </div>
        ) : (
          <Empty text={__('No attachments found.', 'easyjobs')} />
        )}
      </aside>
    );
  }

  if (panel === 'notes') {
    return (
      <aside className={sideClass}>
        <div className="ej-msg-side__head">
          <h3 className="ej-msg-side__title">{__('Notes', 'easyjobs')}</h3>
          <p className="ej-msg-side__sub ej-msg-side__sub--lock">
            <Icon name="lock" size={14} />{' '}
            {__('Notes for team members only.', 'easyjobs')}
          </p>
        </div>

        <div className="ej-msg-notes-list">
          {notesData.map((n) => (
            <NoteItem key={n.id} note={n} />
          ))}
        </div>

        <div className="ej-msg-note-composer">
          <textarea
            placeholder={__('Add a note here', 'easyjobs')}
            className="ej-msg-note-composer__input"
          />
          <div className="ej-msg-note-composer__bar">
            <div className="ej-msg-note-composer__tools">
              <button
                type="button"
                className="ej-msg-iconbtn ej-msg-iconbtn--sm"
                aria-label={__('Emoji', 'easyjobs')}
              >
                <Icon name="smile" size={18} />
              </button>
              <button
                type="button"
                className="ej-msg-iconbtn ej-msg-iconbtn--sm"
                aria-label={__('Mention', 'easyjobs')}
              >
                <Icon name="at" size={18} />
              </button>
            </div>
            <div className="ej-msg-note-composer__actions">
              <button type="button" className="ej-msg-link">
                {__('Cancel', 'easyjobs')}
              </button>
              <button
                type="button"
                className="ej-msg-note-composer__send"
                aria-label={__('Send note', 'easyjobs')}
              >
                <Icon name="send" size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (panel === 'templates') {
    return (
      <aside className={sideClass}>
        <div className="ej-msg-side__head ej-msg-side__head--row">
          <h3 className="ej-msg-side__title">{__('Templates', 'easyjobs')}</h3>
          <button type="button" className="ej-msg-addbtn">
            <Icon name="plus" size={15} />
            <span>{__('Add', 'easyjobs')}</span>
          </button>
        </div>
        <p className="ej-msg-side__sub ej-msg-side__sub--help">
          {__('Only team members can see templates.', 'easyjobs')}
        </p>
        <Empty text={__('No templates found.', 'easyjobs')} />
      </aside>
    );
  }

  return null;
};

export default RightPanel;
