import { dispatch } from "@wordpress/data";
import { useState, useEffect } from "@wordpress/element";

import {
    handleDesktopBtnClick,
    handleTabBtnClick,
    handleMobileBtnClick,
} from "../../helpers";

export default function EBTextControl({
    value,
    onChange,
    neededProps
}) {
    const [inputValue, setInputValue] = useState(value);

    const {
        baseLabel,
        resOption,
        setAttributes,
        controlName,
        isNumber,
    } = neededProps;


    const onInputChange = (event) => {
        let { name, value } = event.target;
        setInputValue(value);
    };

    useEffect(() => {
        onChange(inputValue);
    }, [inputValue]);

    const getMethodForSettingPreviewDeviceType = () => {
        const { editor_type } = eb_conditional_localize || {};

        if (editor_type === "edit-site") {
            return dispatch("core/edit-site").__experimentalSetPreviewDeviceType;
        } else if (editor_type === "edit-post") {
            return dispatch("core/edit-post").__experimentalSetPreviewDeviceType;
        }

        // fallback in case the above condition
        console.log("---fallen back, please check style handler");
        return dispatch("core/edit-post").__experimentalSetPreviewDeviceType;
    };

    const onReset = () => {
        setInputValue("");
        resOption == "Desktop"
            ?
            setAttributes({
                [`${controlName}Value`]: undefined,
                [`${controlName}Unit`]: "px",
            })
            : "";
        resOption == "Tablet"
            ? setAttributes({
                [`TAB${controlName}Value`]: undefined,
                [`TAB${controlName}Unit`]: "px",
            })
            : "";
        resOption == "Mobile"
            ? setAttributes({
                [`MOB${controlName}Value`]: undefined,
                [`MOB${controlName}Unit`]: "px",
            })
            : "";
    }

    return (
        <div className="dimention-container eb-component-wrapper">
            <div className="withResWrapperInDimension">
                <div className="dimention-label">{baseLabel}</div>
                <span
                    onClick={() =>
                        handleDesktopBtnClick({
                            setAttributes,
                            setPreviewDeviceType: getMethodForSettingPreviewDeviceType(),
                        })
                    }
                    className={`typoResButton dashicons dashicons-desktop ${resOption === "Desktop" ? "active" : " "
                        }`}
                ></span>
                <span
                    onClick={() =>
                        handleTabBtnClick({
                            setAttributes,
                            setPreviewDeviceType: getMethodForSettingPreviewDeviceType(),
                        })
                    }
                    className={`typoResButton dashicons dashicons-tablet ${resOption === "Tablet" ? "active" : " "
                        }`}
                ></span>
                <span
                    onClick={() =>
                        handleMobileBtnClick({
                            setAttributes,
                            setPreviewDeviceType: getMethodForSettingPreviewDeviceType(),
                        })
                    }
                    className={`typoResButton dashicons dashicons-smartphone ${resOption === "Mobile" ? "active" : " "
                        }`}
                ></span>
            </div>
            <div className={`input-container`}>
                <div className="text-input-wrapper">
                    <input
                        type={isNumber ? "number" : "text"}
                        name="value"
                        value={inputValue}
                        onChange={onInputChange}
                    />
                </div>
                <button className="eb-range-reset-button" onClick={onReset}>
                    <span className="dashicon dashicons dashicons-image-rotate"></span>
                </button>
            </div>
        </div>
    );
}
