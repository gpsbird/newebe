Feature: Retrieve Activities


    Scenario: Update contacts info
        Create a default contact
        Change default contact data through handlers
        Checks that default contact data are updated
        Checks that contact update activity is properly created

    Scenario: Get contacts 
        Deletes contacts
        Creates contacts
        Through handler retrieve requested contacts
        Check that there is 1 contacts
        Through handlers retrieve pending contacts
        Check that there is 1 contacts
        Through handlers retrieve trusted contacts
        Check that there is 1 contacts
        Through handlers retrieve all contacts
        Check that there is 3 contacts

    Scenario: Get and delete a contact
        Deletes contacts
        Creates contacts
        Through handler retrieve contact with slug httplocalhost1
        Check that there is 1 contacts
        Through handler delete contact with slug httplocalhost1
        Through handler retrieve contact with slug httplocalhost1
        Check that there is 0 contacts

    Scenario: Add a contact
        Deletes contacts
        Deletes seconde newebe contacts
        On first newebe add second newebe as a contact
        Through handlers retrieve all contacts
        Check that there is 1 contacts
        Check that first contact status is pending
        From second newebe retrieve all contacts
        Check that there is 1 contacts
        Check that first contact status is waiting for approval


    Scenario: Confirm a contact
        Deletes contacts
        Deletes seconde newebe contacts
        On first newebe add second newebe as a contact
        On seconde newebe confirm first newebe request
        Through handlers retrieve all contacts
        Check that there is 1 contacts
        Check that first contact status is trusted
        From second newebe retrieve all contacts
        Check that there is 1 contacts
        Check that first contact status is trusted


        
