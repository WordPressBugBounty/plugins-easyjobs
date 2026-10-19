import { __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";

import WithResBtns from "./responsive-btn";

const ResponsiveSelectController = ({
	baseLabel,
	controlName,
	resRequiredProps,
	options,
}) => {
	const { attributes, setAttributes, resOption } = resRequiredProps;

	const resBtnProps = {
		label: baseLabel,
		resRequiredProps,
		options,
		controlName,
	};

	const attrName = `${controlName}Option`;
	const tabAttrName = `TAB${controlName}Option`;
	const mobAttrName = `MOB${controlName}Option`;

	const firstOption = options[0].value;

	const desktopValue = attributes[attrName] || firstOption;
	const tabValue = attributes[tabAttrName] || desktopValue;
	const mobValue = attributes[mobAttrName] || tabValue;

	if (resOption == "Desktop") {
		return (
			<div
				className={`responsiveSelectControl ${
					attributes[attrName] ? "" : "jhapsha"
				}`}
			>
				<WithResBtns resBtnProps={resBtnProps}>
					<SelectControl
						// label={__(baseLabel, "essential-blocks")}
						value={desktopValue}
						options={options}
						onChange={(value) =>
							setAttributes({
								[attrName]: value,
							})
						}
					/>
				</WithResBtns>
			</div>
		);
	}

	if (resOption == "Tablet") {
		return (
			<div
				className={`responsiveSelectControl ${
					attributes[tabAttrName] ? "" : "jhapsha"
				}`}
			>
				<WithResBtns resBtnProps={resBtnProps}>
					<SelectControl
						// label={__(baseLabel, "essential-blocks")}
						value={tabValue}
						options={options}
						onChange={(value) =>
							setAttributes({
								[tabAttrName]: value,
							})
						}
					/>
				</WithResBtns>
			</div>
		);
	}

	if (resOption == "Mobile") {
		return (
			<div
				className={`responsiveSelectControl ${
					attributes[mobAttrName] ? "" : "jhapsha"
				}`}
			>
				<WithResBtns resBtnProps={resBtnProps}>
					<SelectControl
						// label={__(baseLabel, "essential-blocks")}
						value={mobValue}
						options={options}
						onChange={(value) =>
							setAttributes({
								[mobAttrName]: value,
							})
						}
					/>
				</WithResBtns>
			</div>
		);
	}
};

export default ResponsiveSelectController;
