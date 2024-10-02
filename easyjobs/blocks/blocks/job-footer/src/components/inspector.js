/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
    PanelBody,
    TabPanel,
    BaseControl,
} from "@wordpress/components";

/**
 * Internal depencencies
 */
import { 
    TypoprefixGalleryTitle
 } from "./typographyConstants";

import objAttributes from "./attributes";

const {
    ColorControl,
    DynamicInputControl,
    TypographyDropdown,
} = window.EJControls;

const Inspector = ({ attributes, setAttributes }) => {
    const {
        resOption,
        lifeAtTitle,
        galleryTitleColor,
    } = attributes;
    
    const resRequiredProps = {
        setAttributes,
        resOption,
        attributes,
        objAttributes,
    };

    return (
        <InspectorControls key="controls">
            <div className="eb-panel-control">
                <TabPanel
                    className="eb-parent-tab-panel"
                    activeClass="active-tab"
                    tabs={[
                        {
                            name: "content",
                            title: __("Content", "essential-blocks"),
                            className: "eb-tab general",
                        },
                        {
                            name: "styles",
                            title: __("Style", "essential-blocks"),
                            className: "eb-tab styles",
                        },
                        {
                            name: "advance",
                            title: __("Advanced", "essential-blocks"),
                            className: "eb-tab advance",
                        },
                    ]}
                >
                    {(tab) => (
                        <div className={"eb-tab-controls " + tab.name}>
                            {tab.name === "content" && (
                                <>
                                    <PanelBody
                                        title={__(
                                            "Text change",
                                            "essential-blocks"
                                        )}
                                        initialOpen={true}
                                    >
                                        <DynamicInputControl
                                            label="Gallery Section Title"
                                            attrName="lifeAtTitle"
                                            inputValue={lifeAtTitle}
                                            setAttributes={setAttributes}
                                            onChange={(text) => setAttributes({ lifeAtTitle: text })}
                                        />
                                    </PanelBody>
                                </>
                            )}
                            {tab.name === "styles" && (
                                <>
                                    <PanelBody
                                        title={__("Gallery", "essential-blocks")}
                                        initialOpen={true}
                                    >
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__(
                                                    "Gallery Title",
                                                    "essential-blocks"
                                                )}
                                            </h3>
                                        </BaseControl>
                                        <ColorControl
                                            label={__(
                                                "Color",
                                                "essential-blocks"
                                            )}
                                            color={galleryTitleColor}
                                            onChange={(newTextColor) =>
                                                setAttributes({
                                                    galleryTitleColor: newTextColor,
                                                })
                                            }
                                        />
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "essential-blocks"
                                            )}
                                            typographyPrefixConstant={
                                                TypoprefixGalleryTitle
                                            }
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                        />
                                    </PanelBody>
                                </>
                            )}
                            {/* {tab.name === "advance" && (
                                <>
                                    <AdvancedControls
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                    />
                                </>
                            )} */}
                        </div>
                    )}
                </TabPanel>
            </div>
        </InspectorControls>
    );
};

export default Inspector;