import { PanelBody, PanelRow, SelectControl, ToggleControl, TextControl, Button, ButtonGroup, BaseControl, TabPanel, RangeControl } from "@wordpress/components";
import { useEffect, useState, useRef } from "@wordpress/element";
import Select2 from "react-select";

const ProSelectControl = (props) => {
    const {
        options,
        onChange,
        selectType = 'selectcontrol'
    } = props;

    const [isProPreset, setIspro] = useState(false);

    const changePreset = (selected) => {
        let filteredItem = '';

        if (typeof selected === 'object') {
            filteredItem = options.filter((item) => item.value === selected.value);
        }
        else {
            filteredItem = options.filter((item) => item.value === selected);
        }

        if (EssentialBlocksLocalize?.is_pro_active === "false" && filteredItem[0] && filteredItem[0].isPro) {
            setIspro(true);
        } else {
            setIspro(false);
            onChange(selected);
        }
    };

    return (
        <>
            {selectType === 'selectcontrol' && (
                <SelectControl {...props} onChange={(selected) => changePreset(selected)} />
            )}
            {selectType === 'select2' && (
                <Select2 {...props} onChange={(selected) => changePreset(selected)} />
            )}
            {isProPreset && (
                <>
                    <div className="eb-is-pro-message">
                        <span className="dashicons dashicons-lock"></span>
                        <span>
                            <a href={EssentialBlocksLocalize?.upgrade_pro_url} target="_blank">
                                Upgrade to pro
                            </a>{" "}
                            for this premium feature!
                        </span>
                    </div>
                </>
            )}
        </>
    );
};

export default ProSelectControl;
