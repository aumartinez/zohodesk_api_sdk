<?php

    require_once 'ZohoDesk_API.php';
    
    $ZOHODESK_API = new zohodeskAPI('YOUR_AUTH_TOKEN', YOUR_ORG_ID); //Replace your values
    
    /****  Tickets      ******/
    
    //Get tickets
    $ticketsJSON = $ZOHODESK_API->getTickets();
    
    //Create a ticket
    $ticketFields = array(
                        "subject"      => "My ticket subject",
                        "contactId"    => 329372998233,    //YOUR CONTACT ID
                        "departmentId" => 328739287873     //YOUR DEPARTMENT ID
                    );
    //$createdTicket = $ZOHODESK_API->createTicket($ticketFields);
    
    //Get a ticket
    //$ticket_id = 372662979823;
    //$ticketJSON = $ZOHODESK_API->getTicket($ticket_id);
    
    //Update a ticket
    //$ticket_id = 372662979823;
    //$createdTicket = $ZOHODESK_API->updateTicket($ticket_id, $ticketFields);
    
    //Delete a ticket
    //$ZOHODESK_API->deleteTicket($ticket_id);
    
    /****  End of     Tickets      ******/
    
    
    
    
    
    
    /**** Contacts      ******/
    
    //Get contacts
    //$contactsJSON = $ZOHODESK_API->getContacts();
    
    //Create a contact
    //$contactFields = array(
                        "lastName" => "Vijaaaay" 
                    );
    //$createdContact = $ZOHODESK_API->createContact($contactFields);
    
    //echo json_encode($createdContact);
    
    //Get a contact
    //$contact_id = 372662979823;
    //$contactJSON = $ZOHODESK_API->getContact($contact_id);
    
    //Update a contact
    //$contact_id = 32838297938;
    //$updatedContact = $ZOHODESK_API->updateContact($contact_id, $contactFields);
    
    //Delete a contact
    //$contact_id = 32838297938;
    //$ZOHODESK_API->deleteContact($contact_id);
    
    /****  End of     Contacts      ******/
    
    
    
    /***** Same for COMMENTS, ACCOUNTS, TASKS, AGENTS, DEPARTMENTS  ****/
    

?>