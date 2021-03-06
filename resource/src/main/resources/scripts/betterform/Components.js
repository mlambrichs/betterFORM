/*
 * Copyright (c) 2012. betterFORM Project - http://www.betterform.de
 * Licensed under the terms of BSD License
 */

dojo.provide("betterform.Components");
dojo.require("betterform.xf.XFControl");
dojo.require("dijit.form.DateTextBox");


/*
todo: dependencies must be imported for foreign (non-dojo) components
<script type="text/javascript src="..."/>
<style type="text/css" src="..."/>
*/

/*
    Component Definition File which is the central for mapping XForms controls to client-side controls.
    todo:see newJSLayer-readme.txt
*/
var componentBehavior = {

    /*
     ###########################################################################################
     matching all elements with .xfControl and instanciate a XFControl instance for each of them.
     Order is important here - all XFControl should be instanciated before their respective widget childs are
     created. Thus this rule must be the first in a component definition file like this.
    */
    '.xfControl':function(n) {
        console.debug("XFControl found: ",n);

        var controlId = dojo.attr(n,"id");
        new betterform.xf.XFControl({
            id:controlId,
            controlType:"generic"
        }, n);
    },

    // a default input control (TextField) bound to a string
    '.xfInput.xsdString .xfValue': function(n) {
        console.debug("string input field: ",n);

        /*
         ###########################################################################################
         xfId is the id of the parent element (the XFControl) that matches the id of the original XForms
         element in the document.
        */
        var xfId = getXfId(n);

        /*
        ###########################################################################################
        Event handler binding XForms and widget layer.

        There always need to be at least 2 event listener:

        - one listening tor handleStateChanged which are events coming from the processor representing
        changes of the value or state of a node that need to be applied to the widget. The following event handler
        will be triggered by the execution of 'handleStateChanged' in XFControl. This means that all updates on
        XFControl and their representing CSS classes are done. This handler just needs to propagate the change
        to the widget for updating the value.

        - one for listening to the respective change events fired by the widget (usually onBlur or onChange)
        to pass the changed value to the processor
        */
        dojo.connect(dijit.byId(xfId), "handleStateChanged", function(contextInfo){
            // ##### setting value by platform/component-specific means #####
            console.debug("handleStateChanged for:  ",n);
            if(contextInfo){
                console.debug("contextInfo",contextInfo);
            }
            //apply value to widget - handle required, valid and readonly if necessary
            //todo: this is probably not even necessary here?
            var newValue = contextInfo["value"];
            if(newValue != undefined){
                console.debug("newValue: ",newValue);
                n.value=newValue;
            }
        });

        dojo.connect(n,"onblur",function(){
            console.debug("onblur",n);
            var xfControl = dijit.byId(xfId);
            xfControl.setControlValue(n.value);
        });

        //todo: Dijits will need to create themselves later here...
    },

    // ############################## BOOLEAN INPUT ##############################
    // ############################## BOOLEAN INPUT ##############################
    // ############################## BOOLEAN INPUT ##############################
    '.xfInput.xsdBoolean .xfValue': function(n) {
        console.debug("boolean input field: ",n);
        var xfId = n.id.substring(0,n.id.lastIndexOf("-"));
        dojo.connect(dijit.byId(xfId), "handleStateChanged", function(contextInfo){
            console.debug("handleStateChanged for:  ",n);
            if(contextInfo){
                console.debug("contextInfo",contextInfo);
            }
            //apply value to widget - handle required + readonly if necessary

        });

        dojo.connect(n,"onblur",function(){
//            console.debug("onblur",n);
//            console.debug("xfId",xfId);
//            console.debug("checked",n.checked);
            var xfControl = dijit.byId(xfId);
            if(n.checked != undefined){
                xfControl.setControlValue(n.checked);
            }
        });
        dojo.connect(n,"onclick",function(){
//            console.debug("onclick",n);
//            console.debug("xfId",xfId);
//            console.debug("value",n.value);
//            console.debug("checked",n.checked);
            var xfControl = dijit.byId(xfId);
            if(n.checked != undefined){
                xfControl.setControlValue(n.checked);
            }
        });

    },

    // ############################## DATE INPUT ##############################
    // ############################## DATE INPUT ##############################
    // ############################## DATE INPUT ##############################

    //using detailed behavior syntax
    '.xfInput.xsdDate .xfValue' : {
        found: function(n){
//            console.debug("date input field: ",n);
//            console.debug("date input field: ",n.value);
            // create dijit for datePicker as not widly available yet in browsers
/*
            dojo.require("betterform.xf.input.Date");

            var dateWidget=new betterform.xf.input.Date({
                xfControl  : dijit.byId(getXfId(n)),
                value      : new Date(n.value)
            },n);
*/
            var dateWidget = new dijit.form.DateTextBox({
                value      : new Date(n.value)
            },n);

            var xfId = getXfId(n);
            dojo.connect(dijit.byId(xfId), "handleStateChanged", function(contextInfo){
                // ##### setting value by platform/component-specific means #####
                console.debug("handleStateChanged for:  ",n);
                if(contextInfo){
                    console.debug("contextInfo",contextInfo);
                }
                var newValue = contextInfo["schemaValue"];
                if(newValue != undefined){
                    console.debug("newValue: ",newValue);
                    dijit.byId(xfId).setControlValue(newValue);
//                    dojo.attr(dojo.byId(n.id),"value",contextInfo["value"]);
                    dijit.byId(xfId+"-value").set('value', contextInfo["schemaValue"]);
                    dijit.byId(xfId+"-value").set('displayedValue', new Date(contextInfo["value"]));
                }
            });

            dojo.connect(dateWidget,"onChange",function(evt){
                var dateValue =  dateWidget.serialize(dateWidget.get("value")).substring(0,10);
                console.debug("onchange on widget",dateValue);
                dijit.byId(xfId).setControlValue(dateValue);
            });
//            dojo.connect(dateWidget,"onBlur",function(){
//                console.debug("onblur on widget",this.displayedValue);
////                dojo.attr(dojo.byId(n.id),"value",this.displayedValue);
//                this.set("value",this.displayValue);
//                console.debug("this.value: ",this.value);
//                console.debug("this.value: ",this.get("value"));
//
//                dijit.byId(xfId).setControlValue(this.displayedValue);
//            });
        }
    },

    // ############################## DATETIME INPUT ##############################
    // ############################## DATETIME INPUT ##############################
    // ############################## DATETIME INPUT ##############################
    '.xfInput.xsdDateTime .xfValue': function(n) {
    },


    '.xfTrigger .xfValue': function(n) {
        console.debug("node: ",n);
        var parentId = n.id.substring(0,n.id.lastIndexOf("-"));

        //connecting widget to XFControl listening for external value changes (coming from FluxProcessor)
        dojo.connect(n, "onclick", function(){
            // ##### setting value by platform/component-specific means #####
//            console.debug("self:  ",n);
//            console.debug("self:  ",parentId);
            fluxProcessor.dispatchEvent(parentId);
        });
        //todo: add onblur res. onchange handler
    }



};

function getXfId(/*Node*/n){
    var tmp = n.id.substring(0,n.id.lastIndexOf("-"));
    console.debug("returning xfId: ",tmp);
    return tmp;
}
