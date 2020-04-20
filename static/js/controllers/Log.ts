import {AjaxUtil} from '../utils/ajax';
import * as $ from "jquery";



export class LogController{
    private model = new AjaxUtil('../logs');
    private _logs: {};
    private _logsJSON = '';
    private filter = [];
    private counter:any = {};
    private ctx:any = $("#myChart")[0].getContext('2d');

    constructor (){
        var target:any = $(".filter");
        target.change(()=>{
            this.filter = [];
            target.each(index=>{
                if(target[index].checked) {
                    this.filter.push($(target[index]).val())
                }
            })
            this.showtable(this._logs)
        })
        this.updater()        
        setInterval(this.updater, 5000)
    }

    showtable(data){    
        var tbody = $('#logs_table').find('tbody').html('');

        if(data.length === 0) {
            tbody.append('<tr><td colspan="3">Nincs adat</td></tr>');
        }

        data.forEach( row => {
            if(this.filter.indexOf(this.getlevelName(row.level)) > -1 || this.filter.length === 0) {
                tbody.append(
                    `<tr style="background-color:${this.getlevelColor(row.level)}">
                    <td>${this.getlevelName(row.level)}</td>
                    <td>${row.computerName}</td>
                    <td>${new Date(row.date*1000).toLocaleString()}</td>
                    <td>${row.processName}</td>
                    <td>${row.processId}</td>
                    <td>${row.message}</td>
                    <td>
                        <button data-id="${row._id}" type="button" class="btn btn-danger remove_log">Remove</button>
                    </td>
                    </tr>`);
            }
        });
        console.log($.map(this.counter, value => {return [value]}));
        console.log(Object.keys(this.counter));
        new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(this.counter),
                datasets: [{
                    label: 'Number of logs',
                    data: $.map(this.counter, value => {return [value]}),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
        
        $('.remove_log').click((ev) => {
            var id = $(ev.currentTarget).attr('data-id');
            
            this.remove({_id : id}, result => {
                this.updater();
            });
            
        });
    }
    

    get logs(){
        return this._logs;
    }
   
    getlevelName(level:number){
        switch(level){
            case 0: 
            return "Emergency"
            case 1:
            return "Alert"
            case 2:
            return "Critical"
            case 3:
            return "Error"
            case 4:
            return "Warning"
            case 5:
            return "Notice"
            case 6:
            return "Info"
            case 7:
            return "Debug"
        }
    }

    getlevelColor(level:number){
        if(level >= 0 && level <= 3) {
            return "#dc3545"
        }
        else if (level > 3 && level <= 5) {
            return "#ffc107"
        }
        else {
            return "#28a745"
        }
    }

    updater = () => {
        this.model.get(response => {
            console.log(this)
            if(response.success){
                console.log(response)
                let readJSON = JSON.stringify(response.data);
                if(readJSON === this._logsJSON){
                    return;
                }
                this._logsJSON = readJSON;
                this._logs = response.data;  
                response.data.forEach(log => {
                    if(!this.counter[this.getlevelName(log.level)]) this.counter[this.getlevelName(log.level)] = 0;
                    this.counter[this.getlevelName(log.level)]++;
                });
                this.showtable(response.data);
                
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

