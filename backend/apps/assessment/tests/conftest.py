import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from account.models import User, Space, UserAccess
from baseinfo.models.assessmentkitmodels import AssessmentKit, MaturityLevel
from baseinfo.models.basemodels import AssessmentSubject, Questionnaire, QualityAttribute
from baseinfo.models.questionmodels import Question, QuestionImpact, AnswerTemplate, OptionValue
from assessment.fixture.dictionary import Dictionary



@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticate(api_client):
    def do_authenticate(is_staff=False):
        space1 = baker.make(Space)
        user1 = baker.make(User, current_space = space1, email = 'test@test.com')
        user_access11 = baker.make(UserAccess, space = space1, user = user1)
        return api_client.force_authenticate(user1)
    return do_authenticate

@pytest.fixture
def init_data():
    def do_init_data():
        assessment_kit = AssessmentKit.objects.filter().first()
        questionnaire_list = []
        questionnaire_list.append(baker.make(Questionnaire, assessment_kit = assessment_kit, index = 1, title = 'c1'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_kit = assessment_kit, index = 2, title = 'c2'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_kit = assessment_kit, index = 3, title = 'c3'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_kit = assessment_kit, index = 4, title = 'c4'))

        questions_list = []
        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[0], index = 1))
        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[0], index = 2))
        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[0], index = 3))

        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[1], index = 1))
        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[1], index = 2))
        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[1], index = 3))

        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[2], index = 1))
        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[2], index = 2))
        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[2], index = 3))

        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[3], index = 1))
        questions_list.append(baker.make(Question, questionnaire = questionnaire_list[3], index = 2))

        answer_templates = []
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[0], value = 1, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[0], value = 5, index = 2))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[1], value = 1, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[1], value = 3, index = 2))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[1], value = 5, index = 3))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[2], value = 1, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[2], value = 3, index = 2))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[2], value = 4, index = 3))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[2], value = 5, index = 4))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[3], value = 1, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[3], value = 2, index = 2))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[3], value = 3, index = 3))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[3], value = 4, index = 4))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[3], value = 5, index = 5))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[4], value = 1, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[4], value = 5, index = 2))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[5], value = 1, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[5], value = 3, index = 2))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[5], value = 5, index = 3))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[6], value = 2, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[6], value = 5, index = 2))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[7], value = 3, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[7], value = 4, index = 2))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[7], value = 5, index = 3))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[8], value = 1, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[8], value = 5, index = 2))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[9], value = 3, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[9], value = 5, index = 2))

        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[10], value = 1, index = 1))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[10], value = 2, index = 2))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[10], value = 3, index = 3))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[10], value = 4, index = 4))
        answer_templates.append(baker.make(AnswerTemplate, question = questions_list[10], value = 5, index = 5))
        
        subject1 = baker.make(AssessmentSubject, assessment_kit = assessment_kit, questionnaires = [questionnaire_list[0], questionnaire_list[1]])
        subject2 = baker.make(AssessmentSubject, assessment_kit = assessment_kit,  questionnaires = [questionnaire_list[2], questionnaire_list[3]])


        atts = []
        atts.append(baker.make(QualityAttribute, assessment_subject = subject1))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject1))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject1))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject2))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject2))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject2))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject2))     
        
        question_impacts = []

        maturity_level_0 = baker.make(MaturityLevel, title = 'Elementary', value = 0, assessment_kit = assessment_kit)
        maturity_level_1 = baker.make(MaturityLevel, title = 'Weak', value = 1, assessment_kit = assessment_kit)
        maturity_level_2 = baker.make(MaturityLevel, title = 'Moderate', value = 2, assessment_kit = assessment_kit)
        maturity_level_3 = baker.make(MaturityLevel, title = 'Good', value = 3, assessment_kit = assessment_kit)
        maturity_level_4 = baker.make(MaturityLevel, title = 'Great', value = 4, assessment_kit = assessment_kit)
        maturity_level_5 = baker.make(MaturityLevel, title = 'Exceptional', value = 5, assessment_kit = assessment_kit)

        #att1
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_1, quality_attribute = atts[0], question = questions_list[0]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_1, quality_attribute = atts[0], question = questions_list[1]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[0], question = questions_list[2]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[0], question = questions_list[3]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[0], question = questions_list[4]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[0], question = questions_list[5]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[0], question = questions_list[6]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[0], question = questions_list[7]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_4, quality_attribute = atts[0], question = questions_list[8]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_4, quality_attribute = atts[0], question = questions_list[9]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_5, quality_attribute = atts[0], question = questions_list[10]))
        #0-10

        #att2
        #11-21
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_1, quality_attribute = atts[1], question = questions_list[0]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_1, quality_attribute = atts[1], question = questions_list[1]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[1], question = questions_list[2]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[1], question = questions_list[3]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[1], question = questions_list[4]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[1], question = questions_list[5]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[1], question = questions_list[6]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_4, quality_attribute = atts[1], question = questions_list[7]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_4, quality_attribute = atts[1], question = questions_list[8]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_5, quality_attribute = atts[1], question = questions_list[9]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_5, quality_attribute = atts[1], question = questions_list[10]))

        #att3
        #22-32
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_1, quality_attribute = atts[2], question = questions_list[0]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[2], question = questions_list[1]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[2], question = questions_list[2]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[2], question = questions_list[3]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_2, quality_attribute = atts[2], question = questions_list[4]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], question = questions_list[5]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], question = questions_list[6]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], question = questions_list[7]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], question = questions_list[8]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], question = questions_list[9]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], question = questions_list[10]))

        option_values = []
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[0], option = answer_templates[0]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[0], option = answer_templates[1]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[11], option = answer_templates[0]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[11], option = answer_templates[1]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[22], option = answer_templates[0]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[22], option = answer_templates[1]))

        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[1], option = answer_templates[2]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[1], option = answer_templates[3]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[1], option = answer_templates[4]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[12], option = answer_templates[2]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[12], option = answer_templates[3]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[12], option = answer_templates[4]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[23], option = answer_templates[2]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[23], option = answer_templates[3]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[23], option = answer_templates[4]))

        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[2], option = answer_templates[5]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[2], option = answer_templates[6]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[2], option = answer_templates[7]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[2], option = answer_templates[8]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[13], option = answer_templates[5]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[13], option = answer_templates[6]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[13], option = answer_templates[7]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[13], option = answer_templates[8]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[24], option = answer_templates[5]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[24], option = answer_templates[6]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[24], option = answer_templates[7]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[24], option = answer_templates[8]))

        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[3], option = answer_templates[9]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[3], option = answer_templates[10]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[3], option = answer_templates[11]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[3], option = answer_templates[12]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[3], option = answer_templates[13]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[14], option = answer_templates[9]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[14], option = answer_templates[10]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[14], option = answer_templates[11]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[14], option = answer_templates[12]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[14], option = answer_templates[13]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[25], option = answer_templates[9]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[25], option = answer_templates[10]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[25], option = answer_templates[11]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[25], option = answer_templates[12]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[25], option = answer_templates[13]))

        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[4], option = answer_templates[14]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[4], option = answer_templates[15]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[15], option = answer_templates[14]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[15], option = answer_templates[15]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[26], option = answer_templates[14]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[26], option = answer_templates[15]))

        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[5], option = answer_templates[16]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[5], option = answer_templates[17]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[5], option = answer_templates[18]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[16], option = answer_templates[16]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[16], option = answer_templates[17]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[16], option = answer_templates[18]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[27], option = answer_templates[16]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[2], option = answer_templates[17]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[27], option = answer_templates[18]))

        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[6], option = answer_templates[19]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[6], option = answer_templates[20]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[17], option = answer_templates[19]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[17], option = answer_templates[20]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[28], option = answer_templates[19]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[28], option = answer_templates[20]))


        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[7], option = answer_templates[21]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[7], option = answer_templates[22]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[7], option = answer_templates[23]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[18], option = answer_templates[21]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[18], option = answer_templates[22]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[18], option = answer_templates[23]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[29], option = answer_templates[21]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[29], option = answer_templates[22]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[29], option = answer_templates[23]))

        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[8], option = answer_templates[24]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[8], option = answer_templates[25]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[19], option = answer_templates[24]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[19], option = answer_templates[25]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[30], option = answer_templates[24]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[30], option = answer_templates[25]))

        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[9], option = answer_templates[26]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[9], option = answer_templates[27]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[20], option = answer_templates[26]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[20], option = answer_templates[27]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[31], option = answer_templates[26]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[31], option = answer_templates[27]))


        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[10], option = answer_templates[28]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[10], option = answer_templates[29]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[10], option = answer_templates[30]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[10], option = answer_templates[31]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[10], option = answer_templates[32]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[21], option = answer_templates[28]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[21], option = answer_templates[29]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[21], option = answer_templates[30]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[21], option = answer_templates[31]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[21], option = answer_templates[32]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[32], option = answer_templates[28]))
        option_values.append(baker.make(OptionValue, value = 0, question_impact = question_impacts[32], option = answer_templates[29]))
        option_values.append(baker.make(OptionValue, value = 0.5, question_impact = question_impacts[32], option = answer_templates[30]))
        option_values.append(baker.make(OptionValue, value = 0.9, question_impact = question_impacts[32], option = answer_templates[31]))
        option_values.append(baker.make(OptionValue, value = 1, question_impact = question_impacts[32], option = answer_templates[32]))
    
        base_info = Dictionary()
        base_info.add("questionnaires", questionnaire_list)
        base_info.add("questions", questions_list)
        base_info.add("answer_templates", answer_templates)
        base_info.add("subject1", subject1)
        base_info.add("subject2", subject2)
        base_info.add("subject2", subject2)
        base_info.add("attributes", atts)
        base_info.add("impacts", question_impacts)
         
        return base_info
        
    return do_init_data







