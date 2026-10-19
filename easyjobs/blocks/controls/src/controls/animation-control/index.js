/**
 * External Dependencies
*/

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { InspectorControls, PanelColorSettings } from "@wordpress/block-editor";
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
    TextareaControl,
    Button,
    ButtonGroup,
    BaseControl,
    TabPanel,
} from "@wordpress/components";
import { select } from "@wordpress/data";

import {
    ANIMATION_STYLES,
} from "./constants";

export default function AnimationControls(props) {
    const { attributes, setAttributes } = props;

    const {
        animationData,
    } = attributes;


    const changeAnimation = (name, value) => {
        setAttributes({
            animationData: {
                ...animationData,
                [name]: value,
            }
        });
    }

    return (
        <>
            {animationData && (
                <PanelBody title={__("Animation", "essential-blocks")} initialOpen={false}>
                    <SelectControl
                        label={__("Select Animation", "essential-blocks")}
                        value={animationData.style}
                        options={ANIMATION_STYLES}
                        onChange={(style) => changeAnimation("style", style)}
                        id={"eb-animation-style"}
                    />
                    <RangeControl
                        label={__("Animation Speed", "essential-blocks")}
                        value={animationData.speed}
                        onChange={(style) => changeAnimation("speed", style)}
                        min={0}
                        max={5000}
                        allowReset={true}
                    />
                    <RangeControl
                        label={__("Animation Delay", "essential-blocks")}
                        value={animationData.delay}
                        onChange={(style) => changeAnimation("delay", style)}
                        min={0}
                        max={5000}
                        allowReset={true}
                    />
                </PanelBody>
            )}

        </>
    )
}