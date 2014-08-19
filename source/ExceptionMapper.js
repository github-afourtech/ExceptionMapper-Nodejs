/*
Copyright 2014 AFour Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 *  Mapper Class represents a class that returns description of exception in form of ExceptionInfo Object
 * @author AFourTechnologies
 */
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var HashTable = require('jshashtable');
var Enum = require('enum');
var Dom = require('xmldom').DOMParser;
var jf = require('jsonfile');

/**
 *Represents a class that provides general information about exception
 *@class ExceptionInfo
 * @constructor
 */

function ExceptionInfo()
{

    /**
     *Exception message-Gets the exception message for exception
     *
     * @property message
     * @type String
     * @default null
     */
    this.message=null;

    /**
     *Class name - Gets base class name where exception occurred.
     * @property className
     * @type String
     * @default null
     */
    this.className=null;

    /**
     *Alternate text- Gets alternate text for the exception
     * @property alternateText
     * @type String
     * @default null
     */
    this.alternateText=null;

    /**
     *Exception Type- Gets the type of exception
     * @property exceptionType
     * @type String
     * @default null
     */
    this.exceptionType=null;

    /**
     *Stack Trace- Gets stack trace information about exception
     * @property stackTrace
     * @type String
     * @default null
     */
    this.stackTrace=null;

    /**
     *Status Code-Gets status code for the call indicating success or failure
     * @property statusCode
     * @type String
     * @default null
     */
    this.statusCode=null;
}

/**
 *Specify the file path where ExceptionMapping.xml is located.
 * @attribute xmlFilePath
 * @readOnly
 * @default null;
 */
var xmlFilePath=null;

/*
 *This Hashtable is used for one time caching of xml file.
 * @attribute exceptionTypeHashtable
 * @readOnly
 * @default null;
 */
   var exceptionTypeHashtable =null;

/*
This Hashatble is used to store messages tag from xml file.
 * @attribute messageHashtable
 * @readOnly
 * @default null;
 */
   var messageHashtable=null;

/*
 Status code for current error.
 * @attribute statusCodeDictionaryFinder
 * @readOnly
 */
   var statusCodeDictionaryFinder;

/*
 *  Enum to find StepCondition type
 * @attribute stepConditionEnum
 * @readOnly
 */
   var stepConditionEnum = new Enum(["GIVEN","WHEN"]);

/*
 *   Dictionary for checking status of our errors with status code and messages.
 * @attribute statusCodeDictionary
 * @readOnly
 * @default null;
 */
   var statusCodeDictionary= null;


   /*
    * initializeErrorCodeDict
    * @method initializeErrorCodeDict
    *  Method to initialize Error codes in dictionary
    */
 function initializeErrorCodeDict()
 {
     statusCodeDictionary = new HashTable();
     // add elements in the Dictionary
     statusCodeDictionary.put(100, "Success");
     statusCodeDictionary.put(101, "An Error has occurred in our library please contact AFourTech for further Information on debugging this error.");
     statusCodeDictionary.put(102, "File Could not be found at following location :");
     statusCodeDictionary.put(103, "Syntax Error in file. Please follow proper syntax");
 }


 /*
  * cacheXMLDocument
  * @method cacheXMLDocument
  * Method to cache xml file to Hashtable
  */
 function cacheXMLDocument()
{
        initializeErrorCodeDict();
        var elements=null;
        if(this.xmlFilePath==null)
        {
             xmlFilePath=path.dirname(fs.realpathSync(__filename))+"\\resources\\ExceptionMapping.xml";
        }
        statusCodeDictionary.put(102,  statusCodeDictionary.get(102) + xmlFilePath);

        var isXmlValid=true;
        try
        {
             var data = fs.readFileSync(xmlFilePath,'ascii');
        }
        catch(ex)
        {
              statusCodeDictionaryFinder=102;
        }


        if(statusCodeDictionaryFinder!=102)
        {
               var options = {
                                locator:{},
                                errorHandler:{
                                              warning:function(w){ isXmlValid=false; console.warn(w) ;},
                                              error:function(e){isXmlValid=false; },
                                              fatalError:function(f){ isXmlValid=false;}
                                              }
                               };
               try
               {
                  var doc = new Dom(options).parseFromString(data);
                  if(isXmlValid===true)
                  {
                       elements=doc.getElementsByTagName("message");
                  }
                  else
                  {
                      throw new Error(Error);
                  }
               }
               catch(ex)
               {
                  statusCodeDictionaryFinder=103;
               }
               if(statusCodeDictionaryFinder!=102 && statusCodeDictionaryFinder!=103)
               {
                   try
                    {
                            var prevExceptionType=null;
                            var previousMessageHashtable=new HashTable();
                            var alternateText={};
                            var exceptionMessage={};
                            exceptionTypeHashtable = new HashTable();
                            for(var i=0;i<elements.length;i++)
                            {
                                var currentExceptionType= elements[i].parentNode.attributes[0].value;
                                if(prevExceptionType!==currentExceptionType)
                                {
                                    previousMessageHashtable=messageHashtable;
                                    messageHashtable = new HashTable();
                                }
                                if(elements[i].attributes.length > 0)
                                {
                                    alternateText= elements[i].attributes[0].value;
                                    exceptionMessage=elements[i].childNodes[0].nodeValue;
                                }
                                else
                                {
                                    alternateText="";
                                    exceptionMessage=elements[i].childNodes[0].nodeValue;
                                }
                                if(prevExceptionType===null)
                                {
                                    messageHashtable.put(exceptionMessage , alternateText);
                                }
                                else if(prevExceptionType===currentExceptionType)
                                {
                                    messageHashtable.put(exceptionMessage , alternateText);
                                }
                                else
                                {
                                    exceptionTypeHashtable.put(prevExceptionType, previousMessageHashtable);
                                    messageHashtable.put(exceptionMessage , alternateText);
                                }
                                if(i===elements.length-1)
                                {
                                    exceptionTypeHashtable.put(prevExceptionType, messageHashtable);
                                }

                                prevExceptionType=currentExceptionType;
                            }
                            messageHashtable=new HashTable();
                            messageHashtable.put("" , "");
                            exceptionTypeHashtable.put("other", messageHashtable );
                            if (Error)
                            {
                                throw new Error(Error.message);
                            }

                   }
                   catch(ex)
                   {
                       statusCodeDictionaryFinder=101;
                   }
               }
       }
}

 /**
 @class ExceptionMapper
 */
module.exports={

        /**
         * getExceptionInfo
         * @example
         * public ExceptionInfo getExceptionInfo(Exception exception, String stepString)}
         * @method getExceptionInfo
         * Function to return information about Exception given by user with step level condition provided as parameter.
         * @param exception object of Exception class
         * @param stepString   String such as Given ,When ,Then
         * @return {Object} ExceptionInfo class.
         */

        getExceInfoWithTwoParam:function getExceptionInfo(exception, stepString )
        {
            var exceptionType=null;
            var alternateText=null;
            var  whenAndGivenConditionChecker=0;
            var exInfo=new ExceptionInfo();
            try
            {
                  if(stepString!=null)
                  {
                      stepString=stepString.toUpperCase();
                      if (stepString==stepConditionEnum.GIVEN || stepString==stepConditionEnum.WHEN)
                      {
                          exInfo.exceptionType="Environmental";
                          whenAndGivenConditionChecker=1;
                      }
                  }
                  if(exceptionTypeHashtable===null)
                  {
                      cacheXMLDocument();
                  }

                  if(!exceptionTypeHashtable.isEmpty()&&statusCodeDictionaryFinder!=103)
                  {
                      var exceptionTypeHashtableAllKeys = exceptionTypeHashtable.keys();
                      exceptionTypeHashtableAllKeys.forEach(function(hashtableValue)
                      {
                          exceptionType=hashtableValue;
                          messageHashTable=exceptionTypeHashtable.get(hashtableValue);
                          var exceptionMessages = messageHashTable.keys();
                          exceptionMessages.forEach(function(messageInHashTable)
                          {
                              var  alternetTextOfException=messageHashTable.get(messageInHashTable);
                              if(messageInHashTable===exception.message)
                              {
                                      exInfo.exceptionType=hashtableValue;
                                       if ((exceptionType==="Functional") && whenAndGivenConditionChecker === 1)
                                       {
                                           alternateText = "";
                                       }
                                       else
                                       {
                                           alternateText = alternetTextOfException;
                                       }
                                       if(whenAndGivenConditionChecker===1)
                                       {
                                           exInfo.exceptionType="Environmental";
                                       }
                                       exInfo.alternateText=alternateText;
                              }
                          });
                          exInfo.message=exception;
                          exInfo.className=exception.name;
                          exInfo.stackTrace=exception.stack;
                      });


                if(exInfo.exceptionType===null)
                {
                    exInfo.exceptionType="other";
                }
                if(alternateText===null)
                {
                    alternateText="";
                }
                statusCodeDictionaryFinder=100;
                exInfo.alternateText=alternateText;

                var currentDir = path.dirname(fs.realpathSync(__filename));
                var dir =currentDir+"\\StackLog";
                if(!fs.existsSync(dir))
                {
                    fs.mkdirSync(dir);
                }
                var now = moment();
                var currentTime = now.format('YYYY-MM-DD hh-mm-ss-SSS');

                var logFileName=dir+"\\StackLog "+currentTime+".log";
                fs.writeFile(logFileName, exception.stack, function(err)
                {
                    if(err) {console.log(err); statusCodeDictionaryFinder=101; }
                });
                exInfo.message=exception;
                exInfo.className=exception.name;
                exInfo.stackTrace=exception.stack;
               }
            }
            catch(ex)
            {
            }
             exInfo.exceptionType=exInfo.exceptionType;
             exInfo.statusCode=statusCodeDictionaryFinder+" - "+statusCodeDictionary.get(statusCodeDictionaryFinder);
             return  exInfo;
         },

        /**
         * getExceptionInfo
         * @example
         * public ExceptionInfo getExceptionInfo(Exception exception)}
         * @method getExceptionInfo
         * Function to return information about Exception given by user.
         * @param exception object of Exception class
         * @return {Object} ExceptionInfo class.
         */
         getExceInfoWithOneParam:function getExceptionInfo(exception)
         {
                var exceptionType=null;
                var alternateText=null;
                var exInfo=new ExceptionInfo();
                try
                {
                   if(exceptionTypeHashtable===null)
                   {
                       cacheXMLDocument();
                   }
                   if(!exceptionTypeHashtable.isEmpty())
                   {
                         var exceptionTypeHashtableAllKeys = exceptionTypeHashtable.keys();
                         exceptionTypeHashtableAllKeys.forEach(function(hashtableValue)
                         {
                             exceptionType=hashtableValue;
                             messageHashTable=exceptionTypeHashtable.get(hashtableValue);
                             var exceptionMessages = messageHashTable.keys();
                             exceptionMessages.forEach(function(messageInHashTable)
                             {
                                 var  alternetTextOfException=messageHashTable.get(messageInHashTable);

                                 if(messageInHashTable===exception.message)
                                 {
                                     alternateText = alternetTextOfException;
                                     exInfo.alternateText=alternateText;
                                     exInfo.exceptionType=hashtableValue;
                                  }
                             });
                             exInfo.message=exception;
                             exInfo.className=exception.name;
                             exInfo.stackTrace=exception.stack;
                          });
                            if(exInfo.exceptionType===null)
                            {
                                exInfo.exceptionType="other";
                            }
                            if(alternateText===null)
                            {
                                alternateText="";
                            }
                       statusCodeDictionaryFinder=100;
                       exInfo.alternateText=alternateText;

                       var currentDir = path.dirname(fs.realpathSync(__filename));
                       var dir =currentDir+"\\StackLog";
                       if(!fs.existsSync(dir))
                       {
                         fs.mkdirSync(dir);
                       }
                       var now = moment();
                       var currentTime = now.format('YYYY-MM-DD hh-mm-ss-SSS');
                       var logFileName=dir+"\\StackLog "+currentTime+".log";
                       fs.writeFile(logFileName, exception.stack, function(err)
                       {
                         if(err) {console.log(err); statusCodeDictionaryFinder=101; }
                       });

                         exInfo.message=exception;
                         exInfo.className=exception.name;
                         exInfo.stackTrace=exception.stack;
                   }
                }
                catch(ex)
                {
                }
                exInfo.statusCode=statusCodeDictionaryFinder+" - "+statusCodeDictionary.get(statusCodeDictionaryFinder);
                return  exInfo;
         }
}


