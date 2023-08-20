import json
import boto3
from PIL import Image
import uuid


# def hello(event, context):
#     body = {
#         "message": "Go Serverless v1.0! Your function executed successfully!",
#         "input": event
#     }

#     response = {
#         "statusCode": 200,
#         "body": json.dumps(body)
#     }

#     return response

#     # Use this code if you don't use the http event with the LAMBDA-PROXY
#     # integration
#     """
#     return {
#         "message": "Go Serverless v1.0! Your function executed successfully!",
#         "event": event
#     }
#     """

def getimageMetadata(event, context):
    imageMetadata = {}
    imageMetadata["bucketName"]= event["detail"]["bucket"]["name"]
    imageMetadata["objectName"]= event["detail"]["object"]["key"]
    imageMetadata["objectSize"]= event["detail"]["object"]["size"]
    fileExtension=event["detail"]["object"]["key"]
    fileExtension=fileExtension.split(".")[1]
    print(fileExtension)
    if(fileExtension == "jpeg" or fileExtension == "png"):
        imageMetadata["isValidImage"] = 1
    else:
        imageMetadata["isValidImage"] = 0
    print(imageMetadata)
    return imageMetadata

def validImageFormat(event,context):
    return "valid image format"

def resize_image(image_path, resized_path):
  with Image.open(image_path) as image:
      image.thumbnail(tuple(x / 2 for x in image.size))
      image.save(resized_path)

def thumbnailCreation(event,context):
    s3_client = boto3.client('s3')
    destinationBucket= "narbais-sls-stepfunction-thumbnail"
    bucket= event["detail"]["bucket"]["name"]
    key= event["detail"]["object"]["key"]
    print(bucket)
    print(destinationBucket)
    print(key)
    tmpkey = key.replace('/', '')
    download_path = '/tmp/{}{}'.format(uuid.uuid4(), tmpkey)
    upload_path = '/tmp/resized-{}'.format(tmpkey)
    s3_client.download_file(bucket, key, download_path)
    print("file_downloaded")
    resize_image(download_path, upload_path)
    print("image_resized")
    s3_client.upload_file(upload_path, destinationBucket , key)
    print("file_uploaded")
