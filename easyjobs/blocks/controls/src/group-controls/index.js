/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect, useState, Fragment } from "@wordpress/element";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useSelect, select } from "@wordpress/data";
import { addFilter, applyFilters } from "@wordpress/hooks";
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal Dependencies
 */
import { softMinifyCssStrings, loadGoogleFontEditor } from "../helpers";
import classNames from "classnames";

import SupportPanel from "./components/supportPanel";
import {
    generateTextControllerAttributes,
    generateTextControllerStyles,
} from "../helpers/responsiveTextControllerHelpers";

/**
 * Add custom attribute for Essential Block
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes(settings) {
    if (typeof settings.attributes === "undefined") {
        return settings;
    }
    if (
        settings.attributes.blockRoot &&
        settings.attributes.blockRoot.default == "essential_block"
    ) {
        settings.attributes = {
            ...settings.attributes,
            classHook: {
                type: "string",
                default: "",
            },
            showBlockContent: {
                type: "boolean",
                default: true
            },
            commonStyles: {
                type: "object",
            },
            hideOnDesktop: {
                type: "boolean",
                default: false,
            },
            hideOnTab: {
                type: "boolean",
                default: false,
            },
            hideOnMobile: {
                type: "boolean",
                default: false,
            },
            isCustomCssError: {
                type: "boolean",
                default: false,
            },
            customCss: {
                type: "string",
            },
            animationData: {
                type: "object",
                default: {
                    style: "none",
                    speed: 1000,
                    delay: 0,
                },
            },
            wrapperOverflow: {
                type: "string",
                default: '',
            },
            ...generateTextControllerAttributes('zIndex'),
            ...applyFilters("eb_group_controls_attributes", "", settings)
        };
    }

    return settings;
}

/**
 * Add controls and generate styles on Advanced Block Panel.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes, isSelected, name, clientId } = props;

        const {
            blockRoot,
            blockId,
            commonStyles,
            hideOnDesktop,
            hideOnTab,
            hideOnMobile,
            isCustomCssError,
            classHook,
            customCss,
            animationData,
            wrapperOverflow
        } = attributes;

        const blockname = name.substring(name.lastIndexOf("/") + 1);
        const blockKey = blockname.replace(/-/g, "_");

        //Get Device type from "getDeviceType" Function
        const deviceType = useSelect((select) => {
            const { getDeviceType } = select(editorStore)
            const editorType = `core/${eb_conditional_localize?.editor_type || "edit-post"}`;
            let __experimentalGetPreviewDeviceType = select(editorType)?.__experimentalGetPreviewDeviceType;
            return getDeviceType?.() || __experimentalGetPreviewDeviceType?.() || 'Desktop';
        });

        // this useEffect is for setting the resOption attribute to desktop/tab/mobile depending on the added 'eb-res-option-' class
        useEffect(() => {
            if (blockRoot === "essential_block") {
                setAttributes({
                    resOption: deviceType,
                });
            }
        }, [deviceType]);

        /**
         * On change AnimationData Attribute
         */

        useEffect(() => {
            const classes =
                classHook &&
                classHook
                    .split(" ")
                    .filter((className) => !className.includes("eb___"))
                    .join(" ");
            if (
                typeof animationData === "object" &&
                animationData.style != "none"
            ) {
                const addClasses = classNames(
                    classes,
                    "eb_animation",
                    "eb___animated",
                    animationData.style
                );
                setAttributes({
                    classHook: removeDuplicateClasses(addClasses),
                });
            }

            if (
                typeof animationData === "object" &&
                animationData.style === "none"
            ) {
                const removeAnimateClass = classes.replace("eb_animation", "");
                setAttributes({
                    classHook: removeDuplicateClasses(removeAnimateClass),
                });
            }
        }, [animationData]);

        // typography
        useEffect(() => {
            let googleFontFamily = [];
            for (var key in attributes) {
                if (/^(\w+)FontFamily/.test(key)) {
                    if (attributes[key]?.length && attributes[key] !== "Default") {
                        googleFontFamily.push(
                            attributes[key] +
                            ":100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic"
                        );
                    }
                }
            }
            loadGoogleFontEditor(googleFontFamily)
        }, []);

        //Generate Styles for Animation
        const animationAllStyles =
            animationData && animationData.style != "none"
                ? `
            /* Css for Animation */
            body:not(.wp-admin) .eb-parent-${blockId}.eb_animation {
                visibility: hidden;
                opacity: 0;
                transition: ease-in ${animationData.speed}ms;
        }
            body:not(.wp-admin) .eb-parent-${blockId}.eb_animation.eb__animated {
            visibility: visible;
            opacity: 1;
        }
            .eb-parent-${blockId}.eb_animation.eb__animated {
                animation-duration: ${animationData.speed}ms;
        animation-delay: ${animationData.delay}ms;
    }
    `
                : "";

        //Remove Duplicate words Function
        const removeDuplicateClasses = (string) => {
            if (typeof string !== "string") {
                return string;
            }
            if (string.length === 0) {
                return string;
            }

            return string
                .split(" ")
                .filter(function (item, pos, self) {
                    return self.indexOf(item) == pos;
                })
                .join(" ");
        };

        // Set All Style in "blockMeta" Attribute
        if (blockRoot === "essential_block") {
            //Responsive Control CSS
            const responsiveStyleDesktop = `
                .eb-parent-${blockId} {
                    display: ${hideOnDesktop ? "none" : "block"};
                }
            `;
            const responsiveStyleDesktopEditor = `
                .wp-admin .eb-parent-${blockId} {
                    display: block;
                }
                ${hideOnDesktop ? `
                .wp-admin .eb-parent-${blockId} {
                    filter: saturate(0);
                }
                .wp-admin .eb-parent-${blockId}::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(125deg, rgba(0, 0, 0, .05), rgba(0, 0, 0, .05) 1px, transparent 2px, transparent 9px);
                    border: 1px solid rgba(0, 0, 0, .02);
                    z-index: 9999;
                }
                `: `
                    .wp-admin .eb-parent-${blockId} {
                        filter: unset;
                    }
                    .wp-admin .eb-parent-${blockId}::before {
                        content: none;
                    }
                `}
            `;

            const responsiveStyleTabEditor = `
                .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId} {
                    display: block;
                }
                ${hideOnTab ? `
                .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId} {
                    filter: saturate(0);
                }
                .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId}::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(125deg, rgba(0, 0, 0, .05), rgba(0, 0, 0, .05) 1px, transparent 2px, transparent 9px);
                    border: 1px solid rgba(0, 0, 0, .02);
                    z-index: 9999;
                }
                `: `
                .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId} {
                        filter: none;
                    }
                .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId}::before {
                    content: none;
                }
                `}
            `;
            const responsiveStyleTab = `
                .eb-parent-${blockId} {
                    display: ${hideOnTab ? "none" : "block"};
                }
            `;

            const responsiveStyleMobile = `
                .eb-parent-${blockId} {
                    display: ${hideOnMobile ? "none" : "block"};
                }
            `;
            const responsiveStyleMobileEditor = `
                .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId} {
                    display: block;
                }
                ${hideOnMobile ? `
                .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId} {
                    filter: saturate(0);
                }
                    .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId}::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(125deg, rgba(0, 0, 0, .05), rgba(0, 0, 0, .05) 1px, transparent 2px, transparent 9px);
                    border: 1px solid rgba(0, 0, 0, .02);
                    z-index: 9999;
                }
                `: `
                    .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId} {
                        filter: none;
                    }
                    .editor-styles-wrapper.wp-embed-responsive .eb-parent-${blockId}::before {
                        content: none;
                    }
                `}
            `;

            // Layout options css
            const {
                textControlStylesDesktop: zIndexDesktop,
                textControlStylesTab: zIndexTab,
                textControlStylesMobile: zIndexMobile,
            } = generateTextControllerStyles({
                controlName: 'zIndex',
                styleFor: "z-index",
                attributes,
            });

            let layoutDesktopStyle = `
                .root-${blockId} {
                    ${zIndexDesktop}
                    ${wrapperOverflow && wrapperOverflow.length > 0 ? `overflow: ${wrapperOverflow}` : ''};
                    position: relative;
                }
            `;

            let layoutTabStyle = `
                .root-${blockId} {
                    ${zIndexTab}
                }
            `;

            let layoutMobileStyle = `
                .root-${blockId} {
                    ${zIndexMobile}
                }
            `;

            // all css styles for large screen width (desktop/laptop) in strings ⬇
            let desktopAllStyles = softMinifyCssStrings(`
                ${responsiveStyleDesktop}
                ${animationAllStyles}
                ${layoutDesktopStyle}
            `);
            let desktopAllStylesEditor = softMinifyCssStrings(`
                ${responsiveStyleDesktopEditor}
                ${animationAllStyles}
                ${layoutDesktopStyle}
            `);

            // all css styles for Tab in strings ⬇
            let tabAllStyles = softMinifyCssStrings(`
                ${responsiveStyleTab}
                ${layoutTabStyle}
            `);
            let tabAllStylesEditor = softMinifyCssStrings(`
                ${responsiveStyleTabEditor}
                ${layoutTabStyle}
            `);

            // all css styles for Mobile in strings ⬇
            let mobileAllStyles = softMinifyCssStrings(`
                ${responsiveStyleMobile}
                ${layoutMobileStyle}
                `);
            let mobileAllStylesEditor = softMinifyCssStrings(`
                ${responsiveStyleMobileEditor}
                ${layoutMobileStyle}
                `);

            let styleObject = {
                desktop: desktopAllStyles,
                tab: tabAllStyles,
                mobile: mobileAllStyles,
            };

            let styleObjectEditor = {
                desktop: desktopAllStylesEditor,
                tab: tabAllStylesEditor,
                mobile: mobileAllStylesEditor,
            };
            styleObject = applyFilters("eb_common_style_object", styleObject, attributes);
            styleObjectEditor = applyFilters("eb_common_style_object_editor", styleObjectEditor, attributes);

            // Set All Style in "blockMeta" Attribute
            useEffect(() => {
                if (
                    JSON.stringify(commonStyles) != JSON.stringify(styleObject)
                ) {
                    setAttributes({
                        commonStyles: styleObject,
                    });
                }
            }, [attributes]);

            let _attributes = { ...attributes };

            /**
             * Set Block Defaults when new block inserted
             */
            const isBlockJustInserted = select("core/block-editor").wasBlockJustInserted(clientId);
            const blockDefaults = select("essential-blocks")?.getBlockDefaults();


            useEffect(() => {
                const modifyBlockKey = blockKey.startsWith('pro_') ? blockKey.replace('pro_', '') : blockKey;

                if (
                    isBlockJustInserted &&
                    blockRoot === "essential_block" &&
                    name.toLowerCase().includes("essential-blocks/") &&
                    eb_conditional_localize?.editor_type !== 'edit-widgets'
                ) {
                    if (blockDefaults?.[modifyBlockKey]) {
                        _attributes = {
                            ..._attributes,
                            ...blockDefaults[modifyBlockKey],
                            ...(!blockId && { showBlockContent: false })
                        };
                        setAttributes({ ..._attributes });
                    }
                }
            }, []);

            return (
                <Fragment>
                    <BlockEdit {...props} attributes={_attributes} />
                    <style>
                        {`
                            ${styleObjectEditor?.desktop}
                            @media all and (max-width: 1024px) {
                                /* tabcssStart */
                                ${styleObjectEditor?.tab}
                                /* tabcssEnd */

                            }
                            @media all and(max - width: 767px) {
                                /* mobcssStart */
                                ${styleObjectEditor?.mobile}
                                /* mobcssEnd */

                            }
                            /* Custom CSS*/
                            ${!isCustomCssError ? customCss?.replace(/eb_selector/g, "." + blockId) : ''}

                        `}
                    </style>

                    {name.toLowerCase().includes("essential-blocks/") && (
                        <SupportPanel blockName={name} />
                    )}
                </Fragment>
            );
        } else {
            return <BlockEdit {...props} />;
        }
    };
}, "withAdvancedControls");

/**
 * Add Attributes Filter
 */
addFilter("blocks.registerBlockType", "essential-blocks/global", addAttributes);

/**
 * Filter for modification of Edit Function
 */
addFilter("editor.BlockEdit", "essential-blocks/global", withAdvancedControls);

