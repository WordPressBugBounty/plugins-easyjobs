/**
 * Maps the easy.jobs `conversation/*` API payloads to the shapes the Messages UI
 * components expect. Backend reference: docs/api/conversation.md and
 * app/Transformer/ConversationTransformer.php.
 */

/**
 * Decode HTML entities (e.g. &nbsp;, &amp;) for plain-text display. The list
 * preview is tag-stripped server-side but entities stay encoded, so a trailing
 * non-breaking space would otherwise render as the literal text "&nbsp;".
 */
function decodeEntities(str) {
  if (!str) return '';
  if (typeof document === 'undefined') return str;
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

/**
 * The list endpoint returns a Laravel paginator: `{ current_page, data: [...], total }`.
 * Accept either that wrapper or a plain array and return the underlying rows.
 */
export function extractList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }
  return [];
}

/**
 * Conversation list item → ConversationList row.
 * API item: { id (generated_id), user, job, message, created_at, unread_message }
 */
export function mapConversations(payload) {
  const list = extractList(payload);
  return list.map((c) => {
    const message = c.message && !Array.isArray(c.message) ? c.message : null;
    return {
      id: c.id, // generated_id (string) — used to address the thread/send routes
      name: (c.user && c.user.name) || '',
      role: (c.job && c.job.title) || '',
      time: message ? message.created_at : '',
      preview: decodeEntities(message ? message.message : ''),
      avatar: (c.user && c.user.image) || '',
      read: message ? !!message.is_seen : false,
      unread: !!c.unread_message,
    };
  });
}

/**
 * Splits a backend `created_at` string ("14 Feb, 2024, 05:07 AM") into a date
 * part and a time. Falls back gracefully for unexpected formats.
 */
function splitCreatedAt(createdAt) {
  if (!createdAt) {
    return { date: '', time: '' };
  }
  const parts = String(createdAt)
    .split(',')
    .map((p) => p.trim());
  if (parts.length >= 3) {
    return {
      date: `${parts[0]}, ${parts[1]}`,
      time: parts.slice(2).join(', '),
    };
  }
  return { date: createdAt, time: '' };
}

/**
 * Strip a trailing time (and optional "(UTC)") from a date-time string.
 * "18 May, 2025 11:44 AM" → "18 May, 2025".
 */
function dateOnly(value) {
  if (!value) return '';
  return String(value)
    .replace(/\s+\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?\s*(\([^)]*\))?\s*$/i, '')
    .trim();
}

const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/** "14 Feb, 2024" → "WEDNESDAY, 14 FEB 2024" (best-effort; raw fallback). */
function weekdayLabel(datePart) {
  const m = String(datePart).match(/(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})/);
  if (!m) {
    return String(datePart).toUpperCase();
  }
  const day = parseInt(m[1], 10);
  const mon = MONTHS[m[2].slice(0, 3).toLowerCase()];
  const year = parseInt(m[3], 10);
  let weekday = '';
  if (typeof mon !== 'undefined') {
    const d = new Date(year, mon, day);
    if (!isNaN(d.getTime())) {
      weekday = d
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toUpperCase();
    }
  }
  const dd = String(day).padStart(2, '0');
  const base = `${dd} ${m[2].toUpperCase()} ${year}`;
  return weekday ? `${weekday}, ${base}` : base;
}

/** Classify a message item by its reference type. */
function blockKind(item) {
  if (item.pipeline) return 'pipeline';
  if (item.note) return 'note';
  return 'message';
}

/**
 * Colour modifier for a pipeline-change pill, derived from its text.
 * Mirrors the header-badge logic: selected = green, rejected = red,
 * everything else (applied, shortlisted, …) = neutral.
 */
function pipelineStatusClass(text) {
  if (/reject/i.test(text)) return 'is-rejected';
  if (/select/i.test(text)) return 'is-selected';
  return 'is-applied';
}

/**
 * Build day groups, each containing ordered "blocks":
 *  - { kind: 'run', isAdmin, name, image, time, messages: [{ id, html }] }
 *  - { kind: 'pipeline', id, text, time, status }
 *  - { kind: 'note', id, name, time }
 * Consecutive plain messages from the same sender are merged into one run.
 */
function buildGroups(rawMessages) {
  const groups = [];
  let currentDate = null;
  let group = null;
  let run = null;

  const pushRun = () => {
    if (run) {
      group.blocks.push(run);
      run = null;
    }
  };

  rawMessages.forEach((m) => {
    const { date, time } = splitCreatedAt(m.created_at);
    if (date !== currentDate) {
      pushRun();
      currentDate = date;
      group = { label: weekdayLabel(date), blocks: [] };
      groups.push(group);
    }

    const kind = blockKind(m);

    if (kind === 'pipeline') {
      pushRun();
      group.blocks.push({
        kind: 'pipeline',
        id: m.id,
        text: m.pipeline,
        time,
        status: pipelineStatusClass(m.pipeline),
      });
      return;
    }
    if (kind === 'note') {
      pushRun();
      group.blocks.push({ kind: 'note', id: m.id, name: m.name, time });
      return;
    }

    // Plain message → extend or start a run for this sender.
    const sameSender =
      run && run.isAdmin === !!m.isAdmin && run.name === (m.name || '');
    if (!sameSender) {
      pushRun();
      run = {
        kind: 'run',
        isAdmin: !!m.isAdmin,
        name: m.name || '',
        image: m.image || '',
        time,
        messages: [],
      };
    }
    run.time = time; // run meta shows the latest message time
    run.messages.push({
      id: m.id,
      html: m.message || '',
      attachment: m.attachment || '',
      mediaName: m.mediaName || m.media_name || '',
      mediaSize: m.mediaSize || m.media_size || '',
      assessment: m.assessment || null,
    });
  });

  pushRun();
  return groups;
}

/**
 * Single applicant payload → ChatThread `thread` prop.
 */
export function mapThread(applicant) {
  if (!applicant || typeof applicant !== 'object') {
    return null;
  }

  const name = (applicant.user && applicant.user.name) || '';

  // `pipeline` may be a string or a stage object { id, label, type, ... }.
  const pipeline = applicant.pipeline;
  const pipelineLabel =
    pipeline && typeof pipeline === 'object'
      ? pipeline.label || pipeline.type || ''
      : pipeline || '';

  // Badge colour (app: type 99 = selected/green, 100 = rejected/red, else applied/blue).
  const pipelineType =
    pipeline && typeof pipeline === 'object' ? pipeline.type : null;
  let statusClass = '';
  if (pipelineType === 99 || /select/i.test(pipelineLabel)) {
    statusClass = 'is-selected';
  } else if (pipelineType === 100 || /reject/i.test(pipelineLabel)) {
    statusClass = 'is-rejected';
  }

  const rawMessages =
    applicant.messages && Array.isArray(applicant.messages.data)
      ? applicant.messages.data
      : [];

  // `name` from list items is plain; the thread head shows the candidate name + photo.
  const plainName = String(name)
    .replace(/<[^>]*>/g, '')
    .trim();

  return {
    id: applicant.id,
    name: plainName,
    image: (applicant.user && applicant.user.image) || '',
    first: plainName ? plainName.split(' ')[0] : '',
    role: (applicant.job && applicant.job.title) || '',
    status: pipelineLabel,
    statusClass,
    // Read/unread toolbar toggle. `read: true` means the "Mark As Read" action is
    // available (conversation currently unread). `show_button` gates the whole toggle.
    read: !!applicant.read,
    showButton: applicant.show_button !== false,
    draft: applicant.draft_message || '',
    appliedDate: dateOnly(applicant.applied_date),
    conversationStart: dateOnly(applicant.conversation_start),
    groups: buildGroups(rawMessages),
    empty: rawMessages.length === 0,
  };
}
