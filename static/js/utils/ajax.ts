import * as $ from "jquery";

export class AjaxUtil{

    constructor(protected url: string){}

    ajax = (method: string, cb?: (attr) => void, data?: {}) => {
        $.ajax({
            url: this.url,
            method: method,
            contentType: "application/json; charset=utf-8",
            data: (data) ? JSON.stringify(data) : undefined
        }).done(response => {
            //alert(response)
            if (cb) cb(response);
        }).fail(jqXHR => {
            alert("ERROR " + jqXHR.statusText)
        });
    };
   
    get = (data?, cb?) => {
        if(!cb)  cb = data;
        this.ajax('GET', cb, data);
    };
    add = (data: {}, cb?: (attr) => void) => {
        this.ajax('POST', cb, data);
    };
    
    remove = (data: {}, cb?: (attr) => void) => {
        this.ajax('DELETE', cb, data);
    };

}
