import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { ICompareResultBaseInfo, ITotalProgress, TStatus } from "@types";
import Title from "@common/Title";
import { calcGridSizeBasedOnTheLengthOfAssessments } from "./utils";
import { getColorOfStatus, styles } from "@styles";
import CircularProgress from "@mui/material/CircularProgress";

const CompareTable = (props: {
  data: { title: string; items: (string | string[])[] }[];
  title: string;
  base_infos: ICompareResultBaseInfo[];
}) => {
  const { data, title, base_infos } = props;

  return (
    <>
      <Box>
        {data.map((part) => {
          return (
            <Box borderBottom={"1px dashed #e7e7e7"} py={1}>
              <Box mb={0.5} mt={1}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontFamily: "Roboto",
                    opacity: 0.7,
                  }}
                >
                  {part.title}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ py: 1.8 }}>
                {part.items.map((value) => {
                  return (
                    <Grid
                      item
                      xs={calcGridSizeBasedOnTheLengthOfAssessments(
                        base_infos?.length
                      )}
                      sx={{
                        ...styles.compareResultBorder,
                      }}
                    >
                      <Box
                        sx={{
                          opacity: 0.96,
                          height: "100%",
                        }}
                      >
                        {Array.isArray(value) ? (
                          <ul
                            style={{
                              marginBlockStart: 0,
                              marginBlockEnd: 0,
                              paddingInlineStart: "24px",
                            }}
                          >
                            {value.map((text) => (
                              <li>
                                <Typography
                                  sx={{ my: 0.3 }}
                                  fontFamily={"Roboto"}
                                  fontSize="1.1rem"
                                >
                                  {text}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          renderCompareItem(part.title, value)
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

const textStyle = {
  fontFamily: "Roboto",
  fontSize: "1.1rem",
  fontWeight: "bolder",
};

const renderMap: Record<string, (arg: any) => JSX.Element> = {
  Progress: (value: ITotalProgress) => {
    const { progress } = value;
    return (
      <Box sx={{ ...styles.centerV }}>
        <Typography {...textStyle}>
          {progress > 0 && progress < 1 ? (
            <>{progress.toFixed(1)} % </>
          ) : (
            <>{progress.toFixed(0)} % </>
          )}
        </Typography>

        <Box>
          <CircularProgress
            sx={{
              ...styles.circularProgressBackgroundStroke,
              ml: 2,
            }}
            size="36px"
            value={progress}
            variant="determinate"
          />
        </Box>
      </Box>
    );
  },
  "Maturity level": (ml: number) => (
    <Typography {...textStyle} sx={{ color: (t) => t.palette.ml.primary }}>
      {ml} / 5
    </Typography>
  ),
  "Confidence level": (cl: number) => (
    <Typography {...textStyle} sx={{ color: (t) => t.palette.cl.primary }}>
      {cl} / 5
    </Typography>
  ),
  Status: (status: TStatus) => (
    <Typography {...textStyle} sx={{ color: getColorOfStatus(status) }}>
      {status}
    </Typography>
  ),
};

const renderCompareItem = (key: string, value: any) => {
  const component =
    renderMap[key] ||
    ((text) => <Typography {...textStyle}>{text}</Typography>);
  const progressComponent = (obj: any) => (
    <>
      {(obj?.title !== null || obj?.title !== undefined) && (
        <Typography {...textStyle}>{obj?.title}</Typography>
      )}
      {obj?.progress && (
        <Typography
          {...textStyle}
        >{obj.progress}%</Typography>
      )}
    </>
  );
  return typeof value !== "object"
    ? component(value)
    : progressComponent(value);
};

export default CompareTable;
