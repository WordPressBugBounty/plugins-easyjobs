import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import {
    BaseControl,
    PanelRow,
    Dropdown,
    Tooltip,
    TabPanel,
    ColorPicker,
    ColorPalette,
    GradientPicker,
    ColorIndicator,
    Button
} from "@wordpress/components";
import { select } from "@wordpress/data";

const colorBallStyles = {
    padding: 2,
    borderRadius: 0,
    background: "white",
    border: "1px solid #ebebeb",
};

const colorStyles = {
    height: 16,
    width: 16,
    borderRadius: "0%",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)",
};
import { AdvancedColorPicker } from "../../helpers";

const ColorControl = ({ label, color, onChange, defaultColor, isGradient = false }) => {
    const [bgColor, setBgColor] = useState(null);

    useEffect(() => {
        onChange(bgColor);
    }, [bgColor]);

    useEffect(() => {
        setBgColor(color || defaultColor);
    }, []);

    const themeGradientColors = [];
    const generateColorArray = (colors) => {
        const updatedColorArr = []
        if (!colors || colors.length === 0) {
            return updatedColorArr
        }
        colors.map((item) => {
            updatedColorArr.push({
                color: `var(${item?.var})`,
                name: item?.name,
                slug: item?.slug
            })
        })

        return updatedColorArr;
    };
    const [isEssentialBlocksStore, setIsEssentialBlocksStore] = useState(false);
    useEffect(() => {
        if (select("essential-blocks")) {
            setIsEssentialBlocksStore(true);
        }
    }, []);

    const modifiedGradientColors = isEssentialBlocksStore ? generateColorArray(select("essential-blocks").getGradientColors()) : undefined;
    const modifiedCustomGradientColors = isEssentialBlocksStore ? generateColorArray(select("essential-blocks").getCustomGradientColors()) : undefined;

    return (
        <BaseControl label={label || ""} className="eb-color-base">
            <Dropdown
                contentClassName={"eb-color-picker"}
                popoverProps={{ focusOnMount: false }}
                renderToggle={({ isOpen, onToggle }) => (
                    <>
                        <ColorIndicator
                            className={'eb-color-control-indecator'}
                            colorValue={bgColor}
                            onClick={onToggle}
                            aria-label={bgColor || "default"}
                        />
                        {/* <Tooltip text={bgColor || "default"}>
                            <div className="eb-color-ball" style={bgColor && colorBallStyles}>
                                <div
                                    style={{
                                        ...colorStyles,
                                        backgroundColor: bgColor,
                                    }}
                                    aria-expanded={isOpen}
                                    onClick={onToggle}
                                    aria-label={bgColor || "default"}
                                ></div>
                            </div>
                        </Tooltip> */}
                    </>
                )}
                renderContent={() => (
                    <div className={`eb-color-picker-content ${!isGradient ? 'eb-gradient-picker-disabled' : ''}`}>
                        <TabPanel
                            className="eb-colorpicker-tab-panel"
                            activeClass="active-tab"
                            tabs={[
                                {
                                    name: "solid",
                                    title: "Solid",
                                    className: "eb-tab solid",
                                },
                                {
                                    name: "gradient",
                                    title: "Gradient",
                                    className: "eb-tab gradient",
                                }
                            ]}
                        >
                            {(tab) => (
                                <div className={"eb-tab-controls" + tab.name}>
                                    {tab.name === "solid" && (
                                        <>
                                            <AdvancedColorPicker
                                                color={bgColor}
                                                setColor={setBgColor}
                                            />
                                        </>
                                    )}
                                    {tab.name === "gradient" && isGradient && (
                                        <>
                                            <PanelRow>Gradient Colors</PanelRow>
                                            <GradientPicker
                                                __nextHasNoMargin
                                                value={color}
                                                onChange={(color) => {
                                                    setBgColor(color)
                                                }}
                                                asButtons={true}
                                                clearable={true}
                                                gradients={themeGradientColors || []}
                                            />

                                            {modifiedGradientColors && modifiedGradientColors.length > 0 && (
                                                <>
                                                    <PanelRow>Global Gradient Colors</PanelRow>
                                                    <div className="eb-colorpicker-gradient-color-list__global">
                                                        {modifiedGradientColors.map((item, index) => (
                                                            <>
                                                                <ColorIndicator
                                                                    className={`eb-colorpicker-gradient-color ${color === item.color ? 'current' : ''}`}
                                                                    colorValue={item?.color}
                                                                    onClick={() => setBgColor(item.color)}
                                                                />
                                                            </>
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                            {modifiedCustomGradientColors && modifiedCustomGradientColors.length > 0 && (
                                                <>
                                                    <PanelRow>Custom Gradient Colors</PanelRow>
                                                    <div className="eb-colorpicker-gradient-color-list__global">
                                                        {modifiedCustomGradientColors.map((item, index) => (
                                                            <>
                                                                <ColorIndicator
                                                                    key={index}
                                                                    className={`eb-colorpicker-gradient-color ${color === item.color ? 'current' : ''}`}
                                                                    colorValue={item?.color}
                                                                    onClick={() => setBgColor(item.color)}
                                                                />
                                                            </>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </TabPanel>
                    </div>
                )}
            />
            <Button
                isSmall
                className={`eb-color-undo ${!bgColor && 'eb-disable-reset'}`}
                icon="image-rotate"
                style={{
                    transform: "scaleX(-1) rotate(90deg)",
                }}
                onClick={() => {
                    setBgColor(defaultColor);
                }}
                disabled={bgColor ? false : true}
            ></Button>
        </BaseControl>
    );
};

export default ColorControl;
