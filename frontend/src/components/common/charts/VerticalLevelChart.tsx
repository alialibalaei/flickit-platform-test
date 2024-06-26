import { Box, BoxProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { getColorOfStatus, styles } from "@styles";
import Skeleton from "@mui/material/Skeleton";
import { TStatus } from "@types";

interface IVerticalLevelChartProps extends BoxProps {
  loading?: boolean;
  title: string;
  status: TStatus;
  cl: number;
  ml: number;
  mn:number
}

const VerticalLevelChart = (props: IVerticalLevelChartProps) => {
  const { loading, title, status, cl, ml,mn, ...rest } = props;
  const statusColor = getColorOfStatus(status);

  return (
    <Box {...rest} sx={{ ...(styles.centerCH as any), ...((rest.sx || {}) as any) }}>
      <Box textAlign={"center"}>
        <Typography textAlign={"center"}>
          {loading ? (
            <Skeleton width={"114px"} sx={{ margin: "auto" }} />
          ) : (
            <>
              <Box>
                <Trans i18nKey="subjectStatusIs" values={{ title }} />
              </Box>
              <Box>
                <Trans i18nKey="evaluatedAs" />
              </Box>
            </>
          )}
        </Typography>
        <Typography
          sx={{
            display: "inline-block",
            color: statusColor,
            borderBottom: loading ? undefined : `2px solid ${statusColor}`,
          }}
          variant="h3"
          fontFamily={"Oswald"}
          fontWeight="bold"
          letterSpacing={".1em"}
        >
          {loading ? <Skeleton width={"164px"} /> : status}
        </Typography>
      </Box>
      <Box display="flex" mt={2}>
        {loading ? (
          <Skeleton variant="rectangular" sx={{ borderRadius: 20, mx: 1 }} width="74px" height="264px" />
        ) : (
          <VerticalLevel cl={cl} />
        )}
        {loading ? (
          <Skeleton variant="rectangular" sx={{ borderRadius: 20, mx: 1 }} width="74px" height="264px" />
        ) : (
          <VerticalLevel ml={ml} mn={mn} />
        )}
      </Box>
    </Box>
  );
};

const mapToPercent: any = {
  0: "70",
  1: "56",
  2: "42",
  3: "28",
  4: "14",
  5: "0",
};

const VerticalLevel = ({ cl, ml,mn }: { cl?: number; ml?: number,mn?:number }) => {
  return cl || ml ? (
    <Box
      sx={{
        mx: 1,
        background: "#f5f5f5",
        width: "74px",
        height: "216px",
        borderRadius: "100px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          ...styles.centerVH,
          backgroundColor: cl ? "#3596A1" : "#6035A1",
          borderRadius: "100%",
          position: "absolute",
          top: "0px",
          left: "0px",
          zIndex: 1,
          height: "74px",
          width: "74px",
          padding: "8px",
        }}
      >
        <Box
          sx={{
            ...styles.centerVH,
            backgroundColor: "white",
            borderRadius: "100%",
            boxShadow: `0 2px 12px ${cl ? "#144c52" : "#331560"}`,
            height: "100%",
            width: "100%",
          }}
        >
          <Typography sx={{ color: cl ? "#3596A1" : "#6035A1" }} variant="h6" textTransform={"uppercase"} lineHeight={"1.3"}>
            <Trans i18nKey={cl ? "cl" : "ml"} />
            <Typography>{cl || ml || "0"}/{ml?mn?mn:"5":"5"}</Typography>
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          ...styles.centerH,
          background: cl ? "#3596A1" : "#6035A1",
          width: "100%",
          transition: "transform .3s ease",
          minHeight: "76px",
          height: "100%",
          transform: `translateY(-${mapToPercent[(cl || ml) as number] || "70"}%)`,
          borderRadius: "100px",
        }}
      ></Box>
    </Box>
  ) : null;
};

export default VerticalLevelChart;
