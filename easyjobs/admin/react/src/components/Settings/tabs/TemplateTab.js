import React, { useEffect, useState } from 'react';

const TemplateTab = ({
  loading,
  templateSettings,
  getTemplateSettings,
  saveTemplateSettings,
}) => {
  const { __ } = wp.i18n;
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(undefined);

  useEffect(() => {
    getTemplateSettings();
  }, []);

  const handleTemplateChange = (e, template) => {
    e.preventDefault();
    saveTemplateSettings(template.slug);
  };

  return (
    <div className={loading ? 'ej-loading' : ''}>
      <div className={`section-title-wrap mb-0 d-flex justify-content-between`}>
        <div className="section-title margin-deliver">
          {__('Templates', 'easyjobs')}
        </div>
      </div>
      <div className={'row'}>
        {(templateSettings &&
          templateSettings.map((template) => (
            <div className="col-md-6" key={template.id}>
              <div
                className={`template-card ${
                  template.selected ? 'selected' : ''
                }`}
              >
                <div className="template-card-header"></div>
                <div className="template-card-body">
                  <img src={template.url} alt="" className="img-fluid w-100" />
                </div>
                <div className="template-card-footer">
                  <h4 className="section-title">{template.name}</h4>
                  <div className="action-buttons">
                    <button
                      className="semi-button semi-button-success mr-3"
                      onClick={(e) => setPreviewTemplate(template)}
                    >
                      {__('Preview', 'easyjobs')}
                    </button>
                    <button
                      disabled={template.selected}
                      className="semi-button semi-button-primary"
                      onClick={(e) => handleTemplateChange(e, template)}
                    >
                      {(template.selected && 'Selected') || 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))) || (
          <>
            {loading ? (
              <>
                <img
                  className="img-fluid w-100"
                  src={`${easyJobsJs.plugin_url}admin/assets/img/placeholder-full.jpeg`}
                  style={{ width: '100%' }}
                />
              </>
            ) : (
              <h4 className="empty-message">
                {__('No templates found', 'easyjobs')}
              </h4>
            )}
          </>
        )}
      </div>

      {previewTemplate && (
        <div className="modal fade show ej-react-modal ej-preview-modal">
          <div
            role="document"
            className="modal-dialog modal-xl modal-dialog-centered"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-uppercase">
                  Preview: {previewTemplate.name} template
                </h4>
                <button
                  type="button"
                  className="close"
                  onClick={(e) => setPreviewTemplate(undefined)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <iframe
                  src={previewTemplate.preview}
                  frameBorder="0"
                  className="ej-preview"
                />
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateTab;
