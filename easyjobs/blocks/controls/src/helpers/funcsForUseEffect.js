//
// function to mimmik css when clicking the responsive buttons in the inspector panel
export const mimmikCssForResBtns = () => { };

//
// IMPORTANT: The following fuction declaration must be below the 'mimmikCssForResBtns' function declaration
// function to mimmik css for responsive preview when clicking the buttons in the 'Preview button of wordpress' located beside the 'update' button
export const mimmikCssForPreviewBtnClick = () => { };

// IMPORTANT: The following fuction declaration must be below the 'mimmikCssForResBtns' function declaration
// function to mimmik css for responsive preview when clicking the buttons in the 'Preview button of wordpress' located beside the 'update' button while any block is selected and it's inspector panel is mounted in the DOM
export const mimmikCssOnPreviewBtnClickWhileBlockSelected = () => () => { };

//
// this function is for creating a unique blockId for each block's unique className
export const duplicateBlockIdFix = ({
    BLOCK_PREFIX,
    blockId,
    setAttributes,
    select,
    clientId,
}) => {
    const unique_id = BLOCK_PREFIX + "-" + Math.random().toString(36).substring(2, 7);

    /**
     * Define and Generate Unique Block ID
     */
    if (!blockId) {
        setAttributes({ blockId: unique_id });
    }

    /**
     * Assign New Unique ID when duplicate BlockId found
     * Mostly happens when User Duplicate a Block
     */

    const all_blocks = select("core/block-editor").getBlocks();

    let duplicateFound = false;
    const fixDuplicateBlockId = (blocks) => {
        if (duplicateFound) return;
        for (const item of blocks) {
            const { innerBlocks } = item;
            if (item.attributes.blockId === blockId) {
                if (item.clientId !== clientId) {
                    setAttributes({ blockId: unique_id });
                    duplicateFound = true;
                    return;
                } else if (innerBlocks.length > 0) {
                    fixDuplicateBlockId(innerBlocks);
                }
            } else if (innerBlocks.length > 0) {
                fixDuplicateBlockId(innerBlocks);
            }
        }
    };

    fixDuplicateBlockId(all_blocks);
};
