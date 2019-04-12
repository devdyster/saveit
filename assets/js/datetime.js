exports.created_at = function(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

 
    var today = year + "-" + this.pad(month) + "-" + this.pad(day); 

    var date = new Date();
    var time = date.getHours() + ":" + this.pad(date.getMinutes()) + ":" + this.pad(date.getSeconds());

    return today + ' ' + time;


}
function pad(n){
    return (n < 10) ? '0' + n.toString() : n.toString();
}
