# Generated by Django 4.2.2 on 2023-06-11 14:34

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("baseinfo", "0058_auto_20230611_1759"),
    ]

    operations = [migrations.RenameModel('AssessmentProfile', 'AssessmentKit'),
                  migrations.RenameModel('ProfileDsl', 'AssessmentKitDsl'),
                  migrations.RenameModel('ProfileTag', 'AssessmentKitTag'),
                  migrations.RenameModel('ProfileLike', 'AssessmentKitLike'),]
    
