var zohodeskAPI_vars={
    content_json:"application/json; charset=utf-8"
};

class zohodeskAPI {
    constructor(auth_token) {
        this.authtoken = auth_token;
        this.orgId=null;
    }
    createTicket(ticket_data,orgId) {
        var primaryURL="https://desk.zoho.com/api/v1/tickets";
        var url=this.buildURL(primaryURL);
        
        if (this.checkJquey()) {
            this.httpPOST(url,orgId,ticket_data);
        }
    }
    allTickets(orgId=this.orgId,include_fields=""){
        var primaryURL="https://desk.zoho.com/api/v1/tickets";
        var params=(include_fields.length>0)? "include="+include_fields:"";
        var url=this.buildURL(primaryURL,params);
        this.orgId=orgId;
        return this.httpGET(url,orgId);
    }
    checkJquey() {
        return (window.jQuery) ? true : false;
    }
    buildURL(url,params){
        return (params.length>0)?url+params:url;
    }
    httpGET(url,orgId){
        this.httpExecute(url,httpSettings("GET",this.httpHeaders(orgId)));
    }
    httpPOST(url,orgId,data){
        this.httpExecute(url,httpSettings("POST",this.httpHeaders(orgId),data));
    }
    httpHeaders(orgId=this.orgId){
        var authtoken=this.authtoken;
        return (new Headers({
            "Authorization": authtoken,
            "orgId": orgId,
            "contentType": zohodeskAPI_vars.content_json
        }));
    }
    httpSettings(method,headers,data=""){
        return {
            method: method,
            headers: headers,
            mode: 'cors',
            body:data
        };
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
            debugTraceNative(api_response, api_response.ok);
        }).catch(function (error) {
            debugTraceNative(api_response, api_response.ok);
        });
    }
    getPrimaryURL(){
        
    }
    
    assignDefaults(){
        this.authtoken="59550a0e2b1a864a31bef962363e029f";
        this.orgId=652853630;
    }
}
;
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