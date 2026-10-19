export const generateResponsiveAlignAttributes = (controlName, defaults = {}) => {
    const { defaultAlign, defaultTabAlign, defaultMobileAlign } = defaults;
    const desktopAlign = defaultAlign
        ? {
              [`${controlName}`]: {
                  type: "string",
                  default: defaultAlign,
              },
          }
        : {
              [`${controlName}`]: {
                  type: "string",
              },
          };

    const tabAlign = defaultTabAlign
        ? {
              [`TAB${controlName}`]: {
                  type: "string",
                  default: defaultTabAlign,
              },
          }
        : {
              [`TAB${controlName}`]: {
                  type: "string",
              },
          };
    const mobileAlign = defaultMobileAlign
        ? {
              [`MOB${controlName}`]: {
                  type: "string",
                  default: defaultMobileAlign,
              },
          }
        : {
              [`MOB${controlName}`]: {
                  type: "string",
              },
          };

    return {
        ...desktopAlign,
        ...tabAlign,
        ...mobileAlign,
    };
};

// function to generate responsive range control styles for an element based on it's prefix
export const generateResponsiveAlignStyles = ({ controlName, property, attributes }) => {
    const { [`${controlName}`]: desktopAlign, [`TAB${controlName}`]: tabAlign, [`MOB${controlName}`]: mobileAlign } = attributes;

    const alignStylesDesktop = `${desktopAlign ? `${property}: ${desktopAlign};` : ""}`;
    const alignStylesTab = `${tabAlign ? `${property}: ${tabAlign};` : ""}`;
    const alignStylesMobile = `${mobileAlign ? `${property}: ${mobileAlign};` : ""}`;

    return {
        alignStylesDesktop,
        alignStylesTab,
        alignStylesMobile,
    };
};
