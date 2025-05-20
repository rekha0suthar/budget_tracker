from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates or resets a guest user account'

    def handle(self, *args, **kwargs):
        username = 'guestuser'
        password = 'guestpass123'

        user, created = User.objects.get_or_create(username=username)
        user.set_password(password)
        user.save()

        self.stdout.write(self.style.SUCCESS(
            f"Guest user {'created' if created else 'updated'}: {username}/{password}"
        ))