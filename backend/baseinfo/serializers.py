from rest_framework import serializers

from .models import AnswerTemplate, AssessmentProfile, AssessmentSubject, Metric, MetricImpact, QualityAttribute, MetricCategory
from .imagecomponent.serializers import QualityAttributeImageSerializer, ProfileImageSerializer, SubjectImageSerializer

class MetricCategorySerilizer(serializers.ModelSerializer):
    class Meta:
        model = MetricCategory
        fields = ['id', 'code', 'title', 'index']


class MetricCategoryBySubjectSerilizer(serializers.ModelSerializer):
    class Meta:
        model = MetricCategory
        fields = ['id', 'code', 'title', 'total_question', 'index']
    total_question = serializers.SerializerMethodField()

    def get_total_question(self, category:MetricCategory):
        metrics = MetricCategory.objects.get(pk = category.id).metric_set.all()
        return len(metrics)


class AssessmentSubjectSerilizer(serializers.ModelSerializer):
    images = SubjectImageSerializer(many=True)
    class Meta:
        model = AssessmentSubject
        fields = ['id', 'code', 'title', 'description', 'images', 'index']


class MetricImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = MetricImpact
        fields = ['id', 'level', 'quality_attribute']


class QualityAttributeSerilizer(serializers.ModelSerializer):
    images = QualityAttributeImageSerializer(many=True)
    class Meta:
        model = QualityAttribute
        fields = ['id', 'code', 'title', 'description', 'images', 'index']


class AssessmentProfileSerilizer(serializers.ModelSerializer):
    images = ProfileImageSerializer(many=True)
    metric_categories = MetricCategorySerilizer(many=True)
    assessment_subjects = AssessmentSubjectSerilizer(many=True)
    class Meta:
        model = AssessmentProfile
        fields = ['id', 'code', 'title', 'metric_categories', 'assessment_subjects', 'description', 'images']

class AssessmentProfileCreateSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentProfile
        fields = ['id']

class AssessmentProfileSimpleSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentProfile
        fields = ['id', 'code', 'title', 'description']

class AnswerTemplateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = AnswerTemplate
        fields = ['id', 'caption', 'value', 'index']

class SimpleMetricSerializers(serializers.ModelSerializer):
    quality_attributes = QualityAttributeSerilizer(many=True)
    metric_impacts = MetricImpactSerilizer(many=True)
    class Meta:
        model = Metric
        fields = ['id', 'title', 'index', 'quality_attributes', 'metric_impacts']

class MetricSerilizer(serializers.ModelSerializer):
    answer_templates = AnswerTemplateSerializer(many=True)
    class Meta:
        model = Metric
        fields = ['id', 'title', 'index', 'answer_templates']
