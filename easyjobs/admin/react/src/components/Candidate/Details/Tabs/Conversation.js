import React, { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import { Icon } from '../icons';
import ChatThread from '../../../Messages/ChatThread';
import { mapThread } from '../../../Messages/transform';
import {
  getConversationThread,
  sendMessage,
} from '../../../../redux/actions/messagesActions';

/**
 * Conversation panel — reuses the plugin's Messages thread + composer for a
 * single candidate. The applicant is addressed by its `generated_id` (hashid),
 * which the backend now surfaces on candidateDetails.candidate.generated_id.
 * Data flows through the existing messages saga/reducer, so pagination,
 * merge-on-load-older and send all behave exactly like the Messages screen.
 */
const Conversation = ({
  candidateDetails,
  thread,
  threadLoading,
  sending,
  threadPage,
  threadLastPage,
  threadLoadingMore,
  candidateLimit,
  getConversationThread: fetchThread,
  sendMessage: postMessage,
}) => {
  const candidate = candidateDetails?.candidate || {};
  const generatedId = candidate?.generated_id;

  useEffect(() => {
    if (generatedId) fetchThread({ id: generatedId });
  }, [generatedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const mappedThread = thread && thread !== 'unable' ? mapThread(thread) : null;

  const handleSend = ({ message, file }) => {
    if (!generatedId) return;
    postMessage({ id: generatedId, message, file });
  };
  const handleLoadOlder = () => {
    if (!generatedId || threadLoadingMore || threadPage >= threadLastPage)
      return;
    fetchThread({ id: generatedId, page: threadPage + 1 }, true);
  };

  // Same messaging gate as the Messages screen (candidate-limit / plan cap).
  const limitReached = !!(candidateLimit && candidateLimit.percentage >= 100);
  const composerDisabled = !!(
    thread &&
    thread !== 'unable' &&
    thread.is_interested &&
    limitReached
  );
  const upgradeUrl = (candidateLimit && candidateLimit.upgrade_url) || '';

  if (!generatedId) {
    return (
      <div className="panel active" data-testid="ej-candidate-tabpanel">
        <section className="ejc-card conv-card">
          <div className="thread">
            <div className="empty">
              <div className="ic">
                <Icon name="chat" />
              </div>
              <h3>{__('Conversation unavailable', 'easyjobs')}</h3>
              <p>
                {__(
                  'This candidate’s conversation could not be loaded.',
                  'easyjobs',
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="panel active" data-testid="ej-candidate-tabpanel">
      <div className="ej-messages ejc-conv">
        <ChatThread
          thread={mappedThread}
          loading={threadLoading}
          sending={sending}
          onSend={handleSend}
          disabled={composerDisabled}
          upgradeUrl={upgradeUrl}
          hasMore={threadPage < threadLastPage}
          loadingMore={threadLoadingMore}
          onLoadOlder={handleLoadOlder}
          hideStatus
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  thread: state.messages.thread,
  threadLoading: state.messages.threadLoading,
  sending: state.messages.sending,
  threadPage: state.messages.threadPage,
  threadLastPage: state.messages.threadLastPage,
  threadLoadingMore: state.messages.threadLoadingMore,
  candidateLimit: state.dashboard && state.dashboard.candidateLimit,
});

const mapDispatchToProps = (dispatch) => ({
  getConversationThread: (params, append) =>
    dispatch(getConversationThread(params, append)),
  sendMessage: (params) => dispatch(sendMessage(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
