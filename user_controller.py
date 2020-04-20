from base_controller import BaseController


class UserController(BaseController):
    def __init__(self):
        super().__init__()
        db = self.client.test_db
        self.users = db.users

    def insert_user(self, user):
        print(user)
        user["role"] = "user"
        self.users.insert_one(user)

    def get_user(self, username):
        return self.users.find_one({"username": username}, {"_id": False})

    def get_users(self):
        return self.users.find({}, {"_id": False, "password" : False})

    def delete_user(self, username):
        return self.users.remove({"username": username})
        
