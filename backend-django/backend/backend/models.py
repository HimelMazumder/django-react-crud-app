from django.db import models
import uuid


class Data(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    trade_code = models.CharField(max_length=20)
    high = models.FloatField()
    low = models.FloatField()
    open = models.FloatField()
    close = models.FloatField()
    volume = models.IntegerField()
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ID: {self.id}, Date: {self.date}, Trade Code: {self.trade_code}, High: {self.high}, Low: {self.low}, Open: {self.open}, Close: {self.close}, Volume: {self.volume}, Date Created: {self.date_created}"
