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

var objTest= require('./ExceptionMapper.js'); // Import Exception mapping file
try
{
        var x=1;
        var y=0;
        var z =[1,2,3,4];
        var ans=x/y;
     //   var p =z[6];
        if (err)
              throw (err);
 }
catch(ex)
{
   exinfo1= objTest.getExceInfoWithOneParam(ex);    //functional
 //  exinfo1= objTest.getExceInfoWithOneParam(new Error("Index was outside the bounds of the array."));
  //     exinfo1= objTest.getExceInfoWithOneParam(new Error("InvaliArgumentException"));
   console.log("Exception Status        = "+exinfo1.statusCode);
   console.log("Exception Message       ="+exinfo1.message);
   console.log("Exception Class         ="+exinfo1.className);
   console.log("Exception Type          ="+exinfo1.exceptionType);
   console.log("Exception AlternateText ="+exinfo1.alternateText);
   console.log("Exception StackTrace    ="+exinfo1.stackTrace);
   console.log("------------------------------------------------------------------------------------ \n");
}

try
{
        var x=1;
        var y=0;
        var z =[1,2,3,4];
        var ans=x/y;
        //var p =z[6];
        if (err)
              throw (err);
}
catch(ex)
{
    exinfo1= objTest.getExceInfoWithTwoParam(ex,"then");   //functional
 //  exinfo1= objTest.getExceInfoWithTwoParam(new Error("Index was outside the bounds of the array."),"then");
 //   exinfo1= objTest.getExceInfoWithTwoParam(new Error("InvaliArgumentException"),"then");
   console.log("Exception Status        = "+exinfo1.statusCode);
   console.log("Exception Message       ="+exinfo1.message);
   console.log("Exception Class         ="+exinfo1.className);
   console.log("Exception Type          ="+exinfo1.exceptionType);
   console.log("Exception AlternateText ="+exinfo1.alternateText);
   console.log("Exception StackTrace    ="+exinfo1.stackTrace);
   console.log("------------------------------------------------------------------------------------ \n");
}
try
{
        var x=1;
        var y=0;
        var z =[1,2,3,4];
        var ans=x/y;
        //var p =z[6];
        if (err)
              throw (err);
}
catch(ex)
{
     exinfo1= objTest.getExceInfoWithTwoParam(ex,"when");//functional
  //  exinfo1= objTest.getExceInfoWithTwoParam(new Error("Index was outside the bounds of the array."),"when");
 //  exinfo1= objTest.getExceInfoWithTwoParam(new Error("InvaliArgumentException"),"when");
   console.log("Exception Status        = "+exinfo1.statusCode);
   console.log("Exception Message       ="+exinfo1.message);
   console.log("Exception Class         ="+exinfo1.className);
   console.log("Exception Type          ="+exinfo1.exceptionType);
   console.log("Exception AlternateText ="+exinfo1.alternateText);
   console.log("Exception StackTrace    ="+exinfo1.stackTrace);
   console.log("------------------------------------------------------------------------------------ \n");
}
try
{
        var x=1;
        var y=0;
        var z =[1,2,3,4];
        var ans=x/y;
        //var p =z[6];
        if (err)
              throw (err);
}
catch(ex)
{
    exinfo1= objTest.getExceInfoWithTwoParam(ex,"given"); //functional
  //  exinfo1= objTest.getExceInfoWithTwoParam(new Error("Index was outside the bounds of the array."),"given");
  //    exinfo1= objTest.getExceInfoWithTwoParam(new Error("InvaliArgumentException"),"given");
    console.log("Exception Status        = "+exinfo1.statusCode);
   console.log("Exception Message       ="+exinfo1.message);
   console.log("Exception Class         ="+exinfo1.className);
   console.log("Exception Type          ="+exinfo1.exceptionType);
   console.log("Exception AlternateText ="+exinfo1.alternateText);
   console.log("Exception StackTrace    ="+exinfo1.stackTrace);
   console.log("------------------------------------------------------------------------------------ \n");
}
try
{
        var x=1;
        var y=0;
        var z =[1,2,3,4];
        var ans=x/y;
        //var p =z[6];
        if (err)
              throw (err);
}
catch(ex)
{
   exinfo1= objTest.getExceInfoWithTwoParam(ex,"abcd");   //functional
//   exinfo1= objTest.getExceInfoWithTwoParam(new Error("Index was outside the bounds of the array."),"abcd");
 //   exinfo1= objTest.getExceInfoWithTwoParam(new Error("InvaliArgumentException"),"abcd");
    console.log("Exception Status        = "+exinfo1.statusCode);
   console.log("Exception Message       ="+exinfo1.message);
   console.log("Exception Class         ="+exinfo1.className);
   console.log("Exception Type          ="+exinfo1.exceptionType);
   console.log("Exception AlternateText ="+exinfo1.alternateText);
   console.log("Exception StackTrace    ="+exinfo1.stackTrace);
   console.log("------------------------------------------------------------------------------------ \n");
}

