import os
import json
import uuid
import math

from django.http import HttpResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import TradeDataSerializer
from .models import Data

DATA_FILE_PATH = os.path.join(settings.BASE_DIR, "backend", "data.json")


# utility functions
# this function has been used only to optimize data format
def optimize_data(data):
    for i in range(len(data)):
        data[i]["volume"] = int(data[i]["volume"].replace(",", ""))
        data[i]["high"] = float(data[i]["high"].replace(",", ""))
        data[i]["low"] = float(data[i]["low"].replace(",", ""))
        data[i]["open"] = float(data[i]["open"].replace(",", ""))
        data[i]["close"] = float(data[i]["close"].replace(",", ""))
    return data


def read_json():
    with open(DATA_FILE_PATH, "r") as file:
        data = json.load(file)
        return data


def write_json(data):
    with open(DATA_FILE_PATH, "w") as file:
        json.dump(data, file, indent=4)


def process_raw_data():
    data = read_json()
    data = optimize_data(data)
    for item in data:
        item["id"] = str(uuid.uuid4())
    write_json(data)


def process_raw_data_sql():
    data = read_json()
    """ data = optimize_data(data) """

    print(len(data))

    for item in data:
        Data.objects.create(
            id=item["id"],
            date=item["date"],
            trade_code=item["trade_code"],
            high=item["high"],
            low=item["low"],
            open=item["open"],
            close=item["close"],
            volume=item["volume"],
        )


def clean_table_sql():
    Data.objects.all().delete()


# views
@api_view(["GET"])
def get_all(request):
    """process_raw_data()"""
    """ process_raw_data_sql() """
    """ clean_table_sql() """

    page_number = int(request.GET.get("page", 1))
    items_per_page = 50

    query = request.GET.get("query", "")

    sort_by = request.GET.get("sort", "")
    direction = request.GET.get("dir", "asc")

    order_by_literal = f"{'-' if direction == 'desc' else ''}{sort_by}"

    data = None

    offset = (page_number - 1) * items_per_page
    limit = items_per_page

    last_page = None

    if query != "":
        data = Data.objects.filter(trade_code__istartswith=query).order_by(
            f"{order_by_literal}"
        )[offset : offset + limit]

        last_page = math.ceil(
            Data.objects.filter(trade_code__istartswith=query).count() / items_per_page
        )
    else:
        data = Data.objects.all().order_by(f"{order_by_literal}")[
            offset : offset + limit
        ]

        last_page = math.ceil(Data.objects.count() / items_per_page)

    last_page = last_page if last_page != 0 else 1
    # list(data.values()) → Returns a List of Dictionaries, but list(data) → Would return a List of Model Instances
    data_list = list(data.values())

    return Response({"data": data_list, "last_page": last_page})


@api_view(["GET"])
def get_chart_data(request):

    query = request.GET.get("query", "")
    isFinal = request.GET.get("isFinal", "false")

    data = None

    if query != "":
        if isFinal == "false":
            data = (
                Data.objects.filter(trade_code__istartswith=query)
                .order_by("date")
                .values("date", "trade_code", "close", "volume")
            )
        else:
            data = (
                Data.objects.filter(trade_code__iexact=query)
                .order_by("date")
                .values("date", "trade_code", "close", "volume")
            )
    else:
        data = Data.objects.order_by("date").values(
            "date", "trade_code", "close", "volume"
        )

    data_list = list(data)

    return Response(data_list)


# @api_view solves csrfToken related issue
@api_view(["POST"])
def add(request):
    serializer = TradeDataSerializer(data=request.data)
    if serializer.is_valid():
        input_data = serializer.validated_data
        # assigning unique id
        input_data["id"] = uuid.uuid4()

        Data.objects.create(
            id=input_data["id"],
            date=input_data["date"],
            trade_code=input_data["trade_code"],
            high=input_data["high"],
            low=input_data["low"],
            open=input_data["open"],
            close=input_data["close"],
            volume=input_data["volume"],
        )

        return Response(input_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def edit(request, item_id):
    try:
        # data_instance is a Django model instance retrieved from DB
        data_instance = Data.objects.get(id=item_id)
    except Data.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    # just validating data with the help of a model instance
    serializer = TradeDataSerializer(data_instance, data=request.data)

    if serializer.is_valid():
        # updated_data - validated input data in json format retrieved from request.data
        updated_data = serializer.validated_data

        # at this point data_instance is updated with the value from validated input data now stored in updated_data
        for field, value in updated_data.items():
            setattr(data_instance, field, value)

        data_instance.save()

        # response_data is in json format so that we can send it to the client
        response_data = TradeDataSerializer(data_instance).data
        response_data["id"] = item_id

        return Response(response_data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete(request, item_id):
    try:
        item = Data.objects.get(id=item_id)
    except Data.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    item.delete()

    return Response(
        {"message": "Deletion successful"}, status=status.HTTP_204_NO_CONTENT
    )
