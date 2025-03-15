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


# views
@api_view(["GET"])
def get_all(request):
    """process_raw_data()"""

    page_number = int(request.GET.get("page", 1))
    items_per_page = 50

    query = request.GET.get("query", "")

    data = read_json()
    if query != "":
        data = [
            item
            for item in data
            if item["trade_code"].lower().startswith(query.lower())
        ]

    last_page = math.ceil(len(data) / items_per_page)
    last_page = last_page if last_page != 0 else 1

    start = (page_number - 1) * items_per_page
    data = data[start : start + items_per_page]
    """ data = optimize_data(data) """

    return Response({"data": data, "last_page": last_page})


# @api_view solves csrfToken related issue
@api_view(["POST"])
def add(request):
    serializer = TradeDataSerializer(data=request.data)
    if serializer.is_valid():
        inputData = serializer.validated_data
        # we convert date into datetime.date object for validation purpose and we convert date into string so that we can convert input data into json format
        inputData["date"] = inputData["date"].isoformat()
        # assigning unique id
        inputData["id"] = str(uuid.uuid4())

        data = read_json()
        """ data = optimize_data(data) """

        data.insert(0, inputData)

        write_json(data)
        return Response(inputData, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def edit(request, item_id):
    data = read_json()
    for item in data:
        if item["id"] == item_id:
            serializer = TradeDataSerializer(item, data=request.data)
            if serializer.is_valid():
                inputData = serializer.validated_data
                inputData["date"] = inputData["date"].isoformat()

                # update() method updates a dictionary with key-value pairs from another dictionary
                item.update(inputData)

                write_json(data)
                return Response(item)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["DELETE"])
def delete(request, item_id):
    data = read_json()
    # filtering data
    updated_data = [item for item in data if item["id"] != item_id]

    # comparing lengths to see if item has been deleted or not
    if len(updated_data) == len(data):
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    write_json(updated_data)
    return Response(
        {"message": "Deletion successful"}, status=status.HTTP_204_NO_CONTENT
    )
