import React, { PropsWithChildren, Suspense } from "react";
import Box from "@mui/material/Box";
import pl1 from "@assets/svg/pl1.svg";
import Logo from "@assets/svg/FlickitLogo-bw.svg";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import { styles } from "@styles";

const AuthLayout = (props: PropsWithChildren<{}>) => {
  const { children } = props;

  return (
    <Box sx={styles.authLayout}>
      <Box
        sx={{
          color: "white",
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "165px",
        }}
      >
        <img src={Logo} alt="Flickit" width="100%" />
      </Box>
      <Box
        sx={{
          ...styles.centerV,
          zIndex: 1,
          position: "relative",
          mt: "84px",
        }}
      >
        <Suspense
          fallback={
            <Box mt={6}>
              <GettingThingsReadyLoading color="white" />
            </Box>
          }
        >
          {children}
        </Suspense>
      </Box>
      <BGPolygonLeft />
      <BGPolygonRight />
    </Box>
  );
};

const BGPolygonLeft = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${pl1})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        position: "fixed",
        left: "-20%",
        bottom: "-30%",
      }}
    />
  );
};
const BGPolygonRight = () => {
  return (
    <Box
      sx={{
        width: "120%",
        height: "120%",
        backgroundImage: `url(${pl1})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        position: "fixed",
        right: "-65%",
        top: "-50%",
      }}
    />
  );
};

export default AuthLayout;
