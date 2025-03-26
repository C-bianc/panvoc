#!/usr/bin/env python
# ~* coding: utf-8 *~
import json
import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["panvoc_db"]
collection = db["definitions"]

print(f"Connected to {client} successfully!")

with open("data_output.json", "r") as file:
    data = json.load(file)
    json_data = json.loads(data)
    
    collection.insert_many(json_data)

client.close()
print("Data imported successfully!")
