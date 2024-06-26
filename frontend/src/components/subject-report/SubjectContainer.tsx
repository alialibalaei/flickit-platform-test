import React, { useEffect, useRef } from "react";
import Hidden from "@mui/material/Hidden";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import QueryData from "@common/QueryData";
import Title from "@common/Title";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { SubjectAttributeList } from "./SubjectAttributeList";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SubjectRadarChart from "./SubjectRadarChart";
import SubjectBarChart from "./SubjectBarChart";
import SubjectOverallInsight from "./SubjectOverallInsight";
import { IAssessmentResultModel, ISubjectReportModel } from "@types";
import hasStatus from "@utils/hasStatus";
import QuestionnairesNotCompleteAlert from "../questionnaires/QuestionnairesNotCompleteAlert";
import Button from "@mui/material/Button";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";

const SubjectContainer = () => {
  const { noStatus, loading, loaded, hasError, subjectQueryData, subjectId } =
    useSubject();

  return (
    <QueryData
      {...subjectQueryData}
      error={hasError}
      loading={loading}
      loaded={loaded}
      render={(data) => {
        const {
          progress,
          title,
          total_answered_question,
          total_question_number,
          results,
        } = data;
        const isComplete = progress === 100;
        const attributesNumber = results.length;
        return (
          <Box>
            <SubjectTitle {...subjectQueryData} loading={loading} />
            {!isComplete && loaded && !noStatus && (
              <Box mt={2} mb={1}>
                <QuestionnairesNotCompleteAlert
                  subjectName={title}
                  to={`./../../questionnaires?subject_pk=${subjectId}`}
                  q={total_question_number}
                  a={total_answered_question}
                  progress={progress}
                />
              </Box>
            )}
            {loading ? (
              <Box sx={{ ...styles.centerVH }} py={6} mt={5}>
                <GettingThingsReadyLoading color="gray" />
              </Box>
            ) : !loaded ? null : noStatus ? (
              <NoInsightYetMessage {...subjectQueryData} />
            ) : (
              <Box sx={{ px: 0.5 }}>
                <Box
                  mt={3}
                  sx={{
                    background: "white",
                    borderRadius: 2,
                    py: 4,
                    px: { xs: 1, sm: 2, md: 3 },
                  }}
                >
                  <Box>
                    <SubjectOverallInsight
                      {...subjectQueryData}
                      loading={loading}
                    />
                  </Box>
                  <Hidden smDown>
                    {attributesNumber > 2 && (
                      <Box height={"620px"} mb={10} mt={10}>
                        <Typography>
                          <Trans
                            i18nKey="inTheRadarChartBelow"
                            values={{
                              title: subjectQueryData?.data?.title || "",
                            }}
                          />
                        </Typography>

                        <SubjectRadarChart
                          {...subjectQueryData}
                          loading={loading}
                        />
                      </Box>
                    )}
                    <Box height={"520px"} mt={10}>
                      <SubjectBarChart
                        {...subjectQueryData}
                        loading={loading}
                      />
                    </Box>
                  </Hidden>
                </Box>
                <Box>
                  <SubjectAttributeList
                    {...subjectQueryData}
                    loading={loading}
                  />
                </Box>
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

const useSubject = () => {
  const { service } = useServiceContext();
  const { subjectId = "", assessmentId = "" } = useParams();
  const resultsQueryData = useQuery<IAssessmentResultModel>({
    service: (args, config) => service.fetchResults(args, config),
  });
  const subjectQueryData = useQuery<ISubjectReportModel>({
    service: (args: { subjectId: string; resultId: string }, config) =>
      service.fetchSubject(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (resultsQueryData.loaded) {
      const result = resultsQueryData.data?.results.find(
        (item: any) => item?.assessment_project == assessmentId
      );
      const { id: resultId } = result || {};
      subjectQueryData.query({ subjectId, resultId });
    }
  }, [resultsQueryData.loading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasError = subjectQueryData.error || resultsQueryData.error;

  const loading = subjectQueryData.loading || resultsQueryData.loading;
  const loaded = subjectQueryData.loaded;

  const noStatus = !hasStatus(subjectQueryData.data?.status);

  return {
    noStatus,
    loading,
    loaded,
    hasError,
    subjectId,
    subjectQueryData,
  };
};

const SubjectTitle = (props: {
  data: ISubjectReportModel;
  loading: boolean;
}) => {
  const { data, loading } = props;
  const {
    assessment_kit_description,
    assessment_project_title,
    assessment_project_color_code,
    assessment_project_space_title,
    title,
  } = data || {};
  const { spaceId, assessmentId } = useParams();

  useEffect(() => {
    setDocumentTitle(`${title} ${t("insight")}`);
  }, [title]);

  return (
    <Title
      letterSpacing=".08em"
      sx={{ opacity: 0.9 }}
      backLink={-1}
      id="insight"
      inPageLink="insight"
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: assessment_project_space_title,
              to: `/${spaceId}/assessments`,
              icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
            },
            {
              title: `${assessment_project_title} ${t("insights")}`,
              to: `/${spaceId}/assessments/${assessmentId}/insights`,
              icon: (
                <DescriptionRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              ),
            },
            {
              title: <>{title || <Trans i18nKey="technicalDueDiligence" />}</>,
              icon: (
                <AnalyticsRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              ),
            },
          ]}
        />
      }
    >
      <Box sx={{ ...styles.centerV }}>
        <QueryStatsRoundedIcon
          sx={{
            mr: 1,
            color: assessment_project_color_code,
          }}
        />
        {loading ? (
          <Skeleton width={"84px"} sx={{ mr: 0.5, display: "inline-block" }} />
        ) : (
          title || ""
        )}{" "}
        <Trans i18nKey="insights" />
      </Box>
    </Title>
  );
};

const NoInsightYetMessage = (props: { data: ISubjectReportModel }) => {
  const { data } = props;
  const { no_insight_yet_message, title } = data || {};
  const { subjectId } = useParams();

  return (
    <Box mt={2}>
      <Paper
        sx={{
          ...styles.centerCVH,
          background: "gray",
          color: "white",
          p: 3,
          py: 8,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {no_insight_yet_message ? (
          <Typography variant="h4" fontFamily={"Roboto"}>
            {no_insight_yet_message}
          </Typography>
        ) : (
          <>
            <Typography variant="h4" fontFamily={"Roboto"}>
              <Trans i18nKey="moreQuestionsNeedToBeAnswered" />
            </Typography>
            <Typography
              variant="h5"
              fontFamily={"Roboto"}
              fontWeight="300"
              sx={{ mt: 2 }}
            >
              <Trans i18nKey="completeSomeOfQuestionnaires" />
            </Typography>
          </>
        )}
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          component={Link}
          to={`./../../questionnaires?subject_pk=${subjectId}`}
        >
          {title} <Trans i18nKey="questionnaires" />
        </Button>
      </Paper>
    </Box>
  );
};

export default SubjectContainer;
