from pymongo import MongoClient


class BaseController:
    def __init__(self):
        self.client = MongoClient('localhost', 27017)
