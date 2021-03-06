/*
 * Copyright (c) 2012. betterFORM Project - http://www.betterform.de
 * Licensed under the terms of BSD License
 */

dojo.provide("betterform.ui.common.GlobalAlert");


dojo.require("betterform.ui.common.Alert");

dojo.declare("betterform.ui.common.GlobalAlert",
        betterform.ui.common.Alert,
{
    handleValid:function(id,action){
        console.warn("COMING SOON GLOBAL ALERTS - betterform.ui.common.GlobalAlert.valid [id:" + id , " action: " + action + "]");
    },

    handleInvalid:function(id,action){
        console.warn("COMING SOON GLOBAL ALERTS - betterform.ui.common.GlobalAlert.invalid [id:" + id , " action: " + action + "]");
    }

});
