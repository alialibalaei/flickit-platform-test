import React, {useEffect, useRef, useState, useMemo} from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useNavigate, useParams} from "react-router-dom";
import QASvg from "@assets/svg/qa.svg";
import AnswerSvg from "@assets/svg/answer.svg";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
    EAssessmentStatus,
    questionActions,
    useQuestionContext,
    useQuestionDispatch,
} from "@/providers/QuestionProvider";
import {IQuestionInfo, TAnswer, TQuestionsInfo} from "@types";
import {Trans} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {useServiceContext} from "@providers/ServiceProvider";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import {ICustomError} from "@utils/CustomError";
import useDialog from "@utils/useDialog";
import {Collapse, DialogTitle, FormControl, Grid, TextareaAutosize} from "@mui/material";
import {FormProvider, useForm, useFormContext} from "react-hook-form";
import {styles} from "@styles";
import Title from "@common/Title";
import {InputFieldUC} from "@common/fields/InputField";
import ListItem from "@mui/material/ListItem";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ListItemText from "@mui/material/ListItemText";
import toastError from "@utils/toastError";
import setDocumentTitle from "@utils/setDocumentTitle";
import {t} from "i18next";
import {useQuery} from "@utils/useQuery";
import formatDate from "@utils/formatDate";
import useMenu from "@/utils/useMenu";
import MoreActions from "../common/MoreActions";
import {SubmitOnSelectCheckBox} from "./QuestionContainer";
import QueryData from "../common/QueryData";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import languageDetector from "@utils/languageDetector";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Rating from "@mui/material/Rating";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import firstCharDetector from "@/utils/firstCharDetector";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useScreenResize from "@utils/useScreenResize";
import {useConfigContext} from "@/providers/ConfgProvider";
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import {useTheme} from "@mui/material/styles";
import arrowBtn from "../../assets/svg/arrow.svg"
import UploadIcon from "../../assets/svg/UploadIcon.svg"
import PreAttachment from "@components/questions/iconFiles/preAttachments";
import FileSvg from "@components/questions/iconFiles/fileSvg";
import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Dropzone, {useDropzone} from 'react-dropzone'
import {toast} from "react-toastify";
import Skeleton from "@mui/material/Skeleton";

interface IQuestionCardProps {
    questionInfo: IQuestionInfo;
    questionsInfo: TQuestionsInfo;
}

export const QuestionCard = (props: IQuestionCardProps) => {
    const {questionInfo, questionsInfo} = props;
    const {answer, title, hint, mayNotBeApplicable} = questionInfo;
    const {questionIndex} = useQuestionContext();
    const abortController = useRef(new AbortController());
    const [notApplicable, setNotApplicable] = useState<boolean>(false);
    const [disabledConfidence, setDisabledConfidence] = useState<boolean>(true);
    const {service} = useServiceContext();
    const {config} = useConfigContext();

    useEffect(() => {
        return () => {
            abortController.current.abort();
        };
    }, []);
    const is_farsi = languageDetector(title);
    useEffect(() => {
        setDocumentTitle(
            `${t("question")} ${questionIndex}: ${title}`,
            config.appTitle
        );
        setNotApplicable(answer?.isNotApplicable ?? false);
        if (answer?.confidenceLevel) {
            dispatch(
                questionActions.setSelectedConfidenceLevel(
                    answer?.confidenceLevel?.id
                        ? answer?.confidenceLevel?.id
                        : answer?.confidenceLevel ?? null
                )
            );
        }
    }, [title, answer?.confidenceLevel]);
    const ConfidenceListQueryData = useQuery({
        service: (args = {}, config) =>
            service.fetchConfidenceLevelsList(args, config),
        toastError: false,
    });
    const {selcetedConfidenceLevel} = useQuestionContext();
    const dispatch = useQuestionDispatch();
    return (
        <Box>
            <Paper
                sx={{
                    px: {xs: 2.5, sm: 4, md: 5},
                    py: {xs: 3, sm: 5},
                    backgroundColor: `${notApplicable ? "#000000cc" : "#273248"}`,
                    flex: 1,
                    backgroundImage: `url(${QASvg})`,
                    color: "white",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "auto",
                    backgroundPosition: "-140px -140px",
                    position: "relative",
                    overflow: "hidden",
                    my: {xs: 2, md: 5},
                    mx: {xs: 2, sm: "auto"},
                    mb: "0 !important",
                    maxWidth: "1376px",
                    borderRadius: "8px 8px 0 0",
                }}
                elevation={3}
            >
                <Box>
                    <Box>
                        <Typography
                            variant="subLarge"
                            sx={
                                is_farsi
                                    ? {color: "white", opacity: 0.65, direction: "rtl"}
                                    : {color: "white", opacity: 0.65}
                            }
                        >
                            <Trans i18nKey="question"/>
                        </Typography>
                        <Typography
                            variant="h4"
                            letterSpacing={is_farsi ? "0" : ".05em"}
                            sx={
                                is_farsi
                                    ? {
                                        pt: 0.5,
                                        fontSize: "2rem",
                                        fontFamily: {xs: "Vazirmatn", lg: "Vazirmatn"},
                                        direction: "rtl",
                                    }
                                    : {
                                        pt: 0.5,
                                        fontSize: "2rem",
                                    }
                            }
                        >
                            {title.split("\n").map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br/>
                                </React.Fragment>
                            ))}
                        </Typography>
                    </Box>
                    <Box sx={{direction: `${is_farsi ? "rtl" : "ltr"}`}}>
                        {hint && <QuestionGuide hint={hint}/>}
                    </Box>
                    <AnswerTemplate
                        abortController={abortController}
                        questionInfo={questionInfo}
                        questionIndex={questionIndex}
                        questionsInfo={questionsInfo}
                        is_farsi={is_farsi}
                        setNotApplicable={setNotApplicable}
                        notApplicable={notApplicable}
                        may_not_be_applicable={mayNotBeApplicable ?? false}
                        setDisabledConfidence={setDisabledConfidence}
                        selcetedConfidenceLevel={selcetedConfidenceLevel}
                    />
                </Box>
            </Paper>
            <Box sx={{px: {xs: 2, sm: 0}}}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: `${notApplicable ? "#273248" : "#000000cc"}`,
                        flexDirection: {xs: "column", md: "row"},
                        borderRadius: " 0 0 8px 8px ",
                        px: {xs: 1.75, sm: 2, md: 2.5},
                        py: {xs: 1.5, sm: 2.5},
                    }}
                >
                    <SubmitOnSelectCheckBox/>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: {xs: "column", md: "row"},
                        }}
                    >
                        <QueryData
                            {...ConfidenceListQueryData}
                            loading={false}
                            error={false}
                            render={(data) => {
                                const labels = data.confidenceLevels;
                                return (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {selcetedConfidenceLevel !== null ? (
                                            <Box sx={{mr: 2, color: "#fff"}}>
                                                <Typography
                                                    sx={{display: "flex", fontSize: {xs: ".85rem"}}}
                                                >
                                                    <Trans i18nKey={"youSelected"}/>
                                                    <Typography
                                                        fontWeight={900}
                                                        sx={{borderBottom: "1px solid", mx: 1}}
                                                    >
                                                        {labels[selcetedConfidenceLevel - 1]?.title}
                                                    </Typography>

                                                    <Trans i18nKey={"asYourConfidenceLevel"}/>
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    mr: 2,
                                                    color: "#fff",
                                                }}
                                            >
                                                <Typography>
                                                    <Trans i18nKey={"selcetYourConfidenceLevel"}/>
                                                </Typography>
                                            </Box>
                                        )}
                                        <Rating
                                            value={
                                                selcetedConfidenceLevel !== null
                                                    ? selcetedConfidenceLevel
                                                    : null
                                            }
                                            size="medium"
                                            onChange={(event, newValue) => {
                                                dispatch(
                                                    questionActions.setSelectedConfidenceLevel(newValue)
                                                );
                                            }}
                                            icon={
                                                <RadioButtonCheckedRoundedIcon
                                                    sx={{mx: 0.25, color: "#42a5f5"}}
                                                    fontSize="inherit"
                                                />
                                            }
                                            emptyIcon={
                                                <RadioButtonUncheckedRoundedIcon
                                                    style={{opacity: 0.55}}
                                                    sx={{mx: 0.25, color: "#fff"}}
                                                    fontSize="inherit"
                                                />
                                            }
                                        />
                                    </Box>
                                );
                            }}
                        />
                    </Box>
                </Box>

                <Box
                    display={"flex"}
                    justifyContent="space-between"
                    mt={3}
                    sx={{
                        flexDirection: {xs: "column", md: "row"},
                        alignItems: {xs: "stretch", md: "flex-end"},
                    }}
                >
                    <AnswerDetails questionInfo={questionInfo}/>
                </Box>
            </Box>
        </Box>
    );
};

const AnswerTemplate = (props: {
    questionInfo: IQuestionInfo;
    questionIndex: number;
    questionsInfo: TQuestionsInfo;
    abortController: React.MutableRefObject<AbortController>;
    setNotApplicable: any;
    notApplicable: boolean;
    may_not_be_applicable: boolean;
    is_farsi: boolean | undefined;
    setDisabledConfidence: any;
    selcetedConfidenceLevel: any;
}) => {
    const {submitOnAnswerSelection, isSubmitting, evidences} =
        useQuestionContext();
    const {
        questionInfo,
        questionsInfo,
        questionIndex,
        abortController,
        setNotApplicable,
        notApplicable,
        may_not_be_applicable,
        is_farsi,
        setDisabledConfidence,
        selcetedConfidenceLevel,
    } = props;
    const {options, answer} = questionInfo;
    const {total_number_of_questions} = questionsInfo;
    const {service} = useServiceContext();
    const dispatch = useQuestionDispatch();
    const {assessmentId = "", questionnaireId} = useParams();
    const [value, setValue] = useState<TAnswer | null>(
        answer?.selectedOption || null
    );
    const navigate = useNavigate();
    const isLastQuestion = questionIndex == total_number_of_questions;
    const isSelectedValueTheSameAsAnswer =
        questionInfo?.answer?.index == value?.index;
    const changeHappened = useRef(false);
    const onChange = (
        event: React.MouseEvent<HTMLElement>,
        v: TAnswer | null
    ) => {
        if (isSelectedValueTheSameAsAnswer) {
            changeHappened.current = true;
        }
        if (value?.index !== v?.index) {
            setDisabledConfidence(false);
        } else {
            setDisabledConfidence(true);
        }
        setValue((prevValue) => (prevValue?.index === v?.index ? null : v));
    };
    useEffect(() => {
        if (notApplicable) {
            setValue(null);
        }
    }, [notApplicable]);
    useEffect(() => {
        if (answer) {
            setDisabledConfidence(false);
        }
    }, [answer]);
    // first checking if evidences have been submited or not
    const submitQuestion = async () => {
        dispatch(questionActions.setIsSubmitting(true));
        try {
            const res = await service.submitAnswer(
                {
                    assessmentId,
                    data: {
                        questionnaireId: questionnaireId,
                        questionId: questionInfo?.id,
                        answerOptionId: value?.id || null,
                        isNotApplicable: notApplicable,
                        confidenceLevelId:
                            value?.id || submitOnAnswerSelection || notApplicable
                                ? selcetedConfidenceLevel
                                : null,
                    },
                },
                {signal: abortController.current.signal}
            );
            dispatch(questionActions.setIsSubmitting(false));
            dispatch(
                questionActions.setQuestionInfo({
                    ...questionInfo,
                    answer: {
                        selectedOption: value,
                        isNotApplicable: notApplicable,
                        confidenceLevel: selcetedConfidenceLevel ?? null,
                    } as TAnswer,
                })
            );
            if (isLastQuestion) {
                dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.DONE));
                navigate(`../completed`, {replace: true});
                return;
            }
            if (value) {
                dispatch(
                    questionActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS)
                );
            }
            const newQuestionIndex = questionIndex + 1;
            dispatch(questionActions.goToQuestion(newQuestionIndex));
            navigate(`../${newQuestionIndex}`, {
                replace: true,
            });
        } catch (e) {
            dispatch(questionActions.setIsSubmitting(false));
            const err = e as ICustomError;
            toastError(err);
        }
    };

    useEffect(() => {
        if (
            submitOnAnswerSelection &&
            value &&
            changeHappened.current
            // && selcetedConfidenceLevel
        ) {
            submitQuestion();
        }
    }, [value]);
    const notApplicableonChanhe = (e: any) => {
        setNotApplicable(e.target.checked || false);
        if (e.target.checked) {
            setDisabledConfidence(false);
        } else {
            setDisabledConfidence(true);
        }
    };
    return (
        <>
            <Box
                display={"flex"}
                justifyContent="flex-start"
                mt={4}
                sx={is_farsi ? {direction: "rtl"} : {}}
            >
                <Box
                    display={"flex"}
                    sx={{
                        flexDirection: {xs: "column", md: "row"},
                        width: {xs: "100%", sm: "80%", md: "auto"},
                    }}
                    flexWrap={"wrap"}
                >
                    {options?.map((option: any) => {
                        const {index: templateValue, title} = option || {};
                        return (
                            <Box
                                key={option.value}
                                mb={2}
                                mr={2}
                                sx={{minWidth: {xs: "180px", sm: "320px"}}}
                            >
                                <ToggleButton
                                    data-cy="answer-option"
                                    color="success"
                                    fullWidth
                                    size="large"
                                    value={option}
                                    selected={templateValue === value?.index}
                                    onChange={onChange}
                                    disabled={isSubmitting || notApplicable}
                                    sx={{
                                        letterSpacing: `${is_farsi ? "0" : ".05em"}`,
                                        color: "white",
                                        p: {xs: 0.6, sm: 1},
                                        textAlign: "left",
                                        fontSize: {xs: "1.15rem", sm: "1.3rem"},
                                        fontFamily: `${is_farsi ? "Vazirmatn" : customElements}`,
                                        justifyContent: "flex-start",
                                        boxShadow: "0 0 2px white",
                                        borderWidth: "2px",
                                        borderColor: "transparent",
                                        "&.Mui-selected": {
                                            "&:hover": {
                                                backgroundColor: "#0ec586",
                                            },
                                            backgroundImage: `url(${AnswerSvg})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right",
                                            color: "white",
                                            backgroundColor: "#0acb89",
                                            borderColor: "transparent",
                                            zIndex: 2,
                                            position: "relative",
                                        },
                                    }}
                                >
                                    <Checkbox
                                        disableRipple={true}
                                        checked={templateValue === value?.index}
                                        disabled
                                        sx={{
                                            position: "absoulte",
                                            zIndex: 1,
                                            color: "white",
                                            p: 0,
                                            mr: "8px",
                                            ml: "8px",
                                            opacity: 0.8,
                                            "& svg": {fontSize: {xs: "2.1rem", sm: "2.5rem"}},
                                            "&.Mui-checked": {color: "white", opacity: 1},
                                            "&.Mui-disabled": {
                                                color: notApplicable ? "gray" : "white",
                                            },
                                        }}
                                    />
                                    {templateValue}. {title}
                                </ToggleButton>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            {notApplicable && (
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <WarningAmberRoundedIcon color="error"/>
                    <Typography
                        variant="subtitle2"
                        color="error"
                        sx={{ml: "4px", mt: "4px"}}
                    >
                        <Trans i18nKey={"theOptionSelectionIsDisabled"}/>
                    </Typography>
                </Box>
            )}
            <Box
                sx={{
                    mt: {xs: 4, md: 1},
                    mr: {xs: 0, md: 2},
                    display: "flex",
                    flexDirection: "row-reverse",
                    // ml: "auto",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <LoadingButton
                    variant="contained"
                    color={"info"}
                    loading={isSubmitting}
                    sx={
                        is_farsi
                            ? {
                                fontSize: "1.2rem",
                                mr: "auto",
                            }
                            : {fontSize: "1.2rem", ml: "auto"}
                    }
                    onClick={submitQuestion}
                >
                    <Trans i18nKey={"nextQuestion"}/>
                </LoadingButton>
                {may_not_be_applicable && (
                    <FormControlLabel
                        sx={{color: "#0288d1"}}
                        data-cy="automatic-submit-check"
                        control={
                            <Checkbox
                                checked={notApplicable}
                                onChange={(e) => notApplicableonChanhe(e)}
                                sx={{
                                    color: "#0288d1",
                                    "&.Mui-checked": {
                                        color: "#0288d1",
                                    },
                                }}
                            />
                        }
                        label={<Trans i18nKey={"notApplicable"}/>}
                    />
                )}
            </Box>
        </>
    );
};

const AnswerDetails = ({questionInfo}: any) => {
    const dialogProps = useDialog();

    const {service} = useServiceContext();
    const {assessmentId = ""} = useParams();

    return (
        <Box mt={2} width="100%">
            <Title px={1} size="small">
                <Trans i18nKey="answerEvidences"/>
            </Title>
            <Box
                mt={2}
                display={"flex"}
                sx={{cursor: "pointer"}}
                alignItems="center"
                position={"relative"}
                width="100%"
            ></Box>

            <Box
                sx={{
                    flex: 1,
                    mr: {xs: 0, md: 4},
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                {/* <Box mb={1.8}>
          <Typography
            variant="subLarge"
            component={Link}
            to="#"
            sx={{ color: "white", opacity: 0.5, textDecoration: "none" }}
          >
            <Trans i18nKey="howSureAreYou" />
          </Typography>
          <Box
            display="flex"
            alignItems={"baseline"}
            sx={{
              flexDirection: "column",
            }}
          >
            <Box display="flex" alignItems={"baseline"} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
              <Typography>
                <Trans i18nKey={"myConfidenceLevelOnThisQuestionIs"} />
              </Typography>
              <Box width="90px" sx={{ ml: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 } }} position="relative" bottom="1px">
                <FormControl fullWidth>
                  <NativeSelect
                    sx={{
                      "&::before": {
                        display: "none",
                      },
                      "&::after": {
                        display: "none",
                      },
                      background: "#04a56e",
                      fontSize: ".92rem",
                      borderRadius: 1.5,
                      "& select": {
                        pl: 1.2,
                        py: 0.5,
                      },
                      color: "white",
                      "& option": {
                        backgroundColor: "#424242 !important",
                      },
                      "& svg": {
                        color: "white",
                      },
                    }}
                    defaultValue={1}
                    inputProps={{
                      name: "confidenceLevel",
                      id: "uncontrolled-native",
                    }}
                  >
                    <option value={1}>1 of 5</option>
                    <option value={2}>2 of 5</option>
                    <option value={3}>3 of 5</option>
                    <option value={4}>4 of 5</option>
                    <option value={5}>5 of 5</option>
                  </NativeSelect>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box> */}
                <Box
                    display="flex"
                    alignItems={"baseline"}
                    sx={{
                        flexDirection: "column",
                        px: 2,
                        width: "100%",
                        alignItems: "center",
                        wordBreak: "break-word",
                    }}
                >
                    <Evidence
                        {...dialogProps}
                        questionInfo={questionInfo}
                    />
                </Box>
            </Box>
        </Box>
    );
};

const Evidence = (props: any) => {
    const LIMITED = 200;
    const [valueCount, setValueCount] = useState("");
    const [evidencesData,setEvidencesData]= useState<any[]>([])
    const [expandedDeleteDialog, setExpandedDeleteDialog] = useState<boolean>(false);
    const [expandedDeleteAttachmentDialog, setExpandedDeleteAttachmentDialog] = useState<any>({expended:false, id:""});
    const [expandedAttachmentsDialogs, setExpandedAttachmentsDialogs] = useState<any>({expended:false,count:0});
    const [getAttachmentData,setAttachmentData] = useState(false)
    const is_farsi = firstCharDetector(valueCount);
    const {service} = useServiceContext();
    const [evidenceId, setEvidenceId] = useState("")
    const {onClose: closeDialog, openDialog, ...rest} = props;
    const {questionInfo } = props;
    const {assessmentId = ""} = useParams();
    const formMethods = useForm({shouldUnregister: true});

    const evidencesQueryData = useQuery({
        service: (
            args = {questionId: questionInfo.id, assessmentId, page: 0, size: 10},
            config
        ) => service.fetchEvidences(args, config),
        toastError: true,
    });

    const addEvidence = useQuery({
        service: (args, config) => service.addEvidence(args, config),
        runOnMount: false,
    });

    const fetchEvidenceAttachments = useQuery({
        service: (args , config) => service.fetchEvidenceAttachments(args, config),
        runOnMount: false,
    });

    useEffect(()=>{
        (async ()=>{
            let {items} = await evidencesQueryData.query()
            setEvidencesData(items)
        })()
    },[])

    const [value, setValue] = React.useState("POSITIVE");
    const [evidenceBG, setEvidenceBG] = useState<any>({
        background: "#EDFCFC",
        borderColor: "#004F83",
        borderHover: "#117476",
    });
    useEffect(() => {
        if (value === null) {
            setEvidenceBG({
                background: "#EDF4FC",
                borderColor: "#0A2342",
                borderHover: "#061528",
            });
        }
        if (value === "POSITIVE") {
            setEvidenceBG({
                background: "#EDFCFC",
                borderColor: "#004F83",
                borderHover: "#117476",
            });
        }
        if (value === "NEGATIVE") {
            setEvidenceBG({
                background: "#FDF1F5",
                borderColor: "#D81E5B",
                borderHover: "#821237",
            });
        }
    }, [value]);
    const cancelEditing = async (e: any) => {
        formMethods.reset();
    };
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    //if there is a evidence we should use addEvidence service
    const onSubmit = async (data: any) => {
        try {
            if (data.evidence.length <= LIMITED) {
                await addEvidence.query({
                    description: data.evidence,
                    questionId: questionInfo.id,
                    assessmentId,
                    type: value,
                });
                const {items} =  await evidencesQueryData.query();
                setEvidencesData(items)
                setValueCount("");
            }
        } catch (e) {
            const err = e as ICustomError;
            toastError(err?.response?.data.description[0]);
        } finally {
            formMethods.reset();
        }
    };

    const deleteEvidence = useQuery({
        service: (args = {id: evidenceId}, config) => service.deleteEvidence(args, config),
        runOnMount: false,
    });

    const RemoveEvidenceAttachments = useQuery({
        service: (args, config) => service.RemoveEvidenceAttachments(args, {}),
        runOnMount: false,
    });

    const deleteItem = async () => {
        try {
            await deleteEvidence.query();
            setExpandedDeleteDialog(false)
            const {items} =  await evidencesQueryData.query();
            setEvidencesData(items)
        } catch (e) {
            const err = e as ICustomError;
            toastError(err);
        }
    };
    const deleteAttachment = async () => {
        try {
                let attachmentId = expandedDeleteAttachmentDialog.id
                await RemoveEvidenceAttachments.query({evidenceId,attachmentId})
                setExpandedDeleteAttachmentDialog({...expandedDeleteAttachmentDialog,expended:false})
                let {items} = await evidencesQueryData.query()
                setEvidencesData(items)
                setAttachmentData(true)
        } catch (e) {

        }
    };

    const fetchAttachments = async (args :any) =>{
        return fetchEvidenceAttachments.query({...args})
    }

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            width="100%"
            sx={{width: {md: "80%"}}}
        >
            <FormProvider {...formMethods}>
                <form
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                    style={{flex: 1, display: "flex", flexDirection: "column"}}
                >
                    <Grid
                        container
                        display={"flex"}
                        justifyContent={"end"}
                        sx={styles.formGrid}
                    >
                        <TabContext value={value}>
                            <TabList
                                onChange={handleChange}
                                sx={{
                                    width: "100%",

                                    "&.MuiTabs-root": {
                                        borderBottomColor: "transparent",
                                        justifyContent: "space-between",
                                        display: "flex",
                                    },
                                    ".MuiTabs-indicator": {
                                        backgroundColor: evidenceBG.borderColor,
                                    },
                                }}
                            >
                                <Tab
                                    label={<Trans i18nKey="negativeEvidence"/>}
                                    value="NEGATIVE"
                                    sx={{
                                        fontSize: "1rem",
                                        display: "flex",
                                        flex: 1,
                                        "&.Mui-selected": {
                                            color: `${evidenceBG.borderColor}  !important`,
                                        },
                                    }}
                                />
                                <Tab
                                    label={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Trans i18nKey="comment"/>
                                            {value == null && (
                                                <InfoOutlinedIcon
                                                    style={{color: evidenceBG.borderColor}}
                                                    sx={{ml: 1}}
                                                />
                                            )}
                                        </Box>
                                    }
                                    sx={{
                                        fontSize: "1rem",
                                        display: "flex",
                                        flex: 1,
                                        "&.Mui-selected": {
                                            color: `${evidenceBG.borderColor}  !important`,
                                        },
                                    }}
                                    value={null}
                                />
                                <Tab
                                    label={<Trans i18nKey="positiveEvidence"/>}
                                    sx={{
                                        fontSize: "1rem",
                                        display: "flex",
                                        flex: 1,
                                        "&.Mui-selected": {
                                            color: `${evidenceBG.borderColor}  !important`,
                                        },
                                    }}
                                    value="POSITIVE"
                                />
                            </TabList>
                        </TabContext>
                        <Grid item xs={12} position={"relative"}>
                            <InputFieldUC
                                multiline
                                minRows={3}
                                maxRows={8}
                                minLength={3}
                                maxLength={200}
                                autoFocus={false}
                                defaultValue={""}
                                pallet={evidenceBG}
                                name="evidence"
                                label={null}
                                required={true}
                                placeholder="Write down your evidence and comment here...."
                                borderRadius={"16px"}
                                setValueCount={setValueCount}
                                hasCounter={true}
                                isFarsi={is_farsi}
                            />
                            <Typography
                                style={is_farsi ? {left: 20} : {right: 20}}
                                sx={{
                                    position: "absolute",
                                    top: 20,
                                    fontSize: ".875rem",
                                    fontWeight: 300,
                                    color: valueCount.length > LIMITED ? "#D81E5B" : "#9DA7B3",
                                }}
                            >
                                {valueCount.length || 0} / {LIMITED}
                            </Typography>
                            {value == null && valueCount.length == 0 && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: "8px",
                                        right: "80px",
                                        display: "flex",
                                        alignItems: "center",
                                        border: "1px solid #9DA7B3",
                                        px: "6px",
                                        py: "2px",
                                        borderRadius: "16px 0 16px 16px",
                                    }}
                                >
                                    <InfoOutlinedIcon
                                        style={{color: "#0A2342"}}
                                        sx={{mr: 1}}
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: ".875rem",
                                            fontWeight: 300,
                                        }}
                                    >
                                        <Trans i18nKey="commentsWillNotBeShown"/>
                                    </Typography>
                                </Box>
                            )}
                            <Grid
                                item
                                xs={12}
                                sx={
                                    is_farsi
                                        ? {position: "absolute", top: 15, left: 5}
                                        : {
                                            position: "absolute",
                                            top: 15,
                                            right: 5,
                                        }
                                }
                            ></Grid>
                        </Grid>
                        <Box display={"flex"} justifyContent={"end"} mt={2}>
                            <LoadingButton
                                sx={{
                                    ml: "auto",
                                    borderRadius: "100%",
                                    p: 2,
                                    minWidth: "56px",
                                    background: evidenceBG.borderColor,
                                    "&:hover": {
                                        background: evidenceBG.borderHover,
                                    },
                                }}
                                type="submit"
                                variant="contained"
                                loading={evidencesQueryData.loading}
                            >
                                <AddRoundedIcon fontSize="large"/>
                            </LoadingButton>

                        </Box>
                    </Grid>
                </form>
            </FormProvider>
            <Box mt={3}>
                {evidencesData && evidencesData.map((item: any, index: number) => (
                                <EvidenceDetail
                                key={index}
                                setValue={setValue}
                                item={item}
                                evidencesData={evidencesData}
                                setEvidencesData={setEvidencesData}
                                setExpandedDeleteDialog={setExpandedDeleteDialog}
                                setExpandedDeleteAttachmentDialog={setExpandedDeleteAttachmentDialog}
                                setExpandedAttachmentsDialogs={setExpandedAttachmentsDialogs}
                                expandedAttachmentsDialogs={expandedAttachmentsDialogs}
                                setEvidenceId={setEvidenceId}
                                evidenceId={evidenceId}
                                evidencesQueryData={evidencesQueryData}
                                questionInfo={questionInfo}
                                assessmentId={assessmentId}
                                fetchAttachments={fetchAttachments}
                                getAttachmentData={getAttachmentData}
                                setAttachmentData={setAttachmentData}
                                deleteAttachment={deleteAttachment}
                            />
                ))}
                <EvidenceAttachmentsDialogs
                    expanded={expandedAttachmentsDialogs}
                    onClose={() => setExpandedAttachmentsDialogs({...expandedAttachmentsDialogs, expended: false})}
                    assessmentId={assessmentId}
                    setEvidencesData={setEvidencesData}
                    evidenceId={evidenceId}
                    evidencesQueryData={evidencesQueryData}
                    title={<Trans i18nKey={"addNewMember"}/>}
                    uploadAnother={<Trans i18nKey={"uploadAnother"}/>}
                    uploadAttachment={<Trans i18nKey={"uploadAttachment"}/>}
                    fetchAttachments={fetchAttachments}
                    setAttachmentData={setAttachmentData}
                />
                <DeleteDialog
                    expanded={expandedDeleteDialog}
                    onClose={() => setExpandedDeleteDialog(false)}
                    onConfirm={deleteItem}
                    title={<Trans i18nKey={"areYouSureYouWantDeleteThisEvidence"}/>}
                    cancelText={<Trans i18nKey={"letMeSeeItAgain"}/>}
                    confirmText={<Trans i18nKey={"yesDeleteIt"}/>}
                />
                <DeleteDialog
                    expanded={expandedDeleteAttachmentDialog.expended}
                    onClose={() => setExpandedDeleteAttachmentDialog({...expandedAttachmentsDialogs,expended:false})}
                    onConfirm={deleteAttachment}
                    title={<Trans i18nKey={"areYouSureYouWantDeleteThisAttachment"}/>}
                    cancelText={<Trans i18nKey={"letMeSeeItAgain"}/>}
                    confirmText={<Trans i18nKey={"yesDeleteIt"}/>}
                />
            </Box>
        </Box>
    );
};

const EvidenceDetail = (props: any) => {
    const {
        item, evidencesQueryData, questionInfo, assessmentId, setEvidenceId,
        setExpandedDeleteDialog, setExpandedAttachmentsDialogs, setEvidencesData,
        fetchAttachments,expandedAttachmentsDialogs, getAttachmentData, setAttachmentData,
        setExpandedDeleteAttachmentDialog, evidenceId,deleteAttachment, evidencesData
    } = props;
    console.log(item,"test item")
    const LIMITED = 200;
    const [valueCount, setValueCount] = useState("");
    const [value, setValue] = React.useState<any>("POSITIVE");
    const [expandedEvidenceBox, setExpandedEvidenceBox] = useState<boolean>(false);
    const addEvidence = useQuery({
        service: (args, config) => service.addEvidence(args, config),
        runOnMount: false,
    });

    useEffect(()=>{
        if(id === evidencesData[0].id){
            setExpandedEvidenceBox(false)
        }
    },[evidencesData.length])

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const cancelEditing = async (e: any) => {
        formMethods.reset();
    };

    const {description, lastModificationTime, createdBy, id, type , attachmentsCount} = item;
    const {displayName, pictureLink} = createdBy;
    const is_farsi = firstCharDetector(description);
    const [evidenceBG, setEvidenceBG] = useState<any>();

    const formContext = useFormContext();
    const {service} = useServiceContext();
    const [isEditing, setIsEditing] = useState(false)
    const [attachments, setAttachments] = useState<any[]>([])
    const [loadingFile, setLoadingFile] = useState<boolean>(false)

    const submitRef = useRef<any>(null)

    const formMethods = useForm({shouldUnregister: true});

    const onSubmit = async (data: any) => {
        try {
            if (data.evidence.length <= LIMITED) {
                await addEvidence.query({
                    description: data.evidence,
                    questionId: questionInfo.id,
                    assessmentId,
                    type: value,
                    id: id,
                });
               const {items} = await evidencesQueryData.query();
                setEvidencesData(items)
                setIsEditing(false)
                setValueCount("");
            }
        } catch (e) {
            const err = e as ICustomError;
            toastError(err?.response?.data.description[0]);
        } finally {
            formMethods.reset();
        }
    };

    const onUpdate = async () => {
        // formContext.setValue("evidence", description);
        setIsEditing(prev => !prev)

        if (type === "Positive") {
            setValue("POSITIVE");
        }
        if (type === "Negative") {
            setValue("NEGATIVE");
        }
        if (type === null) {
            setValue(null);
        }
    };

    const EditEvidence = () => {
        if (submitRef?.current) {
            submitRef?.current.click()
        }
    }

    useEffect(() => {
        if (type === null) {
            setEvidenceBG({
                background: "#EDF4FC",
                borderColor: "#0A2342",
                borderHover: "#061528",
            });
        }
        if (type === "Positive") {
            setEvidenceBG({
                background: "#EDFCFC",
                borderColor: "#004F83",
                borderHover: "#117476",
            });
        }
        if (type === "Negative") {
            setEvidenceBG({
                background: "#FDF1F5",
                borderColor: "#D81E5B",
                borderHover: "#821237",
            });
        }
    }, [type]);


    const theme = useTheme();
    // const refBox = useRef<any>(null)

    useEffect(()=>{
        (async ()=>{
            if(getAttachmentData ){
                let {attachments} = await fetchAttachments({evidence_id: id})
                setAttachments(attachments)
                setExpandedAttachmentsDialogs({...expandedAttachmentsDialogs,count: attachments.length});
                setAttachmentData(false)
            }
        })()
    },[getAttachmentData])

    const expandedEvidenceBtm = async () =>{
        setLoadingFile(true)
          setExpandedEvidenceBox(prev => !prev);
          if(!expandedEvidenceBox){
              let {attachments} = await fetchAttachments({evidence_id: id})
              setLoadingFile(false)
              setAttachments(attachments)
          }else{
              setLoadingFile(false)
          }
    }

    useEffect(() => {
        setEvidenceId(id)
    }, [id]);


    const downloadFile = ({link} : {link: string})=>{
        const fileUrl = link;
        const a = document.createElement("a");
        a.href = fileUrl;
        a.target = "_blank"
        a.download = "file_name.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
    const skeleton = Array.from(Array(attachmentsCount).keys())
    return (
        <Box display="flex" flexDirection="column" width="100%">
            <Box sx={{display: "flex", gap: 2, mb: 4}}>
                <Avatar
                    {...stringAvatar(displayName.toUpperCase())}
                    src={pictureLink}
                    sx={{width: 56, height: 56}}
                ></Avatar>
                {isEditing ?
                    <>
                        <FormProvider {...formMethods}>
                            <form
                                onSubmit={formMethods.handleSubmit(onSubmit)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "fit-content",
                                    width: "60%",
                                    borderRadius: "16px"
                                }}
                            >
                                <Grid
                                    container
                                    display={"flex"}
                                    justifyContent={"end"}

                                >
                                    <Grid item xs={12} position={"relative"}
                                    >
                                        {isEditing && (
                                            <Typography
                                                sx={{
                                                    fontSize: "1.125rem",
                                                    fontWeight: "bold",
                                                    position: "absolute",
                                                    top: 10,
                                                    left: 15,
                                                    zIndex: 1,
                                                    color: evidenceBG.borderColor
                                                }}
                                            >
                                                <Trans i18nKey="editing"/>
                                            </Typography>
                                        )}

                                        <InputFieldUC
                                            multiline
                                            minRows={3}
                                            maxRows={8}
                                            minLength={3}
                                            maxLength={200}
                                            autoFocus={false}
                                            defaultValue={description}
                                            pallet={evidenceBG}
                                            name="evidence"
                                            label={null}
                                            required={true}
                                            // placeholder={`${description}`}
                                            borderRadius={"16px"}
                                            setValueCount={setValueCount}
                                            hasCounter={true}
                                            isFarsi={is_farsi}
                                            isEditing={isEditing}
                                        />
                                        <Typography
                                            style={is_farsi ? {left: 20} : {right: 20}}
                                            sx={{
                                                position: "absolute",
                                                top: 40,
                                                fontSize: ".875rem",
                                                fontWeight: 300,
                                                color: valueCount.length > LIMITED ? "#D81E5B" : "#9DA7B3",
                                            }}
                                        >
                                            {valueCount.length || 0} / {LIMITED}
                                        </Typography>
                                        {value == null && valueCount.length == 0 && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    bottom: "8px",
                                                    right: "80px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    border: "1px solid #9DA7B3",
                                                    px: "6px",
                                                    py: "2px",
                                                    borderRadius: "16px 0 16px 16px",
                                                }}
                                            >
                                                <InfoOutlinedIcon
                                                    style={{color: "#0A2342"}}
                                                    sx={{mr: 1}}
                                                />
                                                <Typography
                                                    sx={{
                                                        fontSize: ".875rem",
                                                        fontWeight: 300,
                                                    }}
                                                >
                                                    <Trans i18nKey="commentsWillNotBeShown"/>
                                                </Typography>
                                            </Box>
                                        )}
                                        <Grid
                                            item
                                            xs={12}
                                            sx={
                                                is_farsi
                                                    ? {position: "absolute", top: 15, left: 5}
                                                    : {
                                                        position: "absolute",
                                                        top: 15,
                                                        right: 5,
                                                    }
                                            }
                                        ></Grid>
                                    </Grid>
                                </Grid>
                                <IconButton ref={submitRef} type={"submit"} sx={{display: "none",}}/>
                            </form>
                        </FormProvider>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                justifyContent: "center",
                            }}
                        >
                            <Box sx={{display: "flex", gap: 1}}>
                                <IconButton
                                    aria-label="edit"
                                    size="small"
                                    sx={{
                                        boxShadow: 2, p: 1,
                                        background: evidenceBG?.background
                                    }}
                                    onClick={EditEvidence}
                                >
                                    <DoneIcon fontSize="small" style={{color: evidenceBG?.borderColor}}/>
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    sx={{boxShadow: 2, p: 1}}
                                    onClick={onUpdate}
                                >
                                    <ClearIcon
                                        fontSize="small"
                                        style={{color: "#D81E5B"}}
                                    />
                                </IconButton>
                            </Box>
                        </Box>
                    </>
                    :
                    <>
                        <Box
                            sx={{
                                px:{xs: "12px",sm:"32px"},
                                py:{xs: "8px",sm:"16px"},
                                height: "fit-content",
                                display: "flex",
                                flexDirection: "column",
                                // alignItems: "flex-end",
                                // border: `1px solid ${evidenceBG?.borderColor}`,
                                background: evidenceBG?.background,
                                color: "#0A2342",
                                borderRadius: "0 24px 24px 24px ",
                                gap: "16px",
                                direction: `${is_farsi ? "rtl" : "ltr"}`,
                                textAlign: `${is_farsi ? "right" : "left"}`,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: {xs: "column", sm: "row"},
                                    alignItems: "flex-end",
                                    gap: {xs: "24px", sm: "48px"},
                                }}
                            >
                                <Box sx={{display: "flex", flexDirection: "column", gap: "1.7rem", cursor: "pointer"}}>
                                    <Typography>{description}</Typography>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                        <Box onClick={()=>expandedEvidenceBtm()}
                                             sx={{display: "flex"}}>
                                            {!attachmentsCount && <Typography sx={{...theme.typography.titleMedium,fontSize:{xs:"10px",sm:"unset"}}}><Trans
                                                i18nKey={"addFirstAttachment"}/></Typography> }
                                            {attachmentsCount >= 1 && <Typography sx={{...theme.typography.titleMedium,display: 'flex',gap: "5px"}}>
                                                {t("attachmentCount",{attachmentsCount})}</Typography> }
                                            <img style={expandedEvidenceBox ? {
                                                rotate: "180deg",
                                                transition: "all .2s ease"
                                            } : {rotate: "0deg", transition: "all .2s ease"}} src={arrowBtn}/>
                                        </Box>
                                        <Grid
                                             container
                                            // ref={refBox}
                                             // style={expandedEvidenceBox ? {maxHeight: refBox?.current.innerHeight && refBox?.current.innerHeight} : {
                                             style={expandedEvidenceBox ? {} : {
                                                 maxHeight: 0,
                                                 overflow: "hidden"
                                             }} sx={{transition: "all .2s ease",display: "flex", gap: ".5rem", }}>
                                                        {
                                                           loadingFile ?
                                                               <>
                                                               {skeleton.map(()=>{
                                                                   return  <Skeleton animation="wave"  variant="rounded" width={40} height={40} />
                                                               })}

                                                               </>
                                                               :
                                                            attachments.map((item,index)=>{
                                                            return(
                                                                    < FileIcon item={item} setExpandedDeleteAttachmentDialog={setExpandedDeleteAttachmentDialog} evidenceBG={evidenceBG} downloadFile={downloadFile} key={index}   />
                                                            )
                                                        })}
                                                        { attachments.length < 5 && (<>
                                                        <Grid item onClick={() => {
                                                            setExpandedAttachmentsDialogs({expended:true,count: attachments.length});
                                                            setEvidenceId(id)
                                                        }}>
                                                            <PreAttachment mainColor={evidenceBG?.borderColor}
                                                                           backgroundColor={evidenceBG?.background}/>
                                                        </Grid>
                                                </>
                                            ) }

                                        </Grid>
                                        {attachments.length == 5 && <Box>
                                           <Typography sx={{fontSize: "12px",color:"#821237"}}>max file to attach 5</Typography>
                                        </Box>}
                                    </Box>
                                </Box>
                                <Typography
                                    fontSize="12px"
                                    variant="overline"
                                    sx={{whiteSpace: "nowrap", lineHeight: "12px"}}
                                >
                                    {formatDate(lastModificationTime)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                justifyContent: "center",
                            }}
                        >
                            <Box sx={{display: "flex", gap: 1}}>
                                <IconButton
                                    aria-label="edit"
                                    size="small"
                                    sx={{boxShadow: 2, p: 1}}
                                    onClick={onUpdate}
                                >
                                    <EditRoundedIcon fontSize="small" style={{color: "#004F83"}}/>
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    sx={{boxShadow: 2, p: 1}}
                                    onClick={() => {
                                        setExpandedDeleteDialog(true);
                                        setEvidenceId(id)
                                    }}
                                >
                                    <DeleteRoundedIcon
                                        fontSize="small"
                                        style={{color: "#D81E5B"}}
                                    />
                                </IconButton>
                            </Box>
                        </Box>
                    </>
                }
            </Box>
        </Box>
    )
        ;
};

const FileIcon =(props :any) =>{
    const {evidenceBG,downloadFile,item, setExpandedDeleteAttachmentDialog } = props

    const [hover, setHover] = useState(false);

    const {link}= item
    let reg = new RegExp("\\/([^\\/?]+)\\?")
    let name = link.match(reg)[1]

    return(
        <Tooltip title={<>
          <Typography>{name}</Typography>
          <Typography>{item.description}</Typography>
        </>}>
        <Box
            position="relative"
            display="inline-block"
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
        >
                <FileSvg  setExpandedDeleteAttachmentDialog={setExpandedDeleteAttachmentDialog} downloadFile={downloadFile} item={item} name={name}
                          mainColor={evidenceBG?.borderColor}
                          backgroundColor={evidenceBG?.background} hover={hover} />
            {hover && <Box
                position="absolute"
                top={0}
                left={0}
                width="40px"
                height="40px"
                bgcolor="rgba(0, 0, 0, 0.6)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="9px"
                sx={{cursor: "pointer"}}
            >
            </Box>}
        </Box>
        </Tooltip>
    )
}

const MyDropzone = (props: any) =>{

    const { setDropZone } = props

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        maxFiles:1
    });

    const theme = useTheme()
    return (
        <Dropzone accept={{"image/jpeg": [".jpeg", ".jpg",".png",".gif",".gif",".bmp"],"text/plain": ["*"], "application/pdf":["*"],
            "application/x-zip-compressed":["*"], "application/x-rar-compressed":["*"], "application/tar":["*"],
            "application/vnd":[".openxmlformats-officedocument",".wordprocessingml.document",".oasis", ".opendocument", ".text", ".spreadsheetml","spreadsheet" ,".sheet"],
            "application/x-zip":["*"],"application/zip": [".zip"]}} onDrop={(acceptedFiles) => setDropZone(acceptedFiles) }>
            {({getRootProps, getInputProps}) => (
                <section style={{ cursor: "pointer" }}>
                    <Box sx={{height: "220px", width: "100%", border: "1px solid #C4C7C9", borderRadius: "32px"}}>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <img src={UploadIcon}/>
                        <Typography sx={{
                            ...theme.typography.titleMedium,
                            color: "#243342",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "5px"
                        }}>
                            <Trans i18nKey={"dragYourFile"}/><Typography
                            sx={{...theme.typography.titleMedium, color: "#205F94"}}><Trans
                            i18nKey={"locateIt"}/></Typography>
                        </Typography></div>
                    </Box>
                </section>
            )}
        </Dropzone>
    )
}

const EvidenceAttachmentsDialogs = (props: any) => {

    const {
        expanded, onClose, uploadAttachment, uploadAnother,
        evidenceId, evidencesQueryData, setAttachmentData, setEvidencesData
    } = props;
    const MAX_DESK_TEXT = 100

    const fetchEvidenceAttachments = useQuery({
        service: (args = {evidence_id: evidenceId}, config) => service.fetchEvidenceAttachments(args, config),
        runOnMount: false,
    });

    const {service} = useServiceContext();
    const abortController = useMemo(() => new AbortController(),[evidenceId] );
    const [desc,setDesc] = useState("")
    const [error,setError] = useState(false)
    const [getDropZone,setDropZone] = useState<any>(null)
    const addEvidenceAttachments = useQuery({
        service: (args, config) => service.addEvidenceAttachments(args, { signal: abortController.signal }),
        runOnMount: false,
    });

    const handelDescription = (e: any) =>{
        if(e.target.value.length < MAX_DESK_TEXT){
            setDesc(e.target.value)
            setError(false)
        }else {
            setError(true)
        }
    }

    const handelSendFile = async () => {
        if(getDropZone && !error){
            let data ={
                id:evidenceId,
                attachment: getDropZone[0],
                description: desc
            }
            //TODO
            await addEvidenceAttachments.query({evidenceId,data})
            const {items} =  await evidencesQueryData.query();
            setEvidencesData(items)
            setAttachmentData(true)
            setDropZone(null)
            setDesc("")
            onClose()
        }
        if(!getDropZone){
            return toast(t("attachmentRequired"),{type:"error"})
        }
        if(error){
            return toast(t("max100characters"),{type:"error"})
        }
    }

    const handelSendAnother = async () => {
        if(getDropZone && !error){
            let data ={
                id:evidenceId,
                attachment: getDropZone[0],
                description: desc
            }
            await addEvidenceAttachments.query({evidenceId,data})
            const {items} =  await evidencesQueryData.query();
            setEvidencesData(items)
            setAttachmentData(true)
            setDropZone(null)
            setDesc("")
            if(expanded.count >= 5){
                onClose()
            }
        }
        if(!getDropZone){
            return toast(t("attachmentRequired"),{type:"error"})
        }
        if(error){
            return toast(t("max100characters"),{type:"error"})
        }
    }

    const theme = useTheme()
    return (
        <Dialog
            open={expanded.expended}
            onClose={()=> {
                onClose();
                setDropZone(null)
            }}
            maxWidth={"sm"}
            // fullScreen={fullScreen}
            fullWidth
            sx={{
                ".MuiDialog-paper": {
                    borderRadius: "32px",
                },
                ".MuiDialog-paper::-webkit-scrollbar": {
                    display: "none",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                },
            }}
        >
            <DialogContent
                sx={{
                    padding: "0!important",
                    background: "#004F83",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                <Box
                    sx={{
                        background: "#004F83",
                        textAlign: "center",
                        color: "#fff",
                        py: "24px",
                        ...theme.typography.headlineSmall,
                        sm:{...theme.typography.headlineMedium}
                    }}
                >
                    <Trans i18nKey="uploadAttachment"/>
                </Box>
                    <ClearIcon
                        onClick={onClose}
                        style={{color: "#fff"}}
                                   sx={{position: "absolute", width: "25px", height: "25px",right: "17px",top: "25px",
                                   cursor: "pointer"
                                   }} />
            </DialogContent>
            <DialogContent
                sx={{
                    padding: "unset",
                    background: "#fff",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Box sx={{display: "flex", flexDirection: "column", py: "28px", gap: "20px",marginTop:"25px",width:"90%"}}>
                    <Box>
                        <Typography sx={{...theme.typography.headlineSmall,display: "flex",justifyContent: "center",paddingBottom:"20px",paddingTop:"35px", gap: "5px"}}>
                            <Trans i18nKey={"uploadAttachment"}/><Typography sx={{...theme.typography.headlineSmall}}>{expanded.count} of 5 </Typography>
                        </Typography>
                        <Typography sx={{fontSize: "11px", color: "#73808C", maxWidth: "300px", textAlign: "left"}}>
                            <Box sx={{display: "flex", gap: '2px'}}>
                                <InfoOutlinedIcon
                                    style={{color: "#73808C"}}
                                    sx={{mr: 1, width: "12px", height: "12px"}}
                                />
                                <Trans i18nKey="uploadAcceptable"/>
                            </Box>

                        </Typography>
                        <Typography sx={{
                            fontSize: "11px",
                            color: "#73808C",
                            maxWidth: "300px",
                            textAlign: "left",
                            paddingBottom: "1rem"
                        }}>
                            <Box sx={{display: "flex", gap: '2px'}}>
                                <InfoOutlinedIcon
                                    style={{color: "#73808C"}}
                                    sx={{mr: 1, width: "12px", height: "12px"}}
                                />
                                <Trans i18nKey="uploadAcceptableSize"/>
                            </Box>
                        </Typography>
                           <MyDropzone setDropZone={setDropZone} />
                    </Box>
                    <Box>
                        <Typography sx={{...theme.typography.headlineSmall,color: "#243342",paddingBottom: "1rem"}}><Trans i18nKey={"additionalInfo"}/></Typography>
                        <TextField
                           sx={{
                               overflow: "auto",
                           }}
                            rows={3}
                            id="outlined-multiline-static"
                            multiline
                            fullWidth
                            value={desc}
                            onChange={handelDescription}
                            variant="standard"
                            inputProps={{
                               sx: {  fontSize: "13px", marginTop: "4px", background : "rgba(0,0,0,0.06)",padding : "5px"
                               }
                           }}
                            placeholder={"Add description for this specific attachment up to 100 charachter"}
                            error={error}
                            helperText={error && "maximum 100"}
                        />
                    </Box>
                </Box>

                <Box sx={{
                    width: "100%", display: "flex", gap: 2, padding: "16px",
                    justifyContent: "center"
                }}>
                    <Button
                        sx={{
                            fontSize: {xs: '0.7rem', sm: "1rem"},
                            fontWeight: 700,
                            color: "#004F83",
                            "&.MuiButton-root": {
                                border: "1px solid #004F83",
                                borderRadius: "100px",

                            },
                            "&.MuiButton-root:hover": {
                                background: "unset",
                                border: "1px solid #004F83",
                            },
                        }}
                        variant="outlined"
                        onClick={handelSendAnother}
                    >
                        {uploadAnother}
                    </Button>
                    <Button
                        sx={{
                            fontSize: {xs: '0.7rem', sm: "1rem"},
                            fontWeight: 700,
                            "&.MuiButton-root": {
                                color: "#EDFCFC",
                                border: "1px solid #004F83",
                                background: "#004F83",
                                borderRadius: "100px",
                            },
                            "&.MuiButton-root:hover": {
                                background: "#004F83",
                                border: "1px solid #004F83",
                            },
                        }}
                        variant="contained"
                        onClick={handelSendFile}
                    >
                        {uploadAttachment}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

const DeleteDialog = (props: any) => {
    const {expanded, onClose, onConfirm, title, cancelText, confirmText} =
        props;
    const fullScreen = useScreenResize("sm");
    return (
        <Dialog
            open={expanded}
            onClose={onClose}
            maxWidth={"sm"}
            // fullScreen={fullScreen}
            fullWidth
            sx={{
                ".MuiDialog-paper": {
                    borderRadius: "32px",
                },
                ".MuiDialog-paper::-webkit-scrollbar": {
                    display: "none",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                },
            }}
        >
            <DialogContent
                sx={{
                    padding: "32px",
                    background: "#fff",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 6,
                }}
            >
                <Typography sx={{color: "#0A2342"}}>{title}</Typography>

                <Box sx={{display: "flex", gap: 2}}>
                    <Button
                        sx={{
                            "&.MuiButton-root": {
                                color: "#0A2342",
                                border: "1px solid #0A2342",
                                borderRadius: "100px",
                            },
                            "&.MuiButton-root:hover": {
                                background: "#CED3D9  ",
                                border: "1px solid #0A2342",
                            },
                        }}
                        variant="outlined"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        sx={{
                            "&.MuiButton-root": {
                                color: "#FDF1F5",
                                border: "1px solid #D81E5B",
                                background: "#D81E5B",
                                borderRadius: "100px",
                            },
                            "&.MuiButton-root:hover": {
                                background: "#AD1849  ",
                                border: "1px solid #AD1849",
                            },
                        }}
                        variant="contained"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};


const QuestionGuide = (props: any) => {
    const hasSetCollapse = useRef(false);
    const [collapse, setCollapse] = useState<boolean>(false);
    const {service} = useServiceContext();
    const {assessmentId = ""} = useParams();
    const {hint} = props;
    const is_farsi = languageDetector(hint);
    return (
        <Box>
            <Box mt={1} width="100%">
                <Title
                    sup={
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <InfoRoundedIcon sx={{mr: "4px"}}/>
                            <Trans i18nKey="hint"/>
                        </Box>
                    }
                    size="small"
                    sx={{cursor: "pointer", userSelect: "none"}}
                    onClick={() => setCollapse(!collapse)}
                    mb={1}
                ></Title>
                <Collapse in={collapse}>
                    <Box
                        sx={{
                            flex: 1,
                            mr: {xs: 0, md: 4},
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            border: "1px dashed #ffffff99",
                            borderRadius: "8px",
                            direction: `${is_farsi ? "rtl" : "ltr"}`,
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems={"baseline"}
                            sx={{
                                p: 2,
                                width: "100%",
                            }}
                        >
                            <Typography variant="body2">
                                {hint.startsWith("\n")
                                    ? hint
                                        .substring(1)
                                        .split("\n")
                                        .map((line: string, index: number) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br/>
                                            </React.Fragment>
                                        ))
                                    : hint.split("\n").map((line: string, index: number) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br/>
                                        </React.Fragment>
                                    ))}
                            </Typography>
                        </Box>
                    </Box>
                </Collapse>
            </Box>
        </Box>
    );
};
type TAnswerTemplate = { caption: string; value: number }[];
