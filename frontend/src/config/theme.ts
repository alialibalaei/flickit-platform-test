import createPalette from "@mui/material/styles/createPalette";
import { createTheme } from "@mui/material";
import "@fontsource/oswald/300.css";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/700.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";

// export const primaryFontFamily =
//   '"Roboto","Helvetica","Arial","sans-serif","Vazirmatn"';
// export const primaryFontFamily = "Oswald, Roboto, Vazirmatn";
const fontSize = ["12px", "14px", "14px", "16px", "16px"];
export const primaryFontFamily = "NotoSans";
export const secondaryFontFamily = "OpenSans";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    secondary: string;
    secondaryDark: string;
  }
  interface PaletteOptions {
    ml: { primary: React.CSSProperties["color"] };
    cl: { primary: React.CSSProperties["color"] };
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    headlineSmall: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineLarge: React.CSSProperties;
    displaySmall: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displayLarge: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleLarge: React.CSSProperties;
    bodySmall: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    labelSmall: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelLarge: React.CSSProperties;
    subSmall: React.CSSProperties;
    subMedium: React.CSSProperties;
    subLarge: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headlineSmall?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineLarge?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displayLarge?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleLarge?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelLarge?: React.CSSProperties;
    subSmall?: React.CSSProperties;
    subMedium?: React.CSSProperties;
    subLarge?: React.CSSProperties;
  }

  interface Palette {
    ml: { primary: React.CSSProperties["color"] };
    cl: { primary: React.CSSProperties["color"] };
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    headlineSmall?: true;
    headlineMedium?: true;
    headlineLarge?: true;
    displaySmall?: true;
    displayMedium?: true;
    displayLarge?: true;
    titleSmall?: true;
    titleMedium?: true;
    titleLarge?: true;
    bodySmall?: true;
    bodyMedium?: true;
    bodyLarge?: true;
    labelSmall?: true;
    labelMedium?: true;
    labelLarge?: true;
    subSmall?: true;
    subMedium?: true;
    subLarge?: true;
  }
}

const palette = createPalette({
  primary: {
    main: "#2466A8",
    contrastText: "#FFFFFF",
    light: "#2D80D2",
    dark: "#1B4D7E",
  },
  secondary: {
    main: "#B8144B",
    contrastText: "#FFFFFF",
    light: "#E51A5E",
    dark: "#8A0F38",
  },
  background: { secondary: "#EDF4FC", secondaryDark: "#121d33" },
  ml: { primary: "#6035A1" },
  cl: { primary: "#3596A1" },
  error: {
    main: "#8A0F24",
    contrastText: "#fff",
    dark: "#5C0A18",
    light: "#f68b9d",
  },
  success: {
    main: "#3D8F3D",
    contrastText: "#fff",
    dark: "#2E6B2E",
    light: "#4CB24C",
  },
  warning: { main: "#CC7400", contrastText: "#fff", light: "#F4E7D7" },
});

export const theme = createTheme({
  palette,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1620,
    },
  },
  typography: {
    fontFamily: primaryFontFamily,
    subSmall: {
      fontFamily: primaryFontFamily,
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      textTransform: "none",
      color: "GrayText",
    },
    subMedium: {
      fontFamily: primaryFontFamily,
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      color: "GrayText",
    },
    subLarge: {
      fontFamily: primaryFontFamily,
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      color: "GrayText",
    },
    headlineSmall: {
      fontFamily: primaryFontFamily,
      fontWeight: 500,
      fontSize: "1.5rem",
      lineHeight: "2rem",
      letterSpacing: "-3%",
    },
    headlineMedium: {
      fontFamily: secondaryFontFamily,
      fontWeight: "bold",
      fontSize: "2rem",
      lineHeight: "2.25rem",
      letterSpacing: "0",
    },
    headlineLarge: {
      fontFamily: secondaryFontFamily,
      fontWeight: "bold",
      fontSize: "2.5rem",
      lineHeight: "2.7rem",
      letterSpacing: "0",
    },
    displaySmall: {
      fontFamily: primaryFontFamily,
      fontSize: "1rem",
      fontWeight: "normal",
      letterSpacing: "0",
    },
    displayMedium: {
      fontFamily: primaryFontFamily,
      fontSize: "1.75rem",
      fontWeight: "Bold",
      lineHeight: "2.25rem",
      letterSpacing: "0",
    },
    displayLarge: {
      fontFamily: secondaryFontFamily,
      fontSize: "4rem",
      fontWeight: "bold",
      lineHeight: "5.75rem",
      letterSpacing: "0",
    },
    titleSmall: {
      fontFamily: primaryFontFamily,
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      letterSpacing: ".1px",
    },
    titleMedium: {
      fontFamily: primaryFontFamily,
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.5rem",
      letterSpacing: ".15px",
    },
    titleLarge: {
      fontFamily: primaryFontFamily,
      fontWeight: 500,
      fontSize: "1.375rem",
      lineHeight: "1.75rem",
      letterSpacing: "0",
    },
    bodySmall: {
      fontFamily: primaryFontFamily,
      fontWeight: "normal",
      fontSize: "0.75rem",
      lineHeight: "1rem",
      letterSpacing: "0.4px",
    },
    bodyMedium: {
      fontFamily: primaryFontFamily,
      fontWeight: 200,
      fontSize: "0.875rem",
      lineHeight: "1.125rem",
      letterSpacing: "0.25px",
    },
    bodyLarge: {
      fontFamily: primaryFontFamily,
      fontWeight: "lighter",
      fontSize: "1rem",
      lineHeight: "1.5rem",
      letterSpacing: "0.5px",
    },
    labelSmall: {
      fontFamily: primaryFontFamily,
      fontWeight: "lighter",
      fontSize: "0.6875rem",
      lineHeight: "0.75rem",
      letterSpacing: "0.5px",
    },
    labelMedium: {
      fontFamily: secondaryFontFamily,
      fontWeight: 500,
      fontSize: "0.75rem",
      lineHeight: "1rem",
      letterSpacing: "0.5px",
    },
    labelLarge: {
      fontFamily: primaryFontFamily,
      fontWeight: "bold",
      fontSize: "0.875rem",
      lineHeight: "1.125rem",
      letterSpacing: "0.1px",
    },
    button: {
      fontFamily: secondaryFontFamily,
      letterSpacing: ".05em",
    },
    h3: {
      fontFamily: primaryFontFamily,
    },
    h4: {
      fontFamily: primaryFontFamily,
      opacity: 0.9,
    },
    h5: {
      fontFamily: secondaryFontFamily,
      opacity: 0.85,
    },
    h6: {
      fontFamily: secondaryFontFamily,
      lineHeight: 1.6,
      opacity: 0.85,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html {
          scroll-behavior: smooth;
          font-size: ${fontSize[4]};
        }
        @media (max-width: 1600px) {
          html {
            font-size: ${fontSize[3]};
          }
        }
        @media (max-width: 1280px) {
          html {
            font-size: ${fontSize[2]};
          }
        }
        @media (max-width: 960px) {
          html {
            font-size: ${fontSize[1]};
          }
        }
        @media (max-width: 600px) {
          html {
            font-size: ${fontSize[0]};
          }
          .css-1wscs19 {
            width: 340px !important
          }
        }
        body {
          background: #EDEFF1;
        }
        .nc-footer {
          display: none;
        }
        .nc-layout-wrapper {
          background: #F9FAFB;
          padding: 0;
        }
        .nc-header {
          font-family: 'OpenSans';
          background: #E8EBEE;
          border-radius: 7px 7px 0px 0px;
          box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.2);
        }
        .mantine-1avyp1d {
          stroke: rgba(0, 54, 92, 1);
        }
        .mantine-1dbkl0m {
          background: #B8144B;
          width: 20px
        }
      `,
    },
    MuiDialogTitle: {
      defaultProps: {
        bgcolor: palette.primary.main,
        color: palette.primary.contrastText,
        fontFamily: secondaryFontFamily,
        marginBottom: "8px",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          subSmall: "h6",
          subMedium: "h6",
          subLarge: "h6",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
          overflow: "auto",
          padding: "0px 8px",
          borderBottom: "1px solid #d3d3d3",
        },
        indicator: {
          backgroundColor: palette.secondary.main,
          borderRadius: 1,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
          margin: "0px 4px",
          borderRadius: "5px",
          minHeight: "40px",
          transition: "background-color .1s ease, color .1s ease",
          "&:hover": {
            backgroundColor: "#e1dede",
          },
          "&.Mui-selected": {
            color: palette.secondary.main,
          },
        },
      },
    },
    //@ts-expect-error
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: "4px 2px",
        },
      },
    },
  },
});
