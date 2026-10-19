import { registerBlockType } from "@wordpress/blocks";
import { select } from "@wordpress/data";
import { startCase } from "lodash";
import WebFont from "webfontloader";
const { omit } = lodash;

export {
    generateBackgroundControlStyles,
    generateBackgroundAttributes,
} from "./backgroundHelpers";

export {
    generateTypographyAttributes,
    generateTypographyStyles,
} from "./typoHelpers";

export {
    generateDimensionsAttributes,
    generateDimensionsControlStyles,
} from "./dimensionHelpers";

export {
    generateBorderShadowAttributes,
    generateBorderShadowStyles,
} from "./borderShadowHelpers";

export {
    generateResponsiveRangeStyles,
    generateResponsiveRangeAttributes,
} from "./responsiveRangeHelpers";

export {
    generateResponsiveSelectControlAttributes,
    generateResponsiveSelectControlStyles,
} from "./responsiveSelectControlHelpers";

export {
    generateResponsiveAlignAttributes,
    generateResponsiveAlignStyles,
} from "./responsiveAlignControlHelpers";

export {
    generateTextControllerAttributes,
    generateTextControllerStyles,
} from "./responsiveTextControllerHelpers";

export {
    textInsideForEdit,
    generateRandomNumber,
    hardMinifyCssStrings,
    softMinifyCssStrings,
    isCssExists,
    ucFirst,
} from "./miniHelperFuncs";

export {
    handleDesktopBtnClick,
    handleTabBtnClick,
    handleMobileBtnClick,
} from "./handlingPreviewBtnsHelpers";

export {
    mimmikCssForResBtns,
    mimmikCssForPreviewBtnClick,
    mimmikCssOnPreviewBtnClickWhileBlockSelected,
    duplicateBlockIdFix,
} from "./funcsForUseEffect";

export { ebImageSizes, EbImageSizeSelector } from "./coreSettings";

export { stripHtmlTags, isValidHtml } from "./stripFunc";

export { getFlipTransform, getButtonClasses } from "./flipboxHelpers";

export { StyleComponent } from "./StyleComponent";
export { AdvancedColorPicker } from "./AdvancedColorPicker";

export {
    generateShapeDividerStyles,
    generateShapeDividerAttributes,
} from "./shapeDividerHelpers";

export {
    fetchOptionsData,
    saveOptionsData,
    fetchEBSettingsData,
    saveEBSettingsData,
    resetEBSettingsData,
    fetchFormBlockData,
    saveFormBlockData,
    installPlugin,
} from "./apiFetch";

export { ShapeDividerContent } from "./shapeDividerContent";
export { ShapeDividerList } from "./shapeDividerList";

//Check if the string is JSON or plain String
export const ebJsonStringCheck = (string) => {
    try {
        var o = JSON.parse(string);
        if (o && typeof o === "object") {
            return true;
        }
    } catch (e) { }

    return false;
};

/**
 * String to Component Name
 * @param {*} string
 */
export const ebStringToComponentName = (str) => {
    const arr = str.split("_");
    for (var i = 0;i < arr.length;i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join("");
};

/**
 * filter blocks clientID by name
 * @param {array} blocks
 * @param {string} name
 * @returns {array}
 */
export const filterBlocksByName = (blocks, name) => {
    let filteredBlocks = [];

    function extractIds(blocks, name) {
        if (blocks && blocks.length > 0) {
            blocks.map((block) => {
                if (block.name && block.name === name) {
                    filteredBlocks.push(block.clientId);
                }
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    extractIds(block.innerBlocks, name);
                }
            });
        }
    }
    extractIds(blocks, name);

    return filteredBlocks;
};

/**
 * get blocks parent block ClientId by name
 * @param {string} blocks
 * @param {string} name
 * @returns {string}
 */
export const getBlockParentClientId = (clientId, parent_block_name) => {
    let parentId = false;
    const parentIds = select("core/block-editor").getBlockParents(clientId);
    if (typeof parentIds === "object" && parentIds.length > 0) {
        parentId = parentIds.filter(
            (id) =>
                parent_block_name ===
                select("core/block-editor").getBlockName(id)
        );
        if (typeof parentId === "object" && parentId.length > 0) {
            parentId = parentId[0];
        }
    }
    return parentId;
};

/**
 * get all blocks client ID from given blocks
 * @param {array} blocks
 * @returns
 */
export const getAllBlockClientIds = (blocks = []) => {
    if (typeof blocks !== 'object' || (typeof blocks === 'object' && blocks.length === 0)) {
        const { getBlocks } = select('core/editor');
        blocks = getBlocks()
    }
    const getAllInnerBlockClientIds = (block) => {
        let clientIds = [block.clientId];
        if (block.innerBlocks && block.innerBlocks.length > 0) {
            block.innerBlocks.forEach(innerBlock => {
                const innerBlockClientIds = getAllInnerBlockClientIds(innerBlock);
                clientIds = clientIds.concat(innerBlockClientIds);
            });
        }
        return clientIds;
    };

    let allClientIds = [];
    blocks.forEach(block => {
        const blockClientIds = getAllInnerBlockClientIds(block);
        allClientIds = allClientIds.concat(blockClientIds);
    });

    return allClientIds;
};

/**
 * Conditional Register Block
 */
export const ebConditionalRegisterBlockType = (metadata, settings) => {
    const { name } = metadata;
    const { eb_wp_version, all_blocks } = EssentialBlocksLocalize;

    //Generate Block key from block full name
    const regex = /^essential-blocks\//;
    if (regex.test(name)) {
        let block_key = name.replace(
            /essential-blocks\/pro-|essential-blocks\/|-/g,
            "_"
        );
        if (block_key.charAt(0) === "_") {
            block_key = block_key.substring(1);
        }

        //If block visibility false, don't register
        if (
            all_blocks[block_key] &&
            all_blocks[block_key]?.visibility === "false"
        ) {
            return false;
        }
    }

    if (eb_wp_version >= 5.8) {
        registerBlockType({ name, ...metadata }, settings);
    } else {
        registerBlockType(`${name}`, {
            ...omit(metadata, ["name"]),
            ...settings,
        });
    }
};

/**
 * Get icon class from attribute value
 */
export const getIconClass = (value) => {
    if (!value) {
        return ''
    }
    if (!value.includes("fa-")) {
        return "dashicon dashicons " + value;
    }

    return value;
};

/**
 * Get icon type from attribute value
 */
export const getIconType = (value) => {
    if (value && value.includes("fa-")) {
        return "fontawesome";
    }

    return "dashicon";
};

/**
 * Get icon type html
 */
export const ebRenderIcon = (iconType, className, icon) => {
    if (iconType === 'dashicon') {
        return '<span class="dashicon dashicons ' + icon + ' ' + className + '"></span>';
    } else if (iconType === 'fontawesome') {
        return '<i class="' + icon + ' ' + className + '"></i>';
    }

    // Handle other icon types or return an error message if needed.
    return 'Invalid icon type';
}

/** Check if the given color is gradient or not
 * @param {*} color
 * @returns {boolean}
 */
export const isGradientColor = (color) => {
    if (color.includes("gradient")) {
        return true
    }
    // Regular expression to check for common gradient keywords
    const gradientRegex = /(linear|radial)-gradient|conic-gradient/;

    // Use the test method to check if the color contains a gradient keyword
    return gradientRegex.test(color);
}

export const ImgPlaceholder = "data:image/svg+xml,%3Csvg width='700' height='700' viewBox='0 0 700 700' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='700' height='700' fill='%23EAEEF9'/%3E%3Cpath d='M408.679 482.748L339.433 353.977L394.137 261.498L510.471 482.748H408.679ZM292.346 320.498L379.596 482.748H205.096L292.346 320.498ZM255.992 290.998C235.914 290.998 219.637 274.488 219.637 254.123C219.637 233.757 235.914 217.248 255.992 217.248C276.069 217.248 292.346 233.757 292.346 254.123C292.346 274.488 276.069 290.998 255.992 290.998Z' fill='%23CAD2DF'/%3E%3C/svg%3E%0A";;
/**
 *
 * @param {string} url
 * @returns {string}
 */
export const sanitizeURL = function (url) {
    if (!url) {
        return '#';
    }
    if (url.startsWith('/') || url.startsWith('#') || (EssentialBlocksLocalize?.is_pro_active === "true" && url.startsWith(EssentialBlocksProLocalize.eb_dynamic_tags + '/', 0))) {
        return url;
    }

    try {
        const urlObject = new URL(url);

        // Check if the protocol is valid (allowing only 'http' and 'https')
        if (!['http:', 'https:', 'ftp:', 'ftps:', 'mailto:', 'news:', 'irc:', 'irc6:', 'ircs:', 'gopher:', 'nntp:', 'feed:', 'telnet:', 'mms:', 'rtsp:', 'sms:', 'svn:', 'tel:', 'fax:', 'xmpp:', 'webcal:', 'urn:'].includes(urlObject.protocol)) {
            throw new Error('Invalid protocol');
        }

        // If all checks pass, return the sanitized URL
        return urlObject.toString();
    } catch (error) {
        return '#';
    }
}
/**
 * Extract Dynamic Value for placeholder value
 *
 * @param {string} inputString
 * @returns {string}
 */
export const extractDynamicStingInfo = (inputString) => {
    // Regex to capture category and settings JSON
    const regex = /eb-dynamic-tags\/([^\/]+)\/[^=]+=(\{.*\}|\[.*\])/;
    const match = inputString.match(regex);

    if (!match) return {};

    const category = match[1];
    const settingsString = match[2];
    let settings;

    try {
        settings = JSON.parse(settingsString);
    } catch (error) {
        console.error("Failed to parse settings JSON:", error);
        return {};
    }

    let key = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(); // Capitalize the category name
    let value, pathPart;

    // Determine the value based on the category
    switch (category.toLowerCase()) {
        case 'tags':
        case 'terms':
            value = startCase(settings.taxonomy) || "Unknown Taxonomy";
            break;
        case 'other':
        case 'current':
            pathPart = inputString.split('/')[4];
            value = startCase(pathPart);
            break;
        case 'site':
            pathPart = inputString.split('/')[3];
            value = startCase(pathPart);
            break;
        case 'query':
            value = settings.postTypes && settings.postTypes[0] ? startCase(settings.postTypes[0].label) : "Unknown Type";
            break;
        default:
            value = "Unknown";
    }

    return `{${key}: ${value}}`;
}



export const loadGoogleFontEditor = (googleFontFamily) => {
    if (googleFontFamily.length > 0) {
        let webFontConfig = {
            google: {
                families: googleFontFamily,
            },
            context: frames["editor-canvas"],
        };
        WebFont.load(webFontConfig);
    }
}
