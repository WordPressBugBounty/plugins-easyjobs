import React, { useState, useMemo, useRef, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Icon } from './icons';
import { initials } from './cdUtil';
import { EmptyIllustration, NOTES_SVG } from './emptyIllustrations';

const AV_COLORS = ['av-nh', 'av-me'];
const QUICK_EMOJI = ['👍', '🙂', '🎉', '🔥', '❤️', '✅'];

const renderText = (text, tags) => {
  if (!text) return null;
  const names = (tags || []).map((t) => t?.name).filter(Boolean);
  if (!names.length) return text;
  const escaped = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`@(${escaped.join('|')})`, 'g');
  return text.split(re).map((part, i) =>
    names.includes(part) ? (
      <span className="mention" key={i}>
        @{part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
};

/**
 * Right column — Internal Notes. Thread/empty above, composer at the bottom with
 * emoji + @-mention + Cancel + send (matches the app).
 */
const NotesCard = ({
  candidateDetails,
  ejCandidateId,
  addNoteAndManagers,
  addNoteLoading,
  noteLoading,
  onRemoveNote,
}) => {
  const notesData = candidateDetails?.notes || {};
  const notes = notesData?.notes || [];
  const managers = useMemo(() => notesData?.managers || [], [notesData]);

  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const wrapRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMentionOpen(false);
        setEmojiOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const addTag = (m) => {
    const name = m?.name || '';
    setText((t) => `${t}${t && !t.endsWith(' ') ? ' ' : ''}@${name} `);
    if (!tags.find((x) => x?.name === name)) setTags((s) => [...s, m]);
    setMentionOpen(false);
    if (taRef.current) taRef.current.focus();
  };

  const addEmoji = (e) => {
    setText((t) => t + e);
    setEmojiOpen(false);
    if (taRef.current) taRef.current.focus();
  };

  const save = () => {
    const note = text.trim();
    if (!note.length) return;
    const finalTags = tags.filter((t) =>
      new RegExp(`@${t.name}\\b`).test(text),
    );
    const formData = [{ name: 'note', value: note }];
    finalTags.forEach((t) => formData.push({ name: 'tag_select', value: t }));
    addNoteAndManagers({ form_data: formData, candidate_id: ejCandidateId });
    setText('');
    setTags([]);
  };

  return (
    <section className="ejc-card card-pad">
      <h2 className="card-h" style={{ marginBottom: '16px' }}>
        {__('Internal Notes', 'easyjobs')}
        {notes.length ? <span className="pill-n">{notes.length}</span> : null}
      </h2>

      {/* Thread / empty */}
      <div className={`notes-list ${noteLoading ? 'ej-loading' : ''}`}>
        {notes.length > 0 ? (
          notes.map((note, i) => (
            <div className="note" key={note.id || i}>
              <div className={`note-av ${AV_COLORS[i % AV_COLORS.length]}`}>
                {initials(note?.creator)}
              </div>
              <div className="note-body">
                <div className="note-head">
                  <span className="nm">{note?.creator}</span>
                  <span className="ts">{note?.created_at}</span>
                  <button
                    className="note-del"
                    onClick={(e) => onRemoveNote(e, note?.id)}
                    aria-label={__('Delete note', 'easyjobs')}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
                <div className="note-text">
                  {renderText(note?.note, note?.tags)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyIllustration
            svg={NOTES_SVG}
            text={__('No Notes found.', 'easyjobs')}
          />
        )}
      </div>

      {/* Composer */}
      <div
        className={`composer composer--bottom ${
          addNoteLoading ? 'ej-loading' : ''
        }`}
        ref={wrapRef}
      >
        <textarea
          ref={taRef}
          placeholder={__('Add a note here', 'easyjobs')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {mentionOpen && managers.length > 0 ? (
          <div className="mention-pop">
            {managers.map((m, i) => (
              <button
                key={i}
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(m);
                }}
              >
                <span className="mav">{initials(m?.name)}</span>
                {m?.name}
              </button>
            ))}
          </div>
        ) : null}

        {emojiOpen ? (
          <div className="emoji-pop">
            {QUICK_EMOJI.map((e) => (
              <button
                key={e}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  addEmoji(e);
                }}
              >
                {e}
              </button>
            ))}
          </div>
        ) : null}

        <div className="composer-foot">
          <div className="cd-note-tools">
            <button
              type="button"
              className="cd-tool"
              onClick={() => {
                setEmojiOpen((v) => !v);
                setMentionOpen(false);
              }}
              aria-label={__('Emoji', 'easyjobs')}
            >
              <Icon name="emoji" />
            </button>
            <button
              type="button"
              className="cd-tool"
              onClick={() => {
                setMentionOpen((v) => !v);
                setEmojiOpen(false);
              }}
              disabled={!managers.length}
              aria-label={__('Tag a manager', 'easyjobs')}
            >
              <Icon name="at" />
            </button>
          </div>
          <div className="composer-btns">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setText('');
                setTags([]);
              }}
            >
              {__('Cancel', 'easyjobs')}
            </button>
            <button
              type="button"
              className="cd-send"
              onClick={save}
              disabled={!text.trim().length}
              aria-label={__('Save note', 'easyjobs')}
            >
              <Icon name="send" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotesCard;
