import EBTextControl from "./text-control";
import UnitControl from "../unit-control";

const ResponsiveTextController = ({
    resRequiredProps,
    controlName,
    baseLabel,
    useUnits,
    isNumber
}) => {
    const { attributes, setAttributes, resOption } = resRequiredProps;

    const {
        [`${controlName}Unit`]: dimensionUnit,
        [`${controlName}Value`]: dimensionValue,

        [`TAB${controlName}Unit`]: TABdimensionUnit,
        [`TAB${controlName}Value`]: TABdimensionValue,

        [`MOB${controlName}Unit`]: MOBdimensionUnit,
        [`MOB${controlName}Value`]: MOBdimensionValue,
    } = attributes;

    const UNITS = [
        { label: "px", value: "px" },
        { label: "em", value: "em" },
        { label: "%", value: "%" },
    ];

    const neededProps = {
        resOption,
        baseLabel,
        setAttributes,
        controlName,
        isNumber
    };

    return (
        <>
            {resOption == "Desktop" && (
                <>
                    {useUnits && (<>
                        <UnitControl
                            selectedUnit={dimensionUnit}
                            unitTypes={UNITS}
                            onClick={(dimensionUnit) =>
                                setAttributes({ [`${controlName}Unit`]: dimensionUnit })
                            }
                        />
                    </>)}

                    <EBTextControl
                        value={dimensionValue}
                        neededProps={neededProps}
                        onChange={(value) => setAttributes({ [`${controlName}Value`]: value })}
                    />
                </>
            )}
            {
                resOption == "Tablet" && (
                    <>
                        {useUnits && (
                            <>
                                <UnitControl
                                    selectedUnit={TABdimensionUnit}
                                    unitTypes={UNITS}
                                    onClick={(TABdimensionUnit) =>
                                        setAttributes({ [`TAB${controlName}Unit`]: TABdimensionUnit })
                                    }
                                />
                            </>
                        )}

                        <EBTextControl
                            value={TABdimensionValue}
                            neededProps={neededProps}
                            onChange={(value) =>
                                setAttributes({
                                    [`TAB${controlName}Value`]: value,
                                })
                            }
                        />
                    </>
                )
            }
            {
                resOption == "Mobile" && (
                    <>
                        {useUnits && (
                            <>
                                <UnitControl
                                    selectedUnit={MOBdimensionUnit}
                                    unitTypes={UNITS}
                                    onClick={(MOBdimensionUnit) =>
                                        setAttributes({ [`MOB${controlName}Unit`]: MOBdimensionUnit })
                                    }
                                />
                            </>
                        )}

                        <EBTextControl
                            value={MOBdimensionValue}
                            neededProps={neededProps}
                            onChange={(value) =>
                                setAttributes({
                                    [`MOB${controlName}Value`]: value,
                                })
                            }
                        />
                    </>
                )
            }
        </>
    );
}
export default ResponsiveTextController;
