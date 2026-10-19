import { dispatch } from "@wordpress/data";

import {
	handleDesktopBtnClick,
	handleTabBtnClick,
	handleMobileBtnClick,
} from "../../helpers";

export default function WithResBtns({
	children,
	resBtnProps: { label, resRequiredProps, controlName },
}) {
	const {
		setAttributes,
		resOption,
		objAttributes,
		attributes,
	} = resRequiredProps;

	const desktopAttr = `${controlName}Option`;
	const tabAttr = `TAB${controlName}Option`;
	const mobileAttr = `MOB${controlName}Option`;

	const onReset = () => {
		if (resOption === "Desktop") {
			setAttributes({
				[desktopAttr]: objAttributes[desktopAttr].default,
			});
		} else if (resOption === "Tablet") {
			setAttributes({
				[tabAttr]: objAttributes[tabAttr].default,
			});
		} else if (resOption === "Mobile") {
			setAttributes({
				[mobileAttr]: objAttributes[mobileAttr].default,
			});
		}
	};

	const getMethodForSettingPreviewDeviceType = () => {
		const { editor_type } = eb_conditional_localize || {};

		if (editor_type === "edit-site") {
			return dispatch("core/edit-site").__experimentalSetPreviewDeviceType;
		} else if (editor_type === "edit-post") {
			return dispatch("core/edit-post").__experimentalSetPreviewDeviceType;
		}

		// fallback in case the above condition
		console.log("---fallen back, please check style handler");
		return dispatch("core/edit-post").__experimentalSetPreviewDeviceType;
	};

	return (
		<div className={`responsive-btn-wrapper`}>
			<div className="responsive-btn">
				<span className="responsive-btn-label components-base-control__label">
					{label}
				</span>
				<span
					onClick={() =>
						handleDesktopBtnClick({
							setPreviewDeviceType: getMethodForSettingPreviewDeviceType(),
							setAttributes,
						})
					}
					className={`typoResButton dashicons dashicons-desktop ${
						resOption === "Desktop" ? "active" : " "
					}`}
				></span>
				<span
					onClick={() =>
						handleTabBtnClick({
							setPreviewDeviceType: getMethodForSettingPreviewDeviceType(),
							setAttributes,
						})
					}
					className={`typoResButton dashicons dashicons-tablet ${
						resOption === "Tablet" ? "active" : " "
					}`}
				></span>
				<span
					onClick={() =>
						handleMobileBtnClick({
							setPreviewDeviceType: getMethodForSettingPreviewDeviceType(),
							setAttributes,
						})
					}
					className={`typoResButton dashicons dashicons-smartphone ${
						resOption === "Mobile" ? "active" : " "
					}`}
				></span>
			</div>
			<div className="eb-component-wrapper">
				{children}
				<button className="eb-range-reset-button" onClick={onReset}>
					<span className="dashicon dashicons dashicons-image-rotate"></span>
				</button>
			</div>
		</div>
	);
}
