/**
 * WordPress dependencies
 */
import { InnerBlocks } from "@wordpress/block-editor";
const { BlockProps } = window.EJControls;
const Save = (props) => {
    const {attributes} = props;
    const {
        
    } = attributes;

    return (
        <>
            <BlockProps.Save {...props}>
                <div className="eb-accordion-inner">
                    <InnerBlocks.Content />
                </div>
            </BlockProps.Save>
        </>
    );
};

export default Save;