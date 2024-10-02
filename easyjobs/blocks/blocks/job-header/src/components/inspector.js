/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { InspectorControls, MediaUpload } from "@wordpress/block-editor";
import {
    PanelBody,
    ToggleControl,
    TabPanel,
    BaseControl,
    __experimentalDivider as Divider,
    ButtonGroup,
    Button,
} from "@wordpress/components";

/**
 * Internal depencencies
 */
import {
    CONTENT_POSITION,
    INFO_WIDTH,
    INFO_MARGIN,
    INFO_PADDING,
    INFO_BOX_SHADOW,
    WEBSITE_LINK_BTN_BG,
    WEBSITE_LINK_BTN_BDR_SHADOW,
    WEBSITE_LINK_BTN_PADDING,
    DESCRIPTION_POSITION,
    INFO_BACKGROUND,
} from "./constants";

import { 
    TypoprefixCompanyName, 
    TypoprefixLocationName, 
    TypoprefixWebsiteLink, 
    TypoprefixDescription, 
} from "./typographyContants";

import objAttributes from "./attributes";

const {
    ColorControl,
    DynamicInputControl,
    ImageAvatar,
    BackgroundControl,
    ResponsiveRangeController,
    ResponsiveDimensionsControl,
    TypographyDropdown,
    BorderShadowControl,
} = window.EJControls;

const Inspector = ({ attributes, setAttributes }) => {
    const {
        resOption,
        changeCoverImage,
        changeLogoImage,
        companyName,
        websiteLinkText,
        coverImgUrl,
        coverImgId,
        logoImgUrl,
        logoImgId,
        infoAlign,
        descriptionAlign,
        companyNameColor,
        locationNameColor,
        websiteLinkBtnColor,
        websiteLinkBtnColorHvr,
        descriptionColor,

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
                                            "EasyJobs",
                                            "essential-blocks"
                                        )}
                                    >
                                        <ToggleControl
                                            label={__(
                                                "Change Cover Image",
                                                "essential-blocks"
                                            )}
                                            checked={changeCoverImage}
                                            onChange={() =>
                                                setAttributes({
                                                    changeCoverImage: !changeCoverImage,
                                                    coverImgUrl: null
                                                })
                                            }
                                        />
                                        { ! coverImgUrl && changeCoverImage && (
                                            <MediaUpload
                                                onSelect={({ id, url, alt }) =>
                                                    setAttributes({
                                                        coverImgUrl: url,
                                                        coverImgId: id,
                                                        coverImgAlt: alt,
                                                    })
                                                }
                                                type="image"
                                                value={coverImgId}
                                                render={({ open }) => {
                                                    return (
                                                        <Button
                                                            className="eb-background-control-inspector-panel-img-btn components-button"
                                                            label={__("Upload Image", "essential-blocks")}
                                                            icon="format-image"
                                                            onClick={open}
                                                        />
                                                    );
                                                }}
                                            />
                                        )}
                                        {coverImgUrl && changeCoverImage && (
                                            <ImageAvatar
                                                imageUrl={coverImgUrl}
                                                onDeleteImage={() =>
                                                    setAttributes({
                                                        coverImgUrl: null,
                                                    })
                                                }
                                            />
                                        )}
										<ToggleControl
                                            label={__(
                                                "Change Logo",
                                                "essential-blocks"
                                            )}
                                            checked={changeLogoImage}
                                            onChange={() =>
                                                setAttributes({
                                                    changeLogoImage: !changeLogoImage,
                                                    logoImgUrl: null,
                                                })
                                            }
                                        />
                                        { ! logoImgUrl && changeLogoImage && (
                                            <MediaUpload
                                                onSelect={({ id, url, alt }) =>
                                                    setAttributes({
                                                        logoImgUrl: url,
                                                        logoImgId: id,
                                                        logoImgAlt: alt,
                                                    })
                                                }
                                                type="image"
                                                value={logoImgId}
                                                render={({ open }) => {
                                                    return (
                                                        <Button
                                                            className="eb-background-control-inspector-panel-img-btn components-button"
                                                            label={__("Upload Image", "essential-blocks")}
                                                            icon="format-image"
                                                            onClick={open}
                                                        />
                                                    );
                                                }}
                                            />
                                        )}
                                        {logoImgUrl && changeLogoImage && (
                                            <ImageAvatar
                                                imageUrl={logoImgUrl}
                                                onDeleteImage={() =>
                                                    setAttributes({
                                                        logoImgUrl: null,
                                                    })
                                                }
                                            />
                                        )}
                                    </PanelBody>
                                    <PanelBody
                                        title={__(
                                            "Text change",
                                            "essential-blocks"
                                        )}
                                        initialOpen={false}
                                    >
                                        <DynamicInputControl
                                            label="Company Name"
                                            attrName="companyName"
                                            inputValue={companyName}
                                            setAttributes={setAttributes}
                                            onChange={(text) => setAttributes({ companyName: text })}
                                        />
                                        <DynamicInputControl
                                            label="Website Link Text"
                                            attrName="websiteLinkText"
                                            inputValue={websiteLinkText}
                                            setAttributes={setAttributes}
                                            onChange={(text) => setAttributes({ websiteLinkText: text })}
                                        />
                                    </PanelBody>
                                </>
                            )}
                            {tab.name === "styles" && (
                                <>
                                    <PanelBody
                                        title={__("General", "essential-blocks")}
                                        initialOpen={false}
                                    >
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__(
                                                    "Background",
                                                    "essential-blocks"
                                                )}
                                            </h3>
                                        </BaseControl>
                                        <BackgroundControl
                                            controlName={INFO_BACKGROUND}
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                            noOverlay={true}
                                            noMainBgi={true}
                                        />
                                        <Divider />
                                        <BaseControl
                                            label={__(
                                                "Alignment",
                                                "essential-blocks"
                                            )}
                                        >
                                            <ButtonGroup id="eb-button-group-alignment">
                                                {CONTENT_POSITION.map(
                                                    (item, index) => (
                                                        <Button
                                                            key={index}
                                                            isPrimary={
                                                                infoAlign ===
                                                                item.value
                                                            }
                                                            isSecondary={
                                                                infoAlign !==
                                                                item.value
                                                            }
                                                            onClick={() =>
                                                                setAttributes({
                                                                    infoAlign:
                                                                        item.value,
                                                                })
                                                            }
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    )
                                                )}
                                            </ButtonGroup>
                                        </BaseControl>
                                        <Divider />
                                        <ResponsiveRangeController
                                            baseLabel={__(
                                                "Width",
                                                "essential-blocks"
                                            )}
                                            controlName={INFO_WIDTH}
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                            min={0}
                                            max={100}
                                            step={1}
                                        />
                                        <ResponsiveDimensionsControl
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                            controlName={INFO_MARGIN}
                                            baseLabel={__(
                                                "Margin",
                                                "essential-blocks"
                                            )}
                                        />
                                        <ResponsiveDimensionsControl
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                            controlName={INFO_PADDING}
                                            baseLabel={__(
                                                "Padding",
                                                "essential-blocks"
                                            )}
                                        />
                                        <Divider />
                                        <BorderShadowControl
                                            controlName={INFO_BOX_SHADOW}
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                            noBorder={true}
                                        />
                                    </PanelBody>
                                    <PanelBody
                                        title={__("Company Info", "essential-blocks")}
                                        initialOpen={false}
                                    >
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__(
                                                    "Company Name",
                                                    "essential-blocks"
                                                )}
                                            </h3>
                                        </BaseControl>
                                        <ColorControl
                                            label={__(
                                                "Color",
                                                "essential-blocks"
                                            )}
                                            color={companyNameColor}
                                            onChange={(newTextColor) =>
                                                setAttributes({
                                                    companyNameColor: newTextColor,
                                                })
                                            }
                                        />
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "essential-blocks"
                                            )}
                                            typographyPrefixConstant={
                                                TypoprefixCompanyName
                                            }
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                        />
                                        <Divider />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__(
                                                    "Location",
                                                    "essential-blocks"
                                                )}
                                            </h3>
                                        </BaseControl>
                                        <ColorControl
                                            label={__(
                                                "Color",
                                                "essential-blocks"
                                            )}
                                            color={locationNameColor}
                                            onChange={(newTextColor) =>
                                                setAttributes({
                                                    locationNameColor: newTextColor,
                                                })
                                            }
                                        />
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "essential-blocks"
                                            )}
                                            typographyPrefixConstant={
                                                TypoprefixLocationName
                                            }
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                        />
                                        <Divider />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__(
                                                    "Website Link Button",
                                                    "essential-blocks"
                                                )}
                                            </h3>
                                        </BaseControl>
                                        <ColorControl
                                            label={__(
                                                "Color",
                                                "essential-blocks"
                                            )}
                                            color={websiteLinkBtnColor}
                                            onChange={(newTextColor) =>
                                                setAttributes({
                                                    websiteLinkBtnColor: newTextColor,
                                                })
                                            }
                                        />
                                        <ColorControl
                                            label={__(
                                                "Hover Color",
                                                "essential-blocks"
                                            )}
                                            color={websiteLinkBtnColorHvr}
                                            onChange={(newTextColor) =>
                                                setAttributes({
                                                    websiteLinkBtnColorHvr: newTextColor,
                                                })
                                            }
                                        />
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "essential-blocks"
                                            )}
                                            typographyPrefixConstant={
                                                TypoprefixWebsiteLink
                                            }
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                        />
                                        <BackgroundControl
                                            controlName={WEBSITE_LINK_BTN_BG}
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                            noOverlay={true}
                                            noMainBgi={true}
                                        />
                                        <Divider />
                                        <BorderShadowControl
                                            controlName={WEBSITE_LINK_BTN_BDR_SHADOW}
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                        />
                                        <Divider />
                                        <ResponsiveDimensionsControl
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                            controlName={WEBSITE_LINK_BTN_PADDING}
                                            baseLabel={__(
                                                "Padding",
                                                "essential-blocks"
                                            )}
                                        />
                                        <Divider />
                                        <BaseControl>
                                            <h3 className="eb-control-title">
                                                {__(
                                                    "Description",
                                                    "essential-blocks"
                                                )}
                                            </h3>
                                        </BaseControl>
                                        <BaseControl
                                            label={__(
                                                "Alignment",
                                                "essential-blocks"
                                            )}
                                        >
                                            <ButtonGroup id="eb-button-group-alignment">
                                                {DESCRIPTION_POSITION.map(
                                                    (item, index) => (
                                                        <Button
                                                            key={index}
                                                            isPrimary={
                                                                descriptionAlign ===
                                                                item.value
                                                            }
                                                            isSecondary={
                                                                descriptionAlign !==
                                                                item.value
                                                            }
                                                            onClick={() =>
                                                                setAttributes({
                                                                    descriptionAlign:
                                                                        item.value,
                                                                })
                                                            }
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    )
                                                )}
                                            </ButtonGroup>
                                        </BaseControl>
                                        <ColorControl
                                            label={__(
                                                "Color",
                                                "essential-blocks"
                                            )}
                                            color={descriptionColor}
                                            onChange={(newTextColor) =>
                                                setAttributes({
                                                    descriptionColor: newTextColor,
                                                })
                                            }
                                        />
                                        <TypographyDropdown
                                            baseLabel={__(
                                                "Typography",
                                                "essential-blocks"
                                            )}
                                            typographyPrefixConstant={
                                                TypoprefixDescription
                                            }
                                            resRequiredProps={
                                                resRequiredProps
                                            }
                                        />
                                        <Divider />
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