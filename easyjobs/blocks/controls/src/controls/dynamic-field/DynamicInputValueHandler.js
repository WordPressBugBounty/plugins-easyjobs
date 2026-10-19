
/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import {
    RichText
} from "@wordpress/block-editor";
import { doAction, applyFilters } from "@wordpress/hooks";

export default function DynamicInputValueHandler(props) {
    const {
        value,
        tagName,
        className
    } = props

    const [content, setContent] = useState("")

    useEffect(() => {
        applyFilters(
            'essential_blocks_dynamic_value_handle',
            content,
            setContent,
            value,
            tagName || 'span',
            className || ''
        )

        setContent(<RichText {...props} />)
    }, [value, tagName])

    return content
}
