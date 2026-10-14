import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
const ShortcodesTab = ({
  currentTab,
  loading,
  getShortcodes,
  shortcodes,
  shortcodesError,
}) => {
  useEffect(() => {
    getShortcodes();
  }, []);
  useEffect(() => {
    shortcodesError && toast.error(shortcodesError);
  }, [shortcodesError]);

  const [currentIndex, setCurrentIndex] = useState(undefined);

  const copyShortCode = (e, index, text) => {
    e.preventDefault();
    let textarea = document.createElement('textarea');
    textarea.id = 't';
    textarea.style.height = 0;
    document.body.appendChild(textarea);
    textarea.value = text;
    let selector = document.querySelector('#t');
    selector.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCurrentIndex(index);
  };

  return (
    <div
      className={`settings-tab ${currentTab === 'shortcodes' ? 'active' : ''} ${
        loading ? 'ej-loading' : ''
      }`}
    >
      <div className="section-title-wrap margin-deliver">
        <div className="section-title">Shortcodes</div>
      </div>
      <div className="form-box">
        <div className="key-settings shortcodes">
          <form action="#">
            {shortcodes &&
              shortcodes.map((each, i) => (
                <div className="form-group" key={`shortcode-${i}`}>
                  <label htmlFor="">{each.name}</label>
                  <div className="input-wrap">
                    <input type="text" value={each.code} disabled={true} />
                    <div
                      className="copy-shortcode"
                      onClick={(e) => copyShortCode(e, i, each.code)}
                    >
                      <i className="easyjobs-icon easyjobs-duplicate"></i>
                      <p className="code-tooltip">
                        {currentIndex === i ? 'Copied' : 'Copy to clipboard'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShortcodesTab;
