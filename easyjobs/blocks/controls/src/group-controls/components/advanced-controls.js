/**
 * External Dependencies
*/
import Editor from '@monaco-editor/react';
/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { Suspense, useEffect, useState } from "@wordpress/element";
import {
    PanelBody,
    ToggleControl,
} from "@wordpress/components";


/**
 * Internal Dependencies
*/
import AnimationControls from '../../controls/animation-control';
import LayoutOptions from './layout-options';

export default function AdvancedControls(props) {
    const { attributes, setAttributes } = props;

    const {
        customCss,
        hideOnDesktop,
        hideOnTab,
        hideOnMobile,
        resOption
    } = attributes;

    const [errors, setErrors] = useState([]);
    const updateCss = (value) => {
        setAttributes({ customCss: value })
    }

    const handleEditorValidation = (markers) => {
        const currentErrors = markers.filter(marker => marker.severity === monaco.MarkerSeverity.Error);
        setErrors(currentErrors.reverse());
        currentErrors.length === 0 ? setAttributes({ isCustomCssError: false }) : setAttributes({ isCustomCssError: true });
    };

    const defaultCss = `
        eb_selector {
  /*position: relative;*/
}
@media (max-width: 767px) {
  eb_selector {
    /*display: block;*/
  }
}
`;

    return (
        <>
            <LayoutOptions attributes={attributes} setAttributes={setAttributes} resOption={resOption} />
            <PanelBody title={__("Responsive Control", "essential-blocks")} initialOpen={false}>
                <ToggleControl
                    label={__("Hide on Desktop", "essential-blocks")}
                    checked={hideOnDesktop}
                    onChange={() =>
                        setAttributes({ hideOnDesktop: !hideOnDesktop })
                    }
                />
                <ToggleControl
                    label={__("Hide on Tab", "essential-blocks")}
                    checked={hideOnTab}
                    onChange={() =>
                        setAttributes({ hideOnTab: !hideOnTab })
                    }
                />
                <ToggleControl
                    label={__("Hide on Mobile", "essential-blocks")}
                    checked={hideOnMobile}
                    onChange={() =>
                        setAttributes({ hideOnMobile: !hideOnMobile })
                    }
                />
            </PanelBody>

            <AnimationControls attributes={attributes} setAttributes={setAttributes} />

            <PanelBody title={__("Custom CSS", "essential-blocks")} initialOpen={false}>
                <Suspense fallback={"Loading..."}>
                    <Editor
                        height="250px"
                        defaultLanguage="css"
                        defaultValue={customCss || defaultCss.trim()}
                        onChange={updateCss}
                        options={{
                            minimap: {
                                enabled: false,
                            },
                            scrollbar: { vertical: "hidden" },
                            overviewRulerLanes: 0,
                            overviewRulerBorder: false,
                            quickSuggestions: true
                        }}
                        onValidate={handleEditorValidation}
                    />
                </Suspense>
                <p className="eb-help-text">{__('add "eb_selector" prefix to target block elements', 'essential-blocks')}</p>
                {errors.length > 0 && (
                    <div className="eb-css-error-messages-wrapper">
                        {errors.map((err, idx) => (
                            <div key={idx} className="eb-css-error-item">
                                <span className="eb-error-tag"><span class="dashicons dashicons-no-alt"></span>Error on line {err.startLineNumber}:</span> <span className="eb-error-text">{err.message}</span>
                            </div>
                        ))}
                    </div>
                )}
            </PanelBody>
        </>
    )
}
