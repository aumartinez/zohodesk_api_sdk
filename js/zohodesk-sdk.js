var zohodeskAPI_vars={
    content_json:"application/json; charset=utf-8",
    appBaseURL:"https://desk.zoho.com/api/v1/"
};
class zohodeskAPI_Object{
    constructor(name) {
        this.name = name;
    }
    create(data,obj){
        var url=this.buildURL(this.getPrimaryURL());
        return obj.httpPOST(url,data);
    }
    update(id,data,obj){
        var url=this.buildURL(this.getPrimaryURL(id));
        return obj.httpPATCH(url,data);
    }
    delete(id,obj){
        var url=this.buildURL(this.getPrimaryURL(id));
        return obj.httpDELETE(url);
    }
    info(id,obj){
        var url=this.buildURL(this.getPrimaryURL(id));
        return obj.httpGET(url);
    }
    all(obj){
        var url=this.buildURL(this.getPrimaryURL());
        return obj.httpGET(url);
    }
    buildURL(url,params=""){
        return (params.length>0)?url+params:url;
    }
    getPrimaryURL(id=null){
        var returnURL=zohodeskAPI_vars.appBaseURL;
        if(id!==null){
            returnURL+=this.name+"/"+id;
        }else{
            returnURL+=this.name;
        }
        return returnURL;
    }
};
class zohodeskAPI_Secondary_Object{
    constructor(name,parent) {
        this.name = name;
        this.parent_name=parent;
    }
    create(parent_id,data,obj){
        var url=this.buildURL(this.getPrimaryURL(parent_id));
        return obj.httpPOST(url,data);
    }
    update(parent_id,id,data,obj){
        var url=this.buildURL(this.getPrimaryURL(parent_id,id));
        return obj.httpPATCH(url,data);
    }
    delete(parent_id,id,obj){
        var url=this.buildURL(this.getPrimaryURL(parent_id,id));
        return obj.httpDELETE(url);
    }
    info(parent_id,id,obj){
        var url=this.buildURL(this.getPrimaryURL(parent_id,id));
        return obj.httpGET(url);
    }
    all(parent_id,obj){
        var url=this.buildURL(this.getPrimaryURL(parent_id));
        return obj.httpGET(url);
    }
    buildURL(url,params=""){
        return (params.length>0)?url+params:url;
    }
    getPrimaryURL(parent_id=null,id=null){
        var returnURL=zohodeskAPI_vars.appBaseURL;
        var type=this.name;
        if(parent_id!==null){
            returnURL+=this.parent_name+"/"+parent_id;
            if(id!==null){
                returnURL+="/"+this.name+"/"+id;
            }else{
                returnURL+=(type===this.name)?"/"+this.name:"";
            }
        }else{
            returnURL+=this.parent_name;
        }
        return returnURL;
    }
};
var tickets=new zohodeskAPI_Object("tickets");
var comments=new zohodeskAPI_Secondary_Object("comments","tickets");

class zohodeskAPI {
    constructor(auth_token,orgId) {
        this.authtoken = auth_token;
        this.orgId=orgId;
    }
    createTicket(data) {
        return tickets.create(data,this);
    }
    updateTicket(id,data) {
        return tickets.update(id,data,this);
    }
    ticketDetails(id){
        return tickets.info(id,this);
    }
    allTickets(include_fields=""){
        return tickets.all(this);
    }
    allComments(ticketID){
        return comments.all(ticketID,this);
    }
    createComment(ticketID,comment_data){
        return comments.create(ticketID,comment_data,this);
    }
    updateComment(ticketID,commentID,comment_data){
        return comments.update(ticketID,commentID,comment_data,this);
    }
    deleteComment(ticketID,commentID){
        return comments.delete(ticketID,commentID,this);
    }
    commentDetails(ticketID,commentID){
        return comments.info(ticketID,commentID,this);
    }
    
    checkJquey() {
        return (window.jQuery) ? true : false;
    }
    buildURL(url,params=""){
        return (params.length>0)?url+params:url;
    }
    httpGET(url){
        this.httpExecute(url,this.httpSettings("GET",this.httpHeaders()));
    }
    httpPOST(url,data){
        this.httpExecute(url,this.httpSettings("POST",this.httpHeaders(),data));
    }
    httpPATCH(url,data){
        this.httpExecute(url,this.httpSettings("PATCH",this.httpHeaders(),data));
    }
    httpDELETE(url){
        this.httpExecute(url,this.httpSettings("DELETE",this.httpHeaders()));
    }
    httpHeaders(){
        var authtoken=this.authtoken;
        return (new Headers({
            "Authorization": authtoken,
            "orgId": this.orgId,
            "contentType": zohodeskAPI_vars.content_json
        }));
    }
    httpSettings(method,headers,data=""){
        var settingsObj={
            method: method,
            headers: headers,
            mode: 'cors'
        };
        if(method==="POST"){
            settingsObj.body=data;
        }
        return settingsObj;
    }
    httpExecute(url,http_settings) {
        var api_response;
        
        fetch(url, http_settings).then(function (response) {
            api_response = response;
            if (response.ok) {
                return response.json();
            }
            throw new Error("Request Not Successful");
        }).then(function (result) {
            console.log(JSON.stringify(result));
            $('#TicketList .ResponsePanel').text(JSON.stringify(result, null, 2));
            //debugTraceNative(api_response, api_response.ok);
        }).catch(function (error) {
            console.log(error);
            console.log(api_response);
            //debugTraceNative(api_response, api_response.ok);
        });
    }
    getPrimaryURL(type,ticketID=null,commentID=null){
        var returnURL=zohodeskAPI_vars.appBaseURL;
        if(ticketID!==null){
            returnURL+="tickets"+"/"+ticketID;
            if(commentID!==null){
                returnURL+="/"+"comments"+"/"+commentID;
            }else{
                returnURL+=(type==="comments")?"/"+"comments":"";
            }
        }else{
            returnURL+="tickets";
        }
        return returnURL;
    }
    
    assignDefaults(){
        this.authtoken="59550a0e2b1a864a31bef962363e029f";
        this.orgId=652853630;
    }
};
$(document).ready(function () {
    $("#getTicketList").click(
            function () {
                var auth_token = '59550a0e2b1a864a31bef962363e029f'; //your_auth_token
                var org_id = 652853630; //your_organization_id
                var ticket_data = '{"subCategory" : "Sub General", "productId" : "", "contactId" : "215666000000074112", "subject" : "Welcome to Zoho Support. Youve got a sample Request!", "customFields" : { "MyDateTime" : "", "datetime" : "", "MyInteger" : "", "MyPickList" : "asdadada", "Date" : "", "qqweq" : "false" }, "dueDate" : "2016-06-21T16:16:16.000Z", "departmentId" : "215666000000006907", "channel" : "Email", "description" : "Hai This is Description", "priority" : "High", "classification" : "", "assigneeId" : null, "phone" : "1 888 900 9646", "category" : "manoj", "email" : "example@example.com", "status" : "Open"}';
                $.ajax({
                    method: "POST",
                    url: "https://desk.zoho.com/api/v1/tickets",
                    dataType: "json",
                    headers: {
                        "Authorization": auth_token,
                        "orgId": org_id
                    },
                    contentType: "application/json; charset=utf-8",
                    data: ticket_data,
                    success: function (data, textStatus, jqXHR) {
                        console.log(data);
                        $('#TicketList .ResponsePanel').text(JSON.stringify(data, null, 2));
                        debugTrace(jqXHR, 'success');
                    },
                    error: function (jqXHR, tranStatus) {
                        debugTrace(jqXHR, 'error');
                    }
                });
            }
    );
});
function debugTrace(jqXHR, status) {
    $('#responseCode').text("Code: " + jqXHR.status + " Status: " + jqXHR.statusText).css({color: (status == 'success') ? 'blue' : 'red'});
    console.log(jqXHR);
}
function debugTraceNative(response, status) {
    $('#responseCode').text("Code: " + response.status + " Status: " + response.statusText).css({color: (status) ? 'blue' : 'red'});
    console.log(response);
}
function getNativeResponse() {
    var api_response;
    var auth_token = '59550a0e2b1a864a31bef962363e029f'; //your_auth_token
    var org_id = 652853630; //your_organization_id
    var ticket_data = '{"subCategory" : "Sub General", "productId" : "", "contactId" : "215666000000074112", "subject" : "Welcome to Zoho Support. Youve got a Javascript Request!", "customFields" : { "MyDateTime" : "", "datetime" : "", "MyInteger" : "", "MyPickList" : "asdadada", "Date" : "", "qqweq" : "false" }, "dueDate" : "2016-06-21T16:16:16.000Z", "departmentId" : "215666000000006907", "channel" : "Email", "description" : "Hai This is Description", "priority" : "High", "classification" : "", "assigneeId" : null, "phone" : "1 888 900 9646", "category" : "manoj", "email" : "example@example.com", "status" : "Open"}';
    var http_headers = new Headers({
        "Authorization": auth_token,
        "orgId": org_id,
        "contentType": "application/json; charset=utf-8"
    });
    var http_settings = {
        method: "POST",
        headers: http_headers,
        body: ticket_data,
        mode: "cors"
    };
    fetch("https://desk.zoho.com/api/v1/tickets", http_settings).then(function (response) {
        api_response = response;
        if (response.ok) {
            return response.json();
        }
        throw new Error("Request Not Successful");
    }).then(function (result) {
        console.log("ok");
        $('#TicketList .ResponsePanel').text(JSON.stringify(result, null, 2));
        debugTraceNative(api_response, api_response.ok);
    }).catch(function (error) {
        debugTraceNative(api_response, api_response.ok);
    });
}