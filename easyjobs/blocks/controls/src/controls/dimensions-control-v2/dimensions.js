import { __ } from "@wordpress/i18n";
import { dispatch } from "@wordpress/data";
import { useState, useEffect, useRef } from "@wordpress/element";
import {
    handleDesktopBtnClick,
    handleTabBtnClick,
    handleMobileBtnClick,
} from "../../helpers";

export default function DimensionsControl({
    top,
    right,
    bottom,
    left,
    onChange,
    neededProps,
    disableLeftRight,
    disableLinkedButton,
    isTextField,
    setIsTextField,
    selectedUnit,
    useCustomValue
}) {
    const [dimensions, setDimensions] = useState({
        top,
        right,
        bottom,
        left,
    });

    const {
        baseLabel,
        resOption,
        forBorderRadius,
        setAttributes,
        dimensionIsLinked,
        controlName,
    } = neededProps;

    const [isLinked, setIsLinked] = useState(dimensionIsLinked);
    const prevUnitRef = useRef(selectedUnit);
    const showTextField = isTextField || selectedUnit === '';
    const onButtonClick = () => setIsLinked(!isLinked);
    const onInputChange = (event) => {
        let { name, value } = event.target;
        if (isLinked) {
            setDimensions({
                top: value,
                right: value,
                bottom: value,
                left: value,
            });
        } else {
            setDimensions((prevDimensions) => ({ ...prevDimensions, [name]: value }));
        }
    };

    useEffect(() => {
        onChange(dimensions);
    }, [dimensions]);

    useEffect(() => {
        setAttributes({
            [`${controlName}isLinked`]: isLinked,
        });
        const { top: value } = dimensions;
        if (isLinked) {
            setDimensions({
                top: value,
                right: value,
                bottom: value,
                left: value,
            });
        }
    }, [isLinked]);

    useEffect(() => {
        if (useCustomValue) {
            const newUnit = selectedUnit;
            const oldUnit = prevUnitRef.current;

            const hasUnit = ['', 'px', 'em', '%'];
            if ((hasUnit.includes(oldUnit) && newUnit === "") || (oldUnit === "" && hasUnit.includes(newUnit))) {
                setDimensions({
                    top: "",
                    bottom: "",
                    right: "",
                    left: ""
                })
            }

            prevUnitRef.current = newUnit;
        }
    }, [selectedUnit])

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

    return (
        <div className="dimention-container">
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

            <div
                className={`input-container ${disableLeftRight ? "left-right-disabled" : ""
                    }`}
            >
                <div className="input-wrapper">
                    <input
                        type={showTextField ? "text" : "number"}
                        name="top"
                        value={dimensions.top}
                        onChange={onInputChange}
                    />
                    <label className="dimentions-input-label">
                        {forBorderRadius ? " " : "Top"}
                    </label>
                </div>
                {/* {!disableLeftRight && ( */}
                <div className="input-wrapper">
                    <input
                        type={(disableLeftRight || showTextField) ? "text" : "number"}
                        name="right"
                        // value={disableLeftRight ? "auto" : dimensions.right}
                        value={disableLeftRight ? undefined : dimensions.right}
                        disabled={disableLeftRight ? true : false}
                        onChange={onInputChange}
                    />
                    <label className="dimentions-input-label">
                        {forBorderRadius ? " " : "Right"}
                    </label>
                </div>
                {/* )} */}
                <div className="input-wrapper">
                    <input
                        type={showTextField ? "text" : "number"}
                        name="bottom"
                        value={dimensions.bottom}
                        onChange={onInputChange}
                    />
                    <label className="dimentions-input-label">
                        {forBorderRadius ? " " : "Bottom"}
                    </label>
                </div>
                {/* {!disableLeftRight && ( */}
                <div className="input-wrapper">
                    <input
                        type={(disableLeftRight || showTextField) ? "text" : "number"}
                        name="left"
                        // value={disableLeftRight ? "auto" : dimensions.left}
                        value={disableLeftRight ? undefined : dimensions.left}
                        disabled={disableLeftRight ? true : false}
                        onChange={onInputChange}
                    />
                    <label className="dimentions-input-label">
                        {forBorderRadius ? " " : "Left"}
                    </label>
                </div>
                {/* )} */}
                {!disableLinkedButton && (
                    <button
                        className={`linked-btn components-button is-button dashicons dashicons-${isLinked ? "admin-links is-primary" : "editor-unlink is-default"
                            }`}
                        onClick={onButtonClick}
                    />
                )}

            </div>
            {isTextField && (
                <p class="eb-help-text components-base-control__help">{__("Add custom value e.g. ", "essential-blocks")}{<code>auto</code>}</p>
            )}
        </div>
    );
}
