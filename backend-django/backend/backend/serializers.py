from rest_framework import serializers


# ItemSerializer extends serializers.Serializer class
class TradeDataSerializer(serializers.Serializer):
    date = serializers.DateField()
    trade_code = serializers.CharField(max_length=20)
    high = serializers.FloatField()
    low = serializers.FloatField()
    open = serializers.FloatField()
    close = serializers.FloatField()
    volume = serializers.IntegerField()
