# Generated by Django 4.1.5 on 2023-05-16 14:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("baseinfo", "0054_maturitylevel_levelcompetencerelation_and_more"),
        ("assessment", "0017_alter_assessmentproject_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="assessmentproject",
            name="maturity_level",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="assessment_projects",
                to="baseinfo.maturitylevel",
            ),
        ),
        migrations.AddField(
            model_name="qualityattributevalue",
            name="maturity_level",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="quality_attribute_values",
                to="baseinfo.maturitylevel",
            ),
        ),
    ]