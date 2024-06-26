from django.db.models.functions import TruncTime
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from rest_framework.pagination import PageNumberPagination
from baseinfo import services
from drf_yasg import openapi

from baseinfo.services import commonservice , assessmentkitservice
from baseinfo.models.basemodels import AssessmentSubject, Questionnaire, QualityAttribute
from baseinfo.models.questionmodels import Question, OptionValue
from baseinfo.serializers import commonserializers

class QuestionnaireViewSet(ModelViewSet):
    serializer_class = commonserializers.QuestionnaireSerializer

    def get_queryset(self):
        return Questionnaire.objects.all()


class QuestionViewSet(ModelViewSet):
    serializer_class = commonserializers.QuestionSerilizer
    def get_queryset(self):
        return Question.objects.filter(questionnaire_id=self.kwargs['questionnaire_pk']).order_by('index')


class QuestionnaireBySubjectViewSet(ModelViewSet):
    serializer_class = commonserializers.QuestionnaireBySubjectSerilizer
    def get_queryset(self):
        return Questionnaire.objects.prefetch_related('assessment_subjects').filter(assessment_subjects__id=self.kwargs['assessment_subject_pk']).order_by('index')


class AssessmentSubjectViewSet(ModelViewSet):
    serializer_class = commonserializers.AssessmentSubjectSerilizer

    def get_queryset(self):
        return AssessmentSubject.objects.all().order_by('index')


class QualityAttributeViewSet(ModelViewSet):
    serializer_class = commonserializers.QualityAttributeSerilizer

    def get_queryset(self):
        if 'assessment_subject_pk' in self.kwargs:
            return QualityAttribute.objects.filter(assessment_subject_id=self.kwargs['assessment_subject_pk']).order_by('index');
        else:
            return QualityAttribute.objects.all().order_by('index')
            

class LoadOptionValueInternalApi(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(responses={200: commonserializers.OptionValueSerilizers(many=True)})
    def get(self,request,answer_tamplate_id):
        option_value = commonservice.get_option_value_with_answer_tamplate(answer_tamplate_id)
        response = commonserializers.OptionValueSerilizers(option_value, many = True, ).data
        return Response({'items' :response}, status = status.HTTP_200_OK)  

class LoadAssessmentSubjectInternalApi(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(responses={200: commonserializers.LoadAssessmentSubjectAndQualityAttributeSerilizer(many=True)})
    def get(self,request,assessment_kit_id):
        assessment_subject = commonservice.get_assessment_subject_with_assessment_kit(assessment_kit_id)
        if assessment_subject == False:
            return Response({ "code": "NOT_FOUND",'message' :"'assessment_kit_id' does not exist"}, status = status.HTTP_400_BAD_REQUEST)
        response = commonserializers.LoadAssessmentSubjectAndQualityAttributeSerilizer(assessment_subject, many = True).data
        return Response({'items' :response}, status = status.HTTP_200_OK)  

class LoadQuestionInternalApi(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(responses={200: commonserializers.SimpleQuestionSerializers(many=True)})
    def get(self,request,quality_attribute_id):
        question = commonservice.get_question_with_quality_attribute(quality_attribute_id)
        response = commonserializers.SimpleQuestionSerializers(question, many = True).data
        return Response({'items' :response}, status = status.HTTP_200_OK)   

class LoadQualityAttributeInternalApi(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(responses={200: commonserializers.LoadQualityAttributeSerilizer(many=True)})
    def get(self,request,assessment_subject_id):
        quality_attribute = commonservice.get_quality_attribute_with_assessment_subject(assessment_subject_id)
        response = commonserializers.LoadQualityAttributeSerilizer(quality_attribute, many = True).data
        return Response({'items' :response}, status = status.HTTP_200_OK)    

class LoadQuestionImpactInternalApi(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(responses={200: commonserializers.LoadQuestionImpactSerilizer(many=True)})
    def get(self,request,question_impact_id):
        question_impact = commonservice.get_question_impact_with_id(question_impact_id)
        response = commonserializers.LoadQuestionImpactSerilizer(question_impact, many = True).data
        return Response({'items' :response}, status = status.HTTP_200_OK)


class CustomPaginationForQuestions(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 10000
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'items': data
        })

    
class LoadQuestionsInternalApi(APIView):
    permission_classes = [AllowAny]
    pagination_class = CustomPaginationForQuestions
    @swagger_auto_schema(responses={200: commonserializers.SimpleLoadQuestionsSerilizer(many=True)})
    def get(self,request,assessment_kit_id):
        paginator = self.pagination_class()
        question = commonservice.get_questions_with_assessmnet_kit_id(assessment_kit_id)
        if question == False:
            return Response({ "code": "NOT_FOUND",'message' :"'assessment_kit_id' does not exist"}, status = status.HTTP_400_BAD_REQUEST)
        paginated_queryset = paginator.paginate_queryset(question, request)
        response =commonserializers.SimpleLoadQuestionsSerilizer(paginated_queryset, many = True).data
        return paginator.get_paginated_response(response)


test_param = openapi.Parameter('ids', openapi.IN_QUERY, description="test manual param", type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_NUMBER))
class LoadAnswerOptionWithlistIdInternalApi(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema( manual_parameters=[test_param],responses={200: commonserializers.LoadAnswerOptionWithlistidSerilizer(many=True)})
    def get(self,request):
        if "ids" in request.query_params:
            answers_option = commonservice.get_answer_option_whit_id(request.query_params['ids'])
            response = commonserializers.LoadAnswerOptionWithlistidSerilizer(answers_option, many = True).data
            return Response({'items' :response}, status = status.HTTP_200_OK)    
        return Response({'items' :[]},status=status.HTTP_200_OK)
        
