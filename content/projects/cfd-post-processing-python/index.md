+++
# Date this page was created.
date = "2013-05-27"

# Project title.
title = "CFD Post Processing automation"

# Project summary to display on homepage.
summary = "`python` script to help automate post processing of simulations, by applying an extraction macro on multiple result files."

# Optional image to display on homepage (relative to `static/img/` folder).
image_preview = ""

# Tags: can be used for filtering projects.
# Example: `tags = ["machine-learning", "deep-learning"]`
tags = ["python", "code", "automation", "CFD"]

# Optional external URL for project (replaces project detail page).
external_link = ""

# Does the project detail page use math formatting?
math = false

# Optional featured image (relative to `static/img/` folder).
[header]
image = ""
caption = ":smile:"

+++

It is possible (and prevalent) to create templates to post process CFD Simulation results in ANSYS CFD Post using session (.cse) files. Using Shell scripts, it would then be simple to apply these session files on multiple result files and extract the output dictated by the session file. 

This python script that enables the user to set the location of:
- the session file (.cse)
- the CFD result files (.res) 
- create a BAT script with sequential lines, each calling ANSYS CFD Post with the necessary arguments
- run the session script on all the result files available in a particular location.
- gracefully exit, removing all the temporary script files.

 [Code On Github](<https://github.com/shrysr/cfdpost_auto>)

# How it helped

- While these operations could be done directly in python, it is
  easier and simpler to control ANSYS CFD post using a BASH
  script. Therefore the python program creates a BASH script.
- 



# Python script 


    """
    Created on Thu Dec 18 16:10:49 2014
    @author: shrysr
    """
    
    # Description: 
    # This is a simple program that is designed to apply am ANSYS CFD post macro on all the results available at a particular location, one after the other. There are 3 strings required to be set as input by the user.
    # 1. The location of the ANSYS CFD Post executable
    # 2. THe path to the macro file (.cst/.cse)
    # 3. The folder location where the result files are located.
    
    # Note : the >quit command can be written in the post macro to optionally execute the post macro on one file after the other automatically. Otherwise CFD Post has to be quit manually by the user after the macro is applied on each file.
    
    ###---------- USER INPUT -------------###
    # Setting the paths to various locations.
    
    CFDPost_loc=r'"C:\Program Files\ANSYS Inc\v145\CFD-Post\bin\cfdpost"' #Setting the path to the ANSYS CFD Post executable.
    
    Post_template_loc=r'"C:\\example_location\post_macro.cse"' #Path to the .cse/.cst post macro to be applied.
    
    Res_loc=r"Q:\Queueing_sys\Completed\Archive\Shreyas" #Folder location of the result file path
    
    ###---x---x--x-- USER INPUT -x---x---x---x--###
    
    #importing required libraries
    import os
    import glob
    import subprocess as sp
    
    #Creating BAT script for extracting the list of res files in the current working folder - sorted Date wise
    def res_list_syn(Res_loc):
        """
        Grabs all the CFX res files in the chosen location  (Res_loc) and stores them in the variable (array) A1.
        The variableA1 is passed onto another function which uses the array contents
        Example:
        >>> Res_loc=r"Q:\Queueing_sys\Completed\Archive"
        >>> post_syn(Res_loc)
        >>> return variableA1
        """
        print ""
        print "Grabbing all res files from chosen location."
        os.chdir(Res_loc)
        reslist=glob.glob('*.res')
        print "Passing the list of res files to the Post_Syn function"
        post_syn(reslist)
        
    def post_syn(variable):
        print " "    
        print "Listing grabbed res files and creating Post BAT file in chosen location..." 
        print ""
        post_batname='Post_bat_runner.BAT'   
        post_bat_loc=os.path.join(Res_loc,post_batname)
        PC=open(post_bat_loc,'w')
        PC.write('cd /d "%s"\n'%Res_loc)
        i=0
        while i<len(variable):
            print "%d --%s" %(i,variable[i])
            PC.write('%s -s %s %s\n' %(CFDPost_loc,Post_template_loc,variable[i]))
            i+=1
        PC.close()
        print "Running post macro on all the listed Res Files...."
        print ''
        sp.call(post_bat_loc)
        t.sleep(5)
        print 'Killing temp files...'
        t.sleep(5)
        File_killer(Res_loc,'BAT')
        
    
    #Function for deleting temp Files. Prevents Clutter.
    def File_killer(folder_location, type_of_extension):
        for variable in glob.glob('%s/*.%s'%(folder_location,type_of_extension)):
            if os.path.isfile(variable):
                os.remove(variable)
    
    #Starting Program. Geting current working directory
    print "Hello. Program Launch...-->"
    print ""
    print "The chosen result location to be scanned is: %s"%Res_loc
    print ""
    print "Starting scan"
    res_list_syn(Res_loc)


