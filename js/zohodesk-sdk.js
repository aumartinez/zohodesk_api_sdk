var zohodeskAPI_vars = {
    content_json: "application/json; charset=utf-8",
    appBaseURL: "https://desk.zoho.com/api/v1/"
};

class zohodeskAPI_Object {
    constructor(name) {
        this.name = name;
    }
    create(data, obj) {
        var url = this.buildURL(this.getPrimaryURL());
        return obj.httpPOST(url, this.objToString(data));
    }
    update(id, data, obj) {
        console.log(this.objToString(data));
        var url = this.buildURL(this.getPrimaryURL(id));
        return obj.httpPATCH(url, this.objToString(data));
    }
    delete(id, obj) {
        var url = this.buildURL(this.getPrimaryURL(id));
        return obj.httpDELETE(url);
    }
    info(id, params, obj) {
        var param = (params) ? this.handleParameters(params) : "";
        var url = this.buildURL(this.getPrimaryURL(id), param);
        return obj.httpGET(url);
    }
    all(params, obj) {
        var param = (params) ? this.handleParameters(params) : "";
        var url = this.buildURL(this.getPrimaryURL(), param);
        return obj.httpGET(url);
    }
    buildURL(url, params = null) {
        return (params!==null) ? url + params : url;
    }
    getPrimaryURL(id = null) {
        var returnURL = zohodeskAPI_vars.appBaseURL;
        if (id !== null) {
            returnURL += this.name + "/" + id;
        } else {
            returnURL += this.name;
        }
        return returnURL;
    }
    handleParameters(data){
        var params="";
        if(typeof data==="object"){
            for (var item in data) {
                params+=item+"="+data[item]+"&";
            }
        }else{
            return data;
        }
        return "?"+params.substr(0,params.length-1);
    }
    objToString(data){
        return (typeof data==="object")?JSON.stringify(data):data;
    }
}
;
class zohodeskAPI_Secondary_Object {
    constructor(name, parent) {
        this.name = name;
        this.parent_name = parent;
    }
    create(parent_id, data, obj) {
        var url = this.buildURL(this.getPrimaryURL(parent_id));
        return obj.httpPOST(url, this.objToString(data));
    }
    update(parent_id, id, data, obj) {
        var url = this.buildURL(this.getPrimaryURL(parent_id, id));
        return obj.httpPATCH(url, this.objToString(data));
    }
    delete(parent_id, id, obj) {
        var url = this.buildURL(this.getPrimaryURL(parent_id, id));
        return obj.httpDELETE(url);
    }
    info(parent_id, id,params, obj) {
        var param = (params) ? this.handleParameters(params) : "";
        var url = this.buildURL(this.getPrimaryURL(parent_id, id),param);
        return obj.httpGET(url);
    }
    all(parent_id, params, obj) {
        var param = (params) ? this.handleParameters(params): "";
        var url = this.buildURL(this.getPrimaryURL(parent_id), param);
        return obj.httpGET(url);
    }
    buildURL(url, params = null) {
        return (params!==null) ? url + params : url;
    }
    getPrimaryURL(parent_id = null, id = null) {
        var returnURL = zohodeskAPI_vars.appBaseURL;
        var type = this.name;
        if (parent_id !== null) {
            returnURL += this.parent_name + "/" + parent_id;
            if (id !== null) {
                returnURL += "/" + this.name + "/" + id;
            } else {
                returnURL += (type === this.name) ? "/" + this.name : "";
            }
        } else {
            returnURL += this.parent_name;
        }
        return returnURL;
    }
    handleParameters(data){
        var params="";
        if(typeof data==="object"){
            for (var item in data) {
                params+=item+"="+data[item]+"&";
            }
        }else{
            return data;
        }
        return "?"+params.substr(0,params.length-1);
    }
    objToString(data){
        return (typeof data==="object")?JSON.stringify(data):data;
    }
};
var tickets = new zohodeskAPI_Object("tickets");
var comments = new zohodeskAPI_Secondary_Object("comments", "tickets");
var contacts = new zohodeskAPI_Object("contacts");
var accounts = new zohodeskAPI_Object("accounts");
var tasks = new zohodeskAPI_Object("tasks");
var agents = new zohodeskAPI_Object("agents");
var departments = new zohodeskAPI_Object("departments");

tickets.quickCreate=function(subject,departmentId,contactId,productId="",email="",phone="",description=""){
    return {
        "subject":subject,
        "departmentId":departmentId,
        "contactId":contactId,
        "productId":productId,
        "email":email,
        "phone":phone,
        "description":description
    };
};
comments.quickCreate=function(content,isPublic=true){
    var public=(isPublic)?"true":"false";
    return {
        "content":content,
        "isPublic":public
    };
};
contacts.quickCreate=function(lastName,firstName="",email="",phone="",description=""){
    return {
        "lastName":lastName,
        "firstName":firstName,
        "email":email,
        "phone":phone,
        "description":description
    };
};
accounts.quickCreate=function(accountName,email="",website=""){
    return {
        "accountName":accountName,
        "email":email,
        "website":website
    };
};

tasks.quickCreate=function(departmentId,subject,description="",priority="",ticketId=null){
    return {
        "departmentId":departmentId,
        "subject":subject,
        "description":description,
        "priority":priority,
        "ticketId":ticketId
    };
};


class zohodeskAPI {
    constructor(auth_token, orgId) {
        this.authtoken = auth_token;
        this.orgId = orgId;
    }
    createTicket(data) {
        var dataObj=(typeof data==="object")?data:tickets.quickCreate.apply(this,arguments);
        return tickets.create(dataObj, this);
    }
    updateTicket(id, data) {
        return tickets.update(id, data, this);
    }
    ticketDetails(id, params = "") {
        return tickets.info(id, params, this);
    }
    allTickets(params = "") {
        return tickets.all(params, this);
    }
    
    allComments(ticketID, params = "") {
        return comments.all(ticketID, params, this);
    }
    createComment(ticketID, comment_data,is_public=true) {
        var dataObj=(typeof comment_data==="object")?comment_data:comments.quickCreate.apply(this,arguments);
        return tickets.create(ticketID,dataObj, this);
    }
    updateComment(ticketID, commentID, comment_data) {
        return comments.update(ticketID, commentID, comment_data, this);
    }
    deleteComment(ticketID, commentID) {
        return comments.delete(ticketID, commentID, this);
    }
    commentDetails(ticketID, commentID) {
        return comments.info(ticketID, commentID, this);
    }
    
    allContacts(params="") {
        return contacts.all(params,this);
    }
    createContact(data) {
        var dataObj=(typeof data==="object")?data:contacts.quickCreate.apply(this,arguments);
        return contacts.create(dataObj, this);
    }
    updateContact(id, data) {
        return contacts.update(id, data, this);
    }
    deleteContact(id) {
        return contacts.delete(id, this);
    }
    contactDetails(id) {
        return contacts.info(id, this);
    }
    
    allAccounts(params="") {
        return accounts.all(params,this);
    }
    createAccount(data) {
        var dataObj=(typeof data==="object")?data:accounts.quickCreate.apply(this,arguments);
        return accounts.create(dataObj, this);
    }
    updateAccount(id, data) {
        return accounts.update(id, data, this);
    }
    deleteAccount(id) {
        return accounts.delete(id, this);
    }
    accountDetails(id) {
        return accounts.info(id, this);
    }

    allTasks(params="") {
        return tasks.all(params,this);
    }
    createTask(data) {
        var dataObj=(typeof data==="object")?data:tasks.quickCreate.apply(this,arguments);
        return tasks.create(dataObj, this);
    }
    updateTask(id, data) {
        return tasks.update(id, data, this);
    }
    deleteTask(id) {
        return tasks.delete(id, this);
    }
    taskDetails(id) {
        return tasks.info(id, this);
    }
    
    checkJquey() {
        return (window.jQuery) ? true : false;
    }
    buildURL(url, params = null) {
        return (params!==null) ? url + params : url;
    }
    httpGET(url) {
        this.httpExecute(url, this.httpSettings("GET", this.httpHeaders()));
    }
    httpPOST(url, data) {
        this.httpExecute(url, this.httpSettings("POST", this.httpHeaders(), data));
    }
    httpPATCH(url, data) {
        this.httpExecute(url, this.httpSettings("PATCH", this.httpHeaders(), data));
    }
    httpDELETE(url) {
        this.httpExecute(url, this.httpSettings("DELETE", this.httpHeaders()));
    }
    httpHeaders() {
        var authtoken = this.authtoken;
        return (new Headers({
            "Authorization": authtoken,
            "orgId": this.orgId,
            "contentType": zohodeskAPI_vars.content_json,
            
        }));
    }
    httpSettings(method, headers, data = "") {
        var settingsObj = {
            method: method,
            headers: headers,
            mode: 'cors'
        };
        if (method === "POST" || method==="PATCH" || method==="PUT") {
            settingsObj.body = data;
        }
        return settingsObj;
    }
    httpExecute(url, http_settings) {
        var api_response;
        if(this.checkJquey()){
            this.httpAjax(url,http_settings);
            return false;
        }
        fetch(url, http_settings).then(function (response) {
            api_response = response;
            if (response.ok) {
                return response.json();
            }
            throw new Error("Request Not Successful");
        }).then(function (result) {
            debugTraceNative(api_response, api_response.ok);
            console.log(JSON.stringify(result));
            //$('#TicketList .ResponsePanel').text(JSON.stringify(result, null, 2));
            //debugTraceNative(api_response, api_response.ok);
        }).catch(function (error) {
            debugTraceNative(api_response, api_response.ok);
            console.log(error);
            console.log(api_response);
            //debugTraceNative(api_response, api_response.ok);
        });
    }
    httpAjax(url, http_settings) {
        console.log("URL:"+url);
        console.log("htt:"+http_settings.headers);
        $.ajax({
            method: http_settings.method,
            url: url,
            dataType: "json",
            headers: {
                "Authorization": this.authtoken,
                "orgId": this.orgId
            },
            contentType: http_settings.contentType,
            data:http_settings.body,
            success: function (data, textStatus, jqXHR) {
                debugTrace(jqXHR,data, 'success');
                return data;
            },
            error: function (jqXHR, tranStatus) {
                debugTrace(jqXHR, 'error');
            }
        });
    }
    getPrimaryURL(type, ticketID = null, commentID = null) {
        var returnURL = zohodeskAPI_vars.appBaseURL;
        if (ticketID !== null) {
            returnURL += "tickets" + "/" + ticketID;
            if (commentID !== null) {
                returnURL += "/" + "comments" + "/" + commentID;
            } else {
                returnURL += (type === "comments") ? "/" + "comments" : "";
            }
        } else {
            returnURL += "tickets";
        }
        return returnURL;
    }
    checkEnoughArgs(obj){
        
    }
    assignDefaults() {
        this.authtoken = "59550a0e2b1a864a31bef962363e029f";
        this.orgId = 652853630;
    }
};
function ZAPI_Ticket(){
    this.id;
    this.subject="";
    this.departmentId="";
    this.contactId="";
    this.productId;
    this.uploads;
    this.email;
    this.phone;
    this.description;
    this.status;
    this.assigneeId;
    this.category;
    this.subCategory;
    this.resolution;
    this.dueDate;
    this.priority;
    this.channel;
    this.classification;
    this.customFields;
    this.createdTime;
    this.modifiedTime;
    this.timeEntryCount;
    this.approvalCount;
    this.commentCount;
    this.attachmentCount;
    this.taskCount;
    this.threadCount;
    this.product;
    this.closedTime;
    this.ticketNumber;
    this.contact;
    this.customerResponseTime;
    this.required={
        subject:this.subject,departmentId:this.departmentId,contactId:this.contactId
    };
    this.readOnly={
        id:this.id,
        createdTime:this.createdTime,
        modifiedTime:this.modifiedTime,
        timeEntryCount:this.timeEntryCount,
        approvalCount:this.approvalCount,
        commentCount:this.commentCount,
        attachmentCount:this.attachmentCount,
        taskCount:this.taskCount,
        threadCount:this.threadCount,
        product:this.product,
        closedTime:this.closedTime,
        ticketNumber:this.ticketNumber,
        contact:this.contact,
        customerResponseTime:this.customerResponseTime
    };
}
function debugTrace(jqXHR,data, status) {
    console.log(" cons da "+data);
    //$('#responseCode').text("Code: " + jqXHR.status + " Status: " + jqXHR.statusText).css({color: (status == 'success') ? 'blue' : 'red'});
    console.log(JSON.stringify(data, null, 2));
    //$('#TicketList .ResponsePanel').text(JSON.stringify(data, null, 2));
    console.log(jqXHR);
}
function debugTraceNative(response, status) {
    //$('#responseCode').text("Code: " + response.status + " Status: " + response.statusText).css({color: (status) ? 'blue' : 'red'});
    console.log(response);
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};