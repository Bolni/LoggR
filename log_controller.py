from base_controller import BaseController
from bson.objectid import ObjectId
import pymongo

class LogController(BaseController):
    def __init__(self):
        super().__init__()
        db = self.client.test_db
        self.logs = db.logs

    def insert_log(self, log):
        self.logs.insert_one(log)

    def get_log(self):
        logs_dicts = []
        for log_dict in self.logs.find({}).sort("date", pymongo.ASCENDING):
            logs_dicts.append(log_dict)
        return logs_dicts

    def delete_log(self, _id):
        return self.logs.remove({"_id": ObjectId(_id)})
