from branch.models import BranchUser, Branch


class StoreService:

    def get_store_by_user(self, user_id):
        branch_list = list(BranchUser.objects.filter(user_id=user_id).values('store__branch_name','branch_id'))
        return branch_list

    def get_store_by_name(self, branch_name):
        store = Branch.objects.filter(branch_name=branch_name).values(
            'id',
            'branch_name',
        )
        return store

