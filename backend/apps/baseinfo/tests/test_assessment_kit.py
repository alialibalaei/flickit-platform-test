from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.test import APIRequestFactory ,force_authenticate
import pytest
from model_bakery import baker
from baseinfo.views import assessmentkitviews
from baseinfo.models.assessmentkitmodels import ExpertGroup
from baseinfo.models.basemodels import AssessmentSubject, QualityAttribute
from baseinfo.models.questionmodels import Question, QuestionImpact
from assessment.models import AssessmentKit, AssessmentProject
from baseinfo.models.assessmentkitmodels import ExpertGroup ,AssessmentKitLike 
from account.models import User

@pytest.fixture
def init_assessment_kit():
    def do_create_assessment_kit(authenticate, create_expertgroup):
        authenticate()
        test_user = User.objects.get(email = 'test@test.com')
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        test_user.save()
        assessment_kit = baker.make(AssessmentKit, title = 'p1')
        expert_group = create_expertgroup(ExpertGroup, test_user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        return assessment_kit
    return do_create_assessment_kit


@pytest.mark.django_db
class Test_Delete_AssessmentKit:
    def test_delete_assessment_kit_when_user_is_owner_of_assessment_kit_expert_group(self, api_client, init_assessment_kit, authenticate ,create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        response = api_client.delete('/baseinfo/assessmentkits/' + str(assessment_kit.id) + "/")
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_delete_assessment_kit_when_user_is_not_memeber_of_assessment_kit_expert_group(self, api_client, init_assessment_kit, authenticate, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        expert_group = create_expertgroup(ExpertGroup, user = baker.make(User, email = 'sajjad@test.com'))
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        
        response = api_client.delete('/baseinfo/assessmentkits/' + str(assessment_kit.id) + "/")
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['message'] == 'You do not have permission to perform this action.'
        
    def test_delete_assessment_kit_when_user_is_member_of_assessment_kit_expert_group(self, api_client, init_assessment_kit, authenticate, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user =  baker.make(User, email = 'sajjad@test.com')
        expert_group = create_expertgroup(ExpertGroup, user = user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        expert_group.users.add(user)
        
        response = api_client.delete('/baseinfo/assessmentkits/' + str(assessment_kit.id) + "/")
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['message'] == 'You do not have permission to perform this action.'


    def test_delete_assessment_kit_when_assessments_exist_with_assessment_kit(self, api_client, init_assessment_kit, authenticate, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        baker.make(AssessmentProject, assessment_kit = assessment_kit)
        
        response = api_client.delete('/baseinfo/assessmentkits/' + str(assessment_kit.id) + "/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['message'] == 'Some assessments with this assessment_kit exist'


@pytest.mark.django_db
class TestArchiveAssessmentKits:
    def test_archive_assessment_kits_returns_400(self, create_expertgroup, init_assessment_kit, authenticate):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = False 
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/archive/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitArchiveApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The assessment_kit has already been archived'
        
        
    def test_archive_assessment_kits_returns_403(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/archive/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitArchiveApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'
        
        expert_group.users.add(user2)
        request = api.post(f'/baseinfo/assessmentkits/archive/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitArchiveApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'
        
    def test_archive_assessment_kits_returns_200(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/archive/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitArchiveApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'The assessment_kit is archived successfully'


@pytest.mark.django_db
class TestPublishAssessmentKits:
    def test_publish_assessment_kits_returns_400(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/publish/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitPublishApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The assessment_kit has already been published'
        
    def test_publish_assessment_kits_returns_403(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = False
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/publish/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitPublishApi.as_view()
        resp = view(request,assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'    

        expert_group.users.add(user2)
        request = api.post(f'/baseinfo/assessmentkits/publish/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitPublishApi.as_view()
        resp = view(request,assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'    
        
    
    def test_publish_assessment_kits_returns_200(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = False
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/publish/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitPublishApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'The assessment_kit is published successfully'

@pytest.mark.django_db
class TestLikeAssessmentKits:
    def test_like_assessment_kit_return_200(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        AssessmentKitLike(assessment_kit = assessment_kit)
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/like/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitLikeApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["likes"] == 1
        
@pytest.mark.django_db
class TestAssessmentKitListOptions:
    def test_assessment_kit_list_options_return_200(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        assessment_kit1 = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit1.expert_group = expert_group
        assessment_kit1.is_active = True
        assessment_kit1.save()
        assessment_kit2 = baker.make(AssessmentKit)
        assessment_kit2.expert_group = expert_group
        assessment_kit2.is_active = False
        assessment_kit2.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/assessmentkits/options/select/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitListOptionsApi.as_view()
        resp = view(request)
        
        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data["results"]) == 1


@pytest.mark.django_db
class TestAssessmentKitDetailDisplay:
    def test_assessment_kit_detail_display_when_user_is_owner(self, authenticate, init_assessment_kit, init_data, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        init_data()
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/inspectassessmentkit/{assessment_kit.id}/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitDetailDisplayApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['title'] == assessment_kit.title
        assert resp.data['summary'] == assessment_kit.summary
        assert resp.data['about'] == assessment_kit.about
        assert resp.data['assessmentkitInfos'][0]['title'] == 'Questionnaires count'
        assert resp.data['assessmentkitInfos'][0]['item'] == 4
        assert resp.data['assessmentkitInfos'][1]['title'] == 'Attributes count'
        assert resp.data['assessmentkitInfos'][1]['item'] == 7
        assert resp.data['assessmentkitInfos'][2]['title'] == 'Total questions count'
        assert resp.data['assessmentkitInfos'][2]['item'] == 11
        assert resp.data['assessmentkitInfos'][3]['title'] == 'Subjects'
        assert len(resp.data['assessmentkitInfos'][3]['item']) == 2
        assert resp.data['assessmentkitInfos'][4]['title'] == 'Tags'
        assert len(resp.data['assessmentkitInfos'][4]['item']) == 0


    def test_assessment_kit_detail_display_when_user_is_member(self, authenticate, init_assessment_kit, init_data, create_expertgroup, create_user):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        init_data()
        user1 = User.objects.get(email = "test@test.com")
        user2 = create_user(email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user2.user_permissions.add(permission)
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit.expert_group.users.add(user2)


        api = APIRequestFactory()
        request = api.get(f'/baseinfo/inspectassessmentkit/{assessment_kit.id}/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitDetailDisplayApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['title'] == assessment_kit.title
        assert resp.data['summary'] == assessment_kit.summary
        assert resp.data['about'] == assessment_kit.about
        assert resp.data['assessmentkitInfos'][0]['title'] == 'Questionnaires count'
        assert resp.data['assessmentkitInfos'][0]['item'] == 4
        assert resp.data['assessmentkitInfos'][1]['title'] == 'Attributes count'
        assert resp.data['assessmentkitInfos'][1]['item'] == 7
        assert resp.data['assessmentkitInfos'][2]['title'] == 'Total questions count'
        assert resp.data['assessmentkitInfos'][2]['item'] == 11
        assert resp.data['assessmentkitInfos'][3]['title'] == 'Subjects'
        assert len(resp.data['assessmentkitInfos'][3]['item']) == 2
        assert resp.data['assessmentkitInfos'][4]['title'] == 'Tags'
        assert len(resp.data['assessmentkitInfos'][4]['item']) == 0


    def test_assessment_kit_detail_display_when_user_not_member(self, authenticate, init_assessment_kit, init_data, create_expertgroup, create_user):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        init_data()
        user1 = User.objects.get(email = "test@test.com")
        user2 = create_user(email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user2.user_permissions.add(permission)
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/inspectassessmentkit/{assessment_kit.id}/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitDetailDisplayApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_assessment_kit_detail_display_when_user_unauthorized(self, authenticate, init_assessment_kit, init_data, create_expertgroup, create_user):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        init_data()
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = True
        assessment_kit.save()


        api = APIRequestFactory()
        request = api.get(f'/baseinfo/inspectassessmentkit/{assessment_kit.id}/', {}, format='json')
        view = assessmentkitviews.AssessmentKitDetailDisplayApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class Test_Analyse_AssessmentKit:
    def test_analyse_assessment_kit_when_user_is_owner(self, api_client, init_data, create_user, create_expertgroup):
        test_user = create_user(email = "test@test.com") 
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        test_user.save()
        assessment_kit = baker.make(AssessmentKit, title = "p1")
        expert_group = create_expertgroup(ExpertGroup, test_user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        base_info = init_data()
        api_client.force_authenticate(user = test_user)
        response = api_client.get('/baseinfo/analyzeassessmentkit/' + str(assessment_kit.id) + "/")
        
        assert response.status_code == status.HTTP_200_OK
        analyze_list = response.data
        assert analyze_list[0]['level_analysis'][0]['attribute_question_number'] == 0
        assert analyze_list[0]['level_analysis'][1]['attribute_question_number'] == 2
        assert analyze_list[0]['level_analysis'][2]['attribute_question_number'] == 3
        assert analyze_list[0]['level_analysis'][3]['attribute_question_number'] == 3
        assert analyze_list[0]['level_analysis'][4]['attribute_question_number'] == 2
        assert analyze_list[0]['level_analysis'][5]['attribute_question_number'] == 1

        assert analyze_list[1]['level_analysis'][0]['attribute_question_number'] == 0
        assert analyze_list[1]['level_analysis'][1]['attribute_question_number'] == 2
        assert analyze_list[1]['level_analysis'][2]['attribute_question_number'] == 2
        assert analyze_list[1]['level_analysis'][3]['attribute_question_number'] == 3
        assert analyze_list[1]['level_analysis'][4]['attribute_question_number'] == 2
        assert analyze_list[1]['level_analysis'][5]['attribute_question_number'] == 2
    
    
    def test_analyse_assessment_kit_when_user_is_member(self, api_client, init_data, create_user, create_expertgroup):
        test_user = create_user(email = "test@test.com")
        user2 = create_user(email = "test1@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        test_user.save()
        assessment_kit = baker.make(AssessmentKit, title = "p1")
        expert_group = create_expertgroup(ExpertGroup, test_user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        base_info = init_data()
        expert_group.users.add(user2)
        
        api_client.force_authenticate(user = user2)
        response = api_client.get('/baseinfo/analyzeassessmentkit/' + str(assessment_kit.id) + "/")
        
        assert response.status_code == status.HTTP_200_OK
        analyze_list = response.data
        assert analyze_list[0]['level_analysis'][0]['attribute_question_number'] == 0
        assert analyze_list[0]['level_analysis'][1]['attribute_question_number'] == 2
        assert analyze_list[0]['level_analysis'][2]['attribute_question_number'] == 3
        assert analyze_list[0]['level_analysis'][3]['attribute_question_number'] == 3
        assert analyze_list[0]['level_analysis'][4]['attribute_question_number'] == 2
        assert analyze_list[0]['level_analysis'][5]['attribute_question_number'] == 1

        assert analyze_list[1]['level_analysis'][0]['attribute_question_number'] == 0
        assert analyze_list[1]['level_analysis'][1]['attribute_question_number'] == 2
        assert analyze_list[1]['level_analysis'][2]['attribute_question_number'] == 2
        assert analyze_list[1]['level_analysis'][3]['attribute_question_number'] == 3
        assert analyze_list[1]['level_analysis'][4]['attribute_question_number'] == 2
        assert analyze_list[1]['level_analysis'][5]['attribute_question_number'] == 2
    
    
    def test_analyse_assessment_kit_when_user_not_member(self, api_client, init_data, create_user, create_expertgroup):
        test_user = create_user(email = "test@test.com")
        user2 = create_user(email = "test1@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        test_user.save()
        assessment_kit = baker.make(AssessmentKit, title = "p1")
        expert_group = create_expertgroup(ExpertGroup, test_user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        base_info = init_data()
        
        api_client.force_authenticate(user = user2)
        response = api_client.get('/baseinfo/analyzeassessmentkit/' + str(assessment_kit.id) + "/")
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

        
    def test_analyse_assessment_kit_when_user_unauthorized(self, api_client, init_data, create_user, create_expertgroup):
        test_user = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        test_user.save()
        assessment_kit = baker.make(AssessmentKit, title = "p1")
        expert_group = create_expertgroup(ExpertGroup, test_user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        base_info = init_data()
        
        response = api_client.get('/baseinfo/analyzeassessmentkit/' + str(assessment_kit.id) + "/")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestAssessmentKitInitForm:
    def test_get_data_assessment_kit_return_403(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/assessmentkits/get/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitInitFormApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        

  
    def test_get_data_assessment_kit_return_200(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/assessmentkits/get/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitInitFormApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        data = [
                    {
                        "id": assessment_kit.id,
                        "title": "title user1",
                        "summary": "summary user1",
                        "about": "about user 1",
                        "tags": [
                           
                            {
                                "id": tag1.id,
                                "code": "tc1",
                                "title": "devops"
                            },
                            {
                                "id": tag2.id,
                                "code": "tc2",
                                "title": "team"
                            }
                        ]
                    }
                ]
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data == data
        assert user1 == expert_group.owner
        


@pytest.mark.django_db
class TestUpdateAssessmentKit:
    def test_update_assessment_kit_return_400(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        data ={
            "tags" : [tag2.id+1000],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/update/{assessment_kit.id}', data, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        api1 = APIRequestFactory()
        request1 = api1.post(f'/baseinfo/assessmentkits/update/{ assessment_kit.id }/', {}, format='json')
        view1 = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        force_authenticate(request1, user = user1)
        resp1= view1(request1, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] ==  "There is no assessment_kit tag with this id."
        
        assert resp1.status_code == status.HTTP_400_BAD_REQUEST
        assert resp1.data["message"] ==  "All fields cannot be empty."
    
        
    def test_update_assessment_kit_return_403(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        data ={
            "tags" : [tag2.id],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/update/{assessment_kit.id}', data, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        
        expert_group.users.add(user2)
        request = api.post(f'/baseinfo/assessmentkits/update/{assessment_kit.id}', data, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        
        
    
    def test_update_assessment_kit_return_200(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        data ={
            "tags" : [tag2.id],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/update/{assessment_kit.id}', data, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        resp = view(request, assessment_kit_id = assessment_kit.id)
        
        api1 = APIRequestFactory()
        request1 = api1.get(f'/baseinfo/assessmentkits/get/{ assessment_kit.id }/', {}, format='json')
        view1 = assessmentkitviews.AssessmentKitInitFormApi.as_view()
        force_authenticate(request1, user = user1)
        resp1= view1(request1, assessment_kit_id = assessment_kit.id)
        
        data =[
                {
                    "id": assessment_kit.id,
                    "title": "test2",
                    "summary": "test2",
                    "about": "<p>test2</p>",
                    "tags": [
                        {
                            "id": tag2.id,
                            "code": "tc2",
                            "title": "team"
                        }
                    ]
                }
            ]
        assert resp.status_code == status.HTTP_200_OK
        assert resp1.data == data
        assert user1 == expert_group.owner


@pytest.mark.django_db
class TestExpertGroupeListAssessmentKit:
    def test_get_list_assessment_kit_when_user_unauthorized(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        
        api = APIRequestFactory()
        request = api.get(f'expertgroup/{expert_group.id}/assessmentkits/', format='json')
        view = assessmentkitviews.AssessmentKitListForExpertGroupApi.as_view()
        resp = view(request, expert_group.id)

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_list_assessment_kit_when_user_not_member_expert_group(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit1 = baker.make(AssessmentKit)
        assessment_kit1.expert_group = expert_group
        assessment_kit1.is_active = True
        assessment_kit1.save()
        assessment_kit2 = baker.make(AssessmentKit)
        assessment_kit2.expert_group = expert_group
        assessment_kit2.is_active = False
        assessment_kit2.save()
        

        api = APIRequestFactory()
        request = api.get(f'expertgroup/{expert_group.id}/assessmentkits/', format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitListForExpertGroupApi.as_view()
        resp = view(request, expert_group.id)
        results = resp.data["results"]
        assert resp.status_code == status.HTTP_200_OK
        assert results["published"][0]["id"] == assessment_kit1.id
        assert ("unpublished" in results) == False
        
    
    
    def test_get_list_assessment_kit_when_user_member_expert_group(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit1 = baker.make(AssessmentKit)
        assessment_kit1.expert_group = expert_group
        assessment_kit1.is_active = True
        assessment_kit1.save()
        assessment_kit2 = baker.make(AssessmentKit)
        assessment_kit2.expert_group = expert_group
        assessment_kit2.is_active = False
        assessment_kit2.save()
        
        api = APIRequestFactory()
        request = api.get(f'expertgroup/{expert_group.id}/assessmentkits/', format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitListForExpertGroupApi.as_view()
        resp = view(request, expert_group.id)
        
        results = resp.data["results"]
        assert resp.status_code == status.HTTP_200_OK
        assert results["published"][0]["id"] == assessment_kit1.id
        assert results["unpublished"][0]["id"] == assessment_kit2.id


@pytest.mark.django_db
class TestViewAssessmentKit:
    def test_get_assessment_kit_when_user_unauthorized(self, api_client, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        
        resp = api_client.get(f'/baseinfo/assessmentkits/{assessment_kit.id}/')
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    
    def test_get_assessment_kit_when_not_member_expert_group(self, api_client, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test1@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        
        api_client.force_authenticate(user = user2)
        resp = api_client.get(f'/baseinfo/assessmentkits/{assessment_kit.id}/')
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["current_user_is_coordinator"] == False
        
        
    def test_get_assessment_kit_when_user_member_expert_group(self, api_client, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test1@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        expert_group.users.add(user2)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        
        api_client.force_authenticate(user = user2)
        resp = api_client.get(f'/baseinfo/assessmentkits/{assessment_kit.id}/')
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["current_user_is_coordinator"] == False
    
    def test_get_assessment_kit_when_user_is_owner(self, api_client, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        
        api_client.force_authenticate(user = expert_group.owner)
        resp = api_client.get(f'/baseinfo/assessmentkits/{assessment_kit.id}/')
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["current_user_is_coordinator"] == True


@pytest.mark.django_db
class TestLoadAssessmentKitInfoEditableApi:
    def test_get_assessment_kit_info_editable_when_user_expert_groups_is_member(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        expert_group = create_expertgroup(ExpertGroup, user1)
        expert_group.users.add(user2)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/info/')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit_id
        assert resp.data["title"] == assessment_kit.title
        assert resp.data["about"] == assessment_kit.about
        assert resp.data["summary"] == assessment_kit.summary
        assert "tags" in resp.data
        assert resp.data["price"] == 0
        assert resp.data["is_active"] == assessment_kit.is_active


    def test_get_assessment_kit_info_editable_when_user_expert_groups_not_member(self, create_user,create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/info/')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['code'] == "NOT_FOUND"
        assert resp.data['message'] == "'assessment_kit_id' does not exist"

    
    def test_get_assessment_kit_info_editable_when_user_unauthorized(self, create_user,create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/info/')
        view = assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_assessment_kit_info_editable_when_assessment_kit_id_not_exsist(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit_id = 100
        
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/info/')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['code'] == "NOT_FOUND"
        assert resp.data['message'] == "'assessment_kit_id' does not exist" 

@pytest.mark.django_db
class TestLoadAssessmentKitInfoStatisticalApi:
    
    def test_get_assessment_kit_info_Statistical_when_user_expert_groups_is_member(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        expert_group = create_expertgroup(ExpertGroup, user1)
        expert_group.users.add(user2)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/stats/')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.LoadAssessmentKitInfoStatisticalApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["expert_group"]["id"] == expert_group.id

    def test_get_assessment_kit_info_Statistical_when_user_expert_groups_not_member(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id

        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/stats/')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.LoadAssessmentKitInfoStatisticalApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['code'] == "NOT_FOUND"
        assert resp.data['message'] == "'assessment_kit_id' does not exist"

    def test_get_assessment_kit_info_Statistical_when_user_unauthorized(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id

        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/stats/')
        view = assessmentkitviews.LoadAssessmentKitInfoStatisticalApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_assessment_kit_info_Statistical_when_assessment_kit_id_not_exsist(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        assessment_kit_id = 1000

        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/stats/')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.LoadAssessmentKitInfoStatisticalApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['code'] == "NOT_FOUND"
        assert resp.data['message'] == "'assessment_kit_id' does not exist"


@pytest.mark.django_db
class TestEditAssessmentKitInfoApi:
    def test_edit_assessment_kit_when_user_is_owner(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        data ={
            "data" :{
            "tags" : [tag2.id],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            "is_active": True,
            "price": 0,
            }
        }
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user = user1)
        resp= view(request, assessment_kit_id = assessment_kit.id)
        

        assessment_kit.refresh_from_db()
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["title"] == assessment_kit.title
        assert resp.data["summary"] == assessment_kit.summary
        assert resp.data["about"] == assessment_kit.about
        assert resp.data["is_active"] == assessment_kit.is_active
        assert resp.data["price"] == 0
        assert resp.data["tags"][0]["id"] == tag2.id
        assert user1 == expert_group.owner
    
    def test_edit_assessment_kit_when_user_is_member_expert_groups(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email = "test@test.com")
        user2 = create_user(email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        expert_group.users.add(user2)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', {}, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user = user2)
        resp= view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'

    def test_edit_assessment_kit_when_user_not_member_expert_groups(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email = "test@test.com")
        user2 = create_user(email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', {}, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user = user2)
        resp= view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'

    def test_edit_assessment_kit_when_user_is_member_not_valid_field(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        
        # tag id not exist
        data = {
            "data":{
            "tags":[1,100]
            }
        }
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user = user1)
        resp= view(request, assessment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == "'tag_id' does not exists."

        # assessment kit id not exist
        assessment_kit_id= 1000
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit_id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user = user1)
        resp= view(request, assessment_kit_id = assessment_kit_id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['code'] == "NOT_FOUND"
        assert resp.data['message'] == "'assessment_kit_id' does not exist"
        
    def test_edit_assessment_kit_when_user_unauthorized(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        

        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', {}, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        resp= view(request, assessment_kit_id = assessment_kit.id)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    def test_edit_assessment_kit_when_user_is_member_expert_groups_no_editing(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()
        
        # empty data
        data = {}
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user = user1)
        resp= view(request, assessment_kit_id = assessment_kit.id)
        

        assessment_kit.refresh_from_db()
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["title"] == assessment_kit.title
        assert resp.data["summary"] == assessment_kit.summary
        assert resp.data["about"] == assessment_kit.about
        assert resp.data["is_active"] == assessment_kit.is_active
        assert resp.data["price"] == 0
        assert resp.data["tags"][0]["id"] == tag1.id
        assert user1 == expert_group.owner
        # field not exist
        data = {
            "data":{
                "test":"test"
            }
            }
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user = user1)
        resp= view(request, assessment_kit_id = assessment_kit.id)
        

        assessment_kit.refresh_from_db()
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["title"] == assessment_kit.title
        assert resp.data["summary"] == assessment_kit.summary
        assert resp.data["about"] == assessment_kit.about
        assert resp.data["is_active"] == assessment_kit.is_active
        assert resp.data["price"] == 0
        assert resp.data["tags"][0]["id"] == tag1.id
        assert user1 == expert_group.owner