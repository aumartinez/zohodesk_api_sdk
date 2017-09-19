<?php

class ZohoDesk_API {
    
}
function log($txt){
    echo $txt;
}

class ZAPI_Object{
    function __constructor($name, $requires = null) {
        $this->name = $name;
        $this->requiredFields = $requires;
    }
    function create($data, $obj) {
        if (!$this->passedRequires(data)) {
            return false;
        }
        $url = $this->buildURL($this->getPrimaryURL());
        return $obj.httpPOST($url, $this->objToString($data));
    }
    function update($id, $data, $obj) {
        log($this->objToString($data));
        $url = $this->buildURL($this->getPrimaryURL($id));
        return $obj.httpPATCH($url, $this->objToString($data));
    }
    function delete($id, $obj) {
        $url = $this->buildURL($this->getPrimaryURL($id));
        return $obj.httpDELETE($url);
    }
    function info($id, $params, $obj) {
        $param = ($params) ? $this->handleParameters($params) : "";
        $url = $this->buildURL($this->getPrimaryURL($id), $param);
        return $obj.httpGET($url);
    }
    function all($params, $obj) {
        $param = ($params) ? $this->handleParameters($params) : "";
        $url = $this->buildURL($this->getPrimaryURL(), $param);
        return $obj.httpGET($url);
    }
    function buildURL($url, $params = null) {
        return ($params !== null) ? $url + $params : $url;
    }
    function getPrimaryURL($id = null) {
        $returnURL = $zohodeskAPI_vars.appBaseURL;
        if ($id !== null) {
            $returnURL += $this->name + "/" + $id;
        } else {
            $returnURL += $this->name;
        }
        return $returnURL;
    }
    function handleParameters($data) {
        $params = "";
        if (gettype($data) === "object"){
            foreach ($data as $item) {
                $params += $item + "=" + $data[$item] + "&";
            }
        } else {
            return "?" + $data;
        }
        return "?" + $params.substr(0, $params.length - 1);
    }
    function passedRequires($data) {
        try {
            $dataObj = (gettype($data) === "object") ? $data : JSON.parse($data);
            foreach ($this->requiredFields as $item) {
                if ($dataObj.hasOwnProperty($item)) {
                    if (!$dataObj[$item]) {
                        log("ERROR : Field " + $item + " is required to create new " + $this->name + "");
                        $this->printRequired();
                        return false;
                    }
                } else {
                    log("ERROR : Field " + $item + " is required to create new " + $this->name + "");
                    $this->printRequired();
                    return false;
                }
            }
        } catch (Exception $e) {
            log("ERROR : Data is not valid JSON"+$e);
            return false;
        }
        echo("All required fields present");
        return true;
    }
    function required() {
        $this->printRequired();
    }
    function printRequired() {
        log("Required fields to create new " + $this->name + " are ");
        $i = 0;
        foreach ($this->requiredFields as $item) {
            log((++$i) + " : " + $item);
        }
        log("-------------");
    }
    function objToString($data) {
        return (gettype($data) === "object") ? json_decode($data) : $data;
    }

}

?>
