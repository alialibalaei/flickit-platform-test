
import pytest
from rest_framework import status
from model_bakery import baker
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate

from account.models import User
from assessment.models import AssessmentProject, Evidence, EvidenceRelation
from assessment.views.evidenceviews import AddEvidenceApi, EvidenceListApi
from baseinfo.models.questionmodels import Question

@pytest.fixture
def init_data():
    def do_init_data():
        assessment_list = []
        assessment_list.append(baker.make(AssessmentProject))  
        assessment_list.append(baker.make(AssessmentProject)) 

        question_list = []
        question_list.append(baker.make(Question))  
        question_list.append(baker.make(Question)) 

        ev_rel1 = EvidenceRelation.objects.create(question = question_list[0], assessment = assessment_list[0])
        ev_rel2 = EvidenceRelation.objects.create(question = question_list[1], assessment = assessment_list[1])

        baker.make(Evidence, evidence_relation = ev_rel1)
        baker.make(Evidence, evidence_relation = ev_rel1)
        baker.make(Evidence, evidence_relation = ev_rel2)
        baker.make(EvidenceRelation)

        test_date = {}
        test_date['assessment_list'] = assessment_list
        test_date['question_list'] = question_list
        
        return test_date
    return do_init_data
        

    
@pytest.mark.django_db
class Test_EvidenceListApi:
    def test_evidence_create(self):
        user = baker.make(User, email = 'test@test.com')
        assessment = baker.make(AssessmentProject)  
        question = baker.make(Question)  

        api = APIRequestFactory()
        request = api.post('/assessment/addevidence/', {"description" : "test"})
        force_authenticate(request, user=user)
        view = AddEvidenceApi.as_view()
        resp = view(request, question.id, assessment.id)

        evdidence_qs = EvidenceRelation.objects.filter(question_id = question.id, assessment_id = assessment.id)
        evidence = Evidence.objects.get(evidence_relation_id = evdidence_qs.first().id)
        assert resp.status_code == status.HTTP_200_OK
        assert evdidence_qs.exists() == True
        assert evidence.description == "test"

    def test_evidence_list(self, init_data):
        user = baker.make(User, email = 'test@test.com')
        test_date = init_data()

        api = APIRequestFactory()
        request = api.get('/assessment/evidences/')
        force_authenticate(request, user=user)
        view = EvidenceListApi.as_view()
        resp = view(request, test_date['question_list'][0].id, test_date['assessment_list'][0].id)

        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data['evidences']) == 2