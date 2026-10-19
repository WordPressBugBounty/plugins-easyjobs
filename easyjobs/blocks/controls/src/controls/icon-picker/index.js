import { IconPicker, DisplayIcon } from "wordpress-icon-picker";
import { getIconType } from "../../helpers/index";
import "./style.scss";

const enableFontawesome = EssentialBlocksLocalize?.fontAwesome == "true" ? true : false;

export const EBIconPicker = (props) => {
    const defaultValue = !enableFontawesome && getIconType(props.value) == "fontawesome" ? "" : props.value;
    const _props = { ...props, disableFontAwesome: !enableFontawesome, value: defaultValue };
    return <IconPicker {..._props} />;
};

export const EBDisplayIcon = (props) => {
    return <DisplayIcon {...props} />;
};
