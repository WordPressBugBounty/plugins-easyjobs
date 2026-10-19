/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { TextControl, TextareaControl } from "@wordpress/components";
import { applyFilters } from "@wordpress/hooks";
import { extractDynamicStingInfo } from "../../../helpers";
export function DynamicInputControl(props) {
    const {
        label,
        attrName,
        inputValue,
        setAttributes,
        onChange,
        placeholder,
        help,
        isTextarea,
        type
    } = props;

    const [fieldValue, setFieldValue] = useState("");
    const [fieldPlaceholder, setFieldPlaceholder] = useState("");
    const [readOnly, setReadOnly] = useState(false);
    const [didMount, setDidMount] = useState(false);

    const dynamicTag = window?.EssentialBlocksProLocalize
        ? EssentialBlocksProLocalize.eb_dynamic_tags + "/"
        : "dynamic-tags/";

    useEffect(() => {
        setDidMount(true);
        if (inputValue && inputValue.startsWith(dynamicTag, 0)) {
            setReadOnly(true);
            setFieldPlaceholder(extractDynamicStingInfo(inputValue));
        }
    }, []);

    useEffect(() => {
        if (didMount && EssentialBlocksProLocalize) {
            if (typeof fieldValue === "string" && fieldValue.startsWith(dynamicTag, 0)) {
                setReadOnly(true);
                setAttributes({ [attrName]: fieldValue });
                setFieldPlaceholder(extractDynamicStingInfo(fieldValue));
            }
            else {
                setReadOnly(false);
                setAttributes({ [attrName]: fieldValue });
            }
        }
    }, [fieldValue]);

    return (
        <div className="eb-dynamic-input-control">
            {!isTextarea && (
                <>
                    <TextControl
                        label={__(label, "essential-blocks")}
                        value={readOnly ? fieldPlaceholder : inputValue}
                        placeholder={placeholder || ""}
                        onChange={(text) => (readOnly ? false : onChange(text))}
                        readOnly={readOnly}
                        help={help}
                    />
                </>
            )}
            {isTextarea && (
                <>
                    <TextareaControl
                        label={__(label, "essential-blocks")}
                        placeholder={placeholder || ""}
                        value={readOnly ? fieldPlaceholder : inputValue}
                        onChange={(text) => (readOnly ? false : onChange(text))}
                        readOnly={readOnly}
                        help={help}
                    />
                </>
            )}
            {applyFilters(
                "essential_blocks_dynamic_input_control",
                "",
                fieldValue,
                setFieldValue,
                inputValue,
                type
            )}
        </div>
    );
}
