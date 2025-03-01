import os
import glob
import shutil
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connection

from branch.models import AppSettings


class Command(BaseCommand):
    help = 'Resets the database'

    def handle(self, *args, **options):
        dbname = settings.DATABASES["default"]["NAME"]
        with connection.cursor() as cursor:
            cursor.execute("DROP DATABASE IF EXISTS %s" % dbname)
            cursor.execute("CREATE DATABASE %s" % dbname)

        base = str(settings.BASE_DIR)
        migrations = glob.glob(os.path.join(base, "*", "migrations"))

        for migration in migrations:
            print(migration)
            files_in_directory = os.listdir(migration)
            filtered_files = [file for file in files_in_directory if file.endswith(".py") and file != '__init__.py']
            for file in filtered_files:
                path_to_file = os.path.join(migration, file)
                print(path_to_file)
                os.remove(path_to_file)
            # os.makedirs(migration)
            # filename = migration + '\\__init__.py'
            # open(filename , 'x')
            # shutil.rmtree(migration)

        for migration in migrations:
            print(migration.split("\\"))

        apps = [migration.split("\\")[-2] for migration in migrations]
        for app in apps:
            os.system("python manage.py makemigrations %s" % app)
        os.system("python manage.py migrate")
        print(">>>>>>>>>>>>>>>>Creating super user")
        os.system("python manage.py createsuperuser")

        print(">>>>>>>>>>>>>>>>Running Initial Scripts")
        with connection.cursor() as cursor:
            cursor.execute("use %s" % dbname)
            cursor.execute("insert into branch_appsettings(app_key,app_value) values ('REPORT_SERVER_LINK','');");
            cursor.execute("insert into branch_appsettings(app_key,app_value) values ('REPORT_USERNAME','');")
            cursor.execute("insert into branch_appsettings(app_key,app_value) values ('REPORT_PASSWORD','');")
            cursor.execute("insert into branch_appsettings(app_key,app_value) values ('COMPANY_NAME','');")
            cursor.execute("insert into branch_appsettings(app_key,app_value) values ('GST','');")


