import { __ } from "@wordpress/i18n";
import { Button, ButtonGroup, BaseControl } from "@wordpress/components";

import WithResBtns from "./responsive-btn";

export default function ResponsiveAlignControl(props) {
    const { baseLabel, controlName, resRequiredProps, options } = props;
    const { attributes, setAttributes, resOption } = resRequiredProps;

    const resBtnProps = {
        label: baseLabel,
        resRequiredProps,
        options,
        controlName,
    };

    const { [`${controlName}`]: desktopAlign, [`TAB${controlName}`]: tabAlign, [`MOB${controlName}`]: mobileAlign } = attributes;

    return (
        <div className="responsiveAlignControlWrapper">
            {resOption == "Desktop" && (
                <WithResBtns resBtnProps={resBtnProps}>
                    <BaseControl>
                        <ButtonGroup>
                            {options.map((item, index) => (
                                <Button
                                    key={index}
                                    isPrimary={desktopAlign === item.value}
                                    isSecondary={desktopAlign !== item.value}
                                    onClick={() =>
                                        setAttributes({
                                            [`${controlName}`]: item.value,
                                        })
                                    }
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </BaseControl>
                </WithResBtns>
            )}
            {resOption == "Tablet" && (
                <WithResBtns resBtnProps={resBtnProps}>
                    <BaseControl>
                        <ButtonGroup>
                            {options.map((item, index) => (
                                <Button
                                    key={index}
                                    isPrimary={tabAlign === item.value}
                                    isSecondary={tabAlign !== item.value}
                                    onClick={() =>
                                        setAttributes({
                                            [`TAB${controlName}`]: item.value,
                                        })
                                    }
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </BaseControl>
                </WithResBtns>
            )}
            {resOption == "Mobile" && (
                <WithResBtns resBtnProps={resBtnProps}>
                    <BaseControl>
                        <ButtonGroup>
                            {options.map((item, index) => (
                                <Button
                                    key={index}
                                    isPrimary={mobileAlign === item.value}
                                    isSecondary={mobileAlign !== item.value}
                                    onClick={() =>
                                        setAttributes({
                                            [`MOB${controlName}`]: item.value,
                                        })
                                    }
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </BaseControl>
                </WithResBtns>
            )}
        </div>
    );
}
