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
        return obj.httpPOST(url, objToString(data));
    }
    update(id, data, obj) {
        var url = this.buildURL(this.getPrimaryURL(id));
        return obj.httpPATCH(url, objToString(data));
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
        return params.substr(0,params.length-1);
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
        return obj.httpPOST(url, objToString(data));
    }
    update(parent_id, id, data, obj) {
        var url = this.buildURL(this.getPrimaryURL(parent_id, id));
        return obj.httpPATCH(url, objToString(data));
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
};
var tickets = new zohodeskAPI_Object("tickets");
var comments = new zohodeskAPI_Secondary_Object("comments", "tickets");

var contacts = new zohodeskAPI_Object("contacts");

class zohodeskAPI {
    constructor(auth_token, orgId) {
        this.authtoken = auth_token;
        this.orgId = orgId;
    }
    createTicket(data) {
        return tickets.create(data, this);
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
    createComment(ticketID, comment_data) {
        return comments.create(ticketID, comment_data, this);
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
        return contacts.create(data, this);
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
            "contentType": zohodeskAPI_vars.content_json
        }));
    }
    httpSettings(method, headers, data = "") {
        var settingsObj = {
            method: method,
            headers: headers,
            mode: 'cors'
        };
        if (method === "POST") {
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
            $('#TicketList .ResponsePanel').text(JSON.stringify(result, null, 2));
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

    assignDefaults() {
        this.authtoken = "59550a0e2b1a864a31bef962363e029f";
        this.orgId = 652853630;
    }
};
function debugTrace(jqXHR,data, status) {
    console.log(" cons da "+data);
    $('#responseCode').text("Code: " + jqXHR.status + " Status: " + jqXHR.statusText).css({color: (status == 'success') ? 'blue' : 'red'});
    console.log(JSON.stringify(data, null, 2));
    $('#TicketList .ResponsePanel').text(JSON.stringify(data, null, 2));
    console.log(jqXHR);
}
function debugTraceNative(response, status) {
    $('#responseCode').text("Code: " + response.status + " Status: " + response.statusText).css({color: (status) ? 'blue' : 'red'});
    console.log(response);
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};