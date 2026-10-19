import {
    useBlockProps,
} from "@wordpress/block-editor";
import classnames from "classnames";
import { duplicateBlockIdFix } from "../../helpers/funcsForUseEffect";
import { select } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

const BlockPropsEdit = ({ attributes, setAttributes, clientId, blockPrefix, rootClass = "eb-guten-block-main-parent-wrapper", style, children }) => {
    const { className, blockId } = attributes;

    // this useEffect is for creating a unique id for each block's unique className by a random unique number
    useEffect(() => {
        const BLOCK_PREFIX = blockPrefix;
        duplicateBlockIdFix({
            BLOCK_PREFIX,
            blockId,
            setAttributes,
            select,
            clientId,
        });
    }, []);
    const blockProps = useBlockProps({
        className: classnames(className, `${rootClass} root-${blockId}`),
    });
    return (
        <div {...blockProps}>
            {style}
            {/* Render the children passed to this component */}
            {children}
        </div>
    );
};

const BlockPropsSave = ({ attributes, rootClass = "", children }) => {
    const { className, blockId } = attributes;
    const blockProps = useBlockProps.save({
        className: classnames(className, `${rootClass} root-${blockId}`)
    });
    return (
        <div {...blockProps}>
            {/* Render the children passed to this component */}
            {children}
        </div>
    );
};

export const BlockProps = {
    Edit: BlockPropsEdit,
    Save: BlockPropsSave
}

