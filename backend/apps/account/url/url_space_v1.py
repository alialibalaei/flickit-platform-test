from django.urls import path

from account.views import space_views
urlpatterns = [
    path("<str:space_id>/members/", space_views.AddMemberInSpaceApi.as_view()),

]
