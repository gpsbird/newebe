import datetime
import logging

from django.utils import simplejson as json

from newebe.lib.resource import RestResource, NewebeResource
from newebe.lib.response import BadRequestResponse, CreationResponse, \
                                SuccessResponse, DocumentResponse

from newebe.lib.date_util import getDbDateFromUrlDate, getDateFromDbDate

from newebe.core.models import UserManager
from newebe.core.models import ContactManager
from newebe.news.models import MicroPost, MicroPostManager

from urllib2 import Request, urlopen


def sendDocumentToContacts(path, doc, method = 'POST'):
    '''
    Utility function to send documents to given path for all your contacts.
    '''
    logger = logging.getLogger("newebe.news")

    for contact in ContactManager.getTrustedContacts():

        logger.info("Sending document to %s" %contact.url)
        try:
            url = "%s%s" % (contact.url, path)
            logger.debug("Document sent to %s\n" % url)
            req = Request(url, doc.toJson())
            req.get_method = lambda: method
            response = urlopen(req)
            data = response.read()

            dataDict = json.loads(data)
            if not "success" in dataDict:
              logger.error("Sending failed")
            else: 
              logger.info("Sending succeeds")


        except Exception, err:
            logger.error('%s\n' % str(err))
            logger.error("Sending failed")

            pass

def sendDeleteDocumentToContacts(path, doc):
    sendDocumentToContacts(path, doc, 'DELETE')



class MicroPostResource(NewebeResource):
    '''
    This is the main resource of the application. It allows :
     * GET : to retrieve news by pack (number = NEWS_LIMIT) from a given date.
     * POST : to create news.
     * DELETE : to delete news.
    '''

    def __init__(self):
        self.methods = ['GET', 'POST', 'DELETE']
        

    def GET(self, request, startKey = None):
        '''
        Return microposts by pack of NEWS_LIMIT at JSON format. If a start key 
        is given in URL (it means a date like 2010-10-05-12-30-48), 
        microposts from this date are returned. Else latest news are returned. 

        Arguments:
            *startKey* The date from where news should be returned.
        '''
        microposts = list()

        if startKey:
            dateString = getDbDateFromUrlDate(startKey)
            microposts = MicroPostManager.getList(dateString)

        else:
            microposts = MicroPostManager.getList()
            
        return DocumentResponse(microposts)

        
    def POST(self, request):
        '''
        When post request is recieved, micropost data are expected as
        a JSON object. It is extracted from it
        then stored inside a new Microposts object. Micropost author is 
        automatically set with current user and current date is set as date.

        It converts carriage return to a <br /> HTML tag.

        Created microposts are forwarder to contacts.
        '''
        data = request.raw_post_data

        if data:

            # Save post locally
            data = data.replace('\n\r', '<br />').replace('\r\n', '<br />')
            data = data.replace('\n', '<br />').replace('\r', '<br />')
            postedMicropost = json.loads(data)

            micropost = MicroPost(
                author = UserManager.getUser().name,
                content = postedMicropost['content'],
                date = datetime.datetime.now(),
                authorKey = UserManager.getUser().key
            )
            micropost.save()

            # Forward post to contacts
            sendDocumentToContacts("news/microposts/contacts/", micropost)


            # return success response    
            return CreationResponse(micropost.toJson())
    
        else: 
            return BadRequestResponse(
                    "Sent data were incorrects. No post was created.")


    def DELETE(self, request, startKey):
        '''
        Delete extract start key date from URL. Start key is the datetime 
        corresponding at micro post entry. It retrieves the post which have the 
        same datetime and delete it if it exists.
        '''

        if startKey:
            dateString = getDbDateFromUrlDate(startKey)
            microPost = MicroPostManager.getFirst(dateString)

            if microPost:  
                microPost.delete()
                sendDeleteDocumentToContacts("news/microposts/contacts/", \
                                             microPost)

                return SuccessResponse("Micro post deletion succeeds.")
            else:
                return BadRequestResponse(
                        "No micro post for this date. Nothing was deleted.")
    
        else:
            return BadRequestResponse("No date given, nothing was deleted.")



class ContactMicroPostResource(RestResource):
    '''
    This resource allows authorized contacts to send their microposts.
    '''

    def __init__(self):
        self.methods = ['POST', 'DELETE']

    def POST(self, request):
        '''
        When post request is recieved, micropost content is expected inside
        a string under *content* of JSON object. It is extracted from it
        then stored inside a new Microposts object. Micropost author is 
        automatically set with current user and current date is set as date.

        It converts carriage return to a <br /> HTML tag.
        '''
        data = request.raw_post_data
        if data:
            try:
                postedMicropost = json.loads(data)

                date = getDateFromDbDate(postedMicropost["date"])

                micropost = MicroPost(
                    author = postedMicropost["author"],
                    content = postedMicropost['content'],
                    date = date,
                    authorKey = postedMicropost["authorKey"]
                )
                micropost.save()

                return CreationResponse(micropost.toJson())

            except Exception:
                return BadRequestResponse(
                    "Sent data are not correctly formatted.")

        else:
            return BadRequestResponse("No data sent.")
 
    def DELETE(self, request, startKey):
        return BadRequestResponse("Not implemented yet.")

