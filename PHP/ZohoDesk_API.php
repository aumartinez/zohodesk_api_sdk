<?php
const ZOHOBASE_URL="https://desk.zoho.com/api/v1/";
function logio($txt){
    echo $txt."<br><br>";
}

class zohodeskAPI_Object{
    function __construct($name, $requires = null) {
        $this->name = $name;
        $this->requiredFields = $requires;
    }
    public function __call($method, $args)
    {
        if (isset($this->$method)) {
            $func = $this->$method;
            return call_user_func_array($func, $args);
        }
    }
    function create($data, $obj) {
        if (!$this->passedRequires($data)) {
            return false;
        }
        $url = $this->buildURL($this->getPrimaryURL());
        return $obj->httpPOST($url, $this->objToString($data));
    }
    function update($id, $data, $obj) {
        logio($this->objToString($data));
        $url = $this->buildURL($this->getPrimaryURL($id));
        return $obj->httpPATCH($url, $this->objToString($data));
    }
    function delete($id, $obj) {
        $url = $this->buildURL($this->getPrimaryURL($id));
        return $obj->httpDELETE($url);
    }
    function info($id, $params, $obj) {
        $param = ($params) ? $this->handleParameters($params) : "";
        $url = $this->buildURL($this->getPrimaryURL($id), $param);
        return $obj->httpGET($url);
    }
    function all($params, $obj) {
        $param = ($params) ? $this->handleParameters($params) : "";
        $url = $this->buildURL($this->getPrimaryURL(), $param);
        return $obj->httpGET($url);
    }
    function buildURL($url, $params = null) {
        return ($params !== null) ? $url . $params : $url;
    }
    function getPrimaryURL($id = null) {
        $returnURL = ZOHOBASE_URL;
        if ($id !== null) {
            $returnURL .= $this->name . "/" . $id;
        } else {
            $returnURL .= $this->name;
        }
        return $returnURL;
    }
    function handleParameters($data) {
        $params = "";
        if (gettype($data) === "object"){
            foreach ($data as $key=>$value) {
                $params .= $key . "=" . $value . "&";
            }
        } else {
            return "?" . $data;
        }
        return "?" . $params.substr(0, strlen($params) - 1);
    }
    function passedRequires($data) {
        try {
            $dataObj = (gettype($data) === "array") ? $data : $data;
            $dataType=gettype($data);
            if(gettype($data)=="array" || gettype($data)=="object"){
                foreach ($this->requiredFields as $item=>$value) {
                    if (($dataType=="array") ? array_key_exists($item, $dataObj): property_exists($dataObj, $item)) {
                        if ($value) {
                            logio("ERROR : Field " . $item . " is required to create new " . $this->name . "");
                            $this->printRequired();
                            return false;
                        }
                    } else {
                        logio("ERROR : Field " . $item . " is required to create new " . $this->name . "");
                        $this->printRequired();
                        return false;
                    }
                }
            }
            
        } catch (Exception $e) {
            logio("ERROR : Data is not valid JSON".$e);
            return false;
        }
        return true;
    }
    function required() {
        $this->printRequired();
    }
    function printRequired() {
        logio("Required fields to create new " . $this->name . " are ");
        $i = 0;
        foreach ($this->requiredFields as $key=>$value) {
            logio((++$i) . " : " . $key);
        }
        logio("-------------");
    }
    function objToString($data) {
        $json="";
        if(gettype($data)=="array"){
            return $data;
        }else{
            $json=$data;
            if($this->validJson($data)){
               // $json= json_decode($data);
                
            }else{
                logio($data."is not a valid json");
            }
        }
        return $json;
    }
    function validJson($string) {
        if(gettype($string)=="object") return TRUE;
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

}

class zohodeskAPI_ReadOnly_Obj extends zohodeskAPI_Object {
    function create($a,$b) {}
    function update($a,$b,$c) {}
    function delete($a,$b) {}
}
class zohodeskAPI_Secondary_Object {
    function __construct($name, $parent, $requires = null) {
        $this->name = $name;
        $this->parent_name = $parent;
        $this->requiredFields = $requires;
    }
    function create($parent_id, $data, $obj) {
        if (!$this->passedRequires($data)) {
            return false;
        }
        $url = $this->buildURL($this->getPrimaryURL($parent_id));
        return $obj->httpPOST($url, $this->objToString($data));
    }
    function update($parent_id, $id, $data, $obj) {
        $url = $this->buildURL($this->getPrimaryURL($parent_id, $id));
        return $obj->httpPATCH($url, $this->objToString($data));
    }
    function delete($parent_id, $id, $obj) {
        $url = $this->buildURL($this->getPrimaryURL($parent_id, $id));
        return $obj->httpDELETE($url);
    }
    function info($parent_id, $id, $params, $obj) {
        $param = ($params) ? $this->handleParameters($params) : "";
        $url = $this->buildURL($this->getPrimaryURL($parent_id, $id), $param);
        return $obj->httpGET($url);
    }
    function all($parent_id, $params, $obj) {
        $param = ($params) ? $this->handleParameters($params) : "";
        $url = $this->buildURL($this->getPrimaryURL($parent_id), $param);
        return $obj->httpGET($url);
    }
    function buildURL($url, $params = null) {
        return ($params !== null) ? $url . $params : $url;
    }
    function getPrimaryURL($parent_id = null, $id = null) {
        $returnURL = ZOHOBASE_URL;
        $type = $this->name;
        if ($parent_id !== null && trim($parent_id)!=="") {
            $returnURL .= $this->parent_name . "/" . $parent_id;
            if ($id !== null) {
                $returnURL .= "/" . $this->name . "/" . $id;
            } else {
                $returnURL .= ($type === $this->name) ? "/" . $this->name : "";
            }
        } else {
            try{
                throw new Exception("ERROR : ".$this->parent_name."-ID is empty or missing ");
            }
            catch (Exception $e){
                echo $e->getMessage();
            }
            return FALSE;
        }
        return $returnURL;
    }
    function handleParameters($data) {
        $params = "";
        if (gettype($data) === "array") {
            foreach ($data as $item) {
                $params .= $item . "=" . $data[$item] . "&";
            }
        } else {
            return "?" . $data;
        }
        return "?" . $params.substr(0, $params.length - 1);
    }
    function passedRequires($data) {
        try {
            $dataObj = (gettype($data) === "object") ? $data :json_decode($data);
            foreach ($this->requiredFields as $item=>$value) {
                if (property_exists($dataObj, $item)) {
                    if (!$data->$item) {
                        logio("ERROR : Field " . $item . " is empty & required to create new " . $this->name . "");
                        $this->printRequired();
                        return false;
                    }
                } else {
                    logio("ERROR : Field " . $item . " is required to create new " . $this->name . "");
                    $this->printRequired();
                    return false;
                }
            }
        } catch (Exception $e) {
            logio("ERROR : Data is not valid JSON".$e->getMessage());
            return false;
        }
        return true;
    }
    function required() {
        $this->printRequired();
    }
    function printRequired() {
        logio("Required fields to create new " . $this->name . " are ");
        $i = 0;
        foreach ($this->requiredFields as $item=>$value) {
            logio((++$i) . " : " . $item);
        }
        logio("-------------");
    }
    function objToString($data) {
        $json="";
        if(gettype($data)=="array"){
            return $data;
        }else{
            $json=$data;
            if($this->validJson($data)){
               // $json= json_decode($data);
                
            }else{
                logio($data."is not a valid json");
            }
        }
        return $json;
    }
    function validJson($string) {
        if(gettype($string)=="object") return TRUE;
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }
}

//$tickets = new zohodeskAPI_Object("tickets",zohodeskAPI_vars.requiredFields.tickets);
//$comments = new zohodeskAPI_Secondary_Object("comments", "tickets", zohodeskAPI_vars.requiredFields.comments);
//$contacts = new zohodeskAPI_Object("contacts", zohodeskAPI_vars.requiredFields.contacts);
//$accounts = new zohodeskAPI_Object("accounts", zohodeskAPI_vars.requiredFields.accounts);
//$tasks = new zohodeskAPI_Object("tasks", zohodeskAPI_vars.requiredFields.tasks);
//$agents = new zohodeskAPI_ReadOnly_Obj("agents");
//$departments = new zohodeskAPI_ReadOnly_Obj("departments");
class zohodeskAPI {
    function __construct($auth_token, $orgId) {
        $zohodeskAPI_vars = array(
            "content_json" => "application/json; charset=utf-8",
            "appBaseURL" => "https://desk.zoho.com/api/v1/",
            "requiredFields"=> array(
                "tickets" => array("subject"=> "", "departmentId"=> "", "contactId"=> ""),
                "comments"=> array("content"=> "", "isPublic"=> ""),
                "contacts"=> array("lastName"=> ""),
                "accounts"=> array("accountName"=> ""),
                "tasks"=> array("departmentId"=> "", "subject"=> "")
            )
    );
        $this->authtoken = $auth_token;
        $this->orgId = $orgId;
        $this->tickets = new zohodeskAPI_Object("tickets", $zohodeskAPI_vars['requiredFields']['tickets']);
        $this->comments = new zohodeskAPI_Secondary_Object("comments", "tickets", $zohodeskAPI_vars['requiredFields']['comments']);
        $this->contacts = new zohodeskAPI_Object("contacts", $zohodeskAPI_vars['requiredFields']['contacts']);
        $this->accounts = new zohodeskAPI_Object("accounts", $zohodeskAPI_vars['requiredFields']['accounts']);
        $this->tasks = new zohodeskAPI_Object("tasks", $zohodeskAPI_vars['requiredFields']['tasks']);
        $this->agents = new zohodeskAPI_ReadOnly_Obj("agents");
        $this->departments = new zohodeskAPI_ReadOnly_Obj("departments");
        
        $this->tickets->quickCreate = function ($subject, $departmentId, $contactId, $productId = "", $email = "", $phone = "", $description = "") {
            return json_encode(array(
                "subject"=> $subject,
                "departmentId"=> $departmentId,
                "contactId"=> $contactId,
                "productId"=> $productId,
                "email"=> $email,
                "phone"=> $phone,
                "description"=> $description
            ));
        };
        $this->comments->quickCreate = function ($ticketID,$content, $isPublic = true) {
            return json_encode(array(
                "content"=> $content,
                "isPublic"=> ($isPublic)?"true":"false"
            ));
        };
        
        $this->contacts->quickCreate = function ($lastName, $firstName = "", $email = "", $phone = "", $description = "") {
            return json_encode(array(
                "lastName"=> $lastName,
                "firstName"=> $firstName,
                "email"=> $email,
                "phone"=> $phone,
                "description"=> $description
            ));
        };
        $this->accounts->quickCreate = function ($accountName, $email = "", $website = "") {
            return json_encode(array(
                "accountName"=> $accountName,
                "email"=> $email,
                "website"=> $website
            ));
        };
        $this->tasks->quickCreate = function ($departmentId, $subject, $description = "", $priority = "", $ticketId = null) {
            return json_encode(array(
                "departmentId"=> $departmentId,
                "subject"=> $subject,
                "description"=> $description,
                "priority"=> $priority,
                "ticketId"=> $ticketId
            ));
        };
        $this->tasks->tasksOfTicket = function ($ticketId,$params,$obj) {
            $param = ($params) ? $this->tasks->handleParameters($params) : "";
            $url = $this->tasks->buildURL(ZOHOBASE_URL."tickets/$ticketId/tasks", $param);
            return $obj->httpGET($url);
        };

    }
    static function getBaseUrl(){
        return ZOHOBASE_URL;
    }
    function createTicket($data) {
        $arguments = func_get_args();
        $dataJsonObj= $this->getValidJson($data);
        $dataObj = ($dataJsonObj)?$dataJsonObj:call_user_func_array($this->tickets->quickCreate,$arguments);
        return $this->tickets->create($dataObj,$this);
    }
    function updateTicket($id, $data) {
        return $this->tickets->update($id, $data,$this);
    }
    function ticketDetails($id, $params = "") {
        return $this->tickets->info($id, $params,$this);
    }
    function allTickets($params = "") {
        return $this->tickets->all($params,$this);
    }

    function allComments($ticketID, $params = "") {
        return $this->comments->all($ticketID, $params,$this);
    }
    function createComment($ticketID, $comment_data, $is_public = true) {
        $arguments = func_get_args();
        $dataJsonObj= $this->getValidJson($comment_data);
        $dataObj = ($dataJsonObj)?$dataJsonObj:call_user_func_array($this->comments->quickCreate,$arguments);
        return $this->comments->create($ticketID, $dataObj,$this);
    }
    function updateComment($ticketID, $commentID, $comment_data) {
        return $this->comments->update($ticketID, $commentID, $comment_data,$this);
    }
    function deleteComment($ticketID, $commentID) {
        return $this->comments->delete($ticketID, $commentID,$this);
    }
    function commentDetails($ticketID, $commentID, $params = "") {
        return $this->comments->info($ticketID, $commentID, $params,$this);
    }

    function allContacts($params = "") {
        return $this->contacts->all($params,$this);
    }
    function createContact($data) {
        $arguments = func_get_args();
        $dataJsonObj= $this->getValidJson($data);
        $dataObj = ($dataJsonObj)?$dataJsonObj: call_user_func_array($this->contacts->quickCreate,$arguments);
        return $this->contacts->create($dataObj,$this);
    }
    function updateContact($id, $data) {
        return $this->contacts->update($id, $data,$this);
    }
    function deleteContact($id) {
        return $this->contacts->delete($id,$this);
    }
    function contactDetails($id, $params = "") {
        return $this->contacts->info($id, $params,$this);
    }

    function allAccounts($params = "") {
        return $this->accounts->all($params,$this);
    }
    function createAccount($data) {
        $arguments= func_get_args();
        $dataJsonObj= $this->getValidJson($data);
        $dataObj = ($dataJsonObj)?$dataJsonObj:call_user_func_array($this->accounts->quickCreate,$arguments);
        return $this->accounts->create($dataObj,$this);
    }
    function updateAccount($id, $data) {
        return $this->accounts->update($id, $data,$this);
    }
    function deleteAccount($id) {
        return $this->accounts->delete($id,$this);
    }
    function accountDetails($id, $params = "") {
        return $this->accounts->info($id, $params,$this);
    }

    function allTasks($params = "") {
        return $this->tasks.all($params,$this);
    }
    function createTask($data) {
        $arguments = func_get_args();
        $dataJsonObj= $this->getValidJson($data);
        $dataObj = ($dataJsonObj)?$dataJsonObj: call_user_func_array($this->tasks->quickCreate,$arguments);
        return $this->tasks->create($dataObj,$this);
    }
    function updateTask($id, $data) {
        return $this->tasks->update($id, $data,$this);
    }
    function deleteTask($id) {
        return $this->tasks->delete($id,$this);
    }
    function taskDetails($id, $params = "") {
        return $this->tasks->info($id, $params,$this);
    }
    function ticketTasks($ticketId,$params=""){
        return $this->tasks->tasksOfTicket($ticketId, $params,$this);
    }

    function allAgents($params = "") {
        return $this->agents->all($params,$this);
    }
    function agentDetails($id, $params = "") {
        return $this->agents->info($id, $params,$this);
    }

    function allDepartments($params = "") {
        return $this->departments->all($params,$this);
    }
    function departmentDetails($id, $params = "") {
        return $this->departments->info($id, $params,$this);
    }
    function buildURL($url, $params = null) {
        return ($params !== null) ? $url . $params : $url;
    }
    function httpGET($url) {
        $this->httpExecute($url,$this->httpHeaders(),"GET");
    }
    function httpPOST($url, $data) {
        $this->httpExecute($url,$this->httpHeaders(),"POST",$data);
    }
    function httpPATCH($url, $data) {
        $this->httpExecute($url,$this->httpHeaders(),"PATCH",$data);
    }
    function httpDELETE($url) {
        $this->httpExecute($url,$this->httpHeaders(),"DELETE");
    }
    function httpHeaders() {
        $authtoken = $this->authtoken;
        return array(
            "Authorization: $authtoken",
            "orgId: $this->orgId",
            "contentType: application/json; charset=utf-8",
        );
    }
    function httpExecute($url,$headers,$method,$data=""){
        $curl= curl_init($url);
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl,CURLOPT_CUSTOMREQUEST,$method);
        
        if($method=="POST" || $method=="PATCH"){
            curl_setopt($curl, CURLOPT_POSTFIELDS, (gettype($data)==="string")?$data:json_encode($data));
        }
        $response= curl_exec($curl);
        curl_close($curl);
        return ($response);
    }
    function httpSettings($method, $headers, $data = "") {
//        $settingsObj = {
//            method: method,
//            headers: headers,
//            mode: 'cors'
//        };
//        if (method === "POST" || method === "PATCH" || method === "PUT") {
//            settingsObj->body = $data;
//        }
//        return settingsObj;
    }
    function getValidJson($string) {
        switch (gettype($string)){
            case "array":
            case "object":
                return $string;
                break;
            case "string":
                $obj=json_decode($string);
                if(json_last_error() == JSON_ERROR_NONE){
                    return (gettype($obj)==="object")?$obj:FALSE;
                }
                return FALSE;
                break;
            default :
                return FALSE;
        }
    }
    
    function getPrimaryURL($type, $ticketID = null, $commentID = null) {
        $returnURL = ZOHOBASE_URL;
        if ($ticketID !== null) {
            $returnURL .= "tickets" . "/" . $ticketID;
            if ($commentID !== null) {
                $returnURL .= "/" . "comments" . "/" . $commentID;
            } else {
                $returnURL .= ($type === "comments") ? "/" . "comments" : "";
            }
        } else {
            $returnURL .= "tickets";
        }
        return $returnURL;
    }
    function assignDefaults() {
        $this->authtoken = "59550a0e2b1a864a31bef962363e029f";
        $this->orgId = 652853630;
    }
}
/*
function ZAPI_Ticket() {
    $this->$id;
    $this->subject = "";
    $this->departmentId = "";
    $this->contactId = "";
    $this->productId;
    $this->uploads;
    $this->email;
    $this->phone;
    $this->description;
    $this->status;
    $this->assigneeId;
    $this->category;
    $this->subCategory;
    $this->resolution;
    $this->dueDate;
    $this->priority;
    $this->channel;
    $this->classification;
    $this->customFields;
    $this->createdTime;
    $this->modifiedTime;
    $this->timeEntryCount;
    $this->approvalCount;
    $this->commentCount;
    $this->attachmentCount;
    $this->taskCount;
    $this->threadCount;
    $this->product;
    $this->closedTime;
    $this->ticketNumber;
    $this->contact;
    $this->customerResponseTime;
    $this->required = {
        subject: $this->subject, departmentId: $this->departmentId, contactId: $this->contactId
    };
    $this->readOnly = {
        $id: $this->$id,
        createdTime: $this->createdTime,
        modifiedTime: $this->modifiedTime,
        timeEntryCount: $this->timeEntryCount,
        approvalCount: $this->approvalCount,
        commentCount: $this->commentCount,
        attachmentCount: $this->attachmentCount,
        taskCount: $this->taskCount,
        threadCount: $this->threadCount,
        product: $this->product,
        closedTime: $this->closedTime,
        ticketNumber: $this->ticketNumber,
        contact: $this->contact,
        customerResponseTime: $this->customerResponseTime
    };
}
*/

?>
