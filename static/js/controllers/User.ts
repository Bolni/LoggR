import {AjaxUtil} from '../utils/ajax';
import * as $ from "jquery";

export class UserController{
    private allmodel = new AjaxUtil('../users/all');
    private model = new AjaxUtil('../users')
    private _users: {};
    private _usersJSON = '';

    constructor(){
        this.updater()
        setInterval(this.updater, 5000)        
    }

    get users(){
        return this._users;
    }

    updater = () => {
        this.allmodel.get(response => {
            if(response.success){
                let readJSON = JSON.stringify(response.data);
                if(readJSON === this._usersJSON){
                    return;
                }
                this._usersJSON = readJSON;
                this._users = response.data;
                var tbody = $('#users_table').find('tbody').html('');

                if(response.data.length === 0) {
                    tbody.append('<tr><td colspan="3">No data</td></tr>');
                }

                response.data.forEach( row => {
                    tbody.append(
                        `<tr>
                           <td>${row.username}</td>
                           <td>${row.role}</td>
                           <td>${row.date}</td>
                           <td>
                               <button data-username="${row.username}" type="button" class="btn btn-danger remove_user">Remove</button>
                           </td>
                        </tr>`);
                });
                    $('.remove_user').click((ev) => {
                        var username = $(ev.currentTarget).attr('data-username');
                        this.model.remove({
                            "username" : username
                        
                        }, result => {
                            this.updater();
                        })

                    });
             
                }
        });
    };

    add = (data) => {
        this.model.add(data, this.updater);
    };


    remove = (data, cb) => {
        this.model.remove(data, this.updater);
    };
}
