import { __ } from "@wordpress/i18n";
import { PanelBody, SelectControl } from "@wordpress/components";
import ResponsiveTextController from "../../controls/responsive-text-control";
import { applyFilters } from "@wordpress/hooks";


export default function LayoutOptions(props) {
    const { attributes, setAttributes, resOption } = props;
    const objAttributes = attributes;
    const resRequiredProps = { attributes: attributes, setAttributes: setAttributes, resOption: resOption, objAttributes: objAttributes };
    const { wrapperOverflow } = attributes;

    return (
        <>
            <PanelBody title={__("Visibility Options", "essential-blocks")} initialOpen={false}>
                <ResponsiveTextController
                    resRequiredProps={resRequiredProps}
                    controlName="zIndex"
                    baseLabel={__("Z-Index", "essential-blocks")}
                    useUnits={false}
                    isNumber="true"
                />

                <SelectControl
                    label={__("Overflow", "essential-blocks")}
                    value={wrapperOverflow}
                    options={[
                        { label: 'Default', value: '' },
                        { label: 'Auto', value: 'auto' },
                        { label: 'Hidden', value: 'hidden' },
                        { label: 'Visible', value: 'visible' },
                        { label: 'Scroll', value: 'scroll' },
                    ]}
                    onChange={(newWrapperOverflow) => setAttributes({ wrapperOverflow: newWrapperOverflow })}
                />
                {applyFilters("eb_group_controls_layout", "", resRequiredProps)}
            </PanelBody>
        </>
    )
}
